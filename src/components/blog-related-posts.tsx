import Link from "next/link";
import { getRelatedPosts, formatPostDate, getReadingTime } from "@/lib/blog";

interface Props {
  currentSlug: string;
}

/**
 * "Related reading" block shown at the foot of every blog post.
 * Picks 3 posts by shared tags → shared category → recency.
 */
export function BlogRelatedPosts({ currentSlug }: Props) {
  const posts = getRelatedPosts(currentSlug, 3);
  if (posts.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 border-t border-foreground/10 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="oci-section-label mb-10">
          <span>Related Reading</span>
          <span>[NC]</span>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col border border-foreground/10 p-6 transition-colors hover:border-[#1549CD]/40 hover:bg-[#1549CD]/[0.02]"
            >
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#1549CD] font-medium">
                {post.category}
              </span>
              <h3 className="mt-4 font-mono text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-[#1549CD]">
                {post.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-foreground/60 line-clamp-3">
                {post.description}
              </p>
              <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                <span>{formatPostDate(post.date)}</span>
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
