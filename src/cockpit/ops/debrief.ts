// ═══════════════════════════════════════════════════════════════════════════════
// CALL DEBRIEF — distil a transcript into a compact call brief, file it on the
// card. Two entry points share this logic: the manual Slack paste flow
// (consumeCallDebrief in handle.ts) and the automated Granola sync (fileDebrief,
// called by the /debrief-sync agent). Both write the identical shape so the
// day-2/7/30 follow-ups fill their [CALL DETAIL] marker the same way.
// ═══════════════════════════════════════════════════════════════════════════════

import type { CockpitStore } from "../store/types";
import type { Day } from "../cadence/dates";
import type { DraftModel } from "../draft/model";

export const DISTILL_SYSTEM = [
  "You distill a sales-call transcript into a compact call brief for a CRM card.",
  "Return EXACTLY this format, one line each, no preamble:",
  "CARED: <what they actually cared about>",
  "OBJECTIONS: <objections raised, or 'none'>",
  "PERSONAL: <personal details worth remembering, or 'none'>",
  "NEXT: <the agreed next step, or 'none agreed'>",
  "READ: <one-line temperature read>",
  "Be concrete and quote their words where it matters. Never invent.",
].join("\n");

/** Run the distillation. Falls back to raw notes if the model isn't available or errors. */
export async function distillCallBrief(
  model: DraftModel | null,
  prospect: { name: string; company: string | null },
  transcript: string,
  today: Day
): Promise<string> {
  if (!model) return `raw notes (${today}): ${transcript.slice(0, 600)}`;
  try {
    return (
      await model.generate({
        system: DISTILL_SYSTEM,
        user: `Call with ${prospect.name}${prospect.company ? ` (${prospect.company})` : ""}. Transcript/notes:\n\n${transcript.slice(0, 24000)}`,
        attempt: 0,
        violations: [],
      })
    ).trim();
  } catch {
    return `raw notes (${today}): ${transcript.slice(0, 600)}`;
  }
}

export interface FiledDebrief {
  prospectId: string;
  prospectName: string;
  callBrief: string;
}

/**
 * The full write path for an automated debrief: log the transcript, distil the
 * brief, put it on the card, note it. Mirrors consumeCallDebrief exactly but with
 * no Slack side — the Granola sync files silently and reports afterwards.
 * Returns null if the prospect vanished.
 */
export async function fileDebrief(
  store: CockpitStore,
  model: DraftModel | null,
  prospectId: string,
  transcript: string,
  opts: { today: Day; nowIso: string; noteSource?: string }
): Promise<FiledDebrief | null> {
  const p = await store.getProspect(prospectId);
  if (!p) return null;

  await store.logEvent(prospectId, "call_debrief", { text: transcript.slice(0, 12000) }, opts.nowIso);
  const callBrief = await distillCallBrief(model, { name: p.name, company: p.company }, transcript, opts.today);
  await store.updateProspect(prospectId, { callBrief });
  await store.appendNote(prospectId, `${opts.today} call debrief ${opts.noteSource ?? "captured"}`);

  return { prospectId, prospectName: p.name, callBrief };
}
