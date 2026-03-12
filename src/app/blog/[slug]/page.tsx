import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

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
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[50vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <Link
            href="/blog"
            className="text-[11px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/70"
          >
            ← Back to Blog
          </Link>
          <p className="mt-8 text-[11px] uppercase tracking-[0.15em] text-white/40">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {post.author && ` · ${post.author}`}
          </p>
          <h1 className="oci-display-sm mt-4 max-w-3xl">{post.title}</h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            {post.description}
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="prose prose-neutral max-w-3xl prose-headings:font-mono prose-headings:font-medium prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/70 prose-li:font-mono prose-li:text-sm prose-li:text-foreground/70 prose-strong:text-foreground prose-a:text-[#1549CD] prose-a:underline-offset-4">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>

      {/* Footer CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-xl">
            See where your team stands.
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/assess"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Take the Scorecard
            </Link>
            <Link
              href="/book"
              className="px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
            >
              Book a Call →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
