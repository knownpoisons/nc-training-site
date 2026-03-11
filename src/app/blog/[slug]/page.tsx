import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
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
      <article className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          {/* Header */}
          <div className="mb-16">
            <Link
              href="/blog"
              className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Blog
            </Link>
            <p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {post.author && ` · ${post.author}`}
            </p>
            <h1 className="nc-heading-xl mt-4 max-w-3xl">{post.title}</h1>
            <p className="nc-body-lg mt-6 max-w-2xl">{post.description}</p>
          </div>

          {/* Body */}
          <div className="prose prose-neutral max-w-3xl prose-headings:font-mono prose-headings:font-medium prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-lg prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/70 prose-li:font-mono prose-li:text-sm prose-li:text-foreground/70 prose-strong:text-foreground prose-a:text-[#1549CD] prose-a:underline-offset-4">
            <MDXRemote source={post.content} />
          </div>

          {/* Footer CTA */}
          <div className="mt-20 border-t border-foreground/10 pt-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Ready to train your team?
            </p>
            <h2 className="nc-heading-lg mt-4 max-w-xl">
              See where your team stands.
            </h2>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="cursor-pointer text-sm uppercase tracking-widest"
              >
                <Link href="/assess">Take the Scorecard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer text-sm uppercase tracking-widest"
              >
                <Link href="/book">Book a Call</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
