import { formatDisplayDate } from "@/lib/admin/utils";
import { toRenderableContent } from "@/lib/blog/content";
import { normalizeFaqs } from "@/lib/blog/seo";
import { normalizeTags } from "@/lib/blog/tags";

export { paragraphsFromContent } from "@/lib/blog/content";

export function toPublicPost(row) {
  const publishedAt = row.published_at || row.created_at;
  const content = toRenderableContent(row.content);
  return {
    id: row.id,
    slug: row.slug,
    featuredOnHome: Boolean(row.featured_on_home),
    featuredAsHero: Boolean(row.featured_as_hero),
    image: row.cover_image || "",
    imageAlt: row.cover_alt || row.title || "",
    authorName: row.author_name || "",
    date: formatDisplayDate(publishedAt),
    publishedAt: row.published_at || null,
    updatedAt: row.updated_at || null,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt || "",
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    focusKeyword: row.focus_keyword || "",
    faqs: normalizeFaqs(row.faqs),
    contentHtml: content.kind === "html" ? content.html : "",
    paragraphs: content.kind === "paragraphs" ? content.paragraphs : [],
    toc: content.toc || [],
    tags: normalizeTags(row.tags),
  };
}

export function pickHeroPost(posts) {
  return (
    posts.find((post) => post.featuredAsHero) ||
    posts.find((post) => post.featuredOnHome) ||
    posts[0] ||
    null
  );
}

export function relatedPosts(posts, slug, limit = 3) {
  return posts.filter((post) => post.slug !== slug).slice(0, limit);
}
