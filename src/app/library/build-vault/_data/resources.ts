// ─── The Build Vault — resource database ──────────────────────────────────────
// Every entry is an external site we'd actually send someone to. Rules for
// adding one:
//   1. Verified live and described from the site itself — no half-remembered
//      link lists. (All entries below were fetched and checked 2026-08-25.)
//   2. `what` says what it IS. `use` says when you'd reach for it over the
//      others. If you can't write a distinct `use`, the entry doesn't earn a row.
//   3. `cost` is honest about the paywall — nothing is more annoying than a
//      "free" link that wants a card.
//   4. `origin` records provenance, and only one of three things is true:
//      "stack" = the package or asset is genuinely in this repo already;
//      "yours" = Jem sent the link himself;
//      "peers" = it came from a designer he trusts. Leave it unset for anything
//      found by search — that is the honest default, and most entries are.
//   5. Every entry needs a screenshot at public/images/library/build-vault/<slug>.webp
//      (1200x750, captured at 1440x900). Regenerate rather than hotlink.
//
// Culled 2026-08-25 by a three-lens panel — curation vs scale, craft and
// reputation, fit and redundancy for this studio. 47 in, 19 out the other side.
// The full cut list with reasons is at the foot of this file: restoring one is
// a copy-paste, so nothing is lost, but read the reason before you do.
// No dollar figures or percentages anywhere in this file — same PROOF rule as
// every other public page.

/**
 * The shelf axis answers ONE question: what do you walk away with? It is
 * deliberately not "what kind of thing is it" (a library vs a gallery vs a
 * tool), and deliberately not the job you arrived with (scroll, hover, text) —
 * jobs are not mutually exclusive, so a job-shaped shelf either lies or grows
 * an "everything" drawer. Jobs live on `jobs` below and are answered by search.
 */
export type VaultCategory = "paste" | "wire" | "see" | "make" | "understand";

/**
 * The job vocabulary — the words people actually arrive with. Rendered under
 * the search box and on every card; clicking one searches for it rather than
 * opening a second filter axis, so the page never becomes a matrix. Capped, and
 * no word may have fewer than three entries: a filter with one member is a dead
 * end that teaches people the filter is broken.
 */
export const VAULT_JOBS = [
  "scroll",
  "hover",
  "text in motion",
  "page transitions",
  "micro-interactions",
  "texture",
  "backgrounds",
  "3D & WebGL",
  "layout animation",
  "whole pages",
] as const;

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
  /** the jobs it serves, from VAULT_JOBS — rendered on the card */
  jobs: string[];
  /** search fuel only, never rendered: frameworks, formats, licences */
  tech: string[];
  cost: "Free" | "Open source" | "Freemium" | "Paid";
  /** where it came from: in this repo already, Jem's own link, or a designer's pick */
  origin?: "stack" | "yours" | "peers";
  /** panel scores out of 5 — curation, craft, fit — and the total out of 15 */
  panel: { curation: number; craft: number; fit: number };
}

export const VAULT_CATEGORIES: { id: VaultCategory; label: string; blurb: string }[] = [
  {
    id: "paste",
    label: "Paste it in",
    blurb:
      "Code you can lift today and re-dress in our own type and colours. Every generic shimmer-and-beam component kit was cut — what is left is technique, not somebody else's house style.",
  },
  {
    id: "wire",
    label: "Wire it up",
    blurb:
      "The engines you choose between before you build. Five tools, no overlap, each the best at one job — and the native CSS option sits here on purpose, so you consider it before reaching for a library.",
  },
  {
    id: "see",
    label: "See it done",
    blurb:
      "Other people's shipped work, for deciding what the thing should do before you build it. Every open-submission archive with six figures of screens was cut; these are filed by the moment you are actually building.",
  },
  {
    id: "make",
    label: "Make the asset",
    blurb:
      "Tools that hand you a file rather than a snippet — a texture, a dithered image, an animation rigged to respond. Each does something you could not hand-code in five minutes.",
  },
  {
    id: "understand",
    label: "Understand it",
    blurb:
      "The long reads. Not somewhere to grab code — the places that take an interaction apart and explain why it feels right. Read these when you can tell something is wrong and cannot say why.",
  },
];

