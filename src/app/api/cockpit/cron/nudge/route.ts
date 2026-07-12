import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { runNudge } from "@/cockpit/ops/nudge";

// F8 — The Nudge. Runs hourly; self-gates on the settings timezone. Fires at the
// configured nudge hour, once, and only if the channel has been silent since the
// brief. runNudge itself enforces "once, only when silent" — this just gates the
// hour so we don't call it 23 times a day.
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "nudge" });

  const settings = await ctx.store.getSettings();
  const now = new Date();
  const { day, hour } = localParts(settings.timezone, now);

  if (hour !== settings.nudgeHour) {
    return NextResponse.json({ ok: true, skipped: "not-nudge-hour", localHour: hour, nudgeHour: settings.nudgeHour });
  }

  const result = await runNudge(ctx.store, ctx.slack, ctx.channel, day, now.toISOString());
  return NextResponse.json({ ok: true, job: "nudge", day, ...result });
}
