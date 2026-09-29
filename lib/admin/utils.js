import {
  LEGACY_PROPERTY_TYPE_MAP,
  PROPERTY_TYPES_BY_MARKET,
  normalizePropertyType,
} from "@/lib/admin/constants";

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(value) {
  return `AED ${Number(value || 0).toLocaleString("en-AE")}`;
}

export function formatDisplayDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function listedAgoLabel(listedAt) {
  if (!listedAt) return "";
  const date = listedAt instanceof Date ? listedAt : new Date(listedAt);
  if (Number.isNaN(date.getTime())) return String(listedAt);
  const days = Math.round((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  return formatDisplayDate(date);
}

export function resolveImageSrc(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.src || "";
}

export function truncate(value, length = 80) {
  const text = String(value || "");
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
}

export function uniqueSlug(base, existingSlugs, currentId) {
  const root = slugify(base) || "post";
  const taken = new Set(
    existingSlugs
      .filter((entry) => entry.id !== currentId)
      .map((entry) => entry.slug),
  );

  if (!taken.has(root)) return root;

  let index = 2;
  while (taken.has(`${root}-${index}`)) index += 1;
  return `${root}-${index}`;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

export function isInlineImageSrc(src) {
  return Boolean(src && (src.startsWith("data:") || src.startsWith("blob:")));
}

const MARKET_LISTING_PATHS = {
  buy: "/buy/properties",
  rent: "/rent/properties",
  sell: "/sell/properties",
  "off-plan": "/off-plan",
};

function categoryPath(market, type) {
  const categories = PROPERTY_TYPES_BY_MARKET[market];
  if (!categories) return null;
  const match = categories.find((item) => item.value === type);
  return match?.path || null;
}

export function listingPathForType(market, type) {
  const direct = categoryPath(market, type);
  if (direct) return direct;

  // Hero filters still send labels like "Apartment" / "Villa".
  const legacyKey = LEGACY_PROPERTY_TYPE_MAP[market]?.[type];
  if (legacyKey) {
    const legacyPath = categoryPath(market, legacyKey);
    if (legacyPath) return legacyPath;
  }

  const normalized = normalizePropertyType(market, type);
  return (
    categoryPath(market, normalized) ||
    MARKET_LISTING_PATHS[market] ||
    MARKET_LISTING_PATHS.buy
  );
}

export function propertyPublicPath(market, type, slug) {
  const base = listingPathForType(market, type);
  return slug ? `${base}/${slug}` : base;
}
