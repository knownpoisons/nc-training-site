// ─── The Build Vault — resource database ──────────────────────────────────────
// Every entry is an external site we'd actually send someone to. Rules for
// adding one:
//   1. Verified live and described from the site itself — no half-remembered
//      link lists. (All entries below were fetched and checked 2026-08-25.)
//   2. `what` says what it IS. `use` says when you'd reach for it over the
//      others. If you can't write a distinct `use`, the entry doesn't earn a row.
//   3. `cost` is honest about the paywall — nothing is more annoying than a
//      "free" link that wants a card.
//   4. `inStack` marks the ones already used on a NotContent build. Don't set it
//      unless it's true.
//   5. Every entry needs a screenshot at public/images/library/build-vault/<slug>.webp
//      (1200x750, captured at 1440x900). Regenerate rather than hotlink.
//
// Culled 2026-08-25 by a three-lens panel — curation vs scale, craft and
// reputation, fit and redundancy for this studio. 47 in, 19 out the other side.
// The full cut list with reasons is at the foot of this file: restoring one is
// a copy-paste, so nothing is lost, but read the reason before you do.
// No dollar figures or percentages anywhere in this file — same PROOF rule as
// every other public page.

export type VaultCategory = "copy-paste" | "motion" | "inspiration" | "assets";

export interface Resource {
  slug: string;
  name: string;
  url: string;
  /** shown under the name — host only, no protocol */
  domain: string;
  category: VaultCategory;
  /** what it is */
  what: string;
  /** when you'd reach for this one instead of the others */
  use: string;
  tags: string[];
  cost: "Free" | "Open source" | "Freemium" | "Paid";
  /** already used on a NotContent build */
  inStack?: boolean;
  /** panel scores out of 5 — curation, craft, fit — and the total out of 15 */
  panel: { curation: number; craft: number; fit: number };
}

export const VAULT_CATEGORIES: { id: VaultCategory; label: string; blurb: string }[] = [
  {
    id: "copy-paste",
    label: "Copy & paste",
    blurb:
      "Pick the effect, copy the code, paste it in. Every generic shimmer-and-beam component library was cut — what's left is technique, not somebody else's house style.",
  },
  {
    id: "motion",
    label: "Motion & scroll",
    blurb:
      "The engines underneath. Scroll-linked animation, smooth scroll, timelines — five tools, no overlap, each the best at one job.",
  },
  {
    id: "inspiration",
    label: "Inspiration",
    blurb:
      "Four galleries, not fourteen. Every open-submission archive with six figures of screens was cut — these are the ones where somebody with taste threw out the mediocre nine-tenths first.",
  },
  {
    id: "assets",
    label: "Generators & assets",
    blurb:
      "Make the raw material. Icon dumps and blob generators were cut; these three each do something you cannot hand-code in five minutes.",
  },
];

