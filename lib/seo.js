import { createAnonClient } from "@/lib/supabase/anon";

export const SITE_NAME = "Noor and Hoor";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://noorandhoorproperties.com";
export const SITE_DESCRIPTION =
  "Trusted UAE real estate experts helping buyers, sellers, and investors find the right residential, commercial, and off-plan properties.";

function absolutizeUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
  imageAlt,
}) {
  const pageTitle = String(title || "").trim();
  const pageDescription = String(description || SITE_DESCRIPTION).trim();
  const canonical = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : undefined;
  const imageUrl = absolutizeUrl(image);

  return {
    title: pageTitle,
    description: pageDescription,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type,
      siteName: SITE_NAME,
      ...(canonical ? { url: canonical } : {}),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                ...(imageAlt ? { alt: String(imageAlt) } : {}),
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export async function getPageFromSearchParams(searchParams, fallback = 1) {
  const params = await searchParams;
  const raw = params?.page;
  const value = Number.parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export async function getCategoryFromSearchParams(searchParams, allowed, fallback = "All") {
  const params = await searchParams;
  const raw = Array.isArray(params?.category) ? params.category[0] : params?.category;
  if (!raw || !allowed.includes(raw)) return fallback;
  return raw;
}

function marketFromCategoryPath(path) {
  const segment = String(path || "")
    .split("/")
    .filter(Boolean)[0];
  return segment || null;
}

async function getPropertySeoBySlug(slug, market) {
  if (!slug) return null;

  try {
    const supabase = createAnonClient();
    const select =
      "title, seo_title, seo_description, about, market, images";

    if (market) {
      const { data, error } = await supabase
        .from("properties")
        .select(select)
        .eq("slug", slug)
        .eq("market", market)
        .neq("status", "sold")
        .maybeSingle();
      if (!error && data) return data;
    }

    const { data, error } = await supabase
      .from("properties")
      .select(select)
      .eq("slug", slug)
      .neq("status", "sold")
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

function fallbackDescription(property, category) {
  if (category?.metaDescription) return category.metaDescription;
  const about = Array.isArray(property?.about) ? property.about[0] : "";
  if (about) return String(about).slice(0, 160);
  return `View this ${category?.heading || "property"} with Noor and Hoor.`;
}

export async function generateListingItemMetadata({ params, category }) {
  const { slug } = await params;
  const market = marketFromCategoryPath(category?.path);
  const property = await getPropertySeoBySlug(slug, market);

  const title = (
    property?.seo_title ||
    property?.title ||
    category?.heading ||
    "Property"
  ).trim();
  const description = (
    property?.seo_description || fallbackDescription(property, category)
  ).trim();
  const image = Array.isArray(property?.images) ? property.images[0] : "";

  return buildPageMetadata({
    title,
    description,
    path: `${category.path}/${slug}`,
    type: "article",
    image,
    imageAlt: property?.title || title,
  });
}
