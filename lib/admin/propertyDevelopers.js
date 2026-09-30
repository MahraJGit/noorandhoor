/**
 * Property ↔ developer join helpers (many-to-many).
 */

const DEVELOPER_IMAGES_BUCKET = "developer-images";

export function developerImagePublicUrl(imagePath, getPublicUrl) {
  const path = String(imagePath || "").trim();
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  if (typeof getPublicUrl === "function") {
    return getPublicUrl(path) || "";
  }
  return "";
}

export function normalizePropertyDevelopers(value, { getPublicUrl } = {}) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();
  const result = [];

  for (const item of value) {
    const nested = item?.developers || {};
    const id = String(
      item?.id || item?.developer_id || item?.developerId || nested.id || "",
    ).trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);

    const imagePath = String(
      item?.imagePath ||
        item?.image_path ||
        nested.image_path ||
        "",
    ).trim();
    const image =
      String(item?.image || "").trim() ||
      developerImagePublicUrl(imagePath, getPublicUrl);

    result.push({
      id,
      developerName: String(
        item?.developerName ||
          item?.developer_name ||
          item?.name ||
          nested.developer_name ||
          "",
      ).trim(),
      title: String(item?.title || nested.title || "").trim(),
      imagePath,
      image,
      pointOne: String(
        item?.pointOne || item?.point_one || nested.point_one || "",
      ).trim(),
      pointTwo: String(
        item?.pointTwo || item?.point_two || nested.point_two || "",
      ).trim(),
      pointThree: String(
        item?.pointThree || item?.point_three || nested.point_three || "",
      ).trim(),
    });
  }

  return result;
}

/**
 * Map joined `property_developers` rows (with nested `developers`) into app shape.
 */
export function developersFromRelation(rows, fallbackName = "", options = {}) {
  if (Array.isArray(rows) && rows.length) {
    const sorted = [...rows].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0),
    );
    return normalizePropertyDevelopers(
      sorted.map((row) => ({
        id: row.developer_id || row.developers?.id,
        developerName: row.developers?.developer_name,
        title: row.developers?.title,
        imagePath: row.developers?.image_path,
        pointOne: row.developers?.point_one,
        pointTwo: row.developers?.point_two,
        pointThree: row.developers?.point_three,
        developers: row.developers,
      })),
      options,
    );
  }

  void fallbackName;
  return [];
}

export function developersToInsertRows(propertyId, developers) {
  return normalizePropertyDevelopers(developers).map((item, index) => ({
    property_id: propertyId,
    developer_id: item.id,
    sort_order: index,
  }));
}

export function developersToForm(developers = []) {
  return normalizePropertyDevelopers(developers);
}

export function developerNames(developers = []) {
  return normalizePropertyDevelopers(developers)
    .map((item) => item.developerName)
    .filter(Boolean);
}

/** Comma-joined label for the denormalized `properties.developer` column. */
export function developersDisplayName(developers = [], fallback = "") {
  const names = developerNames(developers);
  if (names.length) return names.join(", ");
  return String(fallback || "").trim();
}

export { DEVELOPER_IMAGES_BUCKET };
