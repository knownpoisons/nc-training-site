import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { runMorningBrief, type DraftContext } from "@/cockpit/ops/brief";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";

// F1 — Morning Brief. Runs hourly; self-gates on the settings timezone so it
// posts once, at the configured local hour, and survives the HST → Thailand move
// with no redeploy. Phase 2 posts placeholder drafts (real copy is Phase 3).
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();

  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "morning-brief" });

  const settings = await ctx.store.getSettings();
  const now = new Date();
  const { day, hour } = localParts(settings.timezone, now);

  // Only at the configured brief hour, and only once per local day.
  if (hour !== settings.briefHour) {
    return NextResponse.json({ ok: true, skipped: "not-brief-hour", localHour: hour, briefHour: settings.briefHour });
  }
  const existing = await ctx.store.getBrief(day);
  if (existing?.postedAt) {
    return NextResponse.json({ ok: true, skipped: "already-posted", day });
  }

  // Real drafts (F2) when the API key is set; placeholder drafts otherwise.
  let draftCtx: DraftContext | undefined;
  const model = claudeModelFromEnv();
  if (model) {
    try {
      draftCtx = { model, knowledge: loadKnowledge() };
    } catch (err) {
      console.error("[cockpit/brief] knowledge load failed, using placeholders:", err);
    }
  }

  const result = await runMorningBrief(ctx.store, ctx.slack, ctx.channel, day, now.toISOString(), draftCtx);
  return NextResponse.json({ ok: true, job: "morning-brief", day, ...result });
}
