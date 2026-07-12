import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext, localParts } from "@/cockpit/runtime";
import { buildNewsletter } from "@/cockpit/ops/newsletter";
import { WebLinkReader } from "@/cockpit/ops/linkReader";
import { claudeModelFromEnv } from "@/cockpit/draft/model";
import { loadKnowledge } from "@/cockpit/draft/knowledge";
import { dayOfWeek } from "@/cockpit/cadence/dates";

// F7 — Monthly newsletter. Hourly cron; self-gates to the FIRST TUESDAY of the
// month at the brief hour. Builds a paste-ready Beehiiv draft + 3 subject lines
// from the month's activity (machine-sourced) and posts it for Jem to review,
// paste, and schedule. No Beehiiv API — paste only.
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "newsletter" });

  const settings = await ctx.store.getSettings();
  const { day, hour } = localParts(settings.timezone, new Date());
  const dom = Number(day.slice(8, 10));
  if (dayOfWeek(day) !== 2 || dom > 7) return NextResponse.json({ ok: true, skipped: "not-first-tuesday", day });
  if (hour !== settings.briefHour) return NextResponse.json({ ok: true, skipped: "not-brief-hour", hour });

  const model = claudeModelFromEnv();
  if (!model) return NextResponse.json({ ok: true, skipped: "no-model", job: "newsletter" });

  const month = day.slice(0, 7); // YYYY-MM
  const notes = await ctx.store.getNewsletterNotes(month);
  const counts = await ctx.store.pipelineCounts();
  const activity = `Pipeline this month: ${counts.CALL} calls, ${counts.REPLIED} replies live, ${counts.WON} closed. Keep it to one honest insight.`;
  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: settings.timezone }).format(
    new Date(`${day}T12:00:00Z`)
  );

  const nl = await buildNewsletter(
    model,
    loadKnowledge(),
    {
      monthLabel,
      notes: notes.map((n) => ({ text: n.text, url: n.url })), // Jem's dropped ideas this month
      activitySummary: activity,
    },
    new WebLinkReader() // opens dropped links and reads their contents
  );

  const header =
    `*${monthLabel} newsletter — review, paste into Beehiiv, schedule for Wednesday 9am ET.*` +
    (nl.machineSourced ? "\n_Machine-sourced from this month's activity — read it harder than usual._" : "") +
    (nl.usedFallback ? "\n⚠️ Couldn't fully auto-clear — check the numbers before pasting." : "");
  const subjects = nl.subjects.map((s, i) => `${i + 1}. ${s}`).join("\n");
  await ctx.slack.postMessage(ctx.channel, `${header}\n\n*Subject options:*\n${subjects}\n\n———\n${nl.body}`);

  return NextResponse.json({ ok: true, job: "newsletter", day, subjects: nl.subjects.length });
}
