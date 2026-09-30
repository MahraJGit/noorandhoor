import { slugify } from "@/lib/admin/utils";

export const MAX_UNIT_GROUPS = 12;
export const MAX_UNITS_PER_GROUP = 40;

export const UNIT_GROUP_PRESETS = [
  {
    name: "Retail",
    bedrooms: null,
    accentColor: "#a855f7",
    parkingSpaces: 0,
  },
  {
    name: "1 Bedroom",
    bedrooms: 1,
    accentColor: "#22c55e",
    parkingSpaces: 1,
  },
  {
    name: "2 Bedrooms",
    bedrooms: 2,
    accentColor: "#f97316",
    parkingSpaces: 1,
  },
  {
    name: "3 Bedrooms",
    bedrooms: 3,
    accentColor: "#3b82f6",
    parkingSpaces: 2,
  },
];

function toOptionalInt(value) {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function toNonNegInt(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.round(parsed);
}

function toOptionalNumber(value) {
  if (value === "" || value == null) return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

function uniqueGroupSlug(name, used) {
  const base = slugify(name) || "unit-type";
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
}

export function normalizeUnit(item = {}) {
  const unitNumber = String(item.unitNumber || item.unit_number || "").trim();
  if (!unitNumber) return null;

  const area = toOptionalNumber(item.areaSqft ?? item.area_sqft);
  const price = toOptionalNumber(item.price);

  return {
    id: item.id || null,
    clientKey: item.clientKey || item.id || null,
    unitNumber,
    unitKind: String(item.unitKind || item.unit_kind || "Apartments").trim() || "Apartments",
    floor: String(item.floor ?? "").trim() || null,
    areaSqft: area === "" ? "" : area,
    price: price === "" ? "" : price,
    planImage: String(item.planImage || item.plan_image_url || "").trim(),
  };
}

export function normalizeUnitGroup(item = {}, usedSlugs = new Set()) {
  const name = String(item.name || "").trim();
  if (!name) return null;

  const units = Array.isArray(item.units)
    ? item.units.map(normalizeUnit).filter(Boolean).slice(0, MAX_UNITS_PER_GROUP)
    : [];

  const slug = item.slug
    ? (() => {
        const next = slugify(item.slug) || uniqueGroupSlug(name, usedSlugs);
        usedSlugs.add(next);
        return next;
      })()
    : uniqueGroupSlug(name, usedSlugs);

  return {
    id: item.id || null,
    clientKey: item.clientKey || item.id || null,
    name,
    slug,
    bedrooms: toOptionalInt(item.bedrooms),
    accentColor: String(item.accentColor || item.accent_color || "#22c55e").trim() || "#22c55e",
    parkingSpaces: toNonNegInt(item.parkingSpaces ?? item.parking_spaces, 0),
    inventoryCount: toNonNegInt(item.inventoryCount ?? item.inventory_count, 0),
    units,
  };
}

export function normalizeUnitGroups(value) {
  if (!Array.isArray(value)) return [];
  const usedSlugs = new Set();
  return value
    .map((item) => normalizeUnitGroup(item, usedSlugs))
    .filter(Boolean)
    .slice(0, MAX_UNIT_GROUPS);
}

export function unitGroupsFromRelation(typeRows = [], unitRows = []) {
  const types = Array.isArray(typeRows) ? [...typeRows] : [];
  const units = Array.isArray(unitRows) ? [...unitRows] : [];

  types.sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
  units.sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));

  const byType = new Map();
  for (const unit of units) {
    const key = unit.unit_type_id;
    if (!byType.has(key)) byType.set(key, []);
    byType.get(key).push(unit);
  }

  return normalizeUnitGroups(
    types.map((type) => ({
      id: type.id,
      name: type.name,
      slug: type.slug,
      bedrooms: type.bedrooms,
      accentColor: type.accent_color,
      parkingSpaces: type.parking_spaces,
      inventoryCount: type.inventory_count,
      units: (byType.get(type.id) || []).map((unit) => ({
        id: unit.id,
        unitNumber: unit.unit_number,
        unitKind: unit.unit_kind,
        floor: unit.floor,
        areaSqft: unit.area_sqft,
        price: unit.price,
        planImage: unit.plan_image_url,
      })),
    })),
  );
}

export function unitTypeDisplayName(group = {}) {
  if (group.bedrooms == null || group.bedrooms === "") {
    return String(group.name || "").trim() || "Unit type";
  }
  const beds = Number(group.bedrooms);
  if (!Number.isFinite(beds)) {
    return String(group.name || "").trim() || "Unit type";
  }
  return beds === 1 ? "1 Bedroom" : `${beds} Bedrooms`;
}

export function unitTypeShortName(group = {}) {
  if (group.bedrooms == null || group.bedrooms === "") {
    return String(group.name || "").trim() || "Unit type";
  }
  const beds = Number(group.bedrooms);
  if (!Number.isFinite(beds)) {
    return String(group.name || "").trim() || "Unit type";
  }
  return beds === 1 ? "1 Bed" : `${beds} Bed`;
}

export function nameFromBedrooms(bedrooms) {
  if (bedrooms === "" || bedrooms == null) return "";
  const beds = Number(bedrooms);
  if (!Number.isFinite(beds)) return "";
  return beds === 1 ? "1 Bedroom" : `${beds} Bedrooms`;
}

export function unitGroupsToForm(groups = []) {
  return normalizeUnitGroups(groups);
}

export function unitPlanImageUrls(groups = []) {
  return normalizeUnitGroups(groups)
    .flatMap((group) => group.units.map((unit) => unit.planImage))
    .filter(Boolean);
}

/**
 * Listing-card stats from Units & Availability (single source of truth).
 */
export function deriveListingSpecsFromUnitGroups(unitGroups = []) {
  const groups = normalizeUnitGroups(unitGroups);
  if (!groups.length) return null;

  const bedrooms = groups
    .map((group) => group.bedrooms)
    .filter((value) => value != null && Number.isFinite(Number(value)))
    .map(Number);

  const areas = groups
    .flatMap((group) => group.units.map((unit) => Number(unit.areaSqft)))
    .filter((value) => Number.isFinite(value) && value > 0);

  const prices = groups
    .flatMap((group) => group.units.map((unit) => Number(unit.price)))
    .filter((value) => Number.isFinite(value) && value > 0);

  return {
    bedrooms: bedrooms.length ? Math.min(...bedrooms) : 0,
    area: areas.length ? Math.min(...areas) : 0,
    price: prices.length ? Math.min(...prices) : 0,
    // Listing-level parking is unused; inventory parking lives on unit types.
    parking: 0,
    bathrooms: 0,
  };
}

