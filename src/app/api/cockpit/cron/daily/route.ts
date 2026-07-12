import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { runMorningBrief, type DraftContext } from "@/cockpit/ops/brief";
import { runWeeklyDigest } from "@/cockpit/ops/digest";
import { computeScoreboard, renderScoreboard } from "@/cockpit/ops/scoreboard";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";
import { dayOfWeek, mondayOf, sundayOf, compareDays } from "@/cockpit/cadence/dates";

// FREE-PLAN morning run. Vercel Hobby allows only 2 daily cron jobs, so this one
// endpoint does the lot each morning: Monday's lead digest, Friday's scoreboard,
// then the Morning Brief. (The afternoon Nudge is the 2nd cron.) Fires once at a
// fixed time — no hour-gating; dedupe guards prevent double-posting.
// Heavy/slow jobs (Tier-A enrichment, the monthly newsletter) are triggered on
// demand, not here, to stay well under the function time limit.
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "daily" });

  const settings = await ctx.store.getSettings();
  const now = new Date();
  const nowIso = now.toISOString();
  const { day } = localParts(settings.timezone, now);
  const out: Record<string, unknown> = { day };

  // ── Monday: lead digest (before the brief) ────────────────────────────────
  if (dayOfWeek(day) === 1) {
    const existing = await ctx.store.getDigest(day);
    if (!existing?.postedAt) out.digest = await runWeeklyDigest(ctx.store, ctx.slack, ctx.channel, day, nowIso);
    else out.digest = "already-posted";
  }

  // ── Friday: scoreboard ────────────────────────────────────────────────────
  if (dayOfWeek(day) === 5) {
    const data = await ctx.store.getScoreboardData();
    const programStart =
      data.touches.reduce<string | null>((min, t) => (!min || compareDays(t.dueDate, min) < 0 ? t.dueDate : min), null) ?? day;
    const sb = computeScoreboard({ ...data, weekStart: mondayOf(day), weekEnd: sundayOf(day), today: day, programStart });
    await ctx.slack.postMessage(ctx.channel, renderScoreboard(sb, `${mondayOf(day)} – ${sundayOf(day)}`));
    out.scoreboard = { sent: sb.sent, due: sb.due };
  }

  // ── Every day: the Morning Brief (real drafts if the API key is set) ───────
  const existingBrief = await ctx.store.getBrief(day);
  if (existingBrief?.postedAt) {
    out.brief = "already-posted";
  } else {
    let draftCtx: DraftContext | undefined;
    const model = claudeModelFromEnv();
    if (model) {
      try {
        draftCtx = { model, knowledge: loadKnowledge() };
      } catch (err) {
        console.error("[cockpit/daily] knowledge load failed:", err);
      }
    }
    out.brief = await runMorningBrief(ctx.store, ctx.slack, ctx.channel, day, nowIso, draftCtx);
  }

  return NextResponse.json({ ok: true, job: "daily", ...out });
}
