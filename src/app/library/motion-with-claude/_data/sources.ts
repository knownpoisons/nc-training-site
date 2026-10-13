// ─── Motion with Claude ───────────────────────────────────────────────────────
// Sources for making video and animation WITH Claude, as opposed to the Build
// Vault's web-craft resources. The distinction is the medium: everything here
// produces a rendered film or a generated figure, not a page that responds to a
// cursor. That line was drawn by the panel that kept Prompt Motion out of the
// vault, and this collection is where it belongs instead.
//
// House rules for adding one:
//   1. Every entry carries an honest `watch` — what to ignore, what it costs,
//      or where it will pull you off the house style. An entry with nothing to
//      watch has not been read properly.
//   2. `take` is the single thing worth lifting. If you cannot name it in a
//      sentence, the source is a link, not a resource.
//   3. Describe in our own words. Never paste somebody's article in here.
//   4. No dollar figures or percentages — same PROOF rule as every other page.

export type SourceKind = "Article" | "Claude skill" | "Library" | "Gallery" | "Principle";

export interface Source {
  slug: string;
  name: string;
  byline: string;
  url: string;
  domain: string;
  kind: SourceKind;
  /** what it actually is */
  what: string;
  /** the one thing worth lifting */
  take: string;
  /** what to ignore, what it costs, where it pulls you off-style */
  watch: string;
  cost: "Free" | "Open source" | "Freemium";
}

export const SOURCES: Source[] = [
  {
    slug: "motion-lab",
    name: "Opus 5.5 Motion Lab",
    byline: "Florence · @flxrnc",
    url: "https://x.com/flxrnc/status/2105311836190978392",
    domain: "x.com",
    kind: "Article",
    what: "The deepest thing written on directing Claude to animate. Three finished pieces, each printed with the prompt that started it and every follow-up it needed — including the ones that read like 'the glint reaches the O late'. It also runs a controlled test: the same product, the same model, a vague prompt against a directed one, side by side.",
    take: "The prompt skeleton — goal, output, time, look, motion, shots, banned, QA — and the numbers that go in it: easing as cubic-bezier, springs as damping ratios, durations in frames, a beat grid. Plus the single most useful habit in the whole batch: a list of defaults banned by name, extended after every render with whatever the model reached for anyway.",
    watch: "It is long, and the three showpieces are chrome-and-studio work that is not our house style. Read it for the method, not the look. The A/B test is the fastest way in if you only have ten minutes.",
    cost: "Free",
  },
  {
    slug: "anatomy",
    name: "Anatomy",
    byline: "wheresryan22",
    url: "https://github.com/wheresryan22/anatomy",
    domain: "github.com",
    kind: "Claude skill",
    what: "A Claude Code skill that explains an idea by drawing it as a real working object — interactive isometric figures of machines and systems, built as SVG with optional WebGL. Install it and ask for a thing; it returns a figure with many small precise parts rather than a diagram of boxes.",
    take: "The closest thing in this collection to what we already draw by hand. Our hairline SVG diagrams and the convergence graph are exactly this genre, and this does the laborious version of it — a whole machine, cut away, labelled. Worth trying on one Deck explainer before building the next one by hand.",
    watch: "Days old and moving fast, so pin a version rather than tracking main. Its default look is its own, not ours — expect to restyle the output to cobalt on platinum. Needs Node 20.10 or later; no other dependencies.",
    cost: "Open source",
  },
  {
    slug: "motion-engineering",
    name: "Motion Engineering with Opus 5.5",
    byline: "beamnxw",
    url: "https://x.com/beamnxw/status/2108616740846420354",
    domain: "x.com",
    kind: "Article",
    what: "The same discipline aimed at a different target: a launch film for one product feature, built in Remotion so every frame is a React component of the current frame number. Walks a worked example end to end — analyse a reference video, write a brief, build the opening, review stills, then the rest.",
    take: "Two things. The brief format, which assigns global frame numbers to every event so a revision touches one number instead of a paragraph. And the correction format — location, observed problem, the change, what must stay fixed — which is the difference between an edit and an accidental rewrite.",
    watch: "The last third turns into a pitch for selling launch clips at a pilot price. Ignore it; the craft is in the first two thirds. Remotion-specific, so read the Motion Lab first if you want the general method.",
    cost: "Free",
  },
  {
    slug: "animation-principles",
    name: "The twelve principles of animation",
    byline: "Thomas & Johnston, 1981 · Lasseter, 1987",
    url: "https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation",
    domain: "wikipedia.org",
    kind: "Principle",
    what: "Disney's twelve principles, written down by Frank Thomas and Ollie Johnston in The Illusion of Life, then applied to computer animation by John Lasseter in his 1987 SIGGRAPH paper. Anticipation, squash and stretch, overlapping action, follow-through, arcs, slow in and slow out, timing, staging, exaggeration.",
    take: "The review trick, and it costs nothing: once an animation is drafted, ask Claude to review it against the twelve principles and report which ones it is failing, frame by frame. It turns a vague note into a specific one — anticipation missing before a move, no overlap on the limbs, a travel that runs in a straight line where it should arc.",
    watch: "It is a review pass, not a brief. Asking for 'the twelve principles' up front produces bouncy cartoon motion; the principles are most useful named individually, as frame counts and scale changes, on a draft that already exists.",
    cost: "Free",
  },
  {
    slug: "prompt-motion",
    name: "Prompt Motion",
    byline: "curated by @p4nthera_",
    url: "https://prompt-motion.com/",
    domain: "prompt-motion.com",
    kind: "Gallery",
    what: "A few hundred short motion pieces made with Claude, each shown with the full prompt that produced it, the model, and how many goes it took. Browsable, with a copy button on every prompt.",
    take: "Read it for range, not technique: it is the fastest way to see what a prompt of a given shape actually yields, and the iteration counts are an honest antidote to the one-shot claims. Sort for the pieces closest to what you want, then lift the structure rather than the words.",
    watch: "Open submission with no published standard, and the quality swings accordingly. Its 'skill' filter is a handful of entries, some of which just point at someone else's repo. Nearly everything in it was posted inside a single week after the model launched — treat it as a snapshot, not a maintained collection.",
    cost: "Free",
  },
  {
    slug: "shaders",
    name: "Shaders",
    byline: "shader-effects-inc",
    url: "https://shaders.com",
    domain: "shaders.com",
    kind: "Library",
    what: "WebGPU effects as components for React and the other frameworks — gradients, noise, glass, metal, distortion, cursor effects — with a visual editor that exports the exact component tree, and an MCP server so an agent can reach the real source instead of inventing one.",
    take: "The MCP path is the genuinely interesting part: it is the same idea as pointing Claude at a real library rather than letting it hallucinate one. If a brief ever calls for a single expensive hero moment, this is a faster route to it than hand-writing a shader.",
    watch: "The honest warning on this one is bigger than the entry. Its output is gradients, glass and metal — the exact look we cut six libraries from the Build Vault to avoid. There is a paid tier above the free components. Reach for it once, for one moment, or not at all.",
    cost: "Freemium",
  },
];
