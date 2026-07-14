// ─────────────────────────────────────────────────────────────────────────────
// THE OPERATING MODEL — story copy, single source of truth.
// Every dollar figure / percentage on this page must appear VERBATIM in
// cockpit/knowledge/PROOF.md. Never sum the three client outcomes ($8M+
// combined is hard-banned). "tens of millions" only ever attributed to
// Oshyia Savur. Lorem blocks marked [JEM: …] are slots only Jem can fill.
// ─────────────────────────────────────────────────────────────────────────────

export const LOADER_STEPS = [
  { label: "Weeks 01–02 · Audit & Foundation", num: "01" },
  { label: "Weeks 03–04 · Divergence Mastery", num: "03" },
  { label: "Weeks 05–06 · Convergence & Production", num: "05" },
  { label: "Weeks 07–08 · The Operating Model", num: "08", accent: true },
] as const;

export const HERO = {
  eyebrow: "NotContent · The Flagship Program",
  title: "Eight Weeks",
  subtitle: "From sporadic knowledge to full production.",
  ghost: "8",
  image: "/images/training/speaking-wide-3.webp",
  imageAlt: "Jeremy Somers on stage training a creative team",
  credit: "Delivered. Proven. Production ready.",
};

export const SCORECARD = {
  league: "Creative Operations · Flagship Engagement",
  headline: "Average production time for creative output",
  leftName: "Before",
  leftScore: "Nine months",
  rightName: "After",
  rightScore: "Three months",
  bigNumber: "8",
  bigLabel: "WKS training",
  statement:
    "We've consistently trained teams to use AI to cut production to a third of the time — and a tenth of the cost.",
};

// Marquee — one-liners, PROOF.md wording. `record: true` renders in cobalt.
export const MARQUEE = [
  { text: "Production time cut by roughly 90% · Cash App", record: true },
  { text: "Estimated $3.5M saved in year one · Cash App" },
  { text: "Nine months down to three months · Maesa", record: true },
  { text: "$280k saved on a single brand launch · Maesa" },
  { text: "The AI model now running across 12+ brands · Maesa" },
  { text: "Estimated $4.5M year-one savings · Herman Scheer", record: true },
  { text: "Zero to full AI production in weeks · Herman Scheer" },
  { text: "8 weeks · 4 phases · Run four times" },
  { text: "From $50,000" },
] as const;

export const OPENING = {
  courtLabel: "How week one begins",
  globeSrc: "/images/story/nc-globe.png",
  eyebrow: "Weeks 01–02 · The Audit",
  word: "Look.",
  copy: [
    "No lecture. No slideware. Week one starts with an audit of how your team actually works — the bottlenecks, the hours, the work that shouldn't take the time it takes. ",
    { em: "Then we build on what's true." },
  ],
  videoSrc: "/videos/story/nc-story.mp4",
  videoPoster: "/videos/story/nc-story.jpg",
  videoCaption: "NotContent · case-study film",
} as const;

export const PHASES_HEADING = {
  eyebrow: "Phase by phase",
  titleA: "How all 8 weeks",
  titleB: "happen",
};

export type DotType = "explore" | "select" | "ship" | "fix";

export interface Phase {
  nav: string;
  ghost: string;
  eyebrow: string;
  num: string;
  numLabel: string;
  title: string;
  accent?: boolean;
  // story: strings render muted, {em} renders bright, {lorem} renders as a
  // recognisable placeholder Jem replaces with a real war story from the runs.
  story: Array<string | { em: string } | { lorem: string }>;
  trio: Array<{ val: string; cat: string; accent?: boolean }>;
  dots: Array<{ x: number; y: number; type: DotType }>;
}

