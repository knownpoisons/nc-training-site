import type { Tier, StackBucket } from "./logic";

// ═══════════════════════════════════════════════════════════════════════════════
// TIER COPY — headline, diagnosis, and what-to-do-next for each tier
// ═══════════════════════════════════════════════════════════════════════════════

export interface TierCopy {
  label: string;
  tagline: string;
  diagnosis: string;
  whatItMeans: string[];
}

export const tierCopy: Record<Tier, TierCopy> = {
  starting_line: {
    label: "STARTING LINE",
    tagline: "Your team hasn't meaningfully started with AI yet.",
    diagnosis:
      "That's actually an advantage. You get to skip the bad habits, the fragmented workflows, and the wasted spend on tools nobody uses. The teams that will win the next two years are the ones that start with a shared methodology — not ten people on ten different AI journeys.",
    whatItMeans: [
      "You haven't built any workflow debt yet — the ground is clean.",
      "A half-day session can get your whole team to the same baseline.",
      "Your biggest risk is waiting another six months while competitors pull ahead.",
    ],
  },
  two_speed: {
    label: "TWO-SPEED",
    tagline: "A few people carry the AI work. Everyone else is waiting.",
    diagnosis:
      "This is the most common — and most expensive — state we see. One or two champions figured it out, everyone else is watching. Output quality varies by maker. Work gets routed to whoever's fast, which creates bottlenecks and burns out your early adopters. You don't have a skills problem. You have a system problem.",
    whatItMeans: [
      "Your AI champions are doing work that should be shared across the team.",
      "Output inconsistency is already affecting client or leadership perception.",
      "Closing this gap unlocks 2–3× output without adding headcount.",
    ],
  },
  capable_but_exposed: {
    label: "CAPABLE BUT EXPOSED",
    tagline: "You're getting real value from AI — but the foundations haven't caught up.",
    diagnosis:
      "This is the plateau. The team is capable, the tools are in rotation, work is shipping. But governance is thin. Workflows aren't documented. There's no shared methodology — just parallel expertise that depends on individuals staying. One departure or one client compliance question and the whole thing wobbles. This is where most teams stall for 18 months.",
    whatItMeans: [
      "You have real capability but no durable system around it.",
      "Governance, IP, and disclosure exposure is growing quietly.",
      "Transformation-level work is what converts capability into a defensible operation.",
    ],
  },
  at_frontier: {
    label: "AT THE FRONTIER",
    tagline: "Your team is ahead of the curve. Now the question is how to lock it in.",
    diagnosis:
      "You're in the top decile. Tools, workflows, and a real AI culture are in place. The work to do now is operational: role-specific depth, governance hardening, and a documented methodology that survives team changes. The frontier keeps moving — the teams that stay out front are the ones that turn capability into infrastructure.",
    whatItMeans: [
      "Your advantage is real but not yet defensible without documentation.",
      "The next unlock is operational depth, not more tools.",
      "Transformation-level engagements typically 2× the impact of early wins.",
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STACK AUDIT COPY — Bucket A (light stack) / Bucket B (deep stack)
// ═══════════════════════════════════════════════════════════════════════════════

export interface StackAuditCopy {
  headline: string;
  body: string;
  takeaway: string;
}

export function getStackAuditCopy(
  bucket: StackBucket,
  count: number
): StackAuditCopy {
  if (bucket === "A") {
    return {
      headline: "Bucket A — Light Stack",
      body:
        "Your team has the basics but not much else. That's not a problem on its own — the biggest wins in AI come from methodology, not tool count. But as production ramps, you'll hit a ceiling with two or three tools. The right stack is part of what we build into every program.",
      takeaway:
        "Priority: build the workflow, then layer in the tools that match. Not the other way round.",
    };
  }
  return {
    headline: "Bucket B — Deep Stack",
    body: `You have ${count} AI tools in rotation but no unified system tying them together. This is the most common AI debt we see: paying for capability you're not fully using. Your team is likely duplicating work across tools, losing institutional knowledge when people leave, and spending without a clear ROI picture.`,
    takeaway:
      "Priority: audit, consolidate, and build a governed workflow across the tools that are actually earning their spend.",
  };
}
