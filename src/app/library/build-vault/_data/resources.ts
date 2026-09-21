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
 * a word must serve at least two entries — the one exception being a job
 * nothing else in the vault does at all ("whole pages", which only Recent
 * serves). A filter with one arbitrary member is a dead end; a filter that is
 * the only door to a job is not.
 */
export const VAULT_JOBS = [
  "scroll",
  "hover",
  "text in motion",
  "page transitions",
  "micro-interactions",
  "texture",
  "backgrounds",
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
      "The engines you choose between before you build. Four tools, no overlap, each the best at one job — and the native CSS option sits here on purpose, so you consider it before reaching for a library.",
  },
  {
    id: "see",
    label: "See it done",
    blurb:
      "Two galleries. One for the whole page, one filed by the exact detail — hero, nav, transition, footer. Every open-submission archive went, and so did the three merely-good galleries that were losing to these two.",
  },
  {
    id: "make",
    label: "Make the asset",
    blurb:
      "Tools that hand you a file rather than a snippet. Both make texture — grain, noise, pattern, ink — because texture is the one raw material this house style actually consumes.",
  },
  {
    id: "understand",
    label: "Understand it",
    blurb:
      "The long reads, and now the largest shelf in the vault — which is the whole argument. Nobody who reads these three ships a page that looks generated. Read them when you can tell something is wrong and cannot say why.",
  },
];

export const RESOURCES: Resource[] = [
  {
    slug: "codrops",
    name: "Codrops",
    url: "https://tympanus.net/codrops/",
    domain: "tympanus.net",
    category: "paste",
    what: "The long-running demo lab: scroll rigs, grid reveals, page transitions, type experiments — every demo downloadable with its source.",
    use: "When the brief is something nobody else on the internet has. Start here, then simplify it until it ships.",
    jobs: ["scroll", "page transitions", "text in motion", "backgrounds"],
    tech: ["demos", "experimental", "source included"],
    cost: "Free",
    panel: { curation: 4, craft: 5, fit: 5 },
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
    slug: "motion-dev",
    name: "Motion",
    url: "https://motion.dev/",
    domain: "motion.dev",
    category: "wire",
    what: "The animation engine that grew out of Framer Motion — for React and for plain JavaScript, with hardware-accelerated animations and a proper spring model.",
    use: "The default engine for anything React. Springs, gestures, layout animation, exit animations.",
    jobs: ["layout animation", "page transitions", "text in motion"],
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
    jobs: ["texture", "backgrounds"],
    tech: ["shaders", "webgl", "react", "long-read"],
    cost: "Free",
    origin: "peers",
    panel: { curation: 5, craft: 5, fit: 4 },
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
//
// Third round, 2026-09-12 — the hard cap. Jem set a ceiling of fifteen and said
// new things must displace, not accumulate. 28 went in, 15 came out. A three-lens
// panel (craft and durability · fit and displacement · the sceptic) voted every
// entry; the eleven unanimous keeps plus four majority keeps are what remain.
//
// The thirteen incumbents cut:
//    React Bits · Animista · Motion Primitives · Arlan's Vault ◈ · Thinking Orbs ◈
//                        the paste-in genre, cut as a bloc — a studio that hand-writes CSS does
//                        not need 165 prebuilt effects, and Codrops teaches the same tricks with
//                        the reasoning attached
//    Canvas UI ◈         WebGL glass and liquid: the gradient-and-glow look this studio refuses
//    Anime.js            a second animation engine when Motion is already the dependency
//    Awwwards · SiteInspire   directories, both scored 2/5 on curation — the failure mode two
//                        earlier rounds already ruled on
//    60fps ◈ · Nitish Khagwal ◈   both lose to Details, which files by the exact detail
//    Inspora ◈           6/15, the weakest entry the vault ever carried
//    Rive                a whole authoring tool and runtime to learn, for output the story pages
//                        have never needed
//
// And the eight challengers from the Vibe Coder Toolkit, none admitted:
//    Skiper UI           shadcn-only install, $129 and $549 tiers the toolkit under-reported,
//                        and it sells recreations of other products' interactions — openly
//                        modelled on Devouring Details, which is already here
//    Limora AI · Logiaweb   both are the toolkit author's own properties, listed inside his own
//                        curation without disclosure
//    Liveline · Bklit    charting libraries; the vault has no plot-a-series job
//    KokonutUI           liquid glass and shimmer — Aceternity and Magic UI under a new name
//    NameThatUI · Agentation   genuinely good, and out of scope: they answer "how do I drive my
//                        agent", not "how should this move". Admit them and the membership rule
//                        silently becomes "useful to someone building with AI", which is an
//                        unbounded set — a directory, which is what this vault refuses to be.
//                        If they earn a home it is a separate list with its own remit.
//
// Watchlist, 2026-09-21 — React Bits · Micro (reactbits.dev/c/micro), Jem's find.
// Unanimous OUT *for now*, not a rejection. Thirty-three tactile controls (hold
// button, squish switch, swipe row) by David Haz, with real keyboard and reduced-
// motion work. It is not the effects catalogue we cut. But it launched on
// 2026-09-18 and was still changing daily at review. Admitting it three days in
// would read as reversing the React Bits cut for novelty. Re-review around
// December 2026. It gets in if (1) the 33 have been refined rather than just added
// to, (2) it is still free, and (3) Hold Button, Scrub Field and Glide Select re-
// dressed in cobalt/platinum with glow={false} read as restrained controls. If it
// passes, it swaps one-for-one with Fancy Components (same job, same shelf). All
// three judges named that swap. Notes for the card: MIT + Commons Clause licence,
// icons from Hugeicons rather than lucide, link the /c/micro page, not the home.
//
// Cut, 2026-09-21 — Spotted in Prod (spottedinprod.com), Jem's find. Unanimous OUT.
// Well made and genuinely curated: ~400+ hand-picked clips from shipped iOS
// apps, filed by pattern, gesture and category, scrubbable frame by frame,
// updated daily. But it is iOS only and part of it sits behind a paid
// membership. It is the same thing as 60fps and Mobbin on a platform we don't
// build for, and it loses to Details for the same reason 60fps did: Details
// files shipped WEB interactions. Revisit only if it adds a real web section
// filed the same way (it would then challenge Details), or if the studio ever
// builds a native iOS app (it would go straight in).
