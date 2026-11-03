import type { MetadataRoute } from "next";

const PRIVATE = ["/api/", "/deck", "/design-system", "/partners", "/samplehub", "/skynet", "/two-palms", "/january-digital", "/camp30"];

/** The eight bots that gate citation. Training crawlers are untouched by this file. */
const CITATION_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: CITATION_BOTS, allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://training.notcontent.ai/sitemap.xml",
  };
}
