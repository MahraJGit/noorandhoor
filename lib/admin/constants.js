export const ADMIN_PROPERTIES_KEY = "nh.admin.properties";

export const PROPERTY_MARKETS = ["buy", "off-plan"];

export const PROPERTY_MARKET_OPTIONS = [
  { value: "buy", label: "Buy" },
  { value: "off-plan", label: "Off Plan" },
];

/** Sub-page categories per market (matches frontend nav). */
export const PROPERTY_TYPES_BY_MARKET = {
  buy: [
    { value: "apartments", label: "Buy Apartments", path: "/buy/apartments" },
    { value: "townhouses", label: "Buy Town houses", path: "/buy/townhouses" },
    { value: "penthouses", label: "Penthouses", path: "/buy/penthouses" },
    { value: "villas", label: "Residential Villas", path: "/buy/villas" },
    { value: "properties", label: "Buy Properties", path: "/buy/properties" },
  ],
  "off-plan": [
    { value: "villas", label: "Villas", path: "/off-plan/villas" },
    { value: "apartments", label: "Apartments", path: "/off-plan/apartments" },
    {
      value: "commercial",
      label: "Commercial",
      path: "/off-plan/commercial",
    },
    { value: "penthouses", label: "Penthouse", path: "/off-plan/penthouses" },
    { value: "townhouses", label: "Townhouse", path: "/off-plan/townhouses" },
    // { value: "guide", label: "Off plan guide", path: "/off-plan/guide" },
  ],
};

/** Maps old admin type labels to category keys. */
export const LEGACY_PROPERTY_TYPE_MAP = {
  buy: {
    Apartment: "apartments",
    Villa: "villas",
    Townhouse: "townhouses",
    Penthouse: "penthouses",
    House: "villas",
    Commercial: "properties",
  },
  "off-plan": {
    Apartment: "apartments",
    Villa: "villas",
    Townhouse: "townhouses",
    Penthouse: "penthouses",
    House: "villas",
    Commercial: "commercial",
  },
};

export function propertyTypesForMarket(market) {
  return PROPERTY_TYPES_BY_MARKET[market] || PROPERTY_TYPES_BY_MARKET.buy;
}

export function defaultPropertyType(market = "buy") {
  return propertyTypesForMarket(market)[0]?.value || "apartments";
}

export function normalizePropertyType(market, type) {
  const categories = propertyTypesForMarket(market);
  if (categories.some((item) => item.value === type)) return type;
  const legacy = LEGACY_PROPERTY_TYPE_MAP[market]?.[type];
  if (legacy) return legacy;
  return defaultPropertyType(market);
}

export function propertyTypeLabel(market, type) {
  const normalized = normalizePropertyType(market, type);
  return (
    propertyTypesForMarket(market).find((item) => item.value === normalized)
      ?.label || normalized
  );
}

export const PROPERTY_TYPE_VALUES = [
  ...new Set(
    Object.values(PROPERTY_TYPES_BY_MARKET).flatMap((items) =>
      items.map((item) => item.value),
    ),
  ),
];

/** Flat values for admin filters when no market is selected. */
export const PROPERTY_TYPES = PROPERTY_TYPE_VALUES;

export const PROPERTY_LOCATIONS = [
  "Dubai Marina, Dubai",
  "Downtown Dubai, Dubai",
  "Palm Jumeirah, Dubai",
  "Business Bay, Dubai",
  "JBR, Dubai",
  "Jumeirah Village Circle, Dubai",
  "Dubai Hills Estate, Dubai",
  "Arabian Ranches, Dubai",
  "MBR City, Dubai",
  "Abu Dhabi, Abu Dhabi",
  "Sharjah, Sharjah",
  "Ajman, Ajman",
  "Ras Al Khaimah, Ras Al Khaimah",
  "Umm Al Quwain, Umm Al Quwain",
  "Fujairah, Fujairah",
];
export const PROPERTY_LOCATION_OTHER = "__other__";
export const PROPERTY_STATUSES = ["available", "reserved", "sold", "for sale"];
export const BLOG_STATUSES = ["draft", "published"];
export const DEVELOPER_CATEGORIES = [
  "Residential",
  "Luxury",
  "Commercial",
  "Mixed Use",
  "Hospitality",
];
export const DEVELOPER_STATUSES = ["active", "inactive"];

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", match: "exact" },
  { href: "/admin/properties", label: "Properties", match: "prefix" },
  { href: "/admin/properties/new", label: "Add property", match: "exact", indent: true },
  { href: "/admin/developers", label: "Developers", match: "prefix" },
  { href: "/admin/developers/new", label: "Add developer", match: "exact", indent: true },
  { href: "/admin/blogs", label: "Blogs", match: "prefix" },
  { href: "/admin/blogs/new", label: "Upload blog", match: "exact", indent: true },
];

export const PAGE_SIZE = 8;
export const MAX_COVER_IMAGE_BYTES = 1.5 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 12;

export const DEFAULT_PROPERTY_FEATURES = [
  "Air Conditioning",
  "Central A/C",
  "High-speed Internet",
  "WiFi",
  "Swimming Pool",
  "Fitness Center",
  "24/7 Security",
  "Parking",
  "Balcony",
  "Laundry",
  "Sauna",
  "Window Coverings",
  "Lawn",
];

export const DEFAULT_PROPERTY_DOCUMENTS = [
  { name: "Purchase-Agreement", available: false },
  { name: "Offering-Memorandum", available: false },
  { name: "Market-Information", available: false },
];

export const DEFAULT_PROPERTY_AGENT = {
  name: "Shakeeb Ahmad Khan",
  phone: "+971526938886",
};
