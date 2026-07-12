// ═══════════════════════════════════════════════════════════════════════════════
// F9 INGEST — orchestrate: RawLeads → dedupe → score → persist as QUEUED leads.
//
// The reviewed-queue rule: every ingested lead lands at stage NEW. Nothing here
// can create an IN_SEQUENCE prospect — only Jem's promotion (F11) does that.
// broadcast_only consent is carried through untouched.
// ═══════════════════════════════════════════════════════════════════════════════

import type { CockpitStore, NewLeadInput } from "../store/types";
import type { Day } from "../cadence/dates";
import { dedupe } from "./dedupe";
import { scoreLead } from "./score";
import { SOURCE_TO_ENGINE, type MergedLead, type RawLead } from "./types";

export interface IngestResult {
  received: number; // raw rows in
  merged: number; // distinct people after dedupe
  created: number; // new lead records written
  byTier: { A: number; B: number; C: number };
  byConsent: { pipeline: number; broadcast_only: number };
}

function toLeadInput(lead: MergedLead, today: Day): NewLeadInput {
  const { score, tier } = scoreLead(lead, today);
  // Primary engine = the warmest source's coarse bucket (first in the stack is
  // fine for the scoreboard; `sources` keeps the full detail).
  const primary = lead.sources[0];
  return {
    name: lead.name,
    email: lead.email,
    company: lead.company,
    role: lead.role,
    linkedinUrl: lead.linkedinUrl,
    sourceEngine: SOURCE_TO_ENGINE[primary],
    sources: lead.sources,
    consentLane: lead.consentLane,
    score,
    tier,
    sourceDetail: lead.sourceDetail,
  };
}

/**
 * Ingest a batch of RawLeads (from any mix of importers). Dedupes within the
 * batch, then persists each as a queued lead. Cross-batch dedupe against leads
 * already in the store is best-effort on email.
 */
export async function ingest(
  store: CockpitStore,
  rawLeads: RawLead[],
  today: Day
): Promise<IngestResult> {
  const mergedLeads = dedupe(rawLeads);

  const result: IngestResult = {
    received: rawLeads.length,
    merged: mergedLeads.length,
    created: 0,
    byTier: { A: 0, B: 0, C: 0 },
    byConsent: { pipeline: 0, broadcast_only: 0 },
  };

  for (const lead of mergedLeads) {
    // Cross-batch dedupe: if this email already exists, skip creating a new row.
    if (lead.email) {
      const existing = await store.findProspectByEmail(lead.email);
      if (existing) continue;
    }
    const input = toLeadInput(lead, today);
    await store.createLead(input, today);
    result.created += 1;
    result.byTier[input.tier] += 1;
    result.byConsent[input.consentLane] += 1;
  }
  return result;
}
