// ═══════════════════════════════════════════════════════════════════════════════
// SEED TEMPLATES — mirrors SEQUENCES.md. These are the starting bodies the Draft
// Engine works from; once the cockpit_templates table is populated (Jem edits
// via Slack), the store's version wins. Lane + touch number → template body.
// ═══════════════════════════════════════════════════════════════════════════════

export type Lane = "cold" | "scorecard" | "community" | "inbox" | "engager";

export interface TemplateSeed {
  lane: Lane;
  touchNumber: number;
  body: string;
  requirePersonalise: boolean;
}

export const TEMPLATE_SEEDS: TemplateSeed[] = [
  // Base cold sequence (days 1, 4, 12, 21)
  { lane: "cold", touchNumber: 1, requirePersonalise: true, body:
    "[PERSONALISE — one line proving you looked: campaign, hire, announcement]. I train creative teams to work with AI properly — thought your team might be at that point. No pitch, just connecting." },
  { lane: "cold", touchNumber: 2, requirePersonalise: true, body:
    "[PERSONALISE — reference their reply or their work]. One number from the work: [PROOF STAT]. No reason that couldn't be [COMPANY] — a focused set of AI training sessions built around your slowest, costliest, most annoying processes. Want to see where your team stands first? Two minutes, no pitch: [SCORECARD LINK]." },
  { lane: "cold", touchNumber: 3, requirePersonalise: false, body:
    "Quick one, [NAME] — off the top of your head, name 3 processes that: take the most time, cost the most money, and annoy you the most. I'll tell you straight which we can automate, and which we can't. [TWO TIME OPTIONS] if it's easier to just talk." },
  { lane: "cold", touchNumber: 4, requirePersonalise: false, body:
    "Closing the loop — if the timing's wrong, no problem at all. The door's open when the team's ready. [ONE LINE: what to watch for that signals it's time]." },

  // Scorecard follow-up (2-touch)
  { lane: "scorecard", touchNumber: 1, requirePersonalise: false, body:
    "You took the readiness scorecard — scored [SCORE]. Your biggest flag was [BIG ISSUE]. That's usually where the time and money quietly leak. Give me 15 minutes and I'll show you exactly where it's biting and how we'd fix it — [TWO TIME OPTIONS]." },
  { lane: "scorecard", touchNumber: 2, requirePersonalise: false, body:
    "Closing the loop. Door's open — one line on what to watch for when the timing's right." },

  // Community "never launched" (2-touch)
  { lane: "community", touchNumber: 1, requirePersonalise: true, body:
    "A while back you signed up to hear about a creative × AI community I was starting. I never launched it. Not because the idea died — because the work took over. [ONE PROOF LINE]. I'm [PERSONALISE: why them specifically] — wanted to reconnect properly rather than add you to a list." },
  { lane: "community", touchNumber: 2, requirePersonalise: false, body:
    "Last note on this — honest one. Door's open when the timing's right." },

  // Inbox re-open (1-touch, heavy personalisation)
  { lane: "inbox", touchNumber: 1, requirePersonalise: true, body:
    "[PERSONALISE: reference the actual last exchange]. Wanted to pick the thread back up properly." },

  // LinkedIn engager (3-touch)
  { lane: "engager", touchNumber: 1, requirePersonalise: true, body:
    "You commented on [PERSONALISE: the actual post/topic] — [one line continuing that thread]. No pitch." },
  { lane: "engager", touchNumber: 2, requirePersonalise: false, body:
    "One number from the work: [PROOF STAT]. Two minutes, no pitch, tells you where your team stands: [SCORECARD LINK]." },
  { lane: "engager", touchNumber: 3, requirePersonalise: false, body:
    "Direct question or closing the loop — [PLAYBOOK: pick based on their response]. Worth 15 minutes? [TWO TIME OPTIONS]." },
];

export function findTemplate(lane: Lane, touchNumber: number): TemplateSeed | null {
  return TEMPLATE_SEEDS.find((t) => t.lane === lane && t.touchNumber === touchNumber) ?? null;
}
