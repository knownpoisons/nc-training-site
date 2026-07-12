// One-off LIVE newsletter build — gated behind RUN_NEWSLETTER. Produces a real
// paste-ready Beehiiv draft for Jem's formatting test.
// Run: RUN_NEWSLETTER=1 npx vitest run --config vitest.config.ts src/cockpit/ops/__tests__/newsletter-live.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { loadKnowledge } from "../../draft/knowledge";
import { ClaudeModel } from "../../draft/model";
import { buildNewsletter } from "../newsletter";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

describe.runIf(process.env.RUN_NEWSLETTER)("newsletter (LIVE)", () => {
  it("builds a paste-ready newsletter, guards passing", async () => {
    const knowledge = loadKnowledge();
    const model = new ClaudeModel(process.env.ANTHROPIC_API_KEY!);
    const nl = await buildNewsletter(model, knowledge, {
      monthLabel: "July 2026",
      notes: [
        { text: "The teams winning with AI aren't the ones with the best tools — they kept their taste. AI raises the floor on execution; it does nothing for judgement." },
        { text: "That Herman Scheer thing — an agency going zero to full AI production in weeks is the real story, not the tooling." },
        { text: "Good read on why craft still matters", url: "https://example.com/craft" },
      ],
    });
    console.log(
      "\n══════════ NEWSLETTER (live) ══════════\n\nSUBJECT OPTIONS:\n" +
        nl.subjects.map((s, i) => `  ${i + 1}. ${s}`).join("\n") +
        `\n\n─── BODY (paste-ready) ───\n${nl.body}\n\n[guards: ${nl.report.ok ? "clean" : "FAILED"} · fallback ${nl.usedFallback}]\n`
    );
    expect(nl.report.ok).toBe(true);
    expect(nl.subjects.length).toBe(3);
  }, 120_000);
});
