import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedCron, unauthorized } from "@/cockpit/cron/auth";
import { getLiveContext } from "@/cockpit/runtime";
import { enrichLead, DAILY_ENRICHMENT_CAP } from "@/cockpit/engine-zero/enrich";
import { claudeEnrichmentFromEnv } from "@/cockpit/engine-zero/claudeEnrichment";
import type { MergedLead, LeadSource } from "@/cockpit/engine-zero/types";

// F10 Pass 2 — Tier-A enrichment, max 10/day. Builds a cited dossier for each
// (dossier guard: no citation, no claim). Also triggerable by hand for the pilot
// batch. Dossiers then appear in the Monday digest for Jem's review.
export async function GET(req: NextRequest) {
  if (!isAuthorizedCron(req)) return unauthorized();
  const { ctx, reason } = getLiveContext();
  if (!ctx) return NextResponse.json({ ok: true, skipped: reason, job: "enrich" });

  const provider = claudeEnrichmentFromEnv();
  if (!provider) return NextResponse.json({ ok: true, skipped: "no-anthropic-key", job: "enrich" });

  const leads = await ctx.store.getLeadsNeedingEnrichment(DAILY_ENRICHMENT_CAP);
  let enriched = 0;
  let honest = 0;
  for (const p of leads) {
    const merged: MergedLead = {
      name: p.name,
      email: p.email,
      company: p.company,
      role: p.role,
      linkedinUrl: p.linkedinUrl ?? null,
      sources: (p.sources ?? []) as LeadSource[],
      consentLane: p.consentLane ?? "pipeline",
      engagementRecency: null,
      sourceDetail: {},
    };
    try {
      const dossier = await enrichLead(provider, merged);
      await ctx.store.setDossier(p.id, dossier.line, dossier.openerAngle);
      enriched += 1;
      if (dossier.honest) honest += 1;
    } catch (err) {
      console.error(`[cockpit/enrich] ${p.id} failed:`, err);
    }
  }
  return NextResponse.json({ ok: true, job: "enrich", enriched, honestFallbacks: honest, remaining: Math.max(0, leads.length - enriched) });
}
