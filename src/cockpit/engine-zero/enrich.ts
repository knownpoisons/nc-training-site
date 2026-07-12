// ═══════════════════════════════════════════════════════════════════════════════
// F10 PASS 2 — Tier-A enrichment (max 10/day). A research provider returns claims
// with source URLs; the dossier guard strips anything uncited. The provider is a
// seam: FakeEnrichment (tests) and a live provider (web search + model) wired
// later. The guard runs regardless of provider, so no uncited biography can ship.
// ═══════════════════════════════════════════════════════════════════════════════

import { guardDossier, type DossierClaim, type GuardedDossier } from "./dossierGuard";
import type { MergedLead } from "./types";

export interface ResearchResult {
  claims: DossierClaim[];
  openerAngle: string | null;
}

export interface EnrichmentProvider {
  research(lead: MergedLead): Promise<ResearchResult>;
}

/** Fake provider for tests — returns whatever the test configures. */
export class FakeEnrichment implements EnrichmentProvider {
  constructor(private fn: (lead: MergedLead) => ResearchResult) {}
  research(lead: MergedLead): Promise<ResearchResult> {
    return Promise.resolve(this.fn(lead));
  }
}

export const DAILY_ENRICHMENT_CAP = 10;

/** Enrich one lead: research → guard. The guard is the safety gate. */
export async function enrichLead(
  provider: EnrichmentProvider,
  lead: MergedLead
): Promise<GuardedDossier> {
  const result = await provider.research(lead);
  return guardDossier(result.claims, result.openerAngle);
}

/**
 * Enrich a batch of Tier-A leads, capped at DAILY_ENRICHMENT_CAP. Returns the
 * dossiers plus how many leads were left for tomorrow (never silently dropped).
 */
export async function enrichTierA(
  provider: EnrichmentProvider,
  leads: MergedLead[],
  cap: number = DAILY_ENRICHMENT_CAP
): Promise<{ dossiers: Array<{ lead: MergedLead; dossier: GuardedDossier }>; deferred: number }> {
  const todays = leads.slice(0, cap);
  const dossiers = [];
  for (const lead of todays) {
    dossiers.push({ lead, dossier: await enrichLead(provider, lead) });
  }
  return { dossiers, deferred: Math.max(0, leads.length - todays.length) };
}
