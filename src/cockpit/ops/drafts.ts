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
    `Placeholder body for touch ${touch.touchNumber} — real copy arrives in Phase 3. ` +
    `One CTA goes here.`
  );
}

export function placeholderReplyDraft(prospect: StoreProspect): string {
  return (
    `[Draft response to ${prospect.name}'s reply — real copy arrives in Phase 3.] ` +
    `Paste their message and I'll draft the answer.`
  );
}

/** A "rewrite" in Phase 2 just re-stamps the placeholder with the requested angle. */
export function placeholderRewrite(existing: string, angle: string | null): string {
  const tag = angle ? ` (rewritten: ${angle})` : " (rewritten)";
  return existing.replace(/\s*\(rewritten[^)]*\)$/, "") + tag;
}