export const RESOURCES: Resource[] = [
  {
    slug: "react-bits",
    name: "React Bits",
    url: "https://reactbits.dev/",
    domain: "reactbits.dev",
    category: "copy-paste",
    what: "Around 165 animated React components — text effects, animated backgrounds, small UI pieces — each shipped in four flavours: JavaScript or TypeScript, plain CSS or Tailwind.",
    use: "First stop for a text reveal or a moving background. The four-flavour thing means it drops into any project without a rewrite.",
    tags: ["react", "text effects", "backgrounds", "copy-paste"],
    cost: "Open source",
    panel: { curation: 4, craft: 3, fit: 3 },
  },
  {
    slug: "animista",
    name: "Animista",
    url: "https://animista.net/",
    domain: "animista.net",
    category: "copy-paste",
    what: "A playground of ready CSS animations — pick one, tune the duration, delay, easing and direction on the page, copy the keyframes out.",
    use: "The fastest route to a hand-rolled @keyframes block with zero libraries. Free for commercial work.",
    tags: ["css", "keyframes", "generator", "no-dependency"],
    cost: "Free",
    panel: { curation: 4, craft: 3, fit: 4 },
  },
  {
    slug: "motion-primitives",
    name: "Motion Primitives",
    url: "https://motion-primitives.com/",
    domain: "motion-primitives.com",
    category: "copy-paste",
    what: "Small, composable Motion-for-React primitives — text effects, transitions, cursors, dialogs — rather than fully designed components.",
    use: "When you want the motion, not somebody else's idea of what the component should look like.",
    tags: ["react", "motion", "primitives", "transitions"],
    cost: "Open source",
    panel: { curation: 4, craft: 4, fit: 2 },
  },
  {
    slug: "build-ui-recipes",
    name: "Build UI — Recipes",
    url: "https://buildui.com/recipes",
    domain: "buildui.com",
    category: "copy-paste",
    what: "Worked recipes for the genuinely hard React and Motion interactions, with live code and the reasoning written out beside it.",
    use: "When an interaction won't behave — layout animation, drag, shared elements between pages. This explains why, not just what to paste.",
    tags: ["react", "motion", "tutorial", "layout animation"],
    cost: "Free",
    panel: { curation: 5, craft: 4, fit: 5 },
  },
  {
    slug: "codrops",
    name: "Codrops",
    url: "https://tympanus.net/codrops/",
    domain: "tympanus.net",
    category: "copy-paste",
    what: "The long-running demo lab: scroll rigs, grid reveals, page transitions, type experiments — every demo downloadable with its source.",
    use: "When the brief is something nobody else on the internet has. Start here, then simplify it until it ships.",
    tags: ["demos", "scroll", "page transitions", "experimental"],
    cost: "Free",
    panel: { curation: 4, craft: 5, fit: 5 },
  },
  {
    slug: "arlan-vault",
    name: "Arlan's Vault",
    url: "https://www.arlan.me/vault",
    domain: "arlan.me",
    category: "copy-paste",
    what: "One designer's private vault gone public — arcade pixel, chromatic glow, gradient and typographic effects, each demoed live and released under MIT.",
    use: "Small, weird, high-taste effects you won't find in a component library. Everything is free to lift.",
    tags: ["effects", "typography", "gradients", "mit"],
    cost: "Free",
    inStack: true,
    panel: { curation: 5, craft: 4, fit: 3 },
  },
  {
    slug: "pqoqubbw-icons",
    name: "pqoqubbw/icons",
    url: "https://pqoqubbw.dev/",
    domain: "pqoqubbw.dev",
    category: "copy-paste",
    what: "Beautifully animated icons, copy-paste, built on React and Motion.",
    use: "The cheapest upgrade on a page: icons that animate on hover instead of sitting there.",
    tags: ["icons", "hover", "react", "motion"],
    cost: "Open source",
    panel: { curation: 5, craft: 4, fit: 4 },
  },
  {
    slug: "motion-dev",
    name: "Motion",
    url: "https://motion.dev/",
    domain: "motion.dev",
    category: "motion",
    what: "The animation engine that grew out of Framer Motion — for React and for plain JavaScript, with hardware-accelerated animations and a proper spring model.",
    use: "The default engine for anything React. Springs, gestures, layout animation, exit animations.",
    tags: ["react", "engine", "springs", "framer motion"],
    cost: "Open source",
    inStack: true,
    panel: { curation: 5, craft: 5, fit: 5 },
  },
  {
    slug: "gsap-scroll",
    name: "GSAP — ScrollTrigger",
    url: "https://gsap.com/scroll/",
    domain: "gsap.com",
    category: "motion",
    what: "The scroll toolkit the award-winning sites run on: ScrollTrigger pins and scrubs any animation to scroll position, ScrollSmoother handles the smooth track. Free for everyone — plugins included — since Webflow took it on.",
    use: "Pinned sections, horizontal scroll, scrub-through storytelling. When the scroll IS the interface, this is the one.",
    tags: ["scroll", "pinning", "scrub", "engine"],
    cost: "Free",
    panel: { curation: 5, craft: 5, fit: 5 },
  },
  {
    slug: "scroll-driven-animations",
    name: "Scroll-Driven Animations",
    url: "https://scroll-driven-animations.style/",
    domain: "scroll-driven-animations.style",
    category: "motion",
    what: "Bramus's demo bank for native CSS scroll-driven animations — no JavaScript at all — plus tools, a DevTools debugger and a free video course.",
    use: "Try this BEFORE reaching for a library. Modern browsers can scrub an animation to scroll in pure CSS, which is lighter and survives every framework change.",
    tags: ["css", "scroll", "no-js", "learning"],
    cost: "Free",
    panel: { curation: 5, craft: 4, fit: 5 },
  },
  {
    slug: "lenis",
    name: "Lenis",
    url: "https://lenis.dev/",
    domain: "lenis.dev",
    category: "motion",
    what: "Smooth scroll in one line and under 4kb, from darkroom.engineering — consistent scroll behaviour across every input device.",
    use: "The smoothness under most of the sites worth copying. Pairs with GSAP or with CSS scroll-driven animation; keep an eye on reduced-motion users.",
    tags: ["smooth scroll", "lightweight", "open source"],
    cost: "Open source",
    panel: { curation: 5, craft: 5, fit: 4 },
  },
  {
    slug: "anime-js",
    name: "Anime.js",
    url: "https://animejs.com/",
    domain: "animejs.com",
    category: "motion",
    what: "A small, fast JavaScript animation engine for the DOM, SVG and canvas, with a real timeline.",
    use: "Framework-free work — a static page, an embed, an HTML email preview — where React isn't in the room.",
    tags: ["javascript", "svg", "timeline", "no-framework"],
    cost: "Open source",
    panel: { curation: 4, craft: 4, fit: 2 },
  },
  {
    slug: "inspora",
    name: "Inspora",
    url: "https://www.inspora.design/",
    domain: "inspora.design",
    category: "inspiration",
    what: "A feed of interaction and motion shots — individual UI moments (a slider, a card reveal, a keyboard) rather than whole websites, each credited to its maker.",
    use: "Micro-interaction reference: you know the section works and you're looking for what the one moving part should do. Different job from the site galleries above.",
    tags: ["micro-interaction", "motion", "ui", "feed"],
    cost: "Free",
    inStack: true,
    panel: { curation: 3, craft: 2, fit: 1 },
  },
  {
    slug: "awwwards",
    name: "Awwwards — Sites",
    url: "https://www.awwwards.com/websites/",
    domain: "awwwards.com",
    category: "inspiration",
    what: "The big directory, filterable by award, category, tag (animation, typography, 3D), technology (React, GSAP, WebGL), country and typeface.",
    use: "Filter by TECHNOLOGY. It's the fastest way to see what a specific library can actually do in the wild before you commit to it.",
    tags: ["gallery", "filters", "technology", "animation"],
    cost: "Freemium",
    panel: { curation: 2, craft: 4, fit: 4 },
  },
  {
    slug: "recent-design",
    name: "Recent",
    url: "https://recent.design/",
    domain: "recent.design",
    category: "inspiration",
    what: "The hard-curated feed of the best current web design — this is where godly.website now redirects. Same job, new name.",
    use: "Where the genuinely new interaction ideas surface first.",
    tags: ["curated", "gallery", "web design"],
    cost: "Free",
    panel: { curation: 4, craft: 5, fit: 3 },
  },
  {
    slug: "siteinspire",
    name: "SiteInspire",
    url: "https://www.siteinspire.com/",
    domain: "siteinspire.com",
    category: "inspiration",
    what: "A long-running showcase filtered by style (typographic, minimal, grid), by type (portfolio, agency, commerce) and by subject.",
    use: "Style-led searching: 'show me typographic and minimal' gets you there in two clicks.",
    tags: ["gallery", "style filters", "minimal"],
    cost: "Free",
    panel: { curation: 2, craft: 5, fit: 4 },
  },
  {
    slug: "fffuel",
    name: "fffuel",
    url: "https://www.fffuel.co/",
    domain: "fffuel.co",
    category: "assets",
    what: "A set of free SVG generators — gradients, patterns, textures, noise, blobs, shapes — plus colour tools and converters.",
    use: "Grain and gradient meshes especially. The noise texture that stops a flat page looking cheap.",
    tags: ["svg", "gradients", "noise", "patterns"],
    cost: "Free",
    panel: { curation: 4, craft: 3, fit: 4 },
  },
  {
    slug: "canvas-ui",
    name: "Canvas UI",
    url: "https://canvasui.dev/",
    domain: "canvasui.dev",
    category: "assets",
    what: "Around 40 WebGL canvas effects — glass, liquid, particles, ASCII, distortion — applied over live HTML, framework-agnostic and open source.",
    use: "One hero moment that makes a page feel built rather than assembled. Expensive to run, so use it once and watch the frame rate.",
    tags: ["webgl", "canvas", "effects", "open source"],
    cost: "Open source",
    inStack: true,
    panel: { curation: 5, craft: 3, fit: 2 },
  },
  {
    slug: "rive",
    name: "Rive",
    url: "https://rive.app/",
    domain: "rive.app",
    category: "assets",
    what: "Interactive vector animation with state machines — an animation that responds to hover, scroll and clicks — exported behind a tiny web runtime.",
    use: "When the animation needs to react, not just play. A designer builds it; the developer wires up two lines.",
    tags: ["interactive", "vector", "state machine"],
    cost: "Freemium",
    panel: { curation: 4, craft: 5, fit: 3 },
  },
];

