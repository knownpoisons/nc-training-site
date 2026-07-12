// ═══════════════════════════════════════════════════════════════════════════════
// F8 — THE NUDGE. 14:00. One line, once, only if the channel has been silent
// since the brief. Never twice. A guilt machine gets muted, so this is strict:
//   • Fires only when today's brief exists, has NO interaction, and hasn't
//     already nudged.
//   • Sets nudgedAt on the first fire so a second call is a no-op.
// Stakes are computed (how many actions still open), never motivational.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Day } from "../cadence/dates";
import type { CockpitStore } from "../store/types";
import type { SlackClient } from "../slack/types";

export interface NudgeResult {
  fired: boolean;
  reason: "sent" | "no-brief" | "already-interacted" | "already-nudged" | "nothing-open";
}

export async function runNudge(
  store: CockpitStore,
  slack: SlackClient,
  channel: string,
  today: Day,
  nowIso: string
): Promise<NudgeResult> {
  const brief = await store.getBrief(today);
  if (!brief) return { fired: false, reason: "no-brief" };
  if (brief.lastInteractionAt) return { fired: false, reason: "already-interacted" };
  if (brief.nudgedAt) return { fired: false, reason: "already-nudged" };

  const open = brief.actions.length;
  if (open === 0) return { fired: false, reason: "nothing-open" };

  const top = brief.actions[0];
  const text =
    `${open} still open from this morning. ` +
    `Highest-value one: *${top.label}*. ` +
    "Reply `done`, `skip`, or `snooze` when you've handled it.";

  // Post in the brief's thread if we have its ts, else top-level.
  if (brief.slackTs) await slack.postThreadReply(channel, brief.slackTs, text);
  else await slack.postMessage(channel, text);

  await store.markNudged(today, nowIso);
  return { fired: true, reason: "sent" };
}
