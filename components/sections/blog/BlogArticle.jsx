import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import BlogCard from "@/components/ui/BlogCard";
import BlogTags from "@/components/ui/BlogTags";
import MediaImage from "@/components/ui/MediaImage";
import BlogTableOfContents from "@/components/sections/blog/BlogTableOfContents";
import { CONTACT_FORM_HREF } from "@/components/sections/contact/contactData";

function ArticleBody({ post }) {
  if (post.contentHtml) {
    return (
      <div
        className="blog-article-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    );
  }

  return (
    <div className="space-y-5 text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
      {post.paragraphs.map((paragraph, index) => (
        <p key={`paragraph-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
}

function FaqSection({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="mt-14 border-t border-white/8 pt-12 sm:mt-16 sm:pt-14">
      <div className="mb-6">
        <p className="section-sub-heading">FAQs</p>
        <h3 className="blog-faq-heading text-gold-gradient mt-2">
          Frequently Asked Questions
        </h3>
      </div>
      <div className="space-y-3">
        {faqs.map((item, index) => (
          <details
            key={`faq-${index}`}
            className="group rounded-2xl border border-white/10 bg-[#171717] px-5 py-4 transition-colors open:border-[#ba8a44]/40"
          >
            <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                <h3 className="blog-faq-question m-0 text-left text-sm font-semibold text-white sm:text-base">
                  {item.question}
                </h3>
                <span className="mt-0.5 shrink-0 text-[#ba8a44] transition duration-300 group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function BlogArticle({ post, related = [] }) {
  return (
    <div className="min-h-screen bg-[#111] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
      <article className="section-inner">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-[#eec876]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to Blog
        </Link>

        <header className="mx-auto mt-8 max-w-3xl text-center sm:mt-10">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-md bg-gradient-to-r from-[#BC8741] to-[#D6A85E] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.96px] text-white">
              {post.category}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden />
            <p className="text-xs font-medium text-[#ba8a44] sm:text-sm">
              {post.date}
            </p>
            {post.authorName ? (
              <>
                <span className="h-1 w-1 rounded-full bg-white/25" aria-hidden />
                <p className="text-xs font-medium text-white/65 sm:text-sm">
                  By {post.authorName}
                </p>
              </>
            ) : null}
          </div>

          <h1 className="detail-heading text-gold-gradient mt-5 sm:mt-6">
            {post.title}
          </h1>

          {post.tags?.length ? (
            <div className="mt-5 flex justify-center">
              <BlogTags tags={post.tags} linked />
            </div>
          ) : null}
        </header>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#ba8a44]/25 sm:mt-10 sm:rounded-3xl">
          <MediaImage
            src={post.image}
            alt={post.imageAlt || post.title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111]/50 via-transparent to-transparent"
            aria-hidden
          />
        </div>

        <div className="mt-8 w-full sm:mt-10">
          <BlogTableOfContents items={post.toc} />
        </div>

        <div className="mt-8 w-full sm:mt-10">
          <ArticleBody post={post} />
        </div>

        <FaqSection faqs={post.faqs} />

        <div className="mt-14 w-full overflow-hidden rounded-2xl border border-[#ba8a44]/25 bg-[linear-gradient(160deg,#1b1b1b_0%,#141414_55%,#1a1610_100%)] px-6 py-10 text-center sm:mt-16 sm:px-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[1.6px] text-[#ba8a44]">
            Next step
          </p>
          <h2 className="text-gold-gradient mt-3 text-3xl sm:text-4xl">
            Ready to Take the Next Step?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
            Speak with Noor &amp; Hoor Properties about buying, selling,
            renting, or investing in Dubai.
          </p>
          <Button href={CONTACT_FORM_HREF} className="mt-7 px-7 py-3 text-sm">
            Contact Our Team
          </Button>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-white/8 pt-14 sm:mt-20 sm:pt-16">
            <div className="mb-8 flex flex-col gap-3 sm:mb-10">
              <p className="section-sub-heading">Keep Reading</p>
              <h2 className="text-gold-gradient">Related Articles</h2>
              <div className="h-[4px] w-25 bg-[#B3813D]" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
              {related.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