export const VAULT_TOTAL = RESOURCES.length;

// ─── The cut list (2026-08-25) ────────────────────────────────────────────────
// 28 entries the panel removed, with the reason each one lost. Kept here so the
// argument survives: if you want one back, copy its row from git history — but
// read the reason first. (◈ = one Jem had sent or we'd used before.)
//
//  ◈ 21st.dev          12,000+ open-submission components — the "10,000 options" rule kills it
//    Magic UI          the AI-startup landing-page house style; React Bits covers the same ground
//    Aceternity UI     the single biggest source of the identikit spotlight-and-beam look
//  ◈ Animate UI        third clone of Magic UI / Aceternity; nothing React Bits doesn't have
//    Uiverse           4,400+ open community submissions, neon kitsch, no curation
//    Hover.dev         paid Tailwind/Framer packs; Build UI teaches the same techniques free
//    cuicui            the author now calls it "the experiment" and maintains a different library
//  ◈ MotionSites AI    prompt packs that produce the exact generic page we never ship
//    Animate.css       2011-era bounce presets; Animista generates bespoke keyframes instead
//    Rombo Tailwind    a fourth route to a fade we already have three ways to do
//    CSS Animation Rocks  dormant blog, long superseded by Codrops
//    Land-book         large open-submission SaaS gallery; wrong genre, wrong altitude
//    Refero            142,000+ screens — a database, not curation, and app UI at that
//    Lapa Ninja        7,300+ landing pages padded with freebie bait
//    Httpster          3,100 sites with no curation edge over SiteInspire
//    Minimal Gallery   duplicates SiteInspire's remit with a smaller, staler pool
//    One Page Love     9,000+ sites and a template shop attached
//    Curated.design    aggregator funnelling to a subscription; adds nothing to Awwwards + SiteInspire
//    Navbar Gallery    single-component screenshot dump; you'd open it twice a year
//    Footer.design     same one-note premise as Navbar Gallery
//    Mobbin            621,000 screens — a research database, and mobile product UI not web craft
//    Cosmos            a place to save links, which is this vault's own job
//  ◈ Haikei            blob-and-wave backgrounds are the 2021 SaaS look we avoid
//  ◈ loading.io        spinner mill, and the house rule is skeletons not spinners
//    LottieFiles       800,000+ marketplace animations we have no pipeline for
//    SVGator           GUI SVG animation; Rive does it better and we hand-code the rest
//    SVG Repo          ~460,000 community vectors; lucide-react already ships in this repo
//  ◈ Toools.design     a directory of directories — the definition of a bookmark never opened
