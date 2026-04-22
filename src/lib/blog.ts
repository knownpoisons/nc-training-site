import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  coverImage: string;
  content: string;
}

/**
 * Cover image default: every post has an illustration at
 * /public/images/llustrations/{slug}.jpg — so we auto-derive the path
 * from the slug. Individual MDX frontmatter can override with an
 * explicit `coverImage` field if needed.
 */
function defaultCoverImage(slug: string): string {
  return `/images/llustrations/${slug}.jpg`;
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      author: data.author ?? "",
      tags: data.tags ?? [],
      category: data.category ?? "Insight",
      coverImage: data.coverImage ?? defaultCoverImage(slug),
      content,
    } satisfies BlogPost;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    tags: data.tags ?? [],
    category: data.category ?? "Insight",
    coverImage: data.coverImage ?? defaultCoverImage(slug),
    content,
  };
}

/**
 * Reading time in minutes, based on 200 words per minute.
 * Minimum 1 minute so a very short post never shows "0 min read".
 */
export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Format an ISO date string as "Apr 21, 2026".
 * Uses a fixed en-US locale so it renders identically on server and client.
 */
export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Related posts — ranked by shared tag count, then shared category,
 * then recency. Excludes the current post. Returns up to `limit` posts.
 */
export function getRelatedPosts(
  currentSlug: string,
  limit = 3
): BlogPost[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return all.slice(0, limit);

  const currentTags = new Set(current.tags);

  const scored = all
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => currentTags.has(t)).length;
      const sameCategory = p.category === current.category ? 1 : 0;
      return { post: p, score: sharedTags * 10 + sameCategory };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break by recency
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

  return scored.slice(0, limit).map((s) => s.post);
}
