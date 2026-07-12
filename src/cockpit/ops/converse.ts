// ═══════════════════════════════════════════════════════════════════════════════
// F5 — CONVERSATIONAL HANDLER. When Jem types something that isn't a command,
// this is how he thinks out loud ("this one went cold after pricing — what's the
// move?"). It answers with the pipeline state + PLAYBOOK in context. It may
// PROPOSE actions in words, but it never claims to have taken one — commands do
// that, on Jem's explicit say-so.
// ═══════════════════════════════════════════════════════════════════════════════

import type { CockpitStore } from "../store/types";
import type { DraftModel } from "../draft/model";
import type { Knowledge } from "../draft/knowledge";
import type { Stage } from "../cadence/types";

function pipelineLine(counts: Record<Stage, number>): string {
  return (["NEW", "IN_SEQUENCE", "REPLIED", "CALL", "PROPOSAL", "WON", "LOST", "DORMANT"] as const)
    .map((s) => `${s} ${counts[s]}`)
    .join(", ");
}

export function buildConverseSystem(knowledge: Knowledge, counts: Record<Stage, number>): string {
  return [
    "You are the GTM Cockpit assistant for Jeremy Somers (Jem), a solo founder",
    "running B2B outreach for a creative-AI training programme. This is a Slack",
    "chat — Jem is thinking out loud. Answer in plain English, short and direct.",
    "",
    "You may PROPOSE a next action (e.g. 'want me to schedule a breakup touch for",
    "Friday?') but you must NOT claim to have done anything — only Jem's commands",
    "change state. If a command would do what he wants, tell him the command.",
    "",
    `Current pipeline: ${pipelineLine(counts)}.`,
    "",
    "Use this playbook for judgement on angle, objections, and qualification:",
    knowledge.playbook,
  ].join("\n");
}

export function makeConversationalResponder(
  store: CockpitStore,
  model: DraftModel,
  knowledge: Knowledge
): (text: string) => Promise<string> {
  return async (text: string) => {
    const counts = await store.pipelineCounts();
    const system = buildConverseSystem(knowledge, counts);
    return (await model.generate({ system, user: text, attempt: 0, violations: [] })).trim();
  };
}
