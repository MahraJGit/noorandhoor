import { ADMIN_BLOG_CATEGORIES } from "@/components/sections/blog/blogData";
import {
  removeCoverImage,
  uploadCoverImage,
} from "@/lib/admin/data/blogImages";
import { formatDisplayDate, uniqueSlug } from "@/lib/admin/utils";
import { normalizeFaqs } from "@/lib/blog/seo";
import { normalizeTags } from "@/lib/blog/tags";
import { createClient } from "@/lib/supabase/client";

export { ADMIN_BLOG_CATEGORIES };

const EMPTY = [];
let listeners = new Set();
let snapshot = EMPTY;
let loadPromise = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function fromRow(row) {
  const publishedAt = row.published_at || null;
  const createdAt = row.created_at;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    category: row.category,
    content: row.content || "",
    tags: normalizeTags(row.tags),
    coverImage: row.cover_image || "",
    coverAlt: row.cover_alt || "",
    authorName: row.author_name || "",
    metaTitle: row.meta_title || "",
    metaDescription: row.meta_description || "",
    focusKeyword: row.focus_keyword || "",
    faqs: normalizeFaqs(row.faqs),
    featuredOnHome: Boolean(row.featured_on_home),
    featuredAsHero: Boolean(row.featured_as_hero),
    status: row.status || "draft",
    publishedAt,
    date: formatDisplayDate(publishedAt || createdAt),
    createdAt,
    updatedAt: row.updated_at,
  };
}

function toRow(blog, { createdBy, includeId = false } = {}) {
  const row = {
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    category: blog.category,
    content: blog.content,
    tags: normalizeTags(blog.tags),
    cover_image: blog.coverImage,
    cover_alt: blog.coverAlt || "",
    author_name: blog.authorName || "",
    meta_title: blog.metaTitle || "",
    meta_description: blog.metaDescription || "",
    focus_keyword: blog.focusKeyword || "",
    faqs: normalizeFaqs(blog.faqs),
    featured_on_home: Boolean(blog.featuredOnHome),
    featured_as_hero: Boolean(blog.featuredAsHero),
    status: blog.status,
    published_at: blog.publishedAt,
  };

  if (includeId && blog.id) row.id = blog.id;
  if (createdBy) row.created_by = createdBy;
  return row;
}

function normalizeBlog(payload, existing = [], currentId) {
  return {
    slug: uniqueSlug(payload.slug || payload.title, existing, currentId),
    title: String(payload.title || "").trim(),
    excerpt: String(payload.excerpt || "").trim(),
    category: payload.category || ADMIN_BLOG_CATEGORIES[0],
    content: String(payload.content || "").trim(),
    tags: normalizeTags(payload.tags),
    coverImage: payload.coverImage || "",
    coverAlt: String(payload.coverAlt || "").trim(),
    authorName: String(payload.authorName || "").trim(),
    metaTitle: String(payload.metaTitle || "").trim(),
    metaDescription: String(payload.metaDescription || "").trim(),
    focusKeyword: String(payload.focusKeyword || "").trim(),
    faqs: normalizeFaqs(payload.faqs),
    featuredOnHome: Boolean(payload.featuredOnHome),
    featuredAsHero: Boolean(payload.featuredAsHero),
    status: payload.status || "draft",
  };
}

function publishedAtFor(status, previous) {
  if (status !== "published") return previous || null;
  return previous || new Date().toISOString();
}

function dbErrorMessage(error, fallback) {
  const message = error?.message || "";
  if (error?.code === "23505") {
    if (/featured_as_hero/i.test(message)) {
      return "Another article is already set as the blog hero. Unset it first, or save again to replace it.";
    }
    return "A blog with this slug already exists.";
  }
  if (/row-level security/i.test(message)) {
    return "You need to be signed in as admin to save blogs.";
  }
  return message || fallback;
}

