import { createClient } from "@/lib/supabase/client";
import {
  defaultPropertyType,
  normalizePropertyType,
} from "@/lib/admin/constants";
import {
  normalizeProjectDetails,
  projectDetailsFromRow,
  projectDetailsToRow,
} from "@/lib/admin/propertyDetails";
import {
  amenitiesFromRelation,
  amenitiesToInsertRows,
  amenityNames,
  normalizeAmenities,
} from "@/lib/admin/propertyAmenities";
import {
  DEVELOPER_IMAGES_BUCKET,
  developersDisplayName,
  developersFromRelation,
  developersToInsertRows,
  normalizePropertyDevelopers,
} from "@/lib/admin/propertyDevelopers";
import {
  normalizeUnitGroups,
  unitGroupsFromRelation,
  unitPlanImageUrls,
  deriveListingSpecsFromUnitGroups,
} from "@/lib/admin/propertyUnits";
import {
  paymentMilestonesFromRelation,
  paymentMilestonesToInsertRows,
} from "@/lib/admin/propertyPaymentPlan";
import { isInlineImageSrc, propertyPublicPath, uniqueSlug } from "@/lib/admin/utils";

const PROPERTY_IMAGES_BUCKET = "property-images";
const PROPERTY_SELECT = `
  *,
  property_amenities (
    id,
    name,
    image_url,
    sort_order,
    amenity_type_id
  ),
  property_developers (
    id,
    developer_id,
    sort_order,
    developers (
      id,
      developer_name,
      title,
      image_path,
      point_one,
      point_two,
      point_three
    )
  ),
  property_unit_types (
    id,
    name,
    slug,
    bedrooms,
    accent_color,
    parking_spaces,
    inventory_count,
    sort_order
  ),
  property_units (
    id,
    unit_type_id,
    unit_number,
    unit_kind,
    floor,
    area_sqft,
    price,
    plan_image_url,
    sort_order
  ),
  property_payment_milestones (
    id,
    phase,
    label,
    percent,
    sort_order
  )
`;
const EMPTY = [];

let listeners = new Set();
let snapshot = EMPTY;
let loadPromise = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function developerPublicUrlResolver(supabase) {
  return (path) =>
    supabase.storage
      .from(DEVELOPER_IMAGES_BUCKET)
      .getPublicUrl(path).data.publicUrl;
}

