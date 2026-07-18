// ═══════════════════════════════════════════════════════════════════════════════
// MORNING SENTINEL — the watcher that runs OUTSIDE Vercel (a Claude Code
// scheduled task), so it can catch the app when the app itself is down. Pure
// reads: it never changes state. Returns a list of problems; an empty list means
// healthy, and the agent stays silent (no guilt-machine noise).
// ═══════════════════════════════════════════════════════════════════════════════

import type { CockpitStore } from "../store/types";
import { localParts } from "../runtime";

export interface SentinelIssue {
  severity: "alert" | "warn";
  title: string;
  detail: string;
}

/** Day-of-week from a YYYY-MM-DD string. 1 = Monday … 0 = Sunday. */
function dayOfWeek(day: string): number {
  return new Date(`${day}T00:00:00Z`).getUTCDay();
}

/** A name that's obviously garbage from a malformed `add` (the "[ jane, ecd]" class). */
function looksMalformed(name: string): boolean {
  const n = name.trim();
  if (n.length < 2) return true;
  if (/^[[({].*[\])}]?$/.test(n)) return true; // wrapped in brackets/parens
  if (/^[,;:]/.test(n) || /[,;:]$/.test(n)) return true; // leading/trailing punctuation
  if (!/[a-z]/i.test(n)) return true; // no letters at all
  return false;
}

/**
 * Run every health check against live data. `nowIso` is the current instant
 * (passed in so the check is deterministic and testable).
 */
export async function runSentinelChecks(
  store: CockpitStore,
  nowIso: string
): Promise<SentinelIssue[]> {
  const issues: SentinelIssue[] = [];
  const settings = await store.getSettings();
  const { day, hour } = localParts(settings.timezone, new Date(nowIso));

  // ── Did today's brief fire? Only judge once the brief hour has passed. ──────
  if (hour >= settings.briefHour) {
    const brief = await store.getBrief(day);
    if (!brief) {
      issues.push({
        severity: "alert",
        title: "Morning brief never ran",
        detail: `It's ${hour}:00 ${settings.timezone} and there's no brief row for ${day}. The daily cron didn't fire — check Vercel cron + /api/cockpit/health.`,
      });
    } else if (!brief.postedAt) {
      issues.push({
        severity: "alert",
        title: "Brief ran but didn't post",
        detail: `A brief row exists for ${day} but postedAt is null — the job started and failed before posting to Slack.`,
      });
    }

    // ── Monday: the lead digest should have posted too. ──────────────────────
    if (dayOfWeek(day) === 1) {
      const digest = await store.getDigest(day);
      if (!digest || !digest.postedAt) {
        issues.push({
          severity: "warn",
          title: "Monday digest missing",
          detail: `No posted digest for ${day}. The weekly lead review didn't land.`,
        });
      }
    }
  }

  // ── Garbage prospects from a malformed command. ─────────────────────────────
  const roster = await store.listRoster(500);
  const malformed = roster.filter((p) => looksMalformed(p.name));
  if (malformed.length > 0) {
    issues.push({
      severity: "warn",
      title: `${malformed.length} malformed prospect${malformed.length === 1 ? "" : "s"}`,
      detail: malformed
        .slice(0, 5)
        .map((p) => `"${p.name}" (${p.stage})`)
        .join(", ") + (malformed.length > 5 ? ", …" : ""),
    });
  }

  return issues;
}

/** Render issues as a Slack message. Returns null when there's nothing to say. */
export function renderSentinelAlert(issues: SentinelIssue[]): string | null {
  if (issues.length === 0) return null;
  const lines = ["🛰️ *Cockpit sentinel — something needs a look:*"];
  for (const i of issues) {
    const mark = i.severity === "alert" ? "🔴" : "🟡";
    lines.push(`${mark} *${i.title}* — ${i.detail}`);
  }
  return lines.join("\n");
}
