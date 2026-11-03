import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/schema";

const PAGES = [
  "",
  "/about",
  "/assess",
  "/blog",
  "/book",
  "/methodology",
  "/programs",
  "/programs/foundations",
  "/programs/transformation",
  "/results",
  "/results/cash-app",
  "/results/herman-scheer",
  "/results/maesa",
  "/theprogram",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated || post.date,
  }));
  return [...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })), ...posts];
}