function mapDevelopersFromRows(rows, fallbackName, supabase) {
  return developersFromRelation(rows, fallbackName, {
    getPublicUrl: supabase
      ? developerPublicUrlResolver(supabase)
      : undefined,
  });
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toOptionalNumber(value) {
  if (value === "" || value == null) return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

function toDbNumber(value) {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toParagraphs(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDocuments(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((doc) => ({
      name: String(doc?.name || "").trim(),
      available: Boolean(doc?.available),
    }))
    .filter((doc) => doc.name);
}

function normalizeImages(payload) {
  const fromArray = Array.isArray(payload.images)
    ? payload.images.filter(Boolean)
    : [];
  if (fromArray.length) return fromArray;
  return payload.image ? [payload.image] : [];
}

function hydrateProperty(property) {
  const images = normalizeImages(property);
  const market = property.market || "buy";
  const type = normalizePropertyType(market, property.type);
  const slug = property.slug || "";
  return {
    ...property,
    market,
    type,
    slug,
    featured: Boolean(property.featured),
    images,
    image: property.image || images[0] || "",
    about: Array.isArray(property.about) ? property.about : [],
    descriptionItems: Array.isArray(property.descriptionItems)
      ? property.descriptionItems
      : [],
    features: Array.isArray(property.features) ? property.features : [],
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    developers: Array.isArray(property.developers) ? property.developers : [],
    unitGroups: Array.isArray(property.unitGroups) ? property.unitGroups : [],
    paymentMilestones: Array.isArray(property.paymentMilestones)
      ? property.paymentMilestones
      : [],
    documents: Array.isArray(property.documents) ? property.documents : [],
    parking: toNumber(property.parking),
    view: property.view || "",
    mapLat: property.mapLat ?? "",
    mapLng: property.mapLng ?? "",
    mapLabel: property.mapLabel || "",
    agentName: property.agentName || "",
    agentPhone: property.agentPhone || "",
    paymentDownPercent: toNumber(property.paymentDownPercent, 10) || 10,
    paymentInstallments: toNumber(property.paymentInstallments, 24) || 24,
    paymentStartDate: property.paymentStartDate
      ? String(property.paymentStartDate).slice(0, 10)
      : "",
    href: propertyPublicPath(market, type, slug),
  };
}

function fromRow(row, supabase) {
  const developers = mapDevelopersFromRows(
    row.property_developers,
    row.developer,
    supabase,
  );
  const projectDetails = projectDetailsFromRow(row);

  return hydrateProperty({
    id: row.id,
    title: row.title,
    slug: row.slug,
    location: row.location,
    market: row.market,
    type: row.property_type,
    price: toNumber(row.price),
    bedrooms: toNumber(row.bedrooms),
    bathrooms: toNumber(row.bathrooms),
    area: toNumber(row.area),
    parking: toNumber(row.parking),
    view: row.view || "",
    listedAt: String(row.listed_at || "").slice(0, 10),
    status: row.status,
    featured: Boolean(row.featured),
    images: Array.isArray(row.images) ? row.images : [],
    image: row.images?.[0] || "",
    about: Array.isArray(row.about) ? row.about : [],
    description: Array.isArray(row.about) ? row.about.join("\n\n") : "",
    descriptionItems: Array.isArray(row.description_items)
      ? row.description_items
      : [],
    features: Array.isArray(row.features) ? row.features : [],
    amenities: amenitiesFromRelation(
      row.property_amenities,
      row.features,
    ),
    developers,
    unitGroups: unitGroupsFromRelation(
      row.property_unit_types,
      row.property_units,
    ),
    paymentMilestones: paymentMilestonesFromRelation(
      row.property_payment_milestones,
    ),
    documents: Array.isArray(row.documents) ? row.documents : [],
    mapLat: row.map_lat ?? "",
    mapLng: row.map_lng ?? "",
    mapLabel: row.map_label || "",
    agentName: row.agent_name || "",
    agentPhone: row.agent_phone || "",
    paymentDownPercent: toNumber(row.payment_down_percent, 10) || 10,
    paymentInstallments: toNumber(row.payment_installments, 24) || 24,
    paymentStartDate: String(row.payment_start_date || "").slice(0, 10),
    ...projectDetails,
    developer: developersDisplayName(developers, projectDetails.developer),
  });
}

function toRow(property, { createdBy, includeId = false } = {}) {
  const row = {
    title: property.title,
    slug: property.slug,
    location: property.location,
    market: property.market,
    property_type: property.type,
    status: property.status,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    parking: property.parking,
    view: property.view,
    listed_at: property.listedAt,
    featured: property.featured,
    images: property.images,
    about: property.about,
    description_items: property.descriptionItems,
    features: property.features,
    documents: property.documents,
    map_lat: toDbNumber(property.mapLat),
    map_lng: toDbNumber(property.mapLng),
    map_label: property.mapLabel,
    agent_name: property.agentName,
    agent_phone: property.agentPhone,
    payment_down_percent: property.paymentDownPercent ?? 10,
    payment_installments: property.paymentInstallments ?? 24,
    payment_start_date: property.paymentStartDate || null,
    ...projectDetailsToRow(property),
  };

  if (includeId && property.id) row.id = property.id;
  if (createdBy) row.created_by = createdBy;
  return row;
}

function normalizeProperty(payload, existing = [], currentId) {
  const market = payload.market || "buy";
  const slug = uniqueSlug(
    payload.slug || payload.title,
    existing.filter((item) => item.market === market),
    currentId,
  );
  const type = normalizePropertyType(
    market,
    payload.type || defaultPropertyType(market),
  );
  const images = normalizeImages(payload);
  const about = toParagraphs(
    payload.about ?? payload.aboutText ?? payload.description,
  );
  const unitGroups = normalizeUnitGroups(payload.unitGroups);
  const derived = deriveListingSpecsFromUnitGroups(unitGroups);
  const developers = normalizePropertyDevelopers(payload.developers);

  const downPercent = toNumber(payload.paymentDownPercent, 10);
  const installments = toNumber(payload.paymentInstallments, 24);

  return {
    title: String(payload.title || "").trim(),
    slug,
    location: String(payload.location || "").trim(),
    market,
    type,
    price: (() => {
      const listed = toNumber(payload.price);
      if (listed > 0) return listed;
      return derived?.price || 0;
    })(),
    bedrooms: derived ? derived.bedrooms : toNumber(payload.bedrooms),
    bathrooms: derived ? 0 : toNumber(payload.bathrooms),
    area: derived ? derived.area : toNumber(payload.area),
    parking: derived ? 0 : toNumber(payload.parking),
    view: String(payload.view || "").trim(),
    listedAt: payload.listedAt || new Date().toISOString().slice(0, 10),
    status: payload.status || "available",
    featured: Boolean(payload.featured),
    images,
    image: images[0] || "",
    about,
    description: about.join("\n\n") || String(payload.description || "").trim(),
    descriptionItems: toStringList(payload.descriptionItems),
    amenities: normalizeAmenities(payload.amenities),
    developers,
    unitGroups,
    paymentMilestones: [],
    features: (() => {
      const fromAmenities = amenityNames(payload.amenities);
      if (fromAmenities.length) return fromAmenities;
      return toStringList(payload.features);
    })(),
    documents: normalizeDocuments(payload.documents),
    mapLat: toOptionalNumber(payload.mapLat),
    mapLng: toOptionalNumber(payload.mapLng),
    mapLabel: String(payload.mapLabel || "").trim(),
    agentName: String(payload.agentName || "").trim(),
    agentPhone: String(payload.agentPhone || "").trim(),
    paymentDownPercent:
      downPercent > 0 && downPercent < 100 ? downPercent : 10,
    paymentInstallments:
      installments >= 1 ? Math.round(installments) : 24,
    paymentStartDate: payload.paymentStartDate
      ? String(payload.paymentStartDate).slice(0, 10)
      : "",
    href: propertyPublicPath(market, type, slug),
    ...normalizeProjectDetails({
      ...payload,
      developer: developersDisplayName(developers, payload.developer),
      unitTypes: [],
    }),
  };
}

function dbErrorMessage(error, fallback) {
  const message = error?.message || "";
  if (error?.code === "23505") {
    return "A property with this slug already exists in this market.";
  }
  if (/row-level security/i.test(message)) {
    return "You need to be signed in as admin to save properties.";
  }
  return message || fallback;
}

function extFromMime(mime) {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

function dataUrlToBytes(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("One of the gallery images is invalid.");
  const mime = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { mime, bytes };
}

function storagePathFromPublicUrl(url) {
  const marker = `/storage/v1/object/public/${PROPERTY_IMAGES_BUCKET}/`;
  const index = String(url || "").indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

async function resolveAmenityTypeIds(supabase, amenities) {
  const list = normalizeAmenities(amenities);
  if (!list.length) return list;

  const { data, error } = await supabase
    .from("amenity_types")
    .select("id, name")
    .eq("is_active", true);

  if (error || !data?.length) return list;

  const byName = new Map(
    data.map((row) => [String(row.name).trim().toLowerCase(), row.id]),
  );

  return list.map((item) => ({
    ...item,
    amenityTypeId:
      item.amenityTypeId || byName.get(item.name.toLowerCase()) || null,
  }));
}

async function replacePropertyAmenities(supabase, propertyId, amenities) {
  const { error: deleteError } = await supabase
    .from("property_amenities")
    .delete()
    .eq("property_id", propertyId);

  if (deleteError) {
    throw new Error(
      dbErrorMessage(deleteError, "Could not update property amenities."),
    );
  }

  const linked = await resolveAmenityTypeIds(supabase, amenities);
  const rows = amenitiesToInsertRows(propertyId, linked);
  if (!rows.length) return [];

  const { data, error } = await supabase
    .from("property_amenities")
    .insert(rows)
    .select("id, name, image_url, sort_order, amenity_type_id");

  if (error) {
    throw new Error(dbErrorMessage(error, "Could not save property amenities."));
  }

  return amenitiesFromRelation(data);
}

async function replacePropertyDevelopers(supabase, propertyId, developers) {
  const { error: deleteError } = await supabase
    .from("property_developers")
    .delete()
    .eq("property_id", propertyId);

  if (deleteError) {
    throw new Error(
      dbErrorMessage(deleteError, "Could not update property developers."),
    );
  }

  const rows = developersToInsertRows(propertyId, developers);
  if (!rows.length) return [];

  const { data, error } = await supabase
    .from("property_developers")
    .insert(rows)
    .select(
      `
      id,
      developer_id,
      sort_order,
      developers (
        id,
        developer_name,
        title,
        image_path,
        point_one,
        point_two,
        point_three
      )
    `,
    );

  if (error) {
    throw new Error(
      dbErrorMessage(error, "Could not save property developers."),
    );
  }

  return mapDevelopersFromRows(data, "", supabase);
}

async function uploadPropertyImages(supabase, propertyId, images) {
  const uploaded = [];

  for (const [index, image] of images.entries()) {
    if (!image || !isInlineImageSrc(image)) {
      uploaded.push(image);
      continue;
    }

    const { mime, bytes } = dataUrlToBytes(image);
    const path = `${propertyId}/${Date.now()}-${index}.${extFromMime(mime)}`;
    const { error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });

    if (error) {
      throw new Error(error.message || "Could not upload gallery images.");
    }

    const { data } = supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .getPublicUrl(path);
    uploaded.push(data.publicUrl);
  }

  return uploaded;
}

async function uploadAmenityImages(supabase, propertyId, amenities) {
  const list = normalizeAmenities(amenities);
  const uploaded = [];

  for (const [index, amenity] of list.entries()) {
    if (!amenity.image || !isInlineImageSrc(amenity.image)) {
      uploaded.push(amenity);
      continue;
    }

    const { mime, bytes } = dataUrlToBytes(amenity.image);
    const path = `${propertyId}/amenities/${Date.now()}-${index}.${extFromMime(mime)}`;
    const { error } = await supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: false });

    if (error) {
      throw new Error(error.message || "Could not upload amenity images.");
    }

    const { data } = supabase.storage
      .from(PROPERTY_IMAGES_BUCKET)
      .getPublicUrl(path);
    uploaded.push({ ...amenity, image: data.publicUrl });
  }

  return uploaded;
}

function amenityImageUrls(amenities = []) {
  return normalizeAmenities(amenities)
    .map((item) => item.image)
    .filter(Boolean);
}

async function uploadUnitPlanImages(supabase, propertyId, unitGroups) {
  const groups = normalizeUnitGroups(unitGroups);
  const next = [];

  for (const [groupIndex, group] of groups.entries()) {
    const units = [];
    for (const [unitIndex, unit] of group.units.entries()) {
      if (!unit.planImage || !isInlineImageSrc(unit.planImage)) {
        units.push(unit);
        continue;
      }

      const { mime, bytes } = dataUrlToBytes(unit.planImage);
      const path = `${propertyId}/units/${Date.now()}-${groupIndex}-${unitIndex}.${extFromMime(mime)}`;
      const { error } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .upload(path, bytes, { contentType: mime, upsert: false });

      if (error) {
        throw new Error(error.message || "Could not upload floor plan images.");
      }

      const { data } = supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .getPublicUrl(path);
      units.push({ ...unit, planImage: data.publicUrl });
    }
    next.push({ ...group, units });
  }

  return next;
}

async function replacePropertyUnitGroups(supabase, propertyId, unitGroups) {
  const groups = normalizeUnitGroups(unitGroups);

  const { error: deleteError } = await supabase
    .from("property_unit_types")
    .delete()
    .eq("property_id", propertyId);

  if (deleteError) {
    throw new Error(
      dbErrorMessage(deleteError, "Could not update property unit types."),
    );
  }

  if (!groups.length) return [];

  const typeRows = groups.map((group, index) => ({
    property_id: propertyId,
    name: group.name,
    slug: group.slug,
    bedrooms: group.bedrooms,
    accent_color: group.accentColor,
    parking_spaces: group.parkingSpaces,
    inventory_count: group.inventoryCount,
    sort_order: index,
  }));

  const { data: savedTypes, error: typeError } = await supabase
    .from("property_unit_types")
    .insert(typeRows)
    .select(
      "id, name, slug, bedrooms, accent_color, parking_spaces, inventory_count, sort_order",
    );

  if (typeError) {
    throw new Error(
      dbErrorMessage(typeError, "Could not save property unit types."),
    );
  }

  const sortedTypes = [...(savedTypes || [])].sort(
    (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
  );

  const unitRows = [];
  groups.forEach((group, groupIndex) => {
    const typeId = sortedTypes[groupIndex]?.id;
    if (!typeId) return;
    group.units.forEach((unit, unitIndex) => {
      unitRows.push({
        property_id: propertyId,
        unit_type_id: typeId,
        unit_number: unit.unitNumber,
        unit_kind: unit.unitKind,
        floor: unit.floor,
        area_sqft: unit.areaSqft === "" ? null : unit.areaSqft,
        price: unit.price === "" ? null : unit.price,
        plan_image_url: unit.planImage || "",
        sort_order: unitIndex,
      });
    });
  });

  let savedUnits = [];
  if (unitRows.length) {
    const { data, error: unitError } = await supabase
      .from("property_units")
      .insert(unitRows)
      .select(
        "id, unit_type_id, unit_number, unit_kind, floor, area_sqft, price, plan_image_url, sort_order",
      );

    if (unitError) {
      throw new Error(dbErrorMessage(unitError, "Could not save property units."));
    }
    savedUnits = data || [];
  }

  return unitGroupsFromRelation(sortedTypes, savedUnits);
}

async function replacePropertyPaymentMilestones(supabase, propertyId, milestones) {
  const { error: deleteError } = await supabase
    .from("property_payment_milestones")
    .delete()
    .eq("property_id", propertyId);

  if (deleteError) {
    throw new Error(
      dbErrorMessage(deleteError, "Could not update payment plan."),
    );
  }

  const rows = paymentMilestonesToInsertRows(propertyId, milestones);
  if (!rows.length) return [];

  const { data, error } = await supabase
    .from("property_payment_milestones")
    .insert(rows)
    .select("id, phase, label, percent, sort_order");

  if (error) {
    throw new Error(dbErrorMessage(error, "Could not save payment plan."));
  }

  return paymentMilestonesFromRelation(data);
}

async function removeUnusedImages(supabase, previousImages = [], nextImages = []) {
  const kept = new Set(nextImages);
  const paths = previousImages
    .filter((url) => url && !kept.has(url))
    .map(storagePathFromPublicUrl)
    .filter(Boolean);

  if (!paths.length) return;
  await supabase.storage.from(PROPERTY_IMAGES_BUCKET).remove(paths);
}

async function currentUserId(supabase) {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

function setSnapshot(next) {
  snapshot = next;
  emit();
  return snapshot;
}

export function subscribeProperties(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPropertiesSnapshot() {
  return snapshot;
}

export function getPropertiesServerSnapshot() {
  return EMPTY;
}

export async function loadProperties() {
  if (typeof window === "undefined") return EMPTY;
  if (!loadPromise) {
    loadPromise = (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .order("created_at", { ascending: false })
        .order("sort_order", {
          ascending: true,
          foreignTable: "property_amenities",
        })
        .order("sort_order", {
          ascending: true,
          foreignTable: "property_developers",
        })
        .order("sort_order", {
          ascending: true,
          foreignTable: "property_unit_types",
        })
        .order("sort_order", {
          ascending: true,
          foreignTable: "property_units",
        })
        .order("sort_order", {
          ascending: true,
          foreignTable: "property_payment_milestones",
        });

      if (error) {
        loadPromise = null;
        throw new Error(dbErrorMessage(error, "Could not load properties."));
      }

      return setSnapshot((data || []).map((row) => fromRow(row, supabase)));
    })();
  }

  return loadPromise;
}

export function getAdminProperties() {
  if (typeof window === "undefined") return EMPTY;
  return getPropertiesSnapshot();
}

function withSavedChildren(row, { amenities, developers, unitGroups, paymentMilestones }) {
  return {
    ...fromRow({
      ...row,
      property_amenities: [],
      property_developers: [],
      property_unit_types: [],
      property_units: [],
      property_payment_milestones: [],
    }),
    amenities,
    developers,
    developer: developersDisplayName(developers, row.developer),
    features: amenityNames(amenities),
    unitGroups,
    paymentMilestones,
  };
}

export async function createProperty(payload) {
  const supabase = createClient();
  const properties = getPropertiesSnapshot();
  const id = crypto.randomUUID();
  const property = {
    id,
    ...normalizeProperty(payload, properties),
  };
  property.images = await uploadPropertyImages(supabase, id, property.images);
  property.image = property.images[0] || "";
  property.amenities = await uploadAmenityImages(
    supabase,
    id,
    property.amenities,
  );
  property.unitGroups = await uploadUnitPlanImages(
    supabase,
    id,
    property.unitGroups,
  );

  const { data, error } = await supabase
    .from("properties")
    .insert(
      toRow(property, {
        createdBy: await currentUserId(supabase),
        includeId: true,
      }),
    )
    .select(PROPERTY_SELECT)
    .single();

  if (error) {
    throw new Error(dbErrorMessage(error, "Could not save this property."));
  }

  const savedAmenities = await replacePropertyAmenities(
    supabase,
    id,
    property.amenities,
  );
  const savedDevelopers = await replacePropertyDevelopers(
    supabase,
    id,
    property.developers,
  );
  const savedUnitGroups = await replacePropertyUnitGroups(
    supabase,
    id,
    property.unitGroups,
  );
  const savedPaymentMilestones = await replacePropertyPaymentMilestones(
    supabase,
    id,
    property.paymentMilestones,
  );
  const created = withSavedChildren(data, {
    amenities: savedAmenities,
    developers: savedDevelopers,
    unitGroups: savedUnitGroups,
    paymentMilestones: savedPaymentMilestones,
  });
  setSnapshot([created, ...properties.filter((item) => item.id !== created.id)]);
  return created;
}

export async function updateProperty(id, payload) {
  const supabase = createClient();
  const properties = getPropertiesSnapshot();
  const current = properties.find((item) => item.id === String(id));
  if (!current) throw new Error("Property not found.");

  const next = {
    ...current,
    ...normalizeProperty(
      { listedAt: current.listedAt, ...payload },
      properties,
      current.id,
    ),
  };
  next.images = await uploadPropertyImages(supabase, current.id, next.images);
  next.image = next.images[0] || "";
  next.amenities = await uploadAmenityImages(
    supabase,
    current.id,
    next.amenities,
  );
  next.unitGroups = await uploadUnitPlanImages(
    supabase,
    current.id,
    next.unitGroups,
  );

  const { data, error } = await supabase
    .from("properties")
    .update(toRow(next))
    .eq("id", current.id)
    .select(PROPERTY_SELECT)
    .single();

  if (error) {
    throw new Error(dbErrorMessage(error, "Could not update this property."));
  }

  const savedAmenities = await replacePropertyAmenities(
    supabase,
    current.id,
    next.amenities,
  );
  const savedDevelopers = await replacePropertyDevelopers(
    supabase,
    current.id,
    next.developers,
  );
  const savedUnitGroups = await replacePropertyUnitGroups(
    supabase,
    current.id,
    next.unitGroups,
  );
  const savedPaymentMilestones = await replacePropertyPaymentMilestones(
    supabase,
    current.id,
    next.paymentMilestones,
  );

  await removeUnusedImages(supabase, current.images, next.images);
  await removeUnusedImages(
    supabase,
    amenityImageUrls(current.amenities),
    amenityImageUrls(next.amenities),
  );
  await removeUnusedImages(
    supabase,
    unitPlanImageUrls(current.unitGroups),
    unitPlanImageUrls(next.unitGroups),
  );

  const updated = withSavedChildren(data, {
    amenities: savedAmenities,
    developers: savedDevelopers,
    unitGroups: savedUnitGroups,
    paymentMilestones: savedPaymentMilestones,
  });
  setSnapshot(
    properties.map((item) => (item.id === updated.id ? updated : item)),
  );
  return updated;
}

export async function deleteProperty(id) {
  const supabase = createClient();
  const properties = getPropertiesSnapshot();
  const current = properties.find((item) => item.id === String(id));

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) {
    throw new Error(dbErrorMessage(error, "Could not delete this property."));
  }

  if (current?.images?.length) {
    await removeUnusedImages(supabase, current.images, []);
  }
  if (current?.amenities?.length) {
    await removeUnusedImages(supabase, amenityImageUrls(current.amenities), []);
  }
  if (current?.unitGroups?.length) {
    await removeUnusedImages(supabase, unitPlanImageUrls(current.unitGroups), []);
  }

  return setSnapshot(properties.filter((item) => item.id !== String(id)));
}

export function getPropertyStats(properties) {
  const list = properties || getAdminProperties();
  return {
    total: list.length,
    featured: list.filter((item) => item.featured).length,
    available: list.filter((item) => item.status === "available").length,
    reserved: list.filter((item) => item.status === "reserved").length,
  };
}
