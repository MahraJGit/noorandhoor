import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogTags from "@/components/ui/BlogTags";
import MediaImage from "@/components/ui/MediaImage";

export default function FeaturedPost({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-10 grid overflow-hidden rounded-2xl border border-[#ba8a44]/40 bg-[#121212] transition-colors duration-300 hover:border-[#eec876]/70 lg:mt-14 xl:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="relative aspect-[16/9] w-full bg-[#0d0d0d] xl:col-start-1 xl:row-start-1">
        <MediaImage
          src={post.image}
          alt={post.imageAlt || post.title}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 720px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-4 px-6 py-7 sm:px-8 sm:py-8 xl:col-start-2 xl:row-start-1 xl:h-0 xl:min-h-full xl:overflow-hidden xl:border-l xl:border-[#ba8a44]/20 xl:px-9 xl:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md bg-gradient-to-r from-[#BC8741] to-[#D6A85E] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.96px] text-white">
            {post.category}
          </span>
          <p className="text-xs font-medium tracking-wide text-[#eec876]">
            {post.date}
          </p>
        </div>

        <h2 className="text-gold-gradient !font-accent !text-[1.7rem] !leading-[1.12] !font-normal sm:!text-[2rem]">
          {post.title}
        </h2>

        <p className="line-clamp-3 text-sm leading-6 text-white/68">
          {post.excerpt}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          <BlogTags tags={post.tags} limit={3} />
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[1.6px] text-[#eec876] transition-all duration-300 group-hover:gap-2.5">
            Read Article
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
