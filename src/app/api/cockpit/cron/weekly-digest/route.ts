import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { runWeeklyDigest } from "@/cockpit/ops/digest";
import { dayOfWeek } from "@/cockpit/cadence/dates";

// F11 — Weekly Lead Digest. Hourly cron; self-gates to Monday, one hour before
// the brief hour so it posts ahead of the Morning Brief. Posts once per Monday.
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "weekly-digest" });

  const settings = await ctx.store.getSettings();
  const now = new Date();
  const { day, hour } = localParts(settings.timezone, now);
  if (dayOfWeek(day) !== 1) return NextResponse.json({ ok: true, skipped: "not-monday", day });
  // Post an hour before the brief (or at brief hour if brief hour is 0).
  const digestHour = Math.max(0, settings.briefHour - 1);
  if (hour !== digestHour) return NextResponse.json({ ok: true, skipped: "not-digest-hour", hour, digestHour });

  const existing = await ctx.store.getDigest(day);
  if (existing?.postedAt) return NextResponse.json({ ok: true, skipped: "already-posted", day });

  const result = await runWeeklyDigest(ctx.store, ctx.slack, ctx.channel, day, now.toISOString());
  return NextResponse.json({ ok: true, job: "weekly-digest", day, ...result });
}
