import { DEFAULT_PROPERTY_AGENT } from "@/lib/admin/constants";
import { normalizeProjectDetails } from "@/lib/admin/propertyDetails";
import { deriveListingSpecsFromUnitGroups } from "@/lib/admin/propertyUnits";
import { listedAgoLabel, propertyPublicPath } from "@/lib/admin/utils";
import { propertyMatchesFilters } from "@/lib/listingFilters";

export function findAdminProperty(properties, slug, market) {
  const list = properties || [];
  return (
    list.find((item) => item.slug === slug && item.market === market) ||
    list.find((item) => item.slug === slug) ||
    null
  );
}

export function isPublicProperty(property) {
  return Boolean(property) && property.status !== "sold";
}

function categoryKey(category) {
  if (!category) return "";
  if (typeof category === "string") {
    if (!category.includes("/")) return category;
    return category.split("/").filter(Boolean).at(-1) || "";
  }
  return category.key || "";
}

export function propertyMatchesCategory(property, category) {
  if (!property || !category) return false;

  const key = categoryKey(category);
  if (key) {
    return String(property.type || "") === String(key);
  }

  const path = typeof category === "string" ? category : category?.path;
  if (!path) return false;
  const href =
    property.href ||
    propertyPublicPath(property.market, property.type, property.slug);
  return href === path || href.startsWith(`${path}/`);
}

export function listingHomes(properties, options = {}) {
  const {
    market,
    category,
    featuredOnly = false,
    recent = false,
    limit,
    filters,
  } = options;

  let list = (properties || []).filter(isPublicProperty);
  if (market) list = list.filter((item) => item.market === market);
  if (category) {
    list = list.filter((item) => propertyMatchesCategory(item, category));
  }
  if (filters && Object.keys(filters).length) {
    list = list.filter((item) => propertyMatchesFilters(item, filters));
  }
  if (featuredOnly) {
    list = list.filter((item) => item.featured);
  }
  if (recent) {
    list = [...list].sort((a, b) =>
      String(b.listedAt || "").localeCompare(String(a.listedAt || "")),
    );
  }

  const homes = list.map(adminToListingHome);
  return typeof limit === "number" ? homes.slice(0, limit) : homes;
}

export function relatedListingHomes(properties, current, limit = 4) {
  if (!current) return [];
  return listingHomes(properties, { market: current.market })
    .filter((item) => item.id !== current.id && item.slug !== current.slug)
    .slice(0, limit);
}

export function buildPropertyTags(property) {
  const tags = [];
  if (property.view) {
    tags.push({ label: property.view, type: "view" });
  }
  if (property.listedAt) {
    tags.push({ label: listedAgoLabel(property.listedAt), type: "calendar" });
  }
  return tags;
}

export function galleryFromProperty(property) {
  if (Array.isArray(property.images) && property.images.length) {
    return property.images.filter(Boolean);
  }
  if (property.image) return [property.image];
  return [];
}

export function adminToListingHome(property) {
  const images = galleryFromProperty(property);
  const derived = deriveListingSpecsFromUnitGroups(property.unitGroups);
  return {
    id: property.id,
    images,
    image: images[0] || "",
    title: property.title,
    location: property.location,
    status:
      String(property.saleStatus || property.status || "").trim().toUpperCase() ||
      undefined,
    features: {
      bedroom: derived
        ? derived.bedrooms
        : Number(property.bedrooms) || 0,
      bathroom: derived ? 0 : Number(property.bathrooms) || 0,
      area: derived ? derived.area : Number(property.area) || 0,
    },
    price: Number(property.price) || derived?.price || 0,
    featured: Boolean(property.featured),
    slug: property.slug,
    href: property.href,
  };
}

export function adminToDetailProperty(admin, fallback = {}) {
  const about = Array.isArray(admin.about) && admin.about.length
    ? admin.about
    : admin.description
      ? [admin.description]
      : fallback.about || [];
  const gallery = galleryFromProperty(admin);
  const tags = buildPropertyTags(admin);

  return {
    ...fallback,
    slug: admin.slug,
    title: admin.title,
    location: admin.location,
    price: Number(admin.price) || fallback.price,
    tags: tags.length ? tags : fallback.tags,
    gallery: gallery.length ? gallery : fallback.gallery || [],
    about,
    description:
      Array.isArray(admin.descriptionItems) && admin.descriptionItems.length
        ? admin.descriptionItems
        : fallback.description || [],
    features:
      Array.isArray(admin.features) && admin.features.length
        ? admin.features
        : fallback.features || [],
    amenities:
      Array.isArray(admin.amenities) && admin.amenities.length
        ? admin.amenities
        : fallback.amenities || [],
    developers:
      Array.isArray(admin.developers) && admin.developers.length
        ? admin.developers
        : fallback.developers || [],
    unitGroups:
      Array.isArray(admin.unitGroups) && admin.unitGroups.length
        ? admin.unitGroups
        : fallback.unitGroups || [],
    paymentMilestones:
      Array.isArray(admin.paymentMilestones) && admin.paymentMilestones.length
        ? admin.paymentMilestones
        : fallback.paymentMilestones || [],
    documents:
      Array.isArray(admin.documents) && admin.documents.length
        ? admin.documents
        : fallback.documents || [],
    map: (() => {
      const lat = Number(admin.mapLat);
      const lng = Number(admin.mapLng);
      const hasCoords =
        admin.mapLat !== "" &&
        admin.mapLat != null &&
        admin.mapLng !== "" &&
        admin.mapLng != null &&
        Number.isFinite(lat) &&
        Number.isFinite(lng);

      return {
        lat: hasCoords ? lat : fallback.map?.lat,
        lng: hasCoords ? lng : fallback.map?.lng,
        label: admin.mapLabel || fallback.map?.label || admin.location,
      };
    })(),
    agent: {
      name: admin.agentName || fallback.agent?.name || DEFAULT_PROPERTY_AGENT.name,
      phone: admin.agentPhone || fallback.agent?.phone || DEFAULT_PROPERTY_AGENT.phone,
    },
    listedAt: admin.listedAt || fallback.listedAt,
    market: admin.market,
    type: admin.type,
    parking: admin.parking,
    view: admin.view,
    href: admin.href,
    paymentDownPercent: admin.paymentDownPercent ?? 10,
    paymentInstallments: admin.paymentInstallments ?? 24,
    paymentStartDate: admin.paymentStartDate || "",
    ...normalizeProjectDetails(admin),
  };
}
