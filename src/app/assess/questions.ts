// ═══════════════════════════════════════════════════════════════════════════════
// NOTCONTENT TRAINING — AI READINESS SCORECARD
// 10-question diagnostic across 3 dimensions: ADOPTION / READINESS / BLOCKERS
// Q6 = segmentation tag only (unscored)
// Q7 = stack audit (unscored, routes to Bucket A / Bucket B)
// ═══════════════════════════════════════════════════════════════════════════════

export type Dimension = "adoption" | "readiness" | "blockers" | "none";

export interface Option {
  label: string;
  points: number;
  dimension: Dimension;
  /** Optional segmentation tag for Q6 */
  tag?: string;
  /** Optional canonical tool id for Q7 stack audit */
  toolId?: string;
}

export type QuestionKind =
  | "single" // single-select, auto-advance
  | "multi" // multi-select, NEXT button to advance, scored by sum of selections
  | "stack"; // multi-select, unscored, routes stack audit bucket

export interface Question {
  id: number;
  section: string;
  sectionLabel: string; // "YOUR SITUATION · 1/4"
  text: string;
  kind: QuestionKind;
  options: Option[];
  /** Final question triggers results render + email send */
  isFinal?: boolean;
}

// ─── Q1 ───────────────────────────────────────────────────────────────────────
const q1: Question = {
  id: 1,
  section: "Your Situation",
  sectionLabel: "YOUR SITUATION · 1/4",
  text: "Where is your team with AI right now?",
  kind: "single",
  options: [
    { label: "We haven't started — this would be from scratch", points: 0, dimension: "adoption" },
    { label: "A few people experimenting on their own, nothing shared", points: 5, dimension: "adoption" },
    { label: "People use AI but every person does it differently", points: 10, dimension: "adoption" },
    { label: "We have something working, but it's not consistent across the team", points: 15, dimension: "adoption" },
  ],
};

// ─── Q2 ───────────────────────────────────────────────────────────────────────
const q2: Question = {
  id: 2,
  section: "Your Situation",
  sectionLabel: "YOUR SITUATION · 2/4",
  text: "How is that showing up day to day?",
  kind: "single",
  options: [
    { label: "It isn't yet — we're getting ahead of it", points: 15, dimension: "adoption" },
    { label: "One or two people carry the AI work, everyone else waits", points: 5, dimension: "adoption" },
    { label: "Output quality varies depending on who made it", points: 8, dimension: "adoption" },
    { label: "We're losing pitches or timelines to faster-moving teams", points: 3, dimension: "adoption" },
  ],
};

// ─── Q3 ───────────────────────────────────────────────────────────────────────
const q3: Question = {
  id: 3,
  section: "Your Situation",
  sectionLabel: "YOUR SITUATION · 3/4",
  text: "Has your team done any formal AI training before?",
  kind: "single",
  options: [
    { label: "No — nothing yet", points: 0, dimension: "readiness" },
    { label: "Informal only — tool tutorials, YouTube, self-taught", points: 5, dimension: "readiness" },
    { label: "Yes, but it didn't change how the team actually works", points: 8, dimension: "readiness" },
    { label: "Yes — and we're ready to go deeper", points: 10, dimension: "readiness" },
  ],
};

// ─── Q4 ───────────────────────────────────────────────────────────────────────
const q4: Question = {
  id: 4,
  section: "Your Situation",
  sectionLabel: "YOUR SITUATION · 4/4",
  text: "How urgent is this for you right now?",
  kind: "single",
  options: [
    { label: "Exploratory — we want to understand the landscape first", points: 3, dimension: "readiness" },
    { label: "Building — we want capability before we urgently need it", points: 7, dimension: "readiness" },
    { label: "Urgent — we have a launch or deadline in the next 2–3 months", points: 10, dimension: "readiness" },
    { label: "Critical — we're already behind and feeling it", points: 10, dimension: "readiness" },
  ],
};

// ─── Q5 ───────────────────────────────────────────────────────────────────────
const q5: Question = {
  id: 5,
  section: "Your Team",
  sectionLabel: "YOUR TEAM · 1/2",
  text: "How many people are you looking to train?",
  kind: "single",
  options: [
    { label: "5 or fewer", points: 3, dimension: "readiness" },
    { label: "6–15", points: 5, dimension: "readiness" },
    { label: "16–30", points: 5, dimension: "readiness" },
    { label: "30+", points: 5, dimension: "readiness" },
  ],
};

// ─── Q6 — UNSCORED · segmentation tag ─────────────────────────────────────────
const q6: Question = {
  id: 6,
  section: "Your Team",
  sectionLabel: "YOUR TEAM · 2/2",
  text: "What kind of creative work does your team primarily produce?",
  kind: "single",
  options: [
    { label: "Brand, campaigns, visual identity", points: 0, dimension: "none", tag: "brand" },
    { label: "Performance marketing — content at volume, across channels", points: 0, dimension: "none", tag: "performance" },
    { label: "Product, retail or e-commerce creative", points: 0, dimension: "none", tag: "retail" },
    { label: "Agency work — creative for external clients", points: 0, dimension: "none", tag: "agency" },
  ],
};

