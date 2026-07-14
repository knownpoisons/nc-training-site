#!/usr/bin/env node
// Blog publish gate for the NotContent training blog.
// Runs BEFORE a post is allowed to go live. Enforces the taste-audit rule:
// no post ships without (a) a real first-person engagement scene up top and
// (b) at least one proprietary number, with borrowed stats attributed — and
// with none of the AI-slop tells that made the old posts forgettable.
//
// Usage:  node scripts/blog-gate.mjs content/blog/some-post.mdx
// Exit 0 = PASS (safe to publish). Exit 1 = FAIL (hold, do not publish).

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/blog-gate.mjs <path-to.mdx>");
  process.exit(2);
}

const raw = readFileSync(file, "utf8");

// ── Split frontmatter from body ──────────────────────────────────────────────
const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
const frontmatter = fmMatch ? fmMatch[1] : "";
const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;

// First three paragraphs of the body (the "opening" the reader meets).
const paragraphs = body
  .split(/\n\s*\n/)
  .map((p) => p.trim())
  .filter(Boolean);
const opening = paragraphs.slice(0, 3).join("\n\n");
const wordCount = body.replace(/[#>*_`\-]/g, " ").split(/\s+/).filter(Boolean).length;

// ── Reference data ───────────────────────────────────────────────────────────
// Confirmed, proprietary numbers Jeremy is allowed to state as fact.
const CONFIRMED = [
  /\$3\.5\s*(m|million)\b/i,
  /\$280[,]?000\b/,
  /\$280\s*k\b/i,
  /\$4\.5\s*(m|million)\b/i,
  /\$8\s*(m|million)\b/i,
  /\b90\s*%/,
  /\b30\s*%/,
  /\b(3|three)\s*months?\s*(instead of|,?\s*not)\s*(9|nine)/i,
  /tens of millions/i,
  /\b12\+/,
  /production (time )?(cut )?(to )?10\s*%/i,
];

// AI-slop phrases + the specific tells the audit caught. Any → block.
const BANNED = [
  /in today['’]s fast[- ]paced/i,
  /ever[- ]evolving landscape/i,
  /it['’]s no secret that/i,
  /gone are the days/i,
  /more important than ever/i,
  /\bunlock(ing|s)?\b/i,
  /\bunleash(ing|es)?\b/i,
  /\bsupercharge/i,
  /\brevolutioni[sz]e/i,
  /\bgame[- ]changer\b/i,
  /\bseamless(ly)?\b/i,
  /\bdelve\b/i,
  /\bharness the power\b/i,
  /nobody['’]?s? (is )?talking about/i,   // "the thing nobody's talking about"
  /read that line twice/i,
  /let that sink in/i,
  /the rise of\b/i,
  /when it comes to\b/i,
];

// Signals that a real engagement scene is present in the opening.
const SCENE = /\b(Cash App|Maesa|Herman Scheer|the team|we trained|in the room|on stage|walked into|sat (with|in)|a client|the engagement|week (one|four|eight)|halfway through)\b/i;
const FIRST_PERSON = /\b(I|I['’]m|I['’]ve|my|we|we['’]re|we['’]ve|our)\b/;

// Attribution markers — proof the writer sourced any borrowed stat.
const ATTRIBUTION = /\]\(https?:\/\/|according to|per (the|Every|Spark)|\bEvery['’]?s\b|Spark[^.]*report|report (found|shows|says)|source:/i;

// ── Checks ───────────────────────────────────────────────────────────────────
const results = [];
const add = (name, pass, detail, blocking = true) =>
  results.push({ name, pass, detail, blocking });

// 1. Frontmatter completeness
const fmKeys = ["title", "description", "date", "author", "tags", "category"];
const missingKeys = fmKeys.filter((k) => !new RegExp(`^${k}\\s*:`, "m").test(frontmatter));
add("frontmatter", missingKeys.length === 0, missingKeys.length ? `missing: ${missingKeys.join(", ")}` : "all keys present");

// 2. First-person engagement scene in the opening (first 3 paragraphs)
const hasFP = FIRST_PERSON.test(opening);
const hasScene = SCENE.test(opening);
add(
  "opening scene",
  hasFP && hasScene,
  hasFP && hasScene
    ? "first-person + engagement signal found up top"
    : `missing ${!hasFP ? "first-person voice" : ""}${!hasFP && !hasScene ? " and " : ""}${!hasScene ? "a real engagement/client scene" : ""} in the first 3 paragraphs`
);

// 3. At least one confirmed proprietary number
const confirmedHit = CONFIRMED.find((re) => re.test(body));
add(
  "proprietary number",
  !!confirmedHit,
  confirmedHit ? `found ${confirmedHit.source.slice(0, 24)}…` : "no confirmed NotContent number ($3.5M / $280K / $4.5M / 90% / 3-vs-9 / tens of millions / 12+)"
);

// 4. No AI-slop / banned phrases
const bannedHits = BANNED.filter((re) => re.test(body)).map((re) => (body.match(re) || [""])[0]);
add("no slop phrases", bannedHits.length === 0, bannedHits.length ? `found: ${[...new Set(bannedHits)].join(" | ")}` : "clean");

// 5. Borrowed stats must be attributed.
//    Collect $ / % / Nx tokens, drop the confirmed ones; if foreign stats
//    remain and there's zero attribution anywhere, hold it.
const statTokens = (body.match(/\$\s?\d[\d,.]*\s*(?:k|m|bn|billion|million)?|\b\d{1,3}(?:\.\d+)?\s?%|\b\d+(?:\.\d+)?\s?[x×]\b/gi) || []);
const foreign = statTokens.filter((t) => !CONFIRMED.some((re) => re.test(t)) && !/^\s*(0|100)\s?%$/.test(t));
const hasAttribution = ATTRIBUTION.test(body);
const attrOk = foreign.length === 0 || hasAttribution;
add(
  "attributed stats",
  attrOk,
  attrOk
    ? (foreign.length ? "external stats present, attribution found" : "no external stats")
    : `external stats with no source link/attribution: ${[...new Set(foreign)].slice(0, 6).join(", ")}`
);

// 6. Third-person self-reference (the enterprise-guide tell)
const thirdPerson = /\bthe NotContent team\b/i.test(body);
add("first-person voice", !thirdPerson, thirdPerson ? 'says "the NotContent team" — write as I/we' : "no third-person self-reference");

// 7. EndCta present
add("EndCta", /<EndCta\b/.test(body), /<EndCta\b/.test(body) ? "present" : "missing closing <EndCta>");

// 8. Length sanity
add("length", wordCount >= 500, `${wordCount} words${wordCount < 500 ? " (min 500)" : ""}`, wordCount < 400);

// ── Report ───────────────────────────────────────────────────────────────────
const blockers = results.filter((r) => !r.pass && r.blocking);
console.log(`\nBLOG GATE — ${file}`);
console.log("─".repeat(60));
for (const r of results) {
  const tag = r.pass ? "PASS" : r.blocking ? "FAIL" : "WARN";
  console.log(`  [${tag}] ${r.name.padEnd(20)} ${r.detail}`);
}
console.log("─".repeat(60));
if (blockers.length === 0) {
  console.log("RESULT: PASS — clear to publish.\n");
  process.exit(0);
} else {
  console.log(`RESULT: HOLD — ${blockers.length} blocking issue(s): ${blockers.map((b) => b.name).join(", ")}.`);
  console.log("Do not publish. Revise or hold the week.\n");
  process.exit(1);
}
