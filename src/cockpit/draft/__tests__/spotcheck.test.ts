// One-off voice spot-check — hits the LIVE Anthropic API. Gated behind
// RUN_SPOTCHECK so the normal suite never calls out or spends tokens.
// Run: RUN_SPOTCHECK=1 npx vitest run --config vitest.config.ts src/cockpit/draft/__tests__/spotcheck.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { loadKnowledge } from "../knowledge";
import { ClaudeModel } from "../model";
import { generateDraft, OUTREACH_MAX_WORDS } from "../engine";
import { checkStats } from "../statGuard";
import { checkBannedWords } from "../bannedWords";
import type { DraftInput } from "../prompt";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

const CASES: Array<{ label: string; requirePersonalise: boolean; input: DraftInput }> = [
  {
    label: "Agency · cold touch 1 (connection)",
    requirePersonalise: true,
    input: {
      prospect: { name: "Dana Okafor", role: "Founder / ECD", company: "Ridgeline (brand agency)", notes: "Just announced a rebrand for a DTC skincare client." },
      touchNumber: 1, lane: "cold",
      templateBody: "[PERSONALISE — one line proving you looked]. I train creative teams to work with AI properly — thought your team might be at that point. No pitch, just connecting.",
      maxWords: OUTREACH_MAX_WORDS,
    },
  },
  {
    label: "Brand team · cold touch 2 (value + stat)",
    requirePersonalise: true,
    input: {
      prospect: { name: "Priya Raman", role: "VP Brand", company: "Lumen Beauty (in-house)", notes: "Big seasonal launch cadence; complained publicly about production timelines." },
      touchNumber: 2, lane: "cold",
      templateBody: "[PERSONALISE — reference their work]. One number from the work: [PROOF STAT]. No reason that couldn't be [COMPANY] — a focused set of AI training sessions built around your slowest, costliest, most annoying processes. Want to see where your team stands first? Two minutes, no pitch: [SCORECARD LINK].",
      maxWords: OUTREACH_MAX_WORDS,
    },
  },
  {
    label: "Brand team · cold touch 3 (the ask)",
    requirePersonalise: false,
    input: {
      prospect: { name: "Marco Bellini", role: "Head of Creative", company: "Northwind Foods", notes: "No reply to touches 1–2." },
      touchNumber: 3, lane: "cold",
      templateBody: "Quick one, [NAME] — off the top of your head, name 3 processes that: take the most time, cost the most money, and annoy you the most. I'll tell you straight which we can automate, and which we can't. [TWO TIME OPTIONS] if it's easier to just talk.",
      maxWords: OUTREACH_MAX_WORDS,
    },
  },
  {
    label: "Scorecard follow-up · touch 1",
    requirePersonalise: false,
    input: {
      prospect: { name: "Aisha Bello", role: "Creative Director", company: "Studio Fold", notes: "Scored 44/100 on the readiness scorecard; biggest flagged issue was workflow/process — assets stuck in review, slow handoffs." },
      touchNumber: 1, lane: "scorecard",
      templateBody: "You took the readiness scorecard — scored [SCORE]. Your biggest flag was [BIG ISSUE]. That's usually where the time and money quietly leak. Give me 15 minutes and I'll show you exactly where it's biting and how we'd fix it — [TWO TIME OPTIONS].",
      maxWords: OUTREACH_MAX_WORDS,
    },
  },
  {
    label: "Community 'never launched' · touch 1",
    requirePersonalise: true,
    input: {
      prospect: { name: "Tom Reyes", role: "Founder / CEO", company: "Kin Things", notes: "Signed up to the creative × AI community intake form last year." },
      touchNumber: 1, lane: "community",
      templateBody: "A while back you signed up to hear about a creative × AI community I was starting. I never launched it — the work took over. [ONE PROOF LINE]. I'm [PERSONALISE: why them] — wanted to reconnect properly rather than add you to a list.",
      maxWords: OUTREACH_MAX_WORDS,
    },
  },
];

describe.runIf(process.env.RUN_SPOTCHECK)("voice spot-check (LIVE)", () => {
  it("generates 5 real drafts, all passing the guards", async () => {
    const knowledge = loadKnowledge();
    const model = new ClaudeModel(process.env.ANTHROPIC_API_KEY!);

    const out: string[] = ["", "══════════ VOICE SPOT-CHECK · 5 live drafts ══════════", ""];
    for (const c of CASES) {
      const r = await generateDraft(model, knowledge, c.input, c.requirePersonalise);
      const stats = checkStats(r.draft, knowledge.proofRules);
      const banned = checkBannedWords(r.draft);
      out.push(`── ${c.label} ──`);
      out.push(r.draft);
      out.push(
        `   [attempts ${r.attempts} · ${r.report.wordCount} words · ` +
          `stat-violations ${stats.length} · banned ${banned.length}` +
          `${r.usedFallback ? " · ⚠️ FELL BACK TO TEMPLATE" : ""}` +
          `${r.report.warnings.length ? ` · warnings: ${r.report.warnings.join("; ")}` : ""}]`
      );
      out.push("");
      expect(r.report.ok).toBe(true);
      expect(stats).toHaveLength(0);
      expect(banned).toHaveLength(0);
    }
    console.log(out.join("\n"));
  }, 120_000);
});
