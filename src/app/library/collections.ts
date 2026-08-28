// ─── Library collections ──────────────────────────────────────────────────────
// A collection is a themed set of prompts with its own finder page (search +
// filters + cards), as opposed to a single long-form prompt entry. Rendered as
// featured rows at the top of the library index.

export interface Collection {
  slug: string;
  title: string;
  oneLiner: string;
  eyebrow: string;
  count: number;
  /** which hairline glyph the index row uses */
  glyph: "camera" | "vault";
  /** cobalt block treatment on the index (one at a time — it's the hero row) */
  featured?: boolean;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "camera-prompts",
    title: "The Camera Prompt Finder",
    oneLiner:
      "90 camera prompts — every movement for AI video and every angle, framing and lens look for stills. Search it, filter it, copy the shot, keep your scene.",
    eyebrow: "Featured",
    count: 90,
    glyph: "camera",
    featured: true,
  },
  {
    slug: "build-vault",
    title: "The Build Vault",
    oneLiner:
      "Twenty-eight places worth stealing from — copy-paste code, motion and scroll engines, curated inspiration, generators, and the two long reads. Sixty-three went in; a three-lens panel cut thirty-five. What each one is, and when to reach for it.",
    eyebrow: "Resources",
    count: 28,
    glyph: "vault",
  },
];
