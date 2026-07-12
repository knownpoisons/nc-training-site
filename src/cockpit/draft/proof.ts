// ═══════════════════════════════════════════════════════════════════════════════
// PROOF PARSING — turn PROOF.md into an allow-list + ban-list of numeric claims.
//
// The rule (PROOF.md, handoff failure mode #3): "if a number is not in this file,
// it does not appear in any draft." We implement that literally — the allow-list
// is every stat-like token found in PROOF.md's CLEARED region; the ban-list is
// every token in its HARD-BANNED region. Edit PROOF.md → the guard updates. No
// second source of truth.
//
// Scope of a "numeric claim": currency ($…), percentages (…%), and explicit
// multipliers (…x). Bare counts ("7 brands", "8 weeks", "15 minutes") are not
// dollar figures or percentages and are out of scope — that keeps the guard
// precise and avoids false-flagging "worth 15 minutes?".
// ═══════════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";

export const KNOWLEDGE_DIR = path.join(process.cwd(), "cockpit", "knowledge");

export interface StatToken {
  raw: string; // as written, e.g. "$3.5M"
  canonical: string; // normalized key, e.g. "cur:3500000"
  index: number; // position in the source text
}

/** A canonicalized allow/ban set derived from PROOF.md. */
export interface ProofRules {
  allowed: Set<string>;
  banned: Set<string>;
}

const CURRENCY_RE = /\$\s?\d[\d,]*(?:\.\d+)?\s*(?:k|m|b|bn|thousand|million|billion)?/gi;
const PERCENT_RE = /\d+(?:\.\d+)?\s*%/g;
const MULTIPLIER_RE = /\b\d+(?:\.\d+)?\s*x\b/gi;
const TENS_OF_MILLIONS_RE = /tens of millions/gi;

/** Drift qualifiers that turn a real number into a banned variant. */
export const DRIFT_QUALIFIERS = ["over", "nearly", "almost", "more than", "up to", "under", "at least"];
/** Hedges PROOF.md itself uses — always fine. */
export const ALLOWED_QUALIFIERS = ["roughly", "about", "around", "approximately", "~"];

function canonCurrency(raw: string): string {
  const m = raw.match(/\$\s?([\d,]*(?:\.\d+)?)\s*(k|m|b|bn|thousand|million|billion)?/i);
  if (!m) return `cur:${raw}`;
  let value = parseFloat(m[1].replace(/,/g, ""));
  const suffix = (m[2] ?? "").toLowerCase();
  if (suffix === "k" || suffix === "thousand") value *= 1_000;
  else if (suffix === "m" || suffix === "million") value *= 1_000_000;
  else if (suffix === "b" || suffix === "bn" || suffix === "billion") value *= 1_000_000_000;
  return `cur:${Math.round(value)}`;
}

function canonPercent(raw: string): string {
  const n = parseFloat(raw.replace(/[^\d.]/g, ""));
  return `pct:${n}`;
}

function canonMultiplier(raw: string): string {
  const n = parseFloat(raw.replace(/[^\d.]/g, ""));
  return `mult:${n}`;
}

/** Extract every numeric claim token from a block of text, with positions. */
export function extractStatTokens(text: string): StatToken[] {
  const tokens: StatToken[] = [];
  const push = (re: RegExp, canon: (s: string) => string) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      tokens.push({ raw: m[0].trim(), canonical: canon(m[0]), index: m.index });
    }
  };
  push(CURRENCY_RE, canonCurrency);
  push(PERCENT_RE, canonPercent);
  push(MULTIPLIER_RE, canonMultiplier);
  // phrase token
  TENS_OF_MILLIONS_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TENS_OF_MILLIONS_RE.exec(text)) !== null) {
    tokens.push({ raw: m[0], canonical: "phrase:tens-of-millions", index: m.index });
  }
  return tokens;
}

/** Split PROOF.md at the HARD-BANNED heading and build the allow/ban sets. */
export function parseProof(markdown: string): ProofRules {
  const banHeadingIdx = markdown.search(/HARD-?BANNED/i);
  const clearedRegion = banHeadingIdx >= 0 ? markdown.slice(0, banHeadingIdx) : markdown;
  const bannedRegion = banHeadingIdx >= 0 ? markdown.slice(banHeadingIdx) : "";

  const allowed = new Set(extractStatTokens(clearedRegion).map((t) => t.canonical));
  const bannedRaw = extractStatTokens(bannedRegion).map((t) => t.canonical);

  // The HARD-BANNED section illustrates drift ("over 90%", "$380k-variant"),
  // so it re-mentions legitimate numbers. A number that is cleared elsewhere in
  // PROOF stays cleared — its drifted forms are caught by the qualifier check,
  // not by banning the base value. Only numbers that appear ONLY in the banned
  // region (96%, $8M, $280k, $300k) are truly banned.
  const banned = new Set(bannedRaw.filter((t) => !allowed.has(t)));
  return { allowed, banned };
}

export function loadProofRules(dir: string = KNOWLEDGE_DIR): ProofRules {
  const md = fs.readFileSync(path.join(dir, "PROOF.md"), "utf8");
  return parseProof(md);
}
