// ═══════════════════════════════════════════════════════════════════════════════
// F9 IMPORTERS — parse the REAL source files into RawLeads.
//
// Built against the actual headers found at Gate 0 (see CLAUDE.md "Importer
// notes"), not assumed ones. Each importer is defensive: it skips obvious test
// rows and malformed lines rather than trusting the file.
// ═══════════════════════════════════════════════════════════════════════════════

import { parse } from "csv-parse/sync";
import { SOURCE_CONSENT, type RawLead } from "./types";

// ─── shared helpers ───────────────────────────────────────────────────────────
function clean(v: string | undefined | null): string | null {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

/** Best-effort YYYY-MM-DD from the various date shapes across the sources. */
export function normalizeDate(v: string | null): string | null {
  if (!v) return null;
  const s = v.trim();
  // 2026-03-11 …  or  2023-02-07 20:29:38 UTC
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // 2025/08/24 12:08:23 PM HADT
  m = s.match(/^(\d{4})\/(\d{2})\/(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // 11 Mar 2026
  m = s.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (m) {
    const months: Record<string, string> = {
      jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
      jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
    };
    const mo = months[m[2].toLowerCase()];
    if (mo) return `${m[3]}-${mo}-${m[1].padStart(2, "0")}`;
  }
  return null;
}

function looksLikeTestRow(name: string | null, email: string | null): boolean {
  const n = (name ?? "").toLowerCase();
  const e = (email ?? "").toLowerCase();
  return n === "tes" || n === "test" || /(^|[^a-z])test([^a-z]|$)/.test(n) || e.includes("test@") || e === "test";
}

// ─── Community intake form (Google Forms export) ──────────────────────────────
export function parseCommunityCsv(csvText: string): RawLead[] {
  const rows: Record<string, string>[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  });
  const out: RawLead[] = [];
  for (const r of rows) {
    const name = clean(r["Your Full Name"]);
    const email = clean(r["Your Email"]);
    if (looksLikeTestRow(name, email)) continue;
    if (!name && !email) continue;
    out.push({
      source: "community",
      name,
      email,
      company: clean(r["Your Agency/Studio Name"]),
      role: clean(r["What's your primary role at the agency?"]) ?? clean(r['You said "other" - spill it:']),
      linkedinUrl: clean(r["Your Linkedin Profile"]),
      consentLane: SOURCE_CONSENT.community,
      engagementRecency: normalizeDate(clean(r["Timestamp"])),
      sourceDetail: {
        services: clean(r["What type of creative services does your agency primarily offer? (Select all that apply)"]),
        teamSize: clean(r["What's the approximate size of your team (full-time employees)?"]),
        wants: clean(r["What are you hoping to gain most from this community?"]),
      },
    });
  }
  return out;
}

// ─── Beehiiv subscriber export ────────────────────────────────────────────────
export function parseBeehiivCsv(csvText: string): RawLead[] {
  const rows: Record<string, string>[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  });
  const out: RawLead[] = [];
  for (const r of rows) {
    if (clean(r["status"]) !== "active") continue; // only current subscribers
    const email = clean(r["email"]);
    if (!email) continue;
    out.push({
      source: "beehiiv",
      name: null, // Beehiiv export has no name column
      email,
      company: null,
      role: null,
      linkedinUrl: null,
      consentLane: SOURCE_CONSENT.beehiiv, // broadcast_only — hard rule
      engagementRecency: normalizeDate(clean(r["last_opened_at"])) ?? normalizeDate(clean(r["created_at"])),
      sourceDetail: {
        openRate: clean(r["open_rate"]),
        clickRate: clean(r["click_rate"]),
        totalClicked: clean(r["total_clicked"]),
        acquisitionSource: clean(r["acquisition_source"]),
      },
    });
  }
  return out;
}

// ─── LinkedIn Connections.csv (3-line preamble before the header) ─────────────
export function parseLinkedInConnections(csvText: string): RawLead[] {
  const lines = csvText.split(/\r?\n/);
  const headerIdx = lines.findIndex((l) => l.startsWith("First Name,"));
  if (headerIdx < 0) return [];
  const body = lines.slice(headerIdx).join("\n");
  const rows: Record<string, string>[] = parse(body, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  });
  const out: RawLead[] = [];
  for (const r of rows) {
    const first = clean(r["First Name"]);
    const last = clean(r["Last Name"]);
    const name = [first, last].filter(Boolean).join(" ") || null;
    if (!name) continue;
    out.push({
      source: "linkedin",
      name,
      email: clean(r["Email Address"]),
      company: clean(r["Company"]),
      role: clean(r["Position"]),
      linkedinUrl: clean(r["URL"]),
      consentLane: SOURCE_CONSENT.linkedin,
      engagementRecency: normalizeDate(clean(r["Connected On"])),
      sourceDetail: {},
    });
  }
  return out;
}

// ─── Scorecard completer (from the existing scorecard_leads row) ──────────────
export interface ScorecardRow {
  name: string;
  email: string;
  tier?: string;
  score_normalized?: number;
  work_type?: string | null;
  created_at?: string | null;
  answers?: unknown;
  biggest_issue?: string | null;
}

export function scorecardToLead(row: ScorecardRow): RawLead {
  return {
    source: "scorecard",
    name: clean(row.name),
    email: clean(row.email),
    company: null,
    role: null,
    linkedinUrl: null,
    consentLane: SOURCE_CONSENT.scorecard,
    engagementRecency: normalizeDate(clean(row.created_at ?? null)),
    sourceDetail: {
      scorecardTier: row.tier ?? null,
      score: row.score_normalized ?? null,
      workType: row.work_type ?? null,
      biggestIssue: row.biggest_issue ?? null,
    },
  };
}
