import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { computeScoreboard, renderScoreboard } from "@/cockpit/ops/scoreboard";
import { dayOfWeek, mondayOf, sundayOf, compareDays } from "@/cockpit/cadence/dates";

// F6 — Friday Scoreboard. Hourly cron; self-gates to Friday at the brief hour.
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "friday-scoreboard" });

  const settings = await ctx.store.getSettings();
  const { day, hour } = localParts(settings.timezone, new Date());
  if (dayOfWeek(day) !== 5) return NextResponse.json({ ok: true, skipped: "not-friday", day });
  if (hour !== settings.briefHour) return NextResponse.json({ ok: true, skipped: "not-brief-hour", hour });

  const data = await ctx.store.getScoreboardData();
  // Program start = the earliest touch due date (the day outreach began).
  const programStart =
    data.touches.reduce<string | null>((min, t) => (!min || compareDays(t.dueDate, min) < 0 ? t.dueDate : min), null) ??
    day;

  const weekStart = mondayOf(day);
  const weekEnd = sundayOf(day);
  const sb = computeScoreboard({ ...data, weekStart, weekEnd, today: day, programStart });
  await ctx.slack.postMessage(ctx.channel, renderScoreboard(sb, `${weekStart} – ${weekEnd}`));

  return NextResponse.json({ ok: true, job: "friday-scoreboard", day, sent: sb.sent, due: sb.due });
}
