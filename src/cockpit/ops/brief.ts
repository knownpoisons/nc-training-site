// ═══════════════════════════════════════════════════════════════════════════════
// F1 — MORNING BRIEF. Build the day's actions, render them, post ONE message.
//
// Rules honoured here:
//   • Max 8 actions (BRIEF_CAP); overflow rolls to tomorrow.
//   • Never an empty brief — if nothing is due, post the lightest possible line.
//   • Records the posted brief (ordered action refs) so "done 3" resolves later.
// No AI: drafts are placeholders in Phase 2.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Day } from "../cadence/dates";
import type { CockpitStore, DueItem, PipelineValue, StoreProspect } from "../store/types";
import type { SlackClient } from "../slack/types";
import { buildBrief, wayIn, type BuiltAction } from "./actions";
import { generateDraft, OUTREACH_MAX_WORDS } from "../draft/engine";
import { findTemplate, type Lane } from "../draft/templates";
import type { DraftModel } from "../draft/model";
import type { Knowledge } from "../draft/knowledge";
import type { SourceEngine } from "../cadence/types";

export interface BriefResult {
  posted: boolean;
  actionCount: number;
  overflow: number;
  slackTs: string | null;
  empty: boolean;
  draftsGenerated: number;
  draftsNeedingReview: number;
}

/** F2 wiring for the live brief. When absent, the brief uses placeholder drafts. */
export interface DraftContext {
  model: DraftModel;
  knowledge: Knowledge;
}

// Until Engine Zero sets precise lanes, map the coarse source_engine to a lane.
function sourceToLane(source: SourceEngine): Lane {
  switch (source) {
    case "list":
      return "community";
    case "alumni":
      return "inbox";
    default:
      return "cold";
  }
}

export async function runMorningBrief(
  store: CockpitStore,
  slack: SlackClient,
  channel: string,
  today: Day,
  nowIso: string,
  draftCtx?: DraftContext
): Promise<BriefResult> {
  const items = await store.listDueItems(today);
  const { actions, overflow } = buildBrief(items);

  // The F1 stakes line + today's call-prep cards.
  const [stakes, calls] = await Promise.all([store.getPipelineValue(), store.getCallsForDay(today)]);

  let draftsGenerated = 0;
  let draftsNeedingReview = 0;
  if (draftCtx) {
    const byTouchId = new Map<string, DueItem>();
    for (const it of items) if (it.touch) byTouchId.set(it.touch.id, it);

    for (const a of actions) {
      if (a.kind !== "touch" || !a.touchId || a.touchNumber === null) continue;
      const item = byTouchId.get(a.touchId);
      if (!item?.touch) continue;
      // Touches 5–7 are the post-call follow-up cadence, whatever the source.
      const lane = a.touchNumber >= 5 ? "followup" : sourceToLane(item.prospect.sourceEngine);
      const template = findTemplate(lane, a.touchNumber);
      const out = await generateDraft(
        draftCtx.model,
        draftCtx.knowledge,
        {
          prospect: item.prospect,
          touchNumber: a.touchNumber,
          lane,
          templateBody: template?.body ?? a.draftText,
          maxWords: OUTREACH_MAX_WORDS,
          wayIn: wayIn(item.prospect),
          dossier: item.prospect.dossier ?? null,
          openerAngle: item.prospect.openerAngle ?? null,
        },
        // Only demand a [PERSONALISE] gap when there's NO material to fill it —
        // with a way-in or dossier, the AI writes the real line (not faking it).
        (template?.requirePersonalise ?? true) &&
          !(wayIn(item.prospect) || item.prospect.dossier)
      );
      a.draftText = out.requiresReview ? `${out.draft}\n⚠️ needs your eyes — couldn't auto-clear.` : out.draft;
      await store.setDraft(a.touchId, out.draft);
      draftsGenerated += 1;
      if (out.requiresReview) draftsNeedingReview += 1;
    }
  }

  const text =
    actions.length === 0
      ? [renderStakes(stakes), renderCallPrep(calls), renderEmptyBrief()].filter(Boolean).join("\n\n")
      : [renderStakes(stakes), renderCallPrep(calls), renderBrief(actions, overflow)].filter(Boolean).join("\n\n");
  const { ts } = await slack.postMessage(channel, text);

  await store.saveBrief({
    briefDate: today,
    slackChannel: channel,
    slackTs: ts,
    actions: actions.map((a) => ({
      n: a.n,
      kind: a.kind,
      prospectId: a.prospectId,
      touchId: a.touchId,
      touchNumber: a.touchNumber,
      label: a.label,
    })),
    postedAt: nowIso,
    lastInteractionAt: null,
    nudgedAt: null,
  });

  return {
    posted: true,
    actionCount: actions.length,
    overflow,
    slackTs: ts,
    empty: actions.length === 0,
    draftsGenerated,
    draftsNeedingReview,
  };
}

