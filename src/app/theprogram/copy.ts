// ─────────────────────────────────────────────────────────────────────────────
// THE OPERATING MODEL — story copy, single source of truth.
// Every dollar figure / percentage on this page must appear VERBATIM in
// cockpit/knowledge/PROOF.md. Never sum the three client outcomes ($8M+
// combined is hard-banned). "tens of millions" only ever attributed to
// Oshyia Savur. Lorem blocks marked [JEM: …] are slots only Jem can fill.
// ─────────────────────────────────────────────────────────────────────────────

// The load-in intro — Jem's beats. Tells the whole arc before the hero lands:
// the problem, the intervention, the transformation, the result. `ms` scales to
// each beat's reading length. Final beat's payoff lands in cobalt.
// Skippable — any interaction drops straight into the page (see Loader in ui.tsx).
export const LOADER_STEPS = [
  {
    line1: "Every creative team's got one person quietly good at AI.",
    line2: "No system underneath them. A mess of tools and skills.",
    ms: 2700,
  },
  {
    line1: "Eight weeks we get everyone on the same page and shipping.",
    line2: "Production & client work. AI powered.",
    ms: 2400,
  },
  {
    line1: "Real work gets done by week 6.",
    line2: "10x the output in 10% of the time.",
    ms: 2400,
    accent: true,
  },
  // "Ad-hoc AI experimenters walk in / AI Creative Operators walk out" lives in
  // the hero now — the intro builds to it, so it must not fire here too.
] as const;

export const HERO = {
  eyebrow: "NotContent · The Flagship Program · Eight Weeks",
  // The hook. The load-in intro builds to this; it appears nowhere else.
  titleA: "Ad-hoc AI experimenters walk in.",
  titleB: "AI Creative Operators walk out.",
  subtitle: "From sporadic knowledge to full production.",
  ghost: "8",
  image: "/images/training/speaking-wide-3.webp",
  imageAlt: "Jeremy Somers on stage training a creative team",
  credit: "Delivered. Proven. Production ready.",
};

