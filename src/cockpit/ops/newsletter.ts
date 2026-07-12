// ═══════════════════════════════════════════════════════════════════════════════
// F7 — NEWSLETTER BUILDER (monthly). Turns Jem's one insight (or the month's
// Cockpit activity, flagged machine-sourced) into a paste-ready Beehiiv email +
// 3 subject options. Runs the SAME stat + banned-word guards as outreach, because
// a newsletter carries proof numbers too. No Beehiiv API — output is for paste.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Knowledge } from "../draft/knowledge";
import type { DraftModel } from "../draft/model";
import { lintDraft, type DraftReport } from "../draft/lint";
import type { LinkReader } from "./linkReader";

export const NEWSLETTER_MAX_WORDS = 1500;
const MAX_REGEN = 3;

export interface NewsletterNoteInput {
  text: string;
  url?: string | null;
}

export interface NewsletterInput {
  monthLabel: string;
  notes: NewsletterNoteInput[]; // ideas/links Jem dropped all month
  activitySummary?: string | null; // fallback when nothing was dropped
}

export interface NewsletterOutput {
  subjects: string[];
  body: string; // paste-ready (markdown/rich text)
  report: DraftReport;
  machineSourced: boolean;
  usedFallback: boolean;
}

function systemPrompt(k: Knowledge): string {
  return [
    "You write NotContent's monthly newsletter as Jeremy Somers — for a list of",
    "creatives and brand people. Jem drops raw ideas, notes and links through the",
    "month; your job is to DECIPHER them and weave them into ONE fully-featured,",
    "coherent issue in his voice — useful, un-salesy, opinionated.",
    "",
    "Structure a full issue:",
    "• A short hook to open.",
    "• One clear through-line built from Jem's dropped ideas (find the theme that",
    "  connects them — don't just list them).",
    "• If he dropped links, a brief 'Worth a look' section — one honest line each,",
    "  keep the URL so it's clickable on paste.",
    "• A human sign-off.",
    "",
    "Hard rules (same as outreach): only numbers from PROOF (no invented or",
    "drifted figures), no banned clichés, no unsigned/NDA client names, British",
    "spelling. It's a broadcast — no [PERSONALISE] gaps.",
    "",
    "Return EXACTLY this format:",
    "SUBJECT 1: <option>",
    "SUBJECT 2: <option>",
    "SUBJECT 3: <option>",
    "===BODY===",
    "<the newsletter body, short paragraphs, paste-ready>",
    "",
    "═══ PLAYBOOK ═══",
    k.playbook,
    "",
    "═══ PROOF (only numbers you may use) ═══",
    k.proof,
  ].join("\n");
}

/**
 * Turn the month's dropped ideas into a material block. When a LinkReader is
 * given, each URL is opened and its title + excerpt are folded in, so the model
 * deciphers what's actually behind the link — not just the address.
 */
export async function assembleMaterial(
  notes: NewsletterNoteInput[],
  linkReader?: LinkReader
): Promise<string> {
  const parts: string[] = [];
  for (let i = 0; i < notes.length; i++) {
    const n = notes[i];
    let block = `${i + 1}. ${n.text}`;
    if (n.url) {
      block += `\n   link: ${n.url}`;
      if (linkReader) {
        const s = await linkReader.read(n.url);
        if (s && (s.title || s.excerpt)) {
          if (s.title) block += `\n   link title: ${s.title}`;
          if (s.excerpt) block += `\n   link excerpt: ${s.excerpt}`;
        } else {
          block += `\n   (couldn't open the link — reference it lightly, don't invent its contents)`;
        }
      }
    }
    parts.push(block);
  }
  return parts.join("\n");
}

function userPrompt(monthLabel: string, material: string, activitySummary: string | null | undefined): string {
  if (!material) {
    return (
      `Month: ${monthLabel}\n\n` +
      `Jem dropped no ideas this month. Build a modest, short issue from this activity ` +
      `(flag nothing as certain):\n${activitySummary ?? "Quiet month — keep it short and human."}\n\n` +
      "Write the newsletter now."
    );
  }
  return (
    `Month: ${monthLabel}\n\n` +
    `Jem's dropped ideas, notes and links for this issue — decipher and weave them ` +
    `into one coherent newsletter (find the through-line; don't just list them):\n${material}\n\n` +
    "Write the newsletter now."
  );
}

function parse(raw: string): { subjects: string[]; body: string } {
  const [head, ...rest] = raw.split(/===\s*BODY\s*===/i);
  const body = rest.join("===BODY===").trim();
  const subjects = [...head.matchAll(/SUBJECT\s*\d*\s*:\s*(.+)/gi)].map((m) => m[1].trim()).filter(Boolean);
  return { subjects, body: body || head.trim() };
}

export async function buildNewsletter(
  model: DraftModel,
  knowledge: Knowledge,
  input: NewsletterInput,
  linkReader?: LinkReader
): Promise<NewsletterOutput> {
  const system = systemPrompt(knowledge);
  const opts = { maxWords: NEWSLETTER_MAX_WORDS, requirePersonalise: false };
  const machineSourced = input.notes.length === 0;

  // Assemble the source material once (reading any dropped links).
  const material = await assembleMaterial(input.notes, linkReader);
  const base = userPrompt(input.monthLabel, material, input.activitySummary);

  let violations: string[] = [];
  let last: { subjects: string[]; body: string; report: DraftReport } | null = null;

  for (let attempt = 0; attempt <= MAX_REGEN; attempt++) {
    const user =
      attempt === 0
        ? base
        : base + `\n\nYour last draft failed these checks — fix exactly them:\n${violations.map((v) => `• ${v}`).join("\n")}`;
    const raw = await model.generate({ system, user, attempt, violations });
    const { subjects, body } = parse(raw);
    const report = lintDraft(body, knowledge.proofRules, opts);
    last = { subjects, body, report };
    if (report.ok && subjects.length >= 3) {
      return { subjects: subjects.slice(0, 3), body, report, machineSourced, usedFallback: false };
    }
    violations = report.hard.length ? report.hard : ["need 3 subject options in the SUBJECT format"];
  }

  // Never ship a newsletter with an unverified number. Flag for Jem.
  return {
    subjects: last?.subjects.slice(0, 3) ?? [],
    body: last?.body ?? "",
    report: last!.report,
    machineSourced,
    usedFallback: true,
  };
}
