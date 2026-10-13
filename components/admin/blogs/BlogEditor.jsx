"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BlogFaqFields from "@/components/admin/blogs/BlogFaqFields";
import BlogSeoFields from "@/components/admin/blogs/BlogSeoFields";
import BlogTagFields from "@/components/admin/blogs/BlogTagFields";
import RichTextEditor from "@/components/admin/blogs/RichTextEditor";
import PageHeader from "@/components/admin/ui/PageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import {
  SelectField,
  TextArea,
  TextField,
} from "@/components/admin/ui/Fields";
import VisibilityPanel from "@/components/admin/ui/VisibilityPanel";
import { useToast } from "@/components/admin/providers/ToastProvider";
import {
  BLOG_COVER_HEIGHT,
  BLOG_COVER_WIDTH,
  BLOG_STATUSES,
  MAX_BLOG_COVER_IMAGE_BYTES,
} from "@/lib/admin/constants";
import { ADMIN_BLOG_CATEGORIES } from "@/lib/admin/data/blogs";
import { slugify } from "@/lib/admin/utils";
import { isContentEmpty } from "@/lib/blog/content";
import { normalizeTags } from "@/lib/blog/tags";

export const EMPTY_BLOG_FORM = {
  title: "",
  slug: "",
  category: ADMIN_BLOG_CATEGORIES[0],
  excerpt: "",
  content: "",
  tags: [],
  coverImage: "",
  coverAlt: "",
  authorName: "",
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  faqs: [],
  featuredOnHome: false,
  featuredAsHero: false,
  status: "published",
};

export function blogToForm(blog) {
  return {
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    excerpt: blog.excerpt,
    content: blog.content,
    tags: blog.tags?.length ? blog.tags : [],
    coverImage: blog.coverImage,
    coverAlt: blog.coverAlt || "",
    authorName: blog.authorName || "",
    metaTitle: blog.metaTitle || "",
    metaDescription: blog.metaDescription || "",
    focusKeyword: blog.focusKeyword || "",
    faqs: blog.faqs?.length ? blog.faqs : [],
    featuredOnHome: Boolean(blog.featuredOnHome),
    featuredAsHero: Boolean(blog.featuredAsHero),
    status: blog.status,
  };
}