export const SCORECARD = {
  league: "Creative Operations · Flagship Engagement",
  headline: "Eight sessions. We get you to creative production.",
  // The "what this is" thesis — plants the frame before the phases, so a
  // skimming creative reads the scroll as amplification, not replacement.
  framing:
    "Plainly: this is skill training for the people who already make your best work — eight weeks that hand your team deep, working command of AI, so the minds with the ideas move faster, spend less, and make more of what they imagine.",
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
  courtLabel: "The program works.",
  globeSrc: "/images/story/nc-globe.png",
  eyebrow: "Real Brands, Real Work.",
  word: "Truly.",
  copy: [
    { em: "Creative at Speed." },
    " You've already seen our clients' work — it's in every Target, CVS, Sephora, Urban Outfitters, Walmart and ULTA in the world. ",
    { em: "We don't talk AI Creative — we just talk Creative." },
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

// The diagram is one continuous scatter graph across the four phases: the team
// starts as scattered dots (greys + a few blues) and, phase by phase, turns
// cobalt and converges on the ✕ at the centre — the operating model. By phase
// four they are one large cobalt dot: the team as a single machine.
export type TeamDotKind = "grey" | "blue" | "core";
export interface TeamDot {
  x: number;
  y: number;
  kind: TeamDotKind;
  trail?: boolean; // faint dashed line drawn toward the centre ✕
  ghost?: boolean; // very faint — "where the team was" (phase four echo)
}

export interface Phase {
  nav: string;
  ghost: string;
  eyebrow: string; // "Phase One" …
  num: string; // big number — the phase: 01–04
  numLabel: string; // "Weeks 01–02 · Audit & Foundation"
  title: string;
  accent?: boolean;
  story: Array<string | { em: string }>;
  trio: Array<{ val: string; cat: string; accent?: boolean }>;
  dots: TeamDot[];
}

// Graph viewBox 300×280. Centre ✕ (the operating model) sits at (164, 134).
export const GRAPH_CENTER = { x: 164, y: 134 };

export const PHASES: Phase[] = [
  {
    nav: "P1",
    ghost: "1",
    eyebrow: "Phase One",
    num: "01",
    numLabel: "Weeks 01–02 · Audit & Foundation",
    title: "Audit & Foundation",
    story: [
      "Key workflows mapped. Big bottlenecks named. The toolkit introduced and configured, the team baselined, and the methodology on the table: ",
      { em: "Diverge. Converge. Build." },
      " By the end of week two the team knows exactly where we're going and how to start getting there — using AI as a creative partner and sparring machine. These weeks are the foundational theory for everything that comes after. Without them, ",
      { em: "production is just AI slop." },
    ],
    trio: [
      { val: "Audit", cat: "Workflows mapped" },
      { val: "Toolkit", cat: "Stack configured" },
      { val: "Baseline", cat: "Team measured" },
    ],
    // scattered wide — mostly grey, a few blues, far from the centre
    dots: [
      { x: 58, y: 40, kind: "grey" },
      { x: 108, y: 32, kind: "grey" },
      { x: 168, y: 44, kind: "blue" },
      { x: 232, y: 36, kind: "grey" },
      { x: 270, y: 66, kind: "grey" },
      { x: 60, y: 92, kind: "grey" },
      { x: 128, y: 84, kind: "blue" },
      { x: 208, y: 100, kind: "grey" },
      { x: 272, y: 110, kind: "grey" },
      { x: 54, y: 150, kind: "grey" },
      { x: 120, y: 158, kind: "grey" },
      { x: 196, y: 150, kind: "grey" },
      { x: 256, y: 168, kind: "blue" },
      { x: 92, y: 208, kind: "grey" },
      { x: 170, y: 214, kind: "grey" },
      { x: 238, y: 206, kind: "grey" },
    ],
  },
  {
    nav: "P2",
    ghost: "2",
    eyebrow: "Phase Two",
    num: "02",
    numLabel: "Weeks 03–04 · Divergence Mastery",
    title: "Divergence Mastery",
    story: [
      "This is where theory ends and practical begins. We dive into the technical: an introduction to the tools in your stack, AI as a ",
      { em: "visual sparring partner — not a slot machine" },
      " — and the Stop Rule: knowing the exact moment exploration ends and execution begins. This is where teams get hands-on and very quickly go from basics to intermediate in whatever tools have been selected for the organisation. And the edge nobody talks about: this industry isn't faith-based — a great idea a client can't see is a dead idea. Teams leave able to show it before a dollar of production is spent. ",
      { em: "Still not a replacement for the idea — just what's stood between it and the yes." },
    ],
    trio: [
      { val: "Stack", cat: "Tools introduced" },
      { val: "Sparring", cat: "Not a slot machine" },
      { val: "Stop Rule", cat: "Explore → execute" },
    ],
    // drifting inward — about half now cobalt, trails toward the centre
    dots: [
      { x: 98, y: 72, kind: "blue", trail: true },
      { x: 140, y: 62, kind: "grey", trail: true },
      { x: 190, y: 74, kind: "blue", trail: true },
      { x: 232, y: 80, kind: "grey", trail: true },
      { x: 88, y: 112, kind: "blue", trail: true },
      { x: 132, y: 104, kind: "grey", trail: true },
      { x: 200, y: 110, kind: "blue", trail: true },
      { x: 240, y: 120, kind: "grey", trail: true },
      { x: 104, y: 152, kind: "grey", trail: true },
      { x: 150, y: 160, kind: "blue", trail: true },
      { x: 206, y: 152, kind: "grey", trail: true },
      { x: 244, y: 150, kind: "blue", trail: true },
      { x: 118, y: 192, kind: "blue", trail: true },
      { x: 170, y: 198, kind: "grey", trail: true },
      { x: 220, y: 188, kind: "blue", trail: true },
    ],
  },
  {
    nav: "P3",
    ghost: "3",
    eyebrow: "Phase Three",
    num: "03",
    numLabel: "Weeks 05–06 · Convergence & Production",
    title: "Convergence & Production",
    story: [
      "Exploration becomes production. Precision tools for execution. Aligning brand assets to AI world-building. An introduction to video and transformation workflows. Quality control. This is the phase where ",
      { em: "work starts shipping" },
      " — more intermediate skill sets and technical training combined with the theory from phases one and two. Everything starts coming together: output on-brand, and scalable. And the ideas that used to die in the trash on budget? They survive — the ambitious ones, the ones a client could never afford, made real for a fraction of the cost. ",
      { em: "That's the part that still gets us out of bed." },
    ],
    trio: [
      { val: "Precision", cat: "Production tools" },
      { val: "Brand", cat: "World-building" },
      { val: "QC", cat: "On-brand at scale" },
    ],
    // tight cluster on the centre — nearly all cobalt now
    dots: [
      { x: 132, y: 108, kind: "blue" },
      { x: 164, y: 100, kind: "blue" },
      { x: 196, y: 112, kind: "blue" },
      { x: 120, y: 134, kind: "blue" },
      { x: 150, y: 128, kind: "blue" },
      { x: 178, y: 130, kind: "blue" },
      { x: 206, y: 138, kind: "blue" },
      { x: 134, y: 158, kind: "blue" },
      { x: 166, y: 160, kind: "blue" },
      { x: 198, y: 154, kind: "blue" },
      { x: 150, y: 146, kind: "grey" },
      { x: 182, y: 144, kind: "blue" },
      { x: 146, y: 118, kind: "blue" },
      { x: 176, y: 170, kind: "blue" },
    ],
  },
  {
    nav: "P4",
    ghost: "4",
    eyebrow: "Final Phase",
    num: "04",
    numLabel: "Weeks 07–08 · Build & Governance",
    title: "Build & Governance",
    accent: true,
    story: [
      "The part nobody else does. Repeatable workflows built for your operation, bringing everything together. Mini-sessions on the taxonomy of AI and how to talk about — and sell — it to clients; changes in production, team and agency structure; and how the team's new skills affect the rest of the business. Plus governance, compliance and legal. By the end, the team is ready to ",
      { em: "produce for clients at scale" },
      " — if they haven't started already. Creative, account, strategy, production — different angles in, one shared picture out. ",
      { em: "That alignment is half the value on its own." },
    ],
    trio: [
      { val: "Repeatable", cat: "Built for you" },
      { val: "One team", cat: "One machine", accent: true },
      { val: "Governance", cat: "Compliant & legal" },
    ],
    // one large cobalt core on the ✕ — the team as a single machine — with
    // faint ghosts of where they started
    dots: [
      { x: 58, y: 40, kind: "grey", ghost: true },
      { x: 232, y: 36, kind: "grey", ghost: true },
      { x: 270, y: 66, kind: "grey", ghost: true },
      { x: 60, y: 92, kind: "grey", ghost: true },
      { x: 272, y: 110, kind: "grey", ghost: true },
      { x: 54, y: 150, kind: "grey", ghost: true },
      { x: 256, y: 168, kind: "grey", ghost: true },
      { x: 92, y: 208, kind: "grey", ghost: true },
      { x: 238, y: 206, kind: "grey", ghost: true },
      { x: 170, y: 214, kind: "grey", ghost: true },
      { x: 164, y: 134, kind: "core" },
    ],
  },
];

export const DIAGRAM_LEGEND = [
  { kind: "grey" as const, label: "Team at baseline" },
  { kind: "blue" as const, label: "Capability landed" },
  { kind: "cross" as const, label: "The operating model" },
];

export const QUOTES_HEADING = {
  eyebrow: "Real notes from real agencies and brands",
  titleA: "The whole room ",
  titleEm: "had something to say.",
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
  pre: "All in all:",
  main: "It works.",
};

export const PRESSER = {
  quote: "“We don't just teach the tools — we change how the operation runs. This is business transformation, not Midjourney training.”",
  attribution: "Jeremy Somers · Founder, NotContent",
  // [JEM: presser footage — 30–60s to camera. Drop the file at
  // public/videos/presser.mp4 and set videoSrc to activate.]
  videoSrc: null as string | null,
  placeholderImage: "/images/training/speaking-wide-1.webp",
  placeholderLabel: "[JEM: presser footage · 30–60 seconds to camera · lorem ipsum dolor sit amet]",
  soundHint: "Tap for sound",
  muteHint: "Tap to mute",
};

// "What else is included" — three columns with hairline icons.
export type IncludedIcon = "dashboard" | "support" | "clock";
export const INCLUDED = {
  eyebrow: "Beyond the eight sessions",
  title: "What else is included",
  columns: [
    {
      n: "01",
      icon: "dashboard" as IncludedIcon,
      title: "Training dashboard",
      items: [
        "Your custom plan",
        "Session wrap-ups",
        "Tools and prompts",
        "Recordings and access",
      ],
    },
    {
      n: "02",
      icon: "support" as IncludedIcon,
      title: "Consistent support throughout",
      items: [
        "Dedicated team Slack channel",
        "Direct message line to Jeremy",
        "24-hour turnaround, questions answered",
        "Workflow / creative-output reviews",
      ],
    },
    {
      n: "03",
      icon: "clock" as IncludedIcon,
      title: "2× office-hour sessions",
      note: "Weeks 3 and 7 add a second, non-compulsory open session.",
      items: [
        "Q&A",
        "Showcase work, get feedback",
        "Ask the questions that feel too small",
        "Live access to Jeremy",
      ],
    },
  ],
};

// The scrolling client marquee — mirrors the home page. Names published on the
// live site are cleared for public use.
export const LOGOS = {
  callout: "Creative clients include Adidas, Google, Cash App, Maesa, Tommy Hilfiger, Target.",
  names: [
    "Adidas",
    "Google",
    "Tommy Hilfiger",
    "Cash App",
    "Fine'ry",
    "Maesa",
    "SuperGoop",
    "Fazit Beauty",
    "Target",
  ],
};

export const FOOTER = {
  brand: "NotContent · training.notcontent.ai",
  links: [
    { label: "The full site", href: "/" },
    { label: "Case studies", href: "/results" },
  ],
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
