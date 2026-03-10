// Each option scores independently toward each program.
// The quiz recommends whichever program scores highest overall.

export type Program = "foundations" | "accelerator" | "transformation";

export interface Option {
  label: string;
  scores: Record<Program, number>;
}

export interface Question {
  id: number;
  section: string;
  sectionIndex: number;
  sectionTotal: number;
  text: string;
  options: Option[];
  multiSelect?: boolean; // true = select all that apply
}

export const questions: Question[] = [
  // ─────────────────────────────────────────────────────────────
  // SECTION 1: YOUR GOAL (Q1–Q3) — multi-select
  // ─────────────────────────────────────────────────────────────
  {
    id: 1,
    section: "Your Goal",
    sectionIndex: 1,
    sectionTotal: 4,
    multiSelect: true,
    text: "What do you most want AI training to achieve for your team?",
    options: [
      {
        label: "Increase creative output — more work, faster, without more headcount",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "Replace or reduce what we spend on external production",
        scores: { foundations: 0, accelerator: 1, transformation: 5 },
      },
      {
        label: "Give the team AI skills to work alongside what they already do",
        scores: { foundations: 2, accelerator: 5, transformation: 1 },
      },
      {
        label: "Move faster — hit a launch deadline or compress timelines",
        scores: { foundations: 0, accelerator: 4, transformation: 2 },
      },
      {
        label: "Create structure around AI that's already happening ad-hoc",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "Understand what's possible before we commit to anything bigger",
        scores: { foundations: 5, accelerator: 2, transformation: 0 },
      },
    ],
  },
  {
    id: 2,
    section: "Your Goal",
    sectionIndex: 2,
    sectionTotal: 4,
    multiSelect: true,
    text: "What does success look like 90 days from now?",
    options: [
      {
        label: "Our team independently runs AI-assisted production on real campaigns",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "A meaningful portion of the team has practical AI skills they use regularly",
        scores: { foundations: 1, accelerator: 5, transformation: 2 },
      },
      {
        label: "We've shipped something real with AI and proved the ROI to leadership",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "Everyone follows the same methodology and we have a governance policy",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "We understand AI's potential and have made a clear investment decision",
        scores: { foundations: 5, accelerator: 2, transformation: 0 },
      },
    ],
  },
  {
    id: 3,
    section: "Your Goal",
    sectionIndex: 3,
    sectionTotal: 4,
    multiSelect: true,
    text: "How significant is the change you're actually looking for?",
    options: [
      {
        label: "Transformational — AI permanently embedded in how we operate",
        scores: { foundations: 0, accelerator: 0, transformation: 6 },
      },
      {
        label: "Meaningful — a real capability shift across the whole team",
        scores: { foundations: 0, accelerator: 4, transformation: 3 },
      },
      {
        label: "Targeted — skills for specific people or specific workflows",
        scores: { foundations: 3, accelerator: 4, transformation: 0 },
      },
      {
        label: "Exploratory — we need to understand the landscape before deciding",
        scores: { foundations: 6, accelerator: 1, transformation: 0 },
      },
    ],
  },

  {
    id: 4,
    section: "Your Goal",
    sectionIndex: 4,
    sectionTotal: 4,
    multiSelect: true,
    text: "Why does it matter that your whole team goes through this together — not just a few individuals?",
    options: [
      {
        label: "One person using AI well creates a two-speed team — and two-speed teams produce inconsistent work",
        scores: { foundations: 0, accelerator: 3, transformation: 5 },
      },
      {
        label: "Workflows only change when everyone changes — individual skills don't shift how the operation runs",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "We want to be in the first wave of teams that figures this out — not catching up in two years",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "This is the biggest shift in creative work in my lifetime — I want us to rise through it together",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "Practically: the ROI only works if everyone can execute independently, not just the champions",
        scores: { foundations: 0, accelerator: 4, transformation: 3 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // SECTION 2: YOUR TEAM (Q5–Q7) — single select
  // ─────────────────────────────────────────────────────────────
  {
    id: 5,
    section: "Your Team",
    sectionIndex: 1,
    sectionTotal: 3,
    text: "Where is your team with AI right now?",
    options: [
      {
        label: "Zero — we haven't started, this would be from scratch",
        scores: { foundations: 3, accelerator: 2, transformation: 1 },
      },
      {
        label: "Early — a few people experimenting on their own",
        scores: { foundations: 2, accelerator: 3, transformation: 2 },
      },
      {
        label: "Active but fragmented — people use AI but there's no shared system",
        scores: { foundations: 0, accelerator: 3, transformation: 3 },
      },
      {
        label: "Capable but limited — we have something working, need to scale it",
        scores: { foundations: 0, accelerator: 2, transformation: 4 },
      },
    ],
  },
  {
    id: 6,
    section: "Your Team",
    sectionIndex: 2,
    sectionTotal: 3,
    text: "How many people are you looking to train?",
    options: [
      {
        label: "5 or fewer",
        scores: { foundations: 3, accelerator: 2, transformation: 1 },
      },
      {
        label: "6–15 people",
        scores: { foundations: 1, accelerator: 3, transformation: 2 },
      },
      {
        label: "16–30 people",
        scores: { foundations: 0, accelerator: 2, transformation: 4 },
      },
      {
        label: "30+ people",
        scores: { foundations: 0, accelerator: 1, transformation: 5 },
      },
    ],
  },
  {
    id: 7,
    section: "Your Team",
    sectionIndex: 3,
    sectionTotal: 3,
    text: "Is there a project or deadline pushing this?",
    options: [
      {
        label: "Yes — something major in the next 4–8 weeks",
        scores: { foundations: 1, accelerator: 5, transformation: 1 },
      },
      {
        label: "Yes — something in the next 2–4 months",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "No — building capability before we urgently need it",
        scores: { foundations: 3, accelerator: 3, transformation: 2 },
      },
      {
        label: "We should have done this already — we're behind",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // SECTION 3: YOUR CONTEXT (Q8–Q12) — multi-select
  // ─────────────────────────────────────────────────────────────
  {
    id: 8,
    section: "Your Context",
    sectionIndex: 1,
    sectionTotal: 5,
    multiSelect: true,
    text: "What's the biggest obstacle to AI adoption on your team right now?",
    options: [
      {
        label: "No shared methodology — everyone doing their own thing",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "Skills gap — people don't know how to use the tools well",
        scores: { foundations: 2, accelerator: 4, transformation: 2 },
      },
      {
        label: "Governance — concerned about data, rights, or client disclosure",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "Leadership buy-in — no clear mandate from above",
        scores: { foundations: 4, accelerator: 2, transformation: 1 },
      },
      {
        label: "Time — hard to learn properly alongside existing workload",
        scores: { foundations: 2, accelerator: 4, transformation: 2 },
      },
    ],
  },
  {
    id: 9,
    section: "Your Context",
    sectionIndex: 2,
    sectionTotal: 5,
    multiSelect: true,
    text: "Has your team done any formal AI training before?",
    options: [
      {
        label: "No — this would be a first",
        scores: { foundations: 3, accelerator: 3, transformation: 1 },
      },
      {
        label: "Basic tool tutorials — Midjourney, ChatGPT — no methodology",
        scores: { foundations: 1, accelerator: 3, transformation: 3 },
      },
      {
        label: "Something more structured, but it didn't really stick",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "Internal-only sessions — we need external expertise now",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
    ],
  },
  {
    id: 10,
    section: "Your Context",
    sectionIndex: 3,
    sectionTotal: 5,
    multiSelect: true,
    text: "What kind of creative work does your team primarily produce?",
    options: [
      {
        label: "Brand campaigns, visual identity, editorial",
        scores: { foundations: 2, accelerator: 3, transformation: 3 },
      },
      {
        label: "Performance marketing — content at volume, across channels",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "Product launches, retail or e-commerce creative",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "Agency work — creative for external clients",
        scores: { foundations: 2, accelerator: 4, transformation: 2 },
      },
    ],
  },
  {
    id: 11,
    section: "Your Context",
    sectionIndex: 4,
    sectionTotal: 5,
    multiSelect: true,
    text: "Which AI tools does your team currently use or have experience with?",
    options: [
      {
        label: "ChatGPT or Claude — language, copy, briefs",
        scores: { foundations: 1, accelerator: 3, transformation: 2 },
      },
      {
        label: "Midjourney, DALL-E or Firefly — image generation",
        scores: { foundations: 1, accelerator: 3, transformation: 2 },
      },
      {
        label: "Adobe AI features — Generative Fill, Firefly in workflow",
        scores: { foundations: 1, accelerator: 2, transformation: 3 },
      },
      {
        label: "Video or audio AI — Runway, Sora, ElevenLabs",
        scores: { foundations: 0, accelerator: 2, transformation: 4 },
      },
      {
        label: "None — we haven't started with any AI tools yet",
        scores: { foundations: 5, accelerator: 1, transformation: 0 },
      },
    ],
  },
  {
    id: 12,
    section: "Your Context",
    sectionIndex: 5,
    sectionTotal: 5,
    multiSelect: true,
    text: "How is uneven AI adoption showing up on your team right now?",
    options: [
      {
        label: "We have a two-speed team — a few AI champions and everyone else standing still",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "Work quality is inconsistent — different people, different tools, no shared standard",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "People are experimenting in silos — nothing gets shared or scaled",
        scores: { foundations: 0, accelerator: 2, transformation: 5 },
      },
      {
        label: "There's anxiety, avoidance or quiet resentment around AI on the team",
        scores: { foundations: 2, accelerator: 3, transformation: 3 },
      },
      {
        label: "We're losing time and competitive ground waiting for everyone to catch up",
        scores: { foundations: 0, accelerator: 3, transformation: 4 },
      },
      {
        label: "None of these — our team is already pulling in the same direction",
        scores: { foundations: 3, accelerator: 2, transformation: 1 },
      },
    ],
  },
];
