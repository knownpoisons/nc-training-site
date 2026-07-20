// ═══════════════════════════════════════════════════════════════════════════════
// PLACEHOLDER DRAFTS — Phase 2 only. No AI yet (that is Phase 3, F2).
//
// These stand-in drafts carry the real *shape* a draft must have — the
// [PERSONALISE] marker and a one-line context — so the brief format, command
// round-trips, and Slack rendering are all exercised now. Phase 3 swaps this
// module for the Claude-backed Draft Engine; nothing else changes.
// ═══════════════════════════════════════════════════════════════════════════════

import type { StoreProspect, StoreTouch } from "../store/types";

export function placeholderDraft(prospect: StoreProspect, touch: StoreTouch): string {
  const who = prospect.name + (prospect.company ? `, ${prospect.company}` : "");
  return (
    `[PERSONALISE — one line proving you looked at ${who}]. ` +
    `Draft for touch ${touch.touchNumber} couldn't be written just now — ` +
    `write it yourself, or say \`rewrite ${touch.touchNumber}\` to try again.`
  );
}

/**
 * A reply can't be answered until we know what they said — so the brief asks for
 * it rather than inventing one. `replied N` + the pasted message returns a real
 * drafted response immediately.
 */
export function replyPrompt(prospect: StoreProspect, actionNumber?: number): string {
  const cmd = actionNumber ? `replied ${actionNumber}` : "replied <number>";
  return (
    `${prospect.name} is waiting on you. Say \`${cmd}\` and paste what they wrote — ` +
    `I'll draft the answer in your voice.`
  );
}

/** A "rewrite" in Phase 2 just re-stamps the placeholder with the requested angle. */
export function placeholderRewrite(existing: string, angle: string | null): string {
  const tag = angle ? ` (rewritten: ${angle})` : " (rewritten)";
  return existing.replace(/\s*\(rewritten[^)]*\)$/, "") + tag;
}