// Diagram frame is 300×280 (same viewBox family as the reference). The lower
// horizontal line at y=252 is the "ship line" — dots below it are in market.
export const PHASES: Phase[] = [
  {
    nav: "P1",
    ghost: "1",
    eyebrow: "Weeks 01–02 · Phase One",
    num: "02",
    numLabel: "Weeks in · Audit & Foundation",
    title: "Audit & Foundation",
    story: [
      "Every workflow mapped. Every bottleneck named. The toolkit configured, the team baselined, and the methodology on the table: ",
      { em: "Diverge. Converge. Build." },
      " By the end of week two the team knows exactly where the hours go — and which ones we're taking back. ",
      {
        lorem:
          "[JEM: week 1–2 war story from one of the four runs] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
    trio: [
      { val: "Audit", cat: "Workflows mapped" },
      { val: "Toolkit", cat: "Stack configured" },
      { val: "Baseline", cat: "Skills measured" },
    ],
    dots: [
      { x: 60, y: 70, type: "explore" },
      { x: 110, y: 55, type: "explore" },
      { x: 175, y: 80, type: "explore" },
      { x: 230, y: 60, type: "explore" },
      { x: 85, y: 120, type: "fix" },
      { x: 150, y: 105, type: "fix" },
      { x: 210, y: 130, type: "fix" },
      { x: 120, y: 165, type: "fix" },
      { x: 185, y: 175, type: "explore" },
      { x: 250, y: 155, type: "fix" },
      { x: 70, y: 195, type: "explore" },
      { x: 150, y: 210, type: "select" },
    ],
  },
  {
    nav: "P2",
    ghost: "2",
    eyebrow: "Weeks 03–04 · Phase Two",
    num: "04",
    numLabel: "Weeks in · Divergence Mastery",
    title: "Divergence Mastery",
    story: [
      "This is where output explodes. Advanced Midjourney — style refs, image refs, combinatorial batching. AI as a ",
      { em: "visual sparring partner" },
      ", not a slot machine. And the Stop Rule: knowing the exact moment exploration ends and execution begins. ",
      {
        lorem:
          "[JEM: week 3–4 war story] Lorem ipsum dolor sit amet, consectetur adipiscing elit — ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      },
    ],
    trio: [
      { val: "Refs", cat: "Style + image control" },
      { val: "Batching", cat: "Combinatorial output" },
      { val: "Stop Rule", cat: "Explore → execute" },
    ],
    dots: [
      { x: 40, y: 50, type: "explore" },
      { x: 75, y: 85, type: "explore" },
      { x: 115, y: 45, type: "explore" },
      { x: 145, y: 90, type: "explore" },
      { x: 180, y: 55, type: "explore" },
      { x: 220, y: 85, type: "explore" },
      { x: 255, y: 50, type: "explore" },
      { x: 55, y: 130, type: "explore" },
      { x: 100, y: 145, type: "explore" },
      { x: 160, y: 130, type: "explore" },
      { x: 215, y: 145, type: "explore" },
      { x: 260, y: 125, type: "explore" },
      { x: 80, y: 185, type: "select" },
      { x: 140, y: 195, type: "select" },
      { x: 200, y: 185, type: "select" },
      { x: 250, y: 200, type: "explore" },
      { x: 120, y: 225, type: "select" },
      { x: 175, y: 230, type: "select" },
    ],
  },
  {
    nav: "P3",
    ghost: "3",
    eyebrow: "Weeks 05–06 · Phase Three",
    num: "06",
    numLabel: "Weeks in · Convergence & Production",
    title: "Convergence & Production",
    story: [
      "Exploration becomes production. Precision tools for execution, your brand assets inside AI scenes, video transformation workflows — and quality control that ",
      { em: "holds the brand line at AI speed." },
      " This is the phase where the work starts shipping. ",
      {
        lorem:
          "[JEM: week 5–6 war story] Lorem ipsum dolor sit amet, consectetur adipiscing elit — duis aute irure dolor in reprehenderit in voluptate.",
      },
    ],
    trio: [
      { val: "Precision", cat: "Production-grade tools" },
      { val: "Brand", cat: "Assets in every scene" },
      { val: "QC", cat: "Standards at speed" },
    ],
    dots: [
      { x: 95, y: 60, type: "explore" },
      { x: 190, y: 70, type: "explore" },
      { x: 120, y: 110, type: "select" },
      { x: 165, y: 100, type: "select" },
      { x: 145, y: 140, type: "select" },
      { x: 130, y: 175, type: "select" },
      { x: 160, y: 180, type: "select" },
      { x: 110, y: 210, type: "ship" },
      { x: 145, y: 218, type: "ship" },
      { x: 180, y: 212, type: "ship" },
      { x: 125, y: 262, type: "ship" },
      { x: 160, y: 262, type: "ship" },
      { x: 195, y: 262, type: "ship" },
    ],
  },
  {
    nav: "P4",
    ghost: "4",
    eyebrow: "Weeks 07–08 · Final Phase",
    num: "08",
    numLabel: "Weeks · The model is yours",
    title: "Build & Governance",
    accent: true,
    story: [
      "The part nobody else does. Repeatable workflows built for your specific operation. A governance policy your team actually uses. Role-specific documentation. Onboarding that gets a new hire producing in ",
      { em: "days, not months." },
      " We don't teach tools and leave — we hand over an operating model that keeps running after we're gone. ",
      {
        lorem:
          "[JEM: week 7–8 war story] Lorem ipsum dolor sit amet, consectetur adipiscing elit — excepteur sint occaecat cupidatat non proident.",
      },
    ],
    trio: [
      { val: "Workflows", cat: "Built for your setup" },
      { val: "Governance", cat: "Policy that holds", accent: true },
      { val: "Onboarding", cat: "Days, not months" },
    ],
    dots: [
      { x: 60, y: 70, type: "ship" },
      { x: 110, y: 70, type: "ship" },
      { x: 160, y: 70, type: "ship" },
      { x: 210, y: 70, type: "ship" },
      { x: 60, y: 120, type: "ship" },
      { x: 110, y: 120, type: "ship" },
      { x: 160, y: 120, type: "ship" },
      { x: 210, y: 120, type: "fix" },
      { x: 60, y: 170, type: "ship" },
      { x: 110, y: 170, type: "fix" },
      { x: 160, y: 170, type: "ship" },
      { x: 210, y: 170, type: "ship" },
      { x: 85, y: 220, type: "ship" },
      { x: 135, y: 220, type: "ship" },
      { x: 185, y: 220, type: "ship" },
      { x: 110, y: 262, type: "ship" },
      { x: 160, y: 262, type: "ship" },
      { x: 210, y: 262, type: "ship" },
    ],
  },
];

export const DIAGRAM_LEGEND = [
  { type: "explore" as const, label: "Exploration" },
  { type: "select" as const, label: "Selected" },
  { type: "ship" as const, label: "Shipped" },
  { type: "fix" as const, label: "Process fixed" },
];

export const QUOTES_HEADING = {
  eyebrow: "Four cohorts · Real people",
  titleA: "The people who took it ",
  titleEm: "had things to say.",
};

export interface QuoteCard {
  initials: string;
  name: string;
  handle: string;
  text: string;
  featured?: boolean; // front-and-center card — pops first, sits centre, cobalt border
  // spread position (% of field) + rotation deg
  x: number;
  y: number;
  rot: number;
}

// Sources: the nc-reviews quote machine (Supabase `reviews`, status=approved,
// consent=true) + the three testimonials already published on the live site.
// Cards pop in array order — Savur is #1, front and center, by Jem's call.
export const QUOTE_CARDS: QuoteCard[] = [
  {
    initials: "OS",
    name: "Oshyia Savur",
    handle: "VP Marketing, Maesa · On stage at Shoptalk, 2025",
    text: "“Jeremy and NotContent will save us tens of millions of dollars in the next year alone.”",
    featured: true,
    x: 32, y: 30, rot: -1,
  },
  {
    initials: "JD",
    name: "Jose Diaz",
    handle: "Head of Production, Cash App",
    text: "“Jeremy's training was fun and really gave us the strategies, frameworks, and tools we needed to completely revolutionize how we produce creative — both internally for pitching and externally for production.”",
    x: 5, y: 8, rot: -5,
  },
  {
    initials: "RW",
    name: "Rebecca Wilson",
    handle: "Art Director, Maesa",
    text: "“Stop treating AI like a threat to your craft and start using it to expedite the concepts that would've eaten weeks of time and endless dollars in spend.”",
    x: 66, y: 6, rot: 4,
  },
  {
    initials: "MV",
    name: "Matt Van Dzura",
    handle: "Executive Producer, Block",
    text: "“It felt like we leveled up five times over the course of the class. Jeremy made AI feel practical, creative, and approachable — I walked away feeling way more confident in how I can use it in my day-to-day work.”",
    x: 6, y: 52, rot: 3,
  },
  {
    initials: "EG",
    name: "Emma Gindy",
    handle: "Designer, Herman Scheer",
    text: "“I leveled up five levels in creative direction, and now I use it in every branding presentation. I can safely say I'm a better, more valuable creative after doing this.”",
    x: 68, y: 48, rot: -4,
  },
  {
    initials: "DB",
    name: "Daniel Belay",
    handle: "Creative, Block",
    text: "“The energy was genuinely good — Jeremy didn't just read slides, we laughed, got real examples instead of theory, and there was zero consultant nonsense.”",
    x: 37, y: 66, rot: 5,
  },
  {
    initials: "AD",
    name: "Adam",
    handle: "Creative Director, Herman Scheer",
    text: "“We've been able to offer new and very profitable services to existing clients, and package new offerings to new clients as well. We feel comfortable moving into this new AI-powered world.”",
    x: 3, y: 30, rot: -3,
  },
  {
    initials: "KM",
    name: "Kalen Matherne",
    handle: "Senior Designer, Maesa",
    text: "“Jeremy brings a great energy to each lesson. It feels like learning insider knowledge and not just a how-to class!”",
    x: 70, y: 28, rot: 2,
  },
  {
    initials: "RT",
    name: "Rachel Topping",
    handle: "Jr Art Director, Maesa",
    text: "“I leveled up three times on prompting alone. We've quickly converted to around 60–70% of our assets being AI-generated now, which means we're shipping faster and actually hitting our timelines.”",
    x: 64, y: 64, rot: 3,
  },
  {
    initials: "JL",
    name: "Joey Luau",
    handle: "Art Director, Maesa",
    text: "“Jeremy didn't read off slides, we actually laughed, and there was none of that consultant nonsense. He's a cool cat — 15/10 would recco.”",
    x: 40, y: 4, rot: -6,
  },
];

export const QUOTES_PUNCHLINE = {
  pre: "Four runs. Same review.",
  main: "It works.",
};

export const PRESSER = {
  quote: "“We don't teach tools and leave. We change how the operation runs — then we hand you the keys.”",
  attribution: "Jeremy Somers · Founder, NotContent",
  // [JEM: presser footage — 30–60s to camera. Drop the file at
  // public/videos/presser.mp4 and set videoSrc to activate.]
  videoSrc: null as string | null,
  placeholderImage: "/images/training/speaking-wide-2.webp",
  placeholderLabel: "[JEM: presser footage · 30–60 seconds to camera · lorem ipsum dolor sit amet]",
  soundHint: "Tap for sound",
  muteHint: "Tap to mute",
};

export const RECORD_BOOK = [
  {
    name: "Herman Scheer",
    rank: "Agency · Los Angeles",
    stat: "$4.5M",
    statUnit: "est. year-one savings",
    detail: ["Zero to full AI production in weeks", "Now selling AI services to their own clients"],
  },
  {
    name: "Cash App",
    rank: "Enterprise · Fintech",
    stat: "90%",
    statUnit: "production time cut (roughly)",
    detail: ["Campaign output up roughly 30%", "Estimated $3.5M saved in year one"],
    highlight: true,
  },
  {
    name: "Maesa",
    rank: "Brand house · Beauty",
    stat: "$280k",
    statUnit: "saved on one launch",
    detail: ["Nine months down to three months", "The model now across 12+ brands"],
  },
] as const;

export const FINAL_HINT = {
  desktop: "Hover over each name for the numbers",
  touch: "Tap each name for the numbers",
};

export const CTA = {
  title: "The teams that move first win.",
  sub: "The Operating Model. Eight weeks. From $50,000. Built for in-house teams, agencies, and production studios that ship real work.",
  button: "Book a Discovery Call",
  buttonHref: "/book",
  note: "30 minutes. We'll tell you straight whether we're the right fit.",
  secondary: "Read the case studies",
  secondaryHref: "/results",
};

export const TOPBAR = {
  brand: "NotContent",
  brandHref: "/",
  cta: "Book a call",
  ctaHref: "/book",
};

// Circular scroll cue — "TEAM" renders in cobalt via a tspan.
export const BADGE = {
  pre: "SCROLL TO TRANSFORM YOUR ",
  accent: "TEAM",
  post: " · ",
};
