import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { runMorningBrief, type DraftContext } from "@/cockpit/ops/brief";
import { runWeeklyDigest } from "@/cockpit/ops/digest";
import { computeScoreboard, renderScoreboard } from "@/cockpit/ops/scoreboard";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";
import { dayOfWeek, mondayOf, sundayOf, compareDays } from "@/cockpit/cadence/dates";
import { shouldPromptRaise, MAX_WEEKLY_VOLUME } from "@/cockpit/ops/governor";
import { enrichLead } from "@/cockpit/engine-zero/enrich";
import { claudeEnrichmentFromEnv } from "@/cockpit/engine-zero/claudeEnrichment";
import type { MergedLead, LeadSource } from "@/cockpit/engine-zero/types";
import { buildNewsletter } from "@/cockpit/ops/newsletter";
import { WebLinkReader } from "@/cockpit/ops/linkReader";

// FREE-PLAN morning run. Vercel Hobby allows only 2 daily cron jobs, so this one
// endpoint does the lot each morning: resurface dormant leads, enrich a few
// Tier-A queued leads, Monday's digest, Friday's scoreboard (+ streak/governor),
// the first-Tuesday newsletter, then the Morning Brief. Dedupe guards prevent
// double-posting; the enrichment batch is small to stay inside the time limit.
const DAILY_ENRICH_BATCH = 3;

export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "daily" });

  const settings = await ctx.store.getSettings();
  const now = new Date();
  const nowIso = now.toISOString();
  const { day } = localParts(settings.timezone, now);
  const out: Record<string, unknown> = { day };

  // ── Every day: dormant leads whose 90 days are up → back to the queue ──────
  try {
    const revived = await ctx.store.resurfaceDue(day);
    if (revived > 0) {
      out.resurfaced = revived;
      await ctx.slack.postMessage(
        ctx.channel,
        `${revived} dormant prospect${revived === 1 ? "" : "s"} resurfaced after 90 days — they're back in the queue for Monday's digest.`
      );
    }
  } catch (err) {
    console.error("[cockpit/daily] resurface failed:", err);
  }

  // ── Every day: enrich a small batch of Tier-A queued leads (cited dossiers) ─
  try {
    const provider = claudeEnrichmentFromEnv();
    if (provider) {
      const leads = await ctx.store.getLeadsNeedingEnrichment(DAILY_ENRICH_BATCH);
      let enriched = 0;
      for (const p of leads) {
        const merged: MergedLead = {
          name: p.name, email: p.email, company: p.company, role: p.role,
          linkedinUrl: p.linkedinUrl ?? null, sources: (p.sources ?? []) as LeadSource[],
          consentLane: p.consentLane ?? "pipeline", engagementRecency: null, sourceDetail: {},
        };
        const dossier = await enrichLead(provider, merged);
        await ctx.store.setDossier(p.id, dossier.line, dossier.openerAngle);
        enriched += 1;
      }
      if (enriched) out.enriched = enriched;
    }
  } catch (err) {
    console.error("[cockpit/daily] enrichment failed:", err);
  }

  // ── Monday: lead digest (before the brief) ────────────────────────────────
  if (dayOfWeek(day) === 1) {
    const existing = await ctx.store.getDigest(day);
    if (!existing?.postedAt) out.digest = await runWeeklyDigest(ctx.store, ctx.slack, ctx.channel, day, nowIso);
    else out.digest = "already-posted";
  }

  // ── Friday: scoreboard + streak/governor ───────────────────────────────────
  if (dayOfWeek(day) === 5) {
    const data = await ctx.store.getScoreboardData();
    const programStart =
      data.touches.reduce<string | null>((min, t) => (!min || compareDays(t.dueDate, min) < 0 ? t.dueDate : min), null) ?? day;
    const sb = computeScoreboard({ ...data, weekStart: mondayOf(day), weekEnd: sundayOf(day), today: day, programStart });

    // Streak: ≥80% completion extends it, anything less resets it. Three straight
    // weeks earns the volume question — asked, never auto-raised (F3).
    const hitTarget = sb.due > 0 && sb.completion >= 0.8;
    const streak = hitTarget ? settings.streakWeeks + 1 : 0;
    await ctx.store.updateSettings({ streakWeeks: streak });
    let text = renderScoreboard(sb, `${mondayOf(day)} – ${sundayOf(day)}`);
    if (hitTarget && shouldPromptRaise(Array(3).fill(1), settings.weeklyVolume) && streak >= 3) {
      text += `\n*Streak earned* — ${streak} weeks at 80%+. Raise to ${Math.min(settings.weeklyVolume + 2, MAX_WEEKLY_VOLUME)}/week? Reply \`set volume ${Math.min(settings.weeklyVolume + 2, MAX_WEEKLY_VOLUME)}\` if yes. Your call, not mine.`;
    }
    await ctx.slack.postMessage(ctx.channel, text);
    out.scoreboard = { sent: sb.sent, due: sb.due, streak };
  }

  // ── First Tuesday of the month: the newsletter draft ───────────────────────
  if (dayOfWeek(day) === 2 && Number(day.slice(8, 10)) <= 7) {
    try {
      const model = claudeModelFromEnv();
      if (model) {
        const month = day.slice(0, 7);
        const notes = await ctx.store.getNewsletterNotes(month);
        const counts = await ctx.store.pipelineCounts();
        const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: settings.timezone }).format(new Date(`${day}T12:00:00Z`));
        const nl = await buildNewsletter(
          model,
          loadKnowledge(),
          {
            monthLabel,
            notes: notes.map((n) => ({ text: n.text, url: n.url })),
            activitySummary: `Pipeline this month: ${counts.CALL} calls, ${counts.REPLIED} replies live, ${counts.WON} closed.`,
          },
          new WebLinkReader()
        );
        const header =
          `*${monthLabel} newsletter — review, paste into Beehiiv, schedule.*` +
          (nl.machineSourced ? "\n_Machine-sourced from activity — read it harder than usual._" : "") +
          (nl.usedFallback ? "\n⚠️ Couldn't fully auto-clear — check the numbers before pasting." : "");
        await ctx.slack.postMessage(ctx.channel, `${header}\n\n*Subjects:*\n${nl.subjects.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n———\n${nl.body}`);
        out.newsletter = "posted";
      }
    } catch (err) {
      console.error("[cockpit/daily] newsletter failed:", err);
    }
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
