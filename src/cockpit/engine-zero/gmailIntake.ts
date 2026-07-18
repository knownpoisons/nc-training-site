// ═══════════════════════════════════════════════════════════════════════════════
// GMAIL INBOX-MINE — sent-mail correspondents become queued leads.
//
// The Gmail connector lives in Claude Code, not the app; the /inbox-mine command
// gathers correspondents there and hands them here. This module maps them into
// the same RawLead → ingest() pipeline every other source uses, so dedupe,
// scoring, and the reviewed-queue rule (stage NEW) all apply unchanged.
// ═══════════════════════════════════════════════════════════════════════════════

import type { CockpitStore } from "../store/types";
import type { Day } from "../cadence/dates";
import { ingest, type IngestResult } from "./ingest";
import { SOURCE_CONSENT, type RawLead } from "./types";

/** One correspondent, distilled by the /inbox-mine agent from sent threads. */
export interface GmailCorrespondent {
  email: string;
  name?: string | null;
  company?: string | null;
  /** Most recent date I sent them mail (ISO YYYY-MM-DD) — drives recency. */
  lastSent: Day;
  /** How many threads I've sent them — a rough intent signal, kept for review. */
  count?: number;
}

// Freemail domains carry no company signal; anything else is a plausible org.
const FREEMAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
]);

/** "acme-studio.com" → "Acme Studio". Best-effort, only for non-freemail domains. */
function companyFromEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 0) return null;
  const domain = email.slice(at + 1).toLowerCase().trim();
  if (!domain || FREEMAIL.has(domain)) return null;
  const core = domain.split(".").slice(0, -1).join(".") || domain;
  const label = core.split(".").pop() ?? core;
  return label
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || null;
}

/** Map gathered correspondents into normalised RawLeads for ingest(). */
export function parseGmailCorrespondents(rows: GmailCorrespondent[]): RawLead[] {
  const out: RawLead[] = [];
  for (const r of rows) {
    const email = r.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) continue;
    out.push({
      source: "gmail_sent",
      name: r.name?.trim() || null,
      email,
      company: r.company?.trim() || companyFromEmail(email),
      role: null, // Gmail gives no role — enrichment fills it later
      linkedinUrl: null,
      consentLane: SOURCE_CONSENT.gmail_sent,
      engagementRecency: r.lastSent,
      sourceDetail: { count: r.count ?? 1, lastSent: r.lastSent },
    });
  }
  return out;
}

/** Thin wrapper: correspondents → RawLeads → ingest (dedupe/score/persist NEW). */
export async function ingestGmailCorrespondents(
  store: CockpitStore,
  rows: GmailCorrespondent[],
  today: Day
): Promise<IngestResult> {
  return ingest(store, parseGmailCorrespondents(rows), today);
}
