import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | AI Creative Training Insights",
  description:
    "Insights on AI creative training, workflow methodology, and enterprise team transformation from NotContent.",
};

/* Category badge colours */
const categoryStyles: Record<string, string> = {
  "Case Study": "bg-[#1549CD]/10 text-[#1549CD]",
  Guide: "bg-emerald-50 text-emerald-700",
  Methodology: "bg-amber-50 text-amber-700",
  Insight: "bg-foreground/5 text-foreground/60",
};

/* Simple geometric SVG covers per category */
function BlogCover({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  const seed = title.length % 5;

  if (category === "Case Study") {
    return (
      <svg
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect width="640" height="360" fill="#1549CD" />
        <rect x="60" y="80" width="160" height="80" rx="2" fill="white" opacity="0.06" />
        <rect x="240" y="80" width="160" height="80" rx="2" fill="white" opacity="0.1" />
        <rect x="420" y="80" width="160" height="80" rx="2" fill="white" opacity="0.04" />
        <rect x="60" y="180" width="520" height="1" fill="white" opacity="0.12" />
        <rect x="80" y={260 - seed * 20} width="40" height={60 + seed * 20} rx="2" fill="white" opacity="0.12" />
        <rect x="140" y="220" width="40" height="100" rx="2" fill="white" opacity="0.18" />
        <rect x="200" y="200" width="40" height="120" rx="2" fill="white" opacity="0.25" />
        <rect x="260" y="240" width="40" height="80" rx="2" fill="white" opacity="0.15" />
        <rect x="320" y="190" width="40" height="130" rx="2" fill="white" opacity="0.3" />
        <rect x="380" y="210" width="40" height="110" rx="2" fill="white" opacity="0.2" />
        <rect x="440" y="230" width="40" height="90" rx="2" fill="white" opacity="0.1" />
        <rect x="500" y="250" width="40" height="70" rx="2" fill="white" opacity="0.08" />
        <line x1="60" y1="320" x2="580" y2="320" stroke="white" strokeWidth="0.5" opacity="0.1" />
        <text x="60" y="50" fontFamily="monospace" fontSize="10" fill="white" opacity="0.3" letterSpacing="0.1em">CASE STUDY</text>
      </svg>
    );
  }

  if (category === "Guide") {
    return (
      <svg
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect width="640" height="360" fill="#1549CD" />
        <rect x="200" y="60" width="240" height="240" rx="4" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />
        <rect x="220" y="100" width="120" height="8" rx="2" fill="white" opacity="0.1" />
        <rect x="220" y="120" width="180" height="6" rx="2" fill="white" opacity="0.06" />
        <rect x="220" y="136" width="160" height="6" rx="2" fill="white" opacity="0.06" />
        <rect x="220" y="152" width="140" height="6" rx="2" fill="white" opacity="0.06" />
        <rect x="220" y="180" width="100" height="8" rx="2" fill="white" opacity="0.1" />
        <rect x="220" y="200" width="180" height="6" rx="2" fill="white" opacity="0.06" />
        <rect x="220" y="216" width="150" height="6" rx="2" fill="white" opacity="0.06" />
        <rect x="220" y="232" width="170" height="6" rx="2" fill="white" opacity="0.06" />
        <circle cx="520" cy="100" r={30 + seed * 5} fill="white" opacity="0.05" />
        <circle cx="520" cy="100" r={15 + seed * 3} fill="white" opacity="0.03" />
        <circle cx="120" cy="260" r="20" fill="white" opacity="0.04" />
        <circle cx="100" cy="100" r="40" fill="white" opacity="0.03" />
        <line x1="200" y1="310" x2="440" y2="310" stroke="white" strokeWidth="0.5" opacity="0.08" />
        <text x="200" y="42" fontFamily="monospace" fontSize="10" fill="white" opacity="0.3" letterSpacing="0.1em">GUIDE</text>
      </svg>
    );
  }

  if (category === "Methodology") {
    return (
      <svg
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect width="640" height="360" fill="#1549CD" />
        {/* Diverge fan */}
        <line x1="120" y1="180" x2="320" y2="80" stroke="white" strokeWidth="1" opacity="0.12" />
        <line x1="120" y1="180" x2="320" y2="140" stroke="white" strokeWidth="1" opacity="0.18" />
        <line x1="120" y1="180" x2="320" y2="180" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <line x1="120" y1="180" x2="320" y2="220" stroke="white" strokeWidth="1" opacity="0.18" />
        <line x1="120" y1="180" x2="320" y2="280" stroke="white" strokeWidth="1" opacity="0.12" />
        {/* Converge fan */}
        <line x1="320" y1="80" x2="520" y2="180" stroke="white" strokeWidth="1" opacity="0.12" />
        <line x1="320" y1="140" x2="520" y2="180" stroke="white" strokeWidth="1" opacity="0.18" />
        <line x1="320" y1="180" x2="520" y2="180" stroke="white" strokeWidth="1.5" opacity="0.25" />
        <line x1="320" y1="220" x2="520" y2="180" stroke="white" strokeWidth="1" opacity="0.18" />
        <line x1="320" y1="280" x2="520" y2="180" stroke="white" strokeWidth="1" opacity="0.12" />
        {/* Nodes */}
        <circle cx="120" cy="180" r="8" fill="white" opacity="0.2" />
        <circle cx="120" cy="180" r="3" fill="white" opacity="0.4" />
        <circle cx="320" cy="80" r="4" fill="white" opacity="0.1" />
        <circle cx="320" cy="140" r="5" fill="white" opacity="0.15" />
        <circle cx="320" cy="180" r="6" fill="white" opacity="0.2" />
        <circle cx="320" cy="220" r="5" fill="white" opacity="0.15" />
        <circle cx="320" cy="280" r="4" fill="white" opacity="0.1" />
        <circle cx="520" cy="180" r="8" fill="white" opacity="0.2" />
        <circle cx="520" cy="180" r="3" fill="white" opacity="0.4" />
        <text x="100" y="320" fontFamily="monospace" fontSize="9" fill="white" opacity="0.2">DIVERGE</text>
        <text x="300" y="320" fontFamily="monospace" fontSize="9" fill="white" opacity="0.15">CONVERGE</text>
        <text x="490" y="320" fontFamily="monospace" fontSize="9" fill="white" opacity="0.2">SYSTEMIZE</text>
      </svg>
    );
  }

  // Default / Insight
  return (
    <svg
      viewBox="0 0 640 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect width="640" height="360" fill="#1549CD" />
      <circle cx="320" cy="180" r={100 + seed * 12} fill="white" opacity="0.03" />
      <circle cx="320" cy="180" r={70 + seed * 8} fill="white" opacity="0.04" />
      <circle cx="320" cy="180" r={40 + seed * 5} fill="white" opacity="0.06" />
      <circle cx="320" cy="180" r="16" fill="white" opacity="0.12" />
      <circle cx="180" cy="120" r="30" fill="white" opacity="0.02" />
      <circle cx="480" cy="250" r="45" fill="white" opacity="0.02" />
      <line x1="160" y1="180" x2="480" y2="180" stroke="white" strokeWidth="0.5" opacity="0.06" />
      <line x1="320" y1="60" x2="320" y2="300" stroke="white" strokeWidth="0.5" opacity="0.06" />
    </svg>
  );
}

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
                {/* Cover */}
                <div className="aspect-[16/9] w-full overflow-hidden border border-foreground/10">
                  <BlogCover
                    category={featured.category}
                    title={featured.title}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest ${categoryStyles[featured.category] ?? categoryStyles.Insight}`}
                    >
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="mt-4 text-2xl font-light leading-snug tracking-tight transition-colors group-hover:text-[#1549CD] lg:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/60 line-clamp-3">
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
            <div className="grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-[#E8E6E0] p-6"
                >
                  <article>
                    {/* Card cover */}
                    <div className="aspect-[16/10] w-full overflow-hidden border border-foreground/10">
                      <BlogCover
                        category={post.category}
                        title={post.title}
                      />
                    </div>

                    {/* Card body */}
                    <div className="mt-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest ${categoryStyles[post.category] ?? categoryStyles.Insight}`}
                        >
                          {post.category}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-medium leading-snug tracking-tight transition-colors group-hover:text-[#1549CD]">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-foreground/60 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