async function currentUserId(supabase) {
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

async function clearOtherHeroes(supabase, keepId) {
  let query = supabase
    .from("blog_posts")
    .update({ featured_as_hero: false })
    .eq("featured_as_hero", true);
  if (keepId) query = query.neq("id", keepId);
  const { error } = await query;
  if (error) {
    throw new Error(dbErrorMessage(error, "Could not update blog hero."));
  }
}

function setSnapshot(next) {
  snapshot = next;
  emit();
  return snapshot;
}

export function subscribeBlogs(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getBlogsSnapshot() {
  return snapshot;
}

export function getBlogsServerSnapshot() {
  return EMPTY;
}

export async function loadBlogs() {
  if (typeof window === "undefined") return EMPTY;
  if (!loadPromise) {
    loadPromise = (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        loadPromise = null;
        throw new Error(dbErrorMessage(error, "Could not load blogs."));
      }

      return setSnapshot((data || []).map(fromRow));
    })();
  }

  return loadPromise;
}

export function getBlogs() {
  if (typeof window === "undefined") return EMPTY;
  return getBlogsSnapshot();
}

export async function createBlog(payload) {
  const supabase = createClient();
  const blogs = getBlogsSnapshot();
  const id = crypto.randomUUID();
  const blog = {
    id,
    ...normalizeBlog(payload, blogs),
  };
  blog.publishedAt = publishedAtFor(blog.status, null);
  blog.coverImage = await uploadCoverImage(supabase, id, blog.coverImage);

  if (blog.featuredAsHero) {
    await clearOtherHeroes(supabase, id);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(
      toRow(blog, {
        createdBy: await currentUserId(supabase),
        includeId: true,
      }),
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(dbErrorMessage(error, "Could not save this blog."));
  }

  const created = fromRow(data);
  const nextList = [created, ...blogs.filter((item) => item.id !== created.id)];
  if (created.featuredAsHero) {
    setSnapshot(
      nextList.map((item) =>
        item.id === created.id ? item : { ...item, featuredAsHero: false },
      ),
    );
  } else {
    setSnapshot(nextList);
  }
  return created;
}

export async function updateBlog(id, payload) {
  const supabase = createClient();
  const blogs = getBlogsSnapshot();
  const current = blogs.find((item) => item.id === String(id));
  if (!current) throw new Error("Blog not found.");

  const next = {
    ...current,
    ...normalizeBlog(payload, blogs, current.id),
  };
  next.publishedAt = publishedAtFor(next.status, current.publishedAt);
  next.coverImage = await uploadCoverImage(
    supabase,
    current.id,
    next.coverImage,
  );

  if (next.featuredAsHero) {
    await clearOtherHeroes(supabase, current.id);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update(toRow(next))
    .eq("id", current.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(dbErrorMessage(error, "Could not update this blog."));
  }

  if (current.coverImage && current.coverImage !== next.coverImage) {
    await removeCoverImage(supabase, current.coverImage);
  }

  const updated = fromRow(data);
  setSnapshot(
    blogs.map((item) => {
      if (item.id === updated.id) return updated;
      if (updated.featuredAsHero) return { ...item, featuredAsHero: false };
      return item;
    }),
  );
  return updated;
}

export async function deleteBlog(id) {
  const supabase = createClient();
  const blogs = getBlogsSnapshot();
  const current = blogs.find((item) => item.id === String(id));

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    throw new Error(dbErrorMessage(error, "Could not delete this blog."));
  }

  if (current?.coverImage) {
    await removeCoverImage(supabase, current.coverImage);
  }

  return setSnapshot(blogs.filter((item) => item.id !== String(id)));
}

export function getBlogStats(blogs) {
  const list = blogs || getBlogs();
  return {
    total: list.length,
    published: list.filter((blog) => blog.status === "published").length,
    drafts: list.filter((blog) => blog.status === "draft").length,
    featured: list.filter(
      (blog) => blog.featuredOnHome || blog.featuredAsHero,
    ).length,
  };
}
