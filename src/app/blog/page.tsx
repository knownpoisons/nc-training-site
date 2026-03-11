import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | AI Creative Training Insights",
  description:
    "Insights on AI creative training, workflow methodology, and enterprise team transformation from NotContent.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Blog
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">
            Insights on AI creative training.
          </h1>
          <p className="nc-body-lg mt-6 max-w-xl">
            Practical thinking on how enterprise creative teams adopt AI —
            methodology, mistakes, and what actually works.
          </p>
        </div>
      </section>

      <section className="nc-divider nc-section">
        <div className="nc-container">
          <div className="space-y-16">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {post.author && ` · ${post.author}`}
                  </p>
                  <h2 className="nc-heading-lg mt-3 max-w-2xl transition-colors group-hover:text-[#1549CD]">
                    {post.title}
                  </h2>
                  <p className="nc-body mt-4 max-w-xl">{post.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-widest text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm font-medium uppercase tracking-widest text-[#1549CD]">
                    Read article →
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
