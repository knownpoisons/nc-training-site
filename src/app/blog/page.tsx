import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatPostDate, getReadingTime } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | AI Creative Training Insights",
  description:
    "Insights on AI creative training, workflow methodology, and enterprise team transformation from NotContent.",
};

/* Category chip colour — cobalt across the board for visual coherence */
const categoryChip =
  "inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.15em] bg-[#1549CD]/10 text-[#1549CD]";

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>BLOG</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-3xl">
            Insights on AI
            <br />
            creative training.
          </h1>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="py-16 lg:py-24 relative oci-grid-lines">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="oci-section-label mb-12">
              <span>FEATURED</span>
              <span>[NC.1]</span>
            </div>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Cover illustration */}
                <div className="aspect-[16/9] w-full overflow-hidden border border-foreground/10 bg-[#1549CD]">
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span className={categoryChip}>{featured.category}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                      {formatPostDate(featured.date)} · {getReadingTime(featured.content)} min read
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-medium leading-snug tracking-tight transition-colors group-hover:text-[#1549CD] lg:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-foreground/60 line-clamp-3">
                    {featured.description}
                  </p>
                  <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.15em] text-[#1549CD]">
                    Read article →
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="oci-section-label mb-12">
              <span>ALL POSTS</span>
              <span>[NC.2]</span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col"
                >
                  {/* Card cover illustration */}
                  <div className="aspect-[16/10] w-full overflow-hidden border border-foreground/10 bg-[#1549CD]">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>

                  {/* Card body */}
                  <div className="mt-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className={categoryChip}>{post.category}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-[#1549CD]">
                      {post.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-foreground/60 line-clamp-2">
                      {post.description}
                    </p>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-foreground/40">
                      {formatPostDate(post.date)} · {getReadingTime(post.content)} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