export const RESOURCES: Resource[] = [
  {
    slug: "react-bits",
    name: "React Bits",
    url: "https://reactbits.dev/",
    domain: "reactbits.dev",
    category: "paste",
    what: "Around 165 animated React components — text effects, animated backgrounds, small UI pieces — each shipped in four flavours: JavaScript or TypeScript, plain CSS or Tailwind.",
    use: "First stop for a text reveal or a moving background. The four-flavour thing means it drops into any project without a rewrite.",
    jobs: ["text in motion", "backgrounds"],
    tech: ["react", "typescript", "tailwind", "css", "components"],
    cost: "Open source",
    panel: { curation: 4, craft: 3, fit: 3 },
  },
  {
    slug: "animista",
    name: "Animista",
    url: "https://animista.net/",
    domain: "animista.net",
    category: "paste",
    what: "A playground of ready CSS animations — pick one, tune the duration, delay, easing and direction on the page, copy the keyframes out.",
    use: "The fastest route to a hand-rolled @keyframes block with zero libraries. Free for commercial work.",
    jobs: ["text in motion", "micro-interactions"],
    tech: ["css", "keyframes", "generator", "no-framework"],
    cost: "Free",
    panel: { curation: 4, craft: 3, fit: 4 },
  },
  {
    slug: "motion-primitives",
    name: "Motion Primitives",
    url: "https://motion-primitives.com/",
    domain: "motion-primitives.com",
    category: "paste",
    what: "Small, composable Motion-for-React primitives — text effects, transitions, cursors, dialogs — rather than fully designed components.",
    use: "When you want the motion, not somebody else's idea of what the component should look like.",
    jobs: ["text in motion", "page transitions"],
    tech: ["react", "motion", "primitives"],
    cost: "Open source",
    panel: { curation: 4, craft: 4, fit: 2 },
  },
  {
    slug: "build-ui-recipes",
    name: "Build UI — Recipes",
    url: "https://buildui.com/recipes",
    domain: "buildui.com",
    category: "understand",
    what: "Worked recipes for the genuinely hard React and Motion interactions, with live code and the reasoning written out beside it.",
    use: "When an interaction won't behave — layout animation, drag, shared elements between pages. This explains why, not just what to paste.",
    jobs: ["layout animation", "page transitions", "micro-interactions"],
    tech: ["react", "motion", "tutorial", "layout animation"],
    cost: "Free",
    panel: { curation: 5, craft: 4, fit: 5 },
  },
  {
    slug: "codrops",
    name: "Codrops",
    url: "https://tympanus.net/codrops/",
    domain: "tympanus.net",
    category: "paste",
    what: "The long-running demo lab: scroll rigs, grid reveals, page transitions, type experiments — every demo downloadable with its source.",
    use: "When the brief is something nobody else on the internet has. Start here, then simplify it until it ships.",
    jobs: ["scroll", "page transitions", "text in motion"],
    tech: ["demos", "experimental", "source included"],
    cost: "Free",
    panel: { curation: 4, craft: 5, fit: 5 },
  },
  {
    slug: "arlan-vault",
    name: "Arlan's Vault",
    url: "https://www.arlan.me/vault",
    domain: "arlan.me",
    category: "paste",
    what: "One designer's private vault gone public — arcade pixel, chromatic glow, gradient and typographic effects, each demoed live and released under MIT.",
    use: "Small, weird, high-taste effects you won't find in a component library. Everything is free to lift.",
    jobs: ["text in motion", "texture"],
    tech: ["css", "mit", "effects", "typography"],
    cost: "Free",
    origin: "yours",
    panel: { curation: 5, craft: 4, fit: 3 },
  },
  {
    slug: "pqoqubbw-icons",
    name: "pqoqubbw/icons",
    url: "https://pqoqubbw.dev/",
    domain: "pqoqubbw.dev",
    category: "paste",
    what: "Beautifully animated icons, copy-paste, built on React and Motion.",
    use: "The cheapest upgrade on a page: icons that animate on hover instead of sitting there.",
    jobs: ["hover", "micro-interactions"],
    tech: ["react", "motion", "icons"],
    cost: "Open source",
    panel: { curation: 5, craft: 4, fit: 4 },
  },
  {
    slug: "motion-dev",
    name: "Motion",
    url: "https://motion.dev/",
    domain: "motion.dev",
    category: "wire",
    what: "The animation engine that grew out of Framer Motion — for React and for plain JavaScript, with hardware-accelerated animations and a proper spring model.",
    use: "The default engine for anything React. Springs, gestures, layout animation, exit animations.",
    jobs: ["layout animation", "page transitions"],
    tech: ["react", "javascript", "springs", "engine", "framer motion"],
    cost: "Open source",
    origin: "stack",
    panel: { curation: 5, craft: 5, fit: 5 },
  },
  {
    slug: "gsap-scroll",
    name: "GSAP — ScrollTrigger",
    url: "https://gsap.com/scroll/",
    domain: "gsap.com",
    category: "wire",
    what: "The scroll toolkit the award-winning sites run on: ScrollTrigger pins and scrubs any animation to scroll position, ScrollSmoother handles the smooth track. Free for everyone — plugins included — since Webflow took it on.",
    use: "Pinned sections, horizontal scroll, scrub-through storytelling. When the scroll IS the interface, this is the one.",
    jobs: ["scroll"],
    tech: ["javascript", "engine", "pinning", "scrub"],
    cost: "Free",
    panel: { curation: 5, craft: 5, fit: 5 },
  },
  {
    slug: "scroll-driven-animations",
    name: "Scroll-Driven Animations",
    url: "https://scroll-driven-animations.style/",
    domain: "scroll-driven-animations.style",
    category: "wire",
    what: "Bramus's demo bank for native CSS scroll-driven animations — no JavaScript at all — plus tools, a DevTools debugger and a free video course.",
    use: "Try this BEFORE reaching for a library. Modern browsers can scrub an animation to scroll in pure CSS, which is lighter and survives every framework change.",
    jobs: ["scroll"],
    tech: ["css", "no-js", "learning", "devtools"],
    cost: "Free",
    panel: { curation: 5, craft: 4, fit: 5 },
  },
  {
    slug: "lenis",
    name: "Lenis",
    url: "https://lenis.dev/",
    domain: "lenis.dev",
    category: "wire",
    what: "Smooth scroll in one line and under 4kb, from darkroom.engineering — consistent scroll behaviour across every input device.",
    use: "The smoothness under most of the sites worth copying. Pairs with GSAP or with CSS scroll-driven animation; keep an eye on reduced-motion users.",
    jobs: ["scroll"],
    tech: ["javascript", "smooth scroll", "lightweight", "open source"],
    cost: "Open source",
    panel: { curation: 5, craft: 5, fit: 4 },
  },
  {
    slug: "anime-js",
    name: "Anime.js",
    url: "https://animejs.com/",
    domain: "animejs.com",
    category: "wire",
    what: "A small, fast JavaScript animation engine for the DOM, SVG and canvas, with a real timeline.",
    use: "Framework-free work — a static page, an embed, an HTML email preview — where React isn't in the room.",
    jobs: ["layout animation", "text in motion"],
    tech: ["javascript", "svg", "timeline", "no-framework"],
    cost: "Open source",
    panel: { curation: 4, craft: 4, fit: 2 },
  },
  {
    slug: "inspora",
    name: "Inspora",
    url: "https://www.inspora.design/",
    domain: "inspora.design",
    category: "see",
    what: "A feed of interaction and motion shots — individual UI moments (a slider, a card reveal, a keyboard) rather than whole websites, each credited to its maker.",
    use: "Micro-interaction reference: you know the section works and you're looking for what the one moving part should do. Different job from the site galleries above.",
    jobs: ["micro-interactions", "hover"],
    tech: ["gallery", "feed", "ui"],
    cost: "Free",
    origin: "yours",
    panel: { curation: 3, craft: 2, fit: 1 },
  },
  {
    slug: "awwwards",
    name: "Awwwards — Sites",
    url: "https://www.awwwards.com/websites/",
    domain: "awwwards.com",
    category: "see",
    what: "The big directory, filterable by award, category, tag (animation, typography, 3D), technology (React, GSAP, WebGL), country and typeface.",
    use: "Filter by TECHNOLOGY. It's the fastest way to see what a specific library can actually do in the wild before you commit to it.",
    jobs: ["whole pages", "scroll", "3D & WebGL"],
    tech: ["gallery", "filters", "technology", "react", "gsap"],
    cost: "Freemium",
    panel: { curation: 2, craft: 4, fit: 4 },
  },
  {
    slug: "recent-design",
    name: "Recent",
    url: "https://recent.design/",
    domain: "recent.design",
    category: "see",
    what: "The hard-curated feed of the best current web design — this is where godly.website now redirects. Same job, new name.",
    use: "Where the genuinely new interaction ideas surface first.",
    jobs: ["whole pages"],
    tech: ["gallery", "curated", "web design"],
    cost: "Free",
    panel: { curation: 4, craft: 5, fit: 3 },
  },
  {
    slug: "siteinspire",
    name: "SiteInspire",
    url: "https://www.siteinspire.com/",
    domain: "siteinspire.com",
    category: "see",
    what: "A long-running showcase filtered by style (typographic, minimal, grid), by type (portfolio, agency, commerce) and by subject.",
    use: "Style-led searching: 'show me typographic and minimal' gets you there in two clicks.",
    jobs: ["whole pages"],
    tech: ["gallery", "style filters", "minimal", "typographic"],
    cost: "Free",
    panel: { curation: 2, craft: 5, fit: 4 },
  },
  {
    slug: "fffuel",
    name: "fffuel",
    url: "https://www.fffuel.co/",
    domain: "fffuel.co",
    category: "make",
    what: "A set of free SVG generators — gradients, patterns, textures, noise, blobs, shapes — plus colour tools and converters.",
    use: "Grain and gradient meshes especially. The noise texture that stops a flat page looking cheap.",
    jobs: ["texture", "backgrounds"],
    tech: ["svg", "generator", "noise", "gradients", "patterns"],
    cost: "Free",
    panel: { curation: 4, craft: 3, fit: 4 },
  },
  {
    slug: "canvas-ui",
    name: "Canvas UI",
    url: "https://canvasui.dev/",
    domain: "canvasui.dev",
    category: "paste",
    what: "Around 40 WebGL canvas effects — glass, liquid, particles, ASCII, distortion — applied over live HTML, framework-agnostic and open source.",
    use: "One hero moment that makes a page feel built rather than assembled. Expensive to run, so use it once and watch the frame rate.",
    jobs: ["3D & WebGL", "texture", "backgrounds"],
    tech: ["webgl", "canvas", "open source", "no-framework"],
    cost: "Open source",
    origin: "yours",
    panel: { curation: 5, craft: 3, fit: 2 },
  },
  {
    slug: "rive",
    name: "Rive",
    url: "https://rive.app/",
    domain: "rive.app",
    category: "make",
    what: "Interactive vector animation with state machines — an animation that responds to hover, scroll and clicks — exported behind a tiny web runtime.",
    use: "When the animation needs to react, not just play. A designer builds it; the developer wires up two lines.",
    jobs: ["micro-interactions"],
    tech: ["vector", "state machine", "runtime", "interactive"],
    cost: "Freemium",
    panel: { curation: 4, craft: 5, fit: 3 },
  },
  {
    slug: "details-so",
    name: "Details",
    url: "https://www.details.so/inspo",
    domain: "details.so",
    category: "see",
    what: "Interaction captures from shipped sites, filed by the exact detail — hero, navigation, scroll animation, page transition, footer — so you browse the behaviour rather than the brand.",
    use: "You already know the section works and you want to see how twenty good sites handled that one moment. Sharper than a whole-site gallery when the question is small.",
    jobs: ["scroll", "page transitions", "hover"],
    tech: ["gallery", "interaction", "navigation"],
    cost: "Freemium",
    origin: "peers",
    panel: { curation: 4, craft: 4, fit: 4 },
  },
  {
    slug: "sixty-fps",
    name: "60fps",
    url: "https://60fps.design/",
    domain: "60fps.design",
    category: "see",
    what: "A motion gallery of clips captured at native frame rate from real shipped products, tagged by what the motion does and broken down storyboard-style.",
    use: "Deciding how a thing should move rather than how it should look — the only entry here indexed by behaviour instead of aesthetic.",
    jobs: ["micro-interactions", "page transitions"],
    tech: ["gallery", "motion", "reference"],
    cost: "Freemium",
    origin: "peers",
    panel: { curation: 4, craft: 4, fit: 4 },
  },
  {
    slug: "khagwal-interactions",
    name: "Nitish Khagwal — Interactions",
    url: "https://khagwal.com/interactions/",
    domain: "khagwal.com",
    category: "see",
    what: "One designer's own collection of micro-interactions — built rather than collected, which is rarer than it sounds.",
    use: "A short, personal read when the big galleries have gone stale. Smallest thing on this shelf and the most opinionated.",
    jobs: ["micro-interactions", "hover"],
    tech: ["personal", "ui"],
    cost: "Free",
    origin: "peers",
    panel: { curation: 4, craft: 3, fit: 3 },
  },
  {
    slug: "super-hover",
    name: "Super Hover",
    url: "https://super-hover.danielpetho.com",
    domain: "super-hover.danielpetho.com",
    category: "paste",
    what: "A tiny React hook that keeps hover states honest while the page is scrolling. The pointer is not moving, so the browser never fires the event, and the card under your cursor goes dead — this fixes precisely that.",
    use: "Any scroll-story page with hoverable cards. It is the bug you would otherwise spend an afternoon failing to reproduce.",
    jobs: ["hover", "scroll"],
    tech: ["react", "hook", "open source"],
    cost: "Open source",
    origin: "peers",
    panel: { curation: 5, craft: 4, fit: 4 },
  },
  {
    slug: "fancy-components",
    name: "Fancy Components",
    url: "https://www.fancycomponents.dev",
    domain: "fancycomponents.dev",
    category: "paste",
    what: "Text effects, marquees, image trails and physics-driven interactions from the same author as Super Hover — each one a primitive rather than a finished section.",
    use: "You want one specific effect — letters that scatter, a trail that follows the cursor — and you will re-dress it in our own type and colours.",
    jobs: ["text in motion", "hover", "micro-interactions"],
    tech: ["react", "motion", "open source"],
    cost: "Open source",
    origin: "peers",
    panel: { curation: 5, craft: 4, fit: 3 },
  },
  {
    slug: "thinking-orbs",
    name: "Thinking Orbs",
    url: "https://orbs.jakubantalik.com/",
    domain: "orbs.jakubantalik.com",
    category: "paste",
    what: "Nine hand-tuned states of one animated orb, shipped as a package — idle, listening, thinking, answering.",
    use: "An AI product needs a thinking state that is not a spinner. Deliberately narrow: ignore it for anything else.",
    jobs: ["micro-interactions"],
    tech: ["react", "canvas", "ai", "loading state", "npm"],
    cost: "Open source",
    origin: "peers",
    panel: { curation: 5, craft: 4, fit: 2 },
  },
  {
    slug: "dither-garden",
    name: "Dither Garden",
    url: "https://www.dithergarden.com",
    domain: "dithergarden.com",
    category: "make",
    what: "Upload an image and it dithers — Floyd-Steinberg, Atkinson, Bayer, blue-noise, ASCII, fifteen algorithms with colour modes and a download at the end.",
    use: "Turning a photograph into ink so it sits inside a hairline, mono-type page instead of fighting it.",
    jobs: ["texture"],
    tech: ["image", "generator", "dither", "ascii"],
    cost: "Free",
    origin: "peers",
    panel: { curation: 5, craft: 3, fit: 4 },
  },
  {
    slug: "devouring-details",
    name: "Devouring Details",
    url: "https://devouringdetails.com/",
    domain: "devouringdetails.com",
    category: "understand",
    what: "Rauno Freiberg's book on interaction craft — why a gesture feels right, taken apart chapter by chapter with live examples you can poke at.",
    use: "Not somewhere to grab code. The thing you read when you can tell an interaction is wrong and cannot say why. Highest-scoring entry in the vault, and the only one that costs real money.",
    jobs: ["micro-interactions", "hover"],
    tech: ["book", "craft", "long-read", "paid"],
    cost: "Paid",
    origin: "peers",
    panel: { curation: 5, craft: 5, fit: 4 },
  },
  {
    slug: "maxime-heckel",
    name: "Maxime Heckel",
    url: "https://maximeheckel.com/",
    domain: "maximeheckel.com",
    category: "understand",
    what: "Deep, interactive essays on shaders, WebGL and React motion, with playgrounds you can drag while you read.",
    use: "Going one level below the libraries — when the effect you want does not exist yet and you need to understand the maths behind it.",
    jobs: ["3D & WebGL", "texture"],
    tech: ["shaders", "webgl", "react", "long-read"],
    cost: "Free",
    origin: "peers",
    panel: { curation: 5, craft: 5, fit: 4 },
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
//
// Second round, 2026-08-25 — 16 more, sent by designers Jem trusts. Nine went
// in; these seven did not. The vouch was real signal, not a free pass.
//
//  ◈ Framer University   Framer-builder assets — unusable in a hand-coded Next.js page
//  ◈ Andrew Hedges       personal experiments frozen around 2015, several self-labelled outdated
//  ◈ The Component Gallery  a fine design-system naming index, but it answers a question a solo
//                        studio hand-writing editorial CSS never asks
//  ◈ Navbar Gallery      re-judged with the vouch attached and cut again: ~570 static screenshots,
//                        open submission, no motion — Details covers navbars with the behaviour shown
//  ◈ Supahero            hero screenshots, absorbed into another product and now an upsell
//  ◈ ThreeUI             well-authored, but it is a 3D-glow component kit — the same rule that cut
//                        Aceternity and Magic UI applies here, closest call of the round
//  ◈ Alex Barashkov text animations  a single post, not a resource; the durable artefact is the
//                        pixel-point/animate-text repo, which is worth vaulting if he wants it