export function renderBrief(actions: BuiltAction[], overflow: number): string {
  const lines: string[] = [];
  const plural = actions.length === 1 ? "action" : "actions";
  lines.push(`*Morning brief* — ${actions.length} ${plural} today.`);
  lines.push("");
  for (const a of actions) {
    lines.push(`*${a.n}. ${a.label}*`);
    lines.push(`_${a.contextLine}_`);
    // Intel block — the context so Jem doesn't have to go research anyone.
    if (a.intel.wayIn) lines.push(`↳ *Way in:* ${a.intel.wayIn}`);
    if (a.intel.linkedinUrl) lines.push(`↳ ${a.intel.linkedinUrl}`);
    if (a.intel.dossier) lines.push(`↳ *Who they are:* ${a.intel.dossier}`);
    lines.push(`↳ \`show ${firstName(a.label)}\` for the full card`);
    lines.push("");
    lines.push(a.draftText);
    lines.push("");
  }
  lines.push("Reply as you go: `done 1 2`, `skip 3`, `replied 4`, `add [name, role, company]`.");
  if (overflow > 0) {
    lines.push(`(${overflow} more due — rolled to tomorrow to keep today at ${actions.length}.)`);
  }
  return lines.join("\n").trimEnd();
}

/** "Test Rae · touch 1" → "Test Rae" — the name for a `show` hint. */
function firstName(label: string): string {
  return label.split(" · ")[0];
}

/** F1's stakes line: pipeline vs target, plain numbers, no cheerleading. */
export function renderStakes(v: PipelineValue): string {
  const k = (n: number) => `$${Math.round(n / 1000)}k`;
  return (
    `*${k(v.wonValue)} closed of ${k(v.target)}* · ` +
    `${k(v.openValue)} in play across ${v.openCount} live conversation${v.openCount === 1 ? "" : "s"}.`
  );
}

/** Call-prep card(s) for any call booked today — dossier + history in one glance. */
export function renderCallPrep(calls: StoreProspect[]): string {
  if (!calls.length) return "";
  const blocks = calls.map((p) => {
    const who = [p.name, p.role, p.company].filter(Boolean).join(" · ");
    const L = [`📞 *Call today — ${who}*`];
    if (p.dossier) L.push(`Who they are: ${p.dossier}`);
    if (p.notes) L.push(`Your notes: ${p.notes.split("\n").slice(-3).join(" · ")}`);
    L.push(`Prep: \`show ${p.name}\` for the full history. PLAYBOOK: end the call with the next step booked.`);
    return L.join("\n");
  });
  return blocks.join("\n\n");
}

export function renderEmptyBrief(): string {
  // The "never an empty brief" rule: post the lightest possible line instead.
  return (
    "*Morning brief* — nothing due today.\n" +
    "One thing worth doing: add a prospect you've been meaning to reach — `add [name, role, company]`."
  );
}
