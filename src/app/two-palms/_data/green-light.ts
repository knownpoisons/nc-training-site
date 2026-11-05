// Green Light: the AI policy game (Session 2, Brief, 10 Nov 2026).
// Eight real moments from a Two Palms week. Each one is green (fine), amber (careful) or red (no),
// and each answer quotes the policy line behind it (TPM-POL-001 V6, _data/policy.ts).
// Team-side rule: roles, never staff names.

export type Light = "green" | "amber" | "red";

export interface Moment {
  id: string;
  /** What's happening, in the second person, present tense. */
  text: string;
  answer: Light;
  /** The short verdict shown big on reveal. */
  verdict: string;
  /** Why, in one or two plain sentences. */
  why: string;
  /** The policy section it comes from. */
  rule: string;
}

export const LIGHTS: { key: Light; word: string; meaning: string; kbd: string }[] = [
  { key: "green", word: "Green", meaning: "Fine. Go for it.", kbd: "G" },
  { key: "amber", word: "Amber", meaning: "Careful. Check first.", kbd: "A" },
  { key: "red", word: "Red", meaning: "No. Stop.", kbd: "R" },
];

export const MOMENTS: Moment[] = [
  {
    id: "names",
    text: "You ask Claude for twenty names for an internal campaign, then pick your favourite three.",
    answer: "green",
    verdict: "Go for it.",
    why: "Internal work is exactly what it's for. Ideas, drafts, notes, decks, admin: use it as much as you like.",
    rule: "Use AI freely",
  },
  {
    id: "personal",
    text: "Claude is being slow, so you paste a client caption into your personal ChatGPT to tidy it up.",
    answer: "red",
    verdict: "Stop.",
    why: "Two Palms accounts only, never personal ones, for Two Palms or client work. Business accounts keep our data out of model training. Personal ones don't.",
    rule: "Use AI freely",
  },
  {
    id: "notetaker",
    text: "You start Granola on a call with the client's marketing team.",
    answer: "amber",
    verdict: "Ask first.",
    why: "Note-takers are fine, but ask outside guests before you start, and tell everyone it's on.",
    rule: "Client and personal information",
  },
  {
    id: "unread",
    text: "Claude drafts a reminder to an influencer about a late post. It looks fine, so you send it without reading it.",
    answer: "red",
    verdict: "Stop.",
    why: "You own what you ship. Read it, check it and stand behind it before it goes anywhere. There's no AI excuse.",
    rule: "One rule above all",
  },
  {
    id: "export",
    text: "You drop a sensitive client's full performance export into Claude to write their monthly recap.",
    answer: "amber",
    verdict: "Check first.",
    why: "Approved tools only, and only what the task needs. For clients with strict data terms, check with the Head of AI before anything goes in.",
    rule: "Client and personal information",
  },
  {
    id: "no-ai",
    text: "The client's AI level is No AI. You use Claude to write the first draft of their captions anyway. Nobody will know.",
    answer: "red",
    verdict: "Stop.",
    why: "Every client has an AI level, set at kick-off. If a client says no AI, that's the end of it. Client terms come first.",
    rule: "Clients and the work we sell",
  },
  {
    id: "creators",
    text: "Claude ranks forty creators for a campaign. You book the top five straight off its list.",
    answer: "red",
    verdict: "Stop.",
    why: "AI never makes decisions about people on its own: hiring, pay, performance, which creators we work with. Use the list, then a person decides and can explain why.",
    rule: "Hard no's",
  },
  {
    id: "oops",
    text: "You realise you pasted a client brief into the wrong AI tool. You tell the Head of AI the same day.",
    answer: "green",
    verdict: "Exactly right.",
    why: "Reporting a mistake quickly is never a problem. Hiding one is. Same day, every time.",
    rule: "When something goes wrong",
  },
];

/** Solo-play result, by score out of MOMENTS.length. Australian licence stages, for the Sydney office. */
export function licence(score: number, total = MOMENTS.length): { title: string; line: string } {
  if (score === total) return { title: "Full licence", line: "Clean run. You know the road rules." };
  if (score >= total - 2) return { title: "P-plates", line: "Nearly there. Read the policy once more and you're off them." };
  return { title: "L-plates", line: "Have another lap, then give the policy a proper read." };
}
