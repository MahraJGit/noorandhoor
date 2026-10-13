import { SITE_NAME, SITE_URL, buildPageMetadata } from "@/lib/seo";

function absolutize(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function blogKeywords(post) {
  const seen = new Set();
  const keywords = [];
  for (const value of [post?.focusKeyword, ...(post?.tags || [])]) {
    const text = String(value || "").trim();
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    keywords.push(text);
  }
  return keywords;
}

export function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((item) => ({
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim(),
    }))
    .filter((item) => item.question && item.answer);
}

export function buildBlogMetadata(post) {
  const path = `/blog/${post.slug}`;
  const title = (post.metaTitle || post.title || "").trim();
  const description = (
    post.metaDescription ||
    post.excerpt ||
    SITE_NAME
  ).trim();
  const keywords = blogKeywords(post).join(", ");
  const base = buildPageMetadata({
    title,
    description,
    path,
    type: "article",
    image: post.image,
    imageAlt: post.imageAlt || post.title,
  });

  return {
    ...base,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      ...base.openGraph,
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      ...(post.authorName ? { authors: [post.authorName] } : {}),
    },
  };
}

export function buildBlogJsonLd(post) {
  const url = absolutize(`/blog/${post.slug}`);
  const image = absolutize(post.image);
  const graphs = [
    {
      "@type": "BlogPosting",
      headline: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      ...(blogKeywords(post).length
        ? { keywords: blogKeywords(post).join(", ") }
        : {}),
      image: image ? [image] : undefined,
      datePublished: post.publishedAt || undefined,
      dateModified: post.updatedAt || post.publishedAt || undefined,
      mainEntityOfPage: url,
      author: {
        "@type": post.authorName ? "Person" : "Organization",
        name: post.authorName || SITE_NAME,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      url,
    },
  ];

  const faqs = normalizeFaqs(post.faqs);
  if (faqs.length) {
    graphs.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graphs,
  };
}
