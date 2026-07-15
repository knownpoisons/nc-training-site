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
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "camera-prompts",
    title: "The Camera Prompt Finder",
    oneLiner:
      "90 camera prompts — every movement for AI video and every angle, framing and lens look for stills. Search it, filter it, copy the shot, keep your scene.",
    eyebrow: "Featured",
    count: 90,
  },
];
