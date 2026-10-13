import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogTags from "@/components/ui/BlogTags";
import MediaImage from "@/components/ui/MediaImage";

const BlogCard = ({ blog }) => {
  const { image, imageAlt, title, date, excerpt, slug, category, tags } = blog;
  const href = slug ? `/blog/${slug}` : undefined;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[#ba8a44]/40 bg-[#121212]">
      {href && (
        <Link href={href} className="absolute inset-0 z-[1]" aria-label={title} />
      )}
      <div className="transition-transform duration-300 ease-out group-hover:scale-102">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {image ? (
            <MediaImage
              src={image}
              alt={imageAlt || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-white/5" />
          )}
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {category ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.96px] text-[#eec876]">
                {category}
              </span>
            ) : null}
            <p className="text-xs font-medium text-[#ba8a44]">{date}</p>
          </div>
          <h3 className="!font-accent text-md min-h-12 font-normal uppercase leading-snug tracking-wide text-white transition-colors duration-300 line-clamp-2 group-hover:text-[#ba8a44]">
            {title}
          </h3>
          <p className="line-clamp-3 text-xs leading-relaxed text-white">
            {excerpt}
          </p>
          <BlogTags tags={tags} limit={3} />
          <span className="mt-1 flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[#ba8a44] transition-all duration-300 group-hover:gap-2">
            Read Article
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
