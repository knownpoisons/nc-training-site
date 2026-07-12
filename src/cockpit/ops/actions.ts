// ═══════════════════════════════════════════════════════════════════════════════
// BRIEF ACTIONS — order the day's work by value and cap at 8 (F1).
//
// Ordering (handoff: "replies to handle first, then warm, then cold touches"):
//   1. Replies awaiting a response — highest value, always first.
//   2. Touches, warmest first: later touch numbers (further along the sequence)
//      before earlier ones, then the longest-waiting prospect, then a stable id
//      tiebreak.
// Cap: 8 actions. Anything past 8 rolls to tomorrow (it simply reappears in the
// next brief — nothing is deleted).
// ═══════════════════════════════════════════════════════════════════════════════

import { compareDays } from "../cadence/dates";
import type { BriefActionRef, DueItem } from "../store/types";
import { placeholderDraft, placeholderReplyDraft } from "./drafts";

export const BRIEF_CAP = 8;

export interface BuiltAction extends BriefActionRef {
  contextLine: string;
  draftText: string;
}

export interface BuiltBrief {
  actions: BuiltAction[];
  overflow: number; // how many due items did NOT make today's cap
}

function orderItems(items: DueItem[]): DueItem[] {
  return [...items].sort((a, b) => {
    // replies first
    if (a.kind !== b.kind) return a.kind === "reply" ? -1 : 1;

    if (a.kind === "reply") {
      // among replies, longest-waiting prospect first
      const byAdded = compareDays(a.prospect.addedAt, b.prospect.addedAt);
      if (byAdded !== 0) return byAdded;
      return a.prospect.id < b.prospect.id ? -1 : 1;
    }

    // among touches: warmer (higher touch number) first
    const an = a.touch!.touchNumber;
    const bn = b.touch!.touchNumber;
    if (an !== bn) return bn - an;
    // then longest-waiting prospect
    const byAdded = compareDays(a.prospect.addedAt, b.prospect.addedAt);
    if (byAdded !== 0) return byAdded;
    return a.prospect.id < b.prospect.id ? -1 : 1;
  });
}

export function buildBrief(items: DueItem[]): BuiltBrief {
  const ordered = orderItems(items);
  const capped = ordered.slice(0, BRIEF_CAP);

  const actions: BuiltAction[] = capped.map((item, i) => {
    const n = i + 1;
    if (item.kind === "reply") {
      return {
        n,
        kind: "reply",
        prospectId: item.prospect.id,
        touchId: null,
        touchNumber: null,
        label: `${item.prospect.name} · reply`,
        contextLine: `${item.prospect.name} replied — draft a response and move this forward.`,
        draftText: placeholderReplyDraft(item.prospect),
      };
    }
    const touch = item.touch!;
    return {
      n,
      kind: "touch",
      prospectId: item.prospect.id,
      touchId: touch.id,
      touchNumber: touch.touchNumber,
      label: `${item.prospect.name} · touch ${touch.touchNumber}`,
      contextLine: contextForTouch(item),
      draftText: touch.draftText ?? placeholderDraft(item.prospect, touch),
    };
  });

  return { actions, overflow: Math.max(0, ordered.length - capped.length) };
}

function contextForTouch(item: DueItem): string {
  const t = item.touch!;
  const role = item.prospect.role ? `${item.prospect.role}, ` : "";
  const co = item.prospect.company ?? "—";
  const skips = t.skippedCount > 0 ? ` (skipped ${t.skippedCount}×)` : "";
  return `${role}${co} — touch ${t.touchNumber} of 4${skips}.`;
}