export default function BlogEditor({
  title,
  eyebrow,
  submitLabel,
  initialBlog,
  blogs = [],
  onSave,
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState(() =>
    initialBlog ? blogToForm(initialBlog) : EMPTY_BLOG_FORM,
  );
  const [errors, setErrors] = useState({});
  const [slugLocked, setSlugLocked] = useState(Boolean(initialBlog));
  const [isSaving, setIsSaving] = useState(false);

  const currentHero = useMemo(
    () => blogs.find((item) => item.featuredAsHero) || null,
    [blogs],
  );
  const heroTakenByOther = Boolean(
    currentHero && currentHero.id !== initialBlog?.id,
  );
  const tagSuggestions = useMemo(
    () => normalizeTags(blogs.flatMap((blog) => blog.tags || [])),
    [blogs],
  );

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugLocked ? current.slug : slugify(value),
    }));
    setErrors((current) => ({ ...current, title: undefined }));
  };

  const validation = useMemo(() => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.slug.trim()) next.slug = "Slug is required.";
    if (!form.excerpt.trim()) next.excerpt = "Excerpt is required.";
    if (isContentEmpty(form.content)) {
      next.content = "Write at least one paragraph.";
    }
    if (!form.coverImage) next.coverImage = "Upload a cover image.";
    return next;
  }, [form]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(validation).length) {
      setErrors(validation);
      showToast("Please complete the required fields.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        ...form,
        tags: normalizeTags(form.tags),
      });
      showToast(initialBlog ? "Blog updated." : "Blog uploaded.");
      router.push("/admin/blogs");
    } catch (error) {
      showToast(
        error?.message || "Could not save this blog. Please try again.",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description="Cover image, tags, SEO, rich content, and publishing state are stored in Supabase."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <div className="space-y-5 rounded-2xl border border-white/8 bg-[#161616] p-5 sm:p-6">
            <TextField
              id="title"
              label="Title"
              value={form.title}
              onChange={(event) => onTitleChange(event.target.value)}
              error={errors.title}
              placeholder="Dubai property market trends"
            />
            <TextField
              id="slug"
              label="Slug"
              value={form.slug}
              onChange={(event) => {
                setSlugLocked(true);
                setField("slug", slugify(event.target.value));
              }}
              error={errors.slug}
              hint="Used in the public URL: /blog/your-slug"
              tooltip="Auto-fills from the title. Change only if you need a custom URL."
            />
            <TextArea
              id="excerpt"
              label="Excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(event) => setField("excerpt", event.target.value)}
              error={errors.excerpt}
              placeholder="A short summary for listing cards."
              tooltip="Short summary shown on blog cards and the home Blog section."
            />
            <RichTextEditor
              value={form.content}
              onChange={(value) => setField("content", value)}
              error={errors.content}
            />
            <BlogTagFields
              tags={form.tags}
              suggestions={tagSuggestions}
              onChange={(tags) => setField("tags", tags)}
            />
          </div>

          <BlogSeoFields form={form} errors={errors} setField={setField} />

          <div className="rounded-2xl border border-white/8 bg-[#161616] p-5 sm:p-6">
            <BlogFaqFields
              faqs={form.faqs}
              onChange={(faqs) => setField("faqs", faqs)}
              error={errors.faqs}
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="space-y-5 rounded-2xl border border-white/8 bg-[#161616] p-5 sm:p-6">
            <ImageUploader
              value={form.coverImage}
              onChange={(value) => setField("coverImage", value)}
              error={errors.coverImage}
              requiredWidth={BLOG_COVER_WIDTH}
              requiredHeight={BLOG_COVER_HEIGHT}
              maxBytes={MAX_BLOG_COVER_IMAGE_BYTES}
              aspectClassName="aspect-[16/9]"
            />
            <TextField
              id="coverAlt"
              label="Cover image alt text"
              value={form.coverAlt}
              onChange={(event) => setField("coverAlt", event.target.value)}
              error={errors.coverAlt}
              placeholder="Describe the cover image"
              tooltip="Accessibility and SEO text for the cover image. Falls back to the title if blank."
            />
            <TextField
              id="authorName"
              label="Author name"
              value={form.authorName}
              onChange={(event) => setField("authorName", event.target.value)}
              error={errors.authorName}
              placeholder="e.g. Shakeeb"
              tooltip="Shown on the article page and in structured data."
            />
            <SelectField
              id="category"
              label="Category"
              value={form.category}
              onChange={(event) => setField("category", event.target.value)}
              options={ADMIN_BLOG_CATEGORIES}
              tooltip="Used for blog filters and labels on listing cards."
            />
            <SelectField
              id="status"
              label="Status"
              value={form.status}
              onChange={(event) => setField("status", event.target.value)}
              options={BLOG_STATUSES}
              tooltip="Published posts are public. Drafts stay hidden until you publish."
            />
          </div>

          <VisibilityPanel
            title="Featured placement"
            description="Home can feature several articles. The blog listing hero is limited to one."
            items={[
              {
                id: "featured-on-home",
                label: "Feature on home page",
                description:
                  "Include this post in Blog & Latest News on the home page. Multiple articles can be featured.",
                tooltip:
                  "Home shows featured articles first. If none are featured, it falls back to the latest posts.",
                checked: form.featuredOnHome,
                onChange: (checked) => setField("featuredOnHome", checked),
              },
              {
                id: "featured-as-hero",
                label: "Use as blog hero",
                description: heroTakenByOther
                  ? `Hero is already set to “${currentHero.title}”. Uncheck it there first to choose a different hero.`
                  : "Show this post as the large hero at the top of the Blog listing page. Only one hero is allowed.",
                tooltip: heroTakenByOther
                  ? "Only one blog hero is allowed. Open the current hero article and turn this off first."
                  : "Only one article can be the blog hero at a time.",
                checked: form.featuredAsHero,
                onChange: (checked) => setField("featuredAsHero", checked),
                disabled: heroTakenByOther,
              },
            ]}
          />
        </aside>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <AdminButton
          variant="secondary"
          disabled={isSaving}
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </AdminButton>
        <AdminButton type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </AdminButton>
      </div>
    </form>
  );
}
