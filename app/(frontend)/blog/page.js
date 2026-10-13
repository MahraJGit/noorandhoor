import PropertyHero from "@/components/common/PropertyHero";
import BlogListing from "@/components/sections/blog/BlogListing";
import { BLOG_CATEGORIES } from "@/components/sections/blog/blogData";
import { getPublishedPosts } from "@/lib/blog/queries";
import { tagSlug } from "@/lib/blog/tags";
import {
  buildPageMetadata,
  getCategoryFromSearchParams,
  getPageFromSearchParams,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Blog | Noor & Hoor Properties",
  description:
    "Stay ahead with the latest market trends, buying tips, and neighbourhood guides from Noor & Hoor Properties.",
  path: "/blog",
});

async function getTagFromSearchParams(searchParams) {
  const params = await searchParams;
  const raw = Array.isArray(params?.tag) ? params.tag[0] : params?.tag;
  return tagSlug(String(raw || "").replace(/-/g, " "));
}

export default async function BlogPage({ searchParams }) {
  const [activeCategory, activeTag, posts, page] = await Promise.all([
    getCategoryFromSearchParams(searchParams, BLOG_CATEGORIES),
    getTagFromSearchParams(searchParams),
    getPublishedPosts(),
    getPageFromSearchParams(searchParams),
  ]);

  return (
    <>
      <PropertyHero variant="blog" />
      <BlogListing
        activeCategory={activeCategory}
        activeTag={activeTag}
        posts={posts}
        page={page}
      />
    </>
  );
}
