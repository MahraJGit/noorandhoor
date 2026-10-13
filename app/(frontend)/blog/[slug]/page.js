import { notFound } from "next/navigation";
import BlogArticle from "@/components/sections/blog/BlogArticle";
import { getPublishedPostBySlug, getRelatedPosts } from "@/lib/blog/queries";
import { buildBlogJsonLd, buildBlogMetadata } from "@/lib/blog/seo";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Article | Noor & Hoor Properties",
      description:
        "Read the latest UAE real estate insights from Noor & Hoor Properties.",
      path: `/blog/${slug}`,
    });
  }

  return buildBlogMetadata(post);
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedPosts(slug);
  const jsonLd = buildBlogJsonLd(post);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticle post={post} related={related} />
    </>
  );
}
