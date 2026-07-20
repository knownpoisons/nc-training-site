// ═══════════════════════════════════════════════════════════════════════════════
// F11 — WEEKLY LEAD DIGEST (Monday, before the Morning Brief). Top 10 queued
// leads by score. Jem replies "promote 1 3 4" / "bin 2" / "hold 5". Promoted
// leads enter their source-matched sequence within the weekly volume cap;
// overflow staggers into coming weeks (governor). This is the ONLY door out of
// the reviewed queue — nothing sequences itself.
// ═══════════════════════════════════════════════════════════════════════════════

import { mondayOf, sundayOf, type Day } from "../cadence/dates";
import type { CockpitStore, SavedDigest, StoreProspect } from "../store/types";
import type { SlackClient } from "../slack/types";
import { assignPromotionDates } from "./governor";

export const DIGEST_SIZE = 10;

const LANE_FOR_SOURCE: Record<string, string> = {
  scorecard: "Scorecard follow-up",
  community: "Community 'never launched'",
  inbox: "Inbox re-open",
  linkedin: "LinkedIn engager",
  beehiiv: "broadcast only — needs a signal first",
};

function proposedLane(p: StoreProspect): string {
  const primary = (p.sources ?? [])[0];
  return (primary && LANE_FOR_SOURCE[primary]) || "cold outbound";
}

export interface DigestResult {
  posted: boolean;
  count: number;
  slackTs: string | null;
}

export async function runWeeklyDigest(
  store: CockpitStore,
  slack: SlackClient,
  channel: string,
  digestDate: Day,
  nowIso: string
): Promise<DigestResult> {
  const leads = await store.getQueuedLeads(DIGEST_SIZE);
  const text = leads.length === 0 ? renderEmptyDigest() : renderDigest(leads);
  const { ts } = await slack.postMessage(channel, text);

  await store.saveDigest({
    digestDate,
    slackTs: ts,
    actions: leads.map((p, i) => ({ n: i + 1, prospectId: p.id, label: `${p.name}${p.company ? ` · ${p.company}` : ""}` })),
    postedAt: nowIso,
  });
  return { posted: true, count: leads.length, slackTs: ts };
}

export function renderDigest(leads: StoreProspect[]): string {
  const lines: string[] = [];
  lines.push(`*Weekly lead digest* — top ${leads.length} to review.`);
  lines.push("");
  leads.forEach((p, i) => {
    const srcs = (p.sources ?? []).join(" + ") || "—";
    lines.push(`*${i + 1}. ${p.name}${p.company ? ` · ${p.company}` : ""}*  [${p.tier ?? "?"} · ${Math.round(p.score ?? 0)}]`);
    lines.push(`_${p.role ?? "role unknown"} · sources: ${srcs} · lane: ${proposedLane(p)}_`);
    lines.push(p.dossier ?? "No dossier yet.");
    lines.push("");
  });
  lines.push("Reply `promote 1 3 4`, `bin 2`, or `hold 5`. Promotions respect the weekly cap.");
  return lines.join("\n").trimEnd();
}

export function renderEmptyDigest(): string {
  return "*Weekly lead digest* — the queue is empty. Engine Zero fills this as leads come in.";
}

/** Resolve a digest index to its lead id. */
export function resolveDigest(digest: SavedDigest | null, n: number): string | null {
  return digest?.actions.find((a) => a.n === n)?.prospectId ?? null;
}

export interface PromotionSummary {
  promotedThisWeek: string[];
  deferred: Array<{ label: string; date: Day }>;
  /** Refused because they're broadcast_only (newsletter/list consent). */
  blocked?: string[];
}

/**
 * Promote a set of leads, staggering across weeks per the volume cap. Returns
 * what landed this week and what was pushed out (so the digest handler can say
 * so — never a silent cap).
 */
export async function promoteLeads(
  store: CockpitStore,
  prospectIds: string[],
  today: Day,
  weeklyVolume: number,
  reason: string
): Promise<PromotionSummary> {
  const alreadyThisWeek = await store.countPromotedInWeek(mondayOf(today), sundayOf(today));
  const dates = assignPromotionDates(prospectIds.length, alreadyThisWeek, weeklyVolume, today);

  const summary: PromotionSummary = { promotedThisWeek: [], deferred: [] };
  for (let i = 0; i < prospectIds.length; i++) {
    const id = prospectIds[i];
    const date = dates[i];
    const p = await store.getProspect(id);

    // Consent rule, enforced in code: someone who only ever agreed to a
    // newsletter cannot be dropped into a 1:1 outreach sequence. They shouldn't
    // reach the digest at all — this is the second lock on the same door.
    if (p?.consentLane === "broadcast_only") {
      summary.blocked = summary.blocked ?? [];
      summary.blocked.push(p.name);
      continue;
    }

    await store.promoteLead(id, date, reason);
    const label = p?.name ?? id;
    if (date === today) summary.promotedThisWeek.push(label);
    else summary.deferred.push({ label, date });
  }
  return summary;
}
