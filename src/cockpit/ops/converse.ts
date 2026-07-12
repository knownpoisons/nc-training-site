// ═══════════════════════════════════════════════════════════════════════════════
// F5 — CONVERSATIONAL HANDLER. When Jem types something that isn't a command,
// this is how he thinks out loud ("this one went cold after pricing — what's the
// move?"). It answers with the pipeline state + PLAYBOOK in context. It may
// PROPOSE actions in words, but it never claims to have taken one — commands do
// that, on Jem's explicit say-so.
// ═══════════════════════════════════════════════════════════════════════════════

import type { CockpitStore, RosterEntry } from "../store/types";
import type { DraftModel } from "../draft/model";
import type { Knowledge } from "../draft/knowledge";
import type { Stage } from "../cadence/types";

function pipelineLine(counts: Record<Stage, number>): string {
  return (["NEW", "IN_SEQUENCE", "REPLIED", "CALL", "PROPOSAL", "WON", "LOST", "DORMANT"] as const)
    .map((s) => `${s} ${counts[s]}`)
    .join(", ");
}

export function buildConverseSystem(
  knowledge: Knowledge,
  counts: Record<Stage, number>,
  roster: RosterEntry[]
): string {
  const rosterLines = roster.length
    ? roster
        .map((r) => {
          const who = [r.name, r.role, r.company].filter(Boolean).join(", ");
          const meta = [r.stage, r.tier ? `tier ${r.tier}` : null, r.score != null ? `score ${Math.round(r.score)}` : null, r.sources.length ? r.sources.join("+") : null]
            .filter(Boolean)
            .join(" · ");
          return `• ${who} — ${meta}`;
        })
        .join("\n")
    : "(no prospects yet)";

  return [
    "You are the GTM Cockpit assistant for Jeremy Somers (Jem), a solo founder",
    "running B2B outreach for a creative-AI training programme. This is a Slack",
    "chat — Jem is thinking out loud, or asking about his pipeline. Answer in",
    "plain English, short and direct. Answer questions about specific people or",
    "the pipeline using the DATA below — never invent a prospect or a number.",
    "For one person's full history, tell Jem to type `show <name>`.",
    "",
    "You may PROPOSE a next action but must NOT claim to have done anything —",
    "only Jem's commands change state. If a command does what he wants, name it.",
    "",
    `Pipeline counts: ${pipelineLine(counts)}.`,
    "",
    "Prospects (by score):",
    rosterLines,
    "",
    "Playbook for judgement on angle, objections, and qualification:",
    knowledge.playbook,
  ].join("\n");
}

export function makeConversationalResponder(
  store: CockpitStore,
  model: DraftModel,
  knowledge: Knowledge
): (text: string) => Promise<string> {
  return async (text: string) => {
    const [counts, roster] = await Promise.all([store.pipelineCounts(), store.listRoster(40)]);
    const system = buildConverseSystem(knowledge, counts, roster);
    return (await model.generate({ system, user: text, attempt: 0, violations: [] })).trim();
  };
}
