import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllPosts,
  getPostBySlug,
  getReadingTime,
  formatPostDate,
} from "@/lib/blog";
import { BlogScorecardCta } from "@/components/blog-scorecard-cta";
import { BlogAuthorCard } from "@/components/blog-author-card";
import { BlogLinkedInCta } from "@/components/blog-linkedin-cta";
import { BlogRelatedPosts } from "@/components/blog-related-posts";
import { EndCta } from "@/components/end-cta";

interface Props {
  params: Promise<{ slug: string }>;
}

/** MDX components available inside blog post .mdx files */
const mdxComponents = {
  EndCta,
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      authors: [post.author],
      publishedTime: post.date,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/**
 * Prose styling for the MDX body.
 * Body copy is Source Serif 4 (editorial, long-form friendly).
 * Headings stay in IBM Plex Mono for brand continuity.
 * Centered 680px column, dark high-contrast text, tight paragraph rhythm.
 */
const PROSE_CLASSES = [
  "prose prose-neutral max-w-none",
  // Paragraphs — Source Serif 4, 18px, open rhythm (full blank-line feel between paragraphs)
  "prose-p:font-serif prose-p:text-[18px] prose-p:leading-[1.7] prose-p:text-foreground/90 prose-p:mt-10 prose-p:mb-0",
  // Headings — Plex Mono, strong hierarchy, air above
  "prose-headings:font-mono prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-h2:text-[26px] prose-h2:leading-[1.15] prose-h2:mt-16 prose-h2:mb-6",
  "prose-h3:text-[18px] prose-h3:leading-tight prose-h3:mt-12 prose-h3:mb-4",
  // Lists — match body font + rhythm, spacious between items
  "prose-ul:font-serif prose-ul:text-[18px] prose-ul:leading-[1.7] prose-ul:text-foreground/90 prose-ul:mt-8 prose-ul:mb-0 prose-ul:space-y-4 prose-ul:pl-6",
  "prose-ol:font-serif prose-ol:text-[18px] prose-ol:leading-[1.7] prose-ol:text-foreground/90 prose-ol:mt-8 prose-ol:mb-0 prose-ol:space-y-4 prose-ol:pl-6",
  "prose-li:my-0 prose-li:marker:text-[#1549CD]/50",
  // Emphasis — bold gets full weight + pure black for emphasis
  "prose-strong:text-foreground prose-strong:font-bold",
  "prose-em:italic",
  // Links — cobalt with underline that darkens on hover
  "prose-a:text-[#1549CD] prose-a:font-semibold prose-a:underline prose-a:underline-offset-[3px] prose-a:decoration-[#1549CD]/40 hover:prose-a:decoration-[#1549CD]",
  // Blockquote — cobalt hairline, serif italic
  "prose-blockquote:my-10 prose-blockquote:border-l-2 prose-blockquote:border-[#1549CD] prose-blockquote:pl-6 prose-blockquote:font-serif prose-blockquote:text-[22px] prose-blockquote:leading-[1.45] prose-blockquote:text-foreground prose-blockquote:font-light prose-blockquote:italic",
  // Inline code — subtle chip
  "prose-code:before:content-none prose-code:after:content-none prose-code:bg-foreground/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[15px] prose-code:font-mono",
  // HR — cobalt hairline
  "prose-hr:border-[#1549CD]/15 prose-hr:my-12",
].join(" ");

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const readingTime = getReadingTime(post.content);
  const formattedDate = formatPostDate(post.date);

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1549CD] text-white overflow-hidden pt-32 lg:pt-36 pb-14 lg:pb-20">
        {/* Cover image — faded 16:9 background when present */}
        {post.coverImage && (
          <div className="absolute inset-0">
            <img
              src={post.coverImage}
              alt=""
              className="h-full w-full object-cover opacity-[0.18] mix-blend-lighten"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1549CD]/30 via-[#1549CD]/75 to-[#1549CD]" />
          </div>
        )}

        <div className="oci-grid-lines-light" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8 w-full">
          {/* Back to blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> Back to Blog
          </Link>

          {/* Category chip */}
          <div className="mt-10">
            <span className="inline-block border border-white/25 bg-white/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em]">
              {post.category}
            </span>
          </div>

          <h1 className="oci-display-sm mt-6 max-w-3xl">{post.title}</h1>

          {post.description && (
            <p className="mt-6 max-w-2xl font-serif text-lg lg:text-xl leading-[1.5] font-light text-white/80">
              {post.description}
            </p>
          )}

          {/* Author row */}
          <div className="mt-12 flex items-center gap-4 border-t border-white/15 pt-6">
            <img
              src="/images/jeremy-somers.jpg"
              alt={post.author}
              className="h-11 w-11 shrink-0 object-cover rounded-[2px] ring-1 ring-white/20"
            />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
                {post.author}
              </span>
              <span className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-white/50">
                Founder, NotContent
                {formattedDate && (
                  <>
                    <span className="mx-2 text-white/30">·</span>
                    {formattedDate}
                  </>
                )}
                <span className="mx-2 text-white/30">·</span>
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BODY ──────────────────────────────────────────────────────── */}
      <article className="pt-16 lg:pt-24 pb-8 lg:pb-10">
        <div className="mx-auto max-w-[680px] px-6 lg:px-8">
          <div className={PROSE_CLASSES}>
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </div>
      </article>

      {/* ─── AUTHOR BIO CARD ───────────────────────────────────────────── */}
      <BlogAuthorCard />

      {/* ─── LINKEDIN CTA ──────────────────────────────────────────────── */}
      <BlogLinkedInCta />

      {/* ─── RELATED POSTS ─────────────────────────────────────────────── */}
      <BlogRelatedPosts currentSlug={post.slug} />

      {/* ─── SCORECARD CTA ─────────────────────────────────────────────── */}
      <BlogScorecardCta />
    </>
  );
}