// ─── Q7 — STACK AUDIT · unscored · multi-select ───────────────────────────────
const q7: Question = {
  id: 7,
  section: "Your Stack",
  sectionLabel: "YOUR STACK · 1/4",
  text: "Which AI tools is your team currently paying for or actively using? Select everything that applies — even tools only one or two people use.",
  kind: "stack",
  options: [
    { label: "ChatGPT (OpenAI)", points: 0, dimension: "none", toolId: "chatgpt" },
    { label: "Claude (Anthropic)", points: 0, dimension: "none", toolId: "claude" },
    { label: "Midjourney", points: 0, dimension: "none", toolId: "midjourney" },
    { label: "Adobe Firefly / Adobe AI features", points: 0, dimension: "none", toolId: "adobe_firefly" },
    { label: "DALL-E", points: 0, dimension: "none", toolId: "dalle" },
    { label: "Runway", points: 0, dimension: "none", toolId: "runway" },
    { label: "Kling", points: 0, dimension: "none", toolId: "kling" },
    { label: "Sora", points: 0, dimension: "none", toolId: "sora" },
    { label: "ElevenLabs", points: 0, dimension: "none", toolId: "elevenlabs" },
    { label: "Canva AI", points: 0, dimension: "none", toolId: "canva_ai" },
    { label: "Jasper, Copy.ai or similar AI writing tools", points: 0, dimension: "none", toolId: "ai_writing" },
    { label: "Notion AI, ClickUp AI or similar productivity AI", points: 0, dimension: "none", toolId: "productivity_ai" },
    { label: "GitHub Copilot or similar code AI", points: 0, dimension: "none", toolId: "code_ai" },
    { label: "None yet", points: 0, dimension: "none", toolId: "none" },
  ],
};

// ─── Q8 ───────────────────────────────────────────────────────────────────────
const q8: Question = {
  id: 8,
  section: "Your Stack",
  sectionLabel: "YOUR STACK · 2/4",
  text: "Roughly how much is your team spending on AI tools per month in total?",
  kind: "single",
  options: [
    { label: "Under $100", points: 3, dimension: "blockers" },
    { label: "$100–$500", points: 7, dimension: "blockers" },
    { label: "$500–$2,000", points: 10, dimension: "blockers" },
    { label: "$2,000+", points: 10, dimension: "blockers" },
    { label: "Honestly, we don't know", points: 5, dimension: "blockers" },
  ],
};

// ─── Q9 — multi-select, scored by sum ─────────────────────────────────────────
const q9: Question = {
  id: 9,
  section: "Your Stack",
  sectionLabel: "YOUR STACK · 3/4",
  text: "What's the biggest thing getting in the way of AI adoption right now? Select all that apply.",
  kind: "multi",
  options: [
    { label: "No shared methodology — everyone doing their own thing", points: 0, dimension: "blockers" },
    { label: "Skills gap — people don't know how to use the tools well", points: 3, dimension: "blockers" },
    { label: "Governance concerns — data security, IP rights, client disclosure", points: 5, dimension: "blockers" },
    { label: "No clear mandate — leadership hasn't fully committed", points: 3, dimension: "blockers" },
    { label: "Time — hard to learn properly alongside existing workload", points: 5, dimension: "blockers" },
  ],
};

// ─── Q10 — FINAL ──────────────────────────────────────────────────────────────
const q10: Question = {
  id: 10,
  section: "Your Stack",
  sectionLabel: "YOUR STACK · 4/4",
  text: "What does success look like for your team 90 days from now?",
  kind: "single",
  isFinal: true,
  options: [
    { label: "We understand what's possible and have made a clear investment decision", points: 5, dimension: "readiness" },
    { label: "A meaningful portion of the team has practical AI skills they use regularly", points: 10, dimension: "readiness" },
    { label: "Everyone follows the same methodology with governance in place", points: 13, dimension: "readiness" },
    { label: "Our team independently runs AI-assisted production on live campaigns", points: 15, dimension: "readiness" },
  ],
};

export const questions: Question[] = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];

// ─── Dimension maxes ──────────────────────────────────────────────────────────
// Adoption  (Q1 + Q2)            max 30 pts
// Readiness (Q3 + Q4 + Q5 + Q10) max 40 pts
// Blockers  (Q8 + Q9)            max 26 pts
// Total raw                      max 96 pts → normalised to 100 on display

export const DIMENSION_MAX = {
  adoption: 30,
  readiness: 40,
  blockers: 26,
} as const;

export const RAW_MAX = 96;
