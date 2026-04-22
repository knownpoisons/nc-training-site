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
import { BlogRelatedPosts } from "@/components/blog-related-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

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
 * Prose styling for the MDX body. Kept as a single string so it's easy to tune
 * without digging through the JSX. Uses Plex Sans for body, Plex Mono for
 * headings, and enforces a centered ~680px column with generous vertical
 * rhythm.
 */
const PROSE_CLASSES = [
  "prose prose-neutral max-w-none",
  // Paragraphs — Plex Sans, 17px, generous line-height, consistent spacing
  "prose-p:font-sans prose-p:text-[17px] prose-p:leading-[1.75] prose-p:text-foreground/80 prose-p:mt-6 prose-p:mb-0",
  // Headings — Plex Mono, stronger hierarchy, breathing room above
  "prose-headings:font-mono prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-foreground",
  "prose-h2:text-[26px] prose-h2:leading-tight prose-h2:mt-14 prose-h2:mb-5",
  "prose-h3:text-[18px] prose-h3:leading-tight prose-h3:mt-10 prose-h3:mb-3",
  // Lists
  "prose-ul:font-sans prose-ul:text-[17px] prose-ul:leading-[1.75] prose-ul:text-foreground/80 prose-ul:my-6 prose-ul:space-y-2 prose-ul:pl-6",
  "prose-ol:font-sans prose-ol:text-[17px] prose-ol:leading-[1.75] prose-ol:text-foreground/80 prose-ol:my-6 prose-ol:space-y-2 prose-ol:pl-6",
  "prose-li:my-1 prose-li:marker:text-[#1549CD]/40",
  // Emphasis
  "prose-strong:text-foreground prose-strong:font-semibold",
  "prose-em:italic",
  // Links — cobalt, subtle underline, stronger on hover
  "prose-a:text-[#1549CD] prose-a:font-medium prose-a:underline prose-a:underline-offset-[3px] prose-a:decoration-[#1549CD]/30 hover:prose-a:decoration-[#1549CD]",
  // Blockquotes — cobalt left border, Sans italic
  "prose-blockquote:my-10 prose-blockquote:border-l-2 prose-blockquote:border-[#1549CD] prose-blockquote:pl-6 prose-blockquote:not-italic prose-blockquote:font-sans prose-blockquote:text-[20px] prose-blockquote:leading-[1.55] prose-blockquote:text-foreground prose-blockquote:font-light",
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

        {/* Editorial grid lines */}
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

          {/* Title */}
          <h1 className="oci-display-sm mt-6 max-w-3xl">{post.title}</h1>

          {/* Subtitle / description */}
          {post.description && (
            <p className="mt-6 max-w-2xl font-sans text-lg lg:text-xl leading-[1.55] font-light text-white/80">
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
                Founder, NotContent{formattedDate && (
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
      <article className="py-16 lg:py-24">
        <div className="mx-auto max-w-[680px] px-6 lg:px-8">
          <div className={PROSE_CLASSES}>
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>

      {/* ─── AUTHOR BIO CARD ───────────────────────────────────────────── */}
      <BlogAuthorCard />

      {/* ─── RELATED POSTS ─────────────────────────────────────────────── */}
      <BlogRelatedPosts currentSlug={post.slug} />

      {/* ─── SCORECARD CTA ─────────────────────────────────────────────── */}
      <BlogScorecardCta />
    </>
  );
}
