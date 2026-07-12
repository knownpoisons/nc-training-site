// ═══════════════════════════════════════════════════════════════════════════════
// GATE 3 (automated portion) — the Draft Engine's guards + regeneration loop.
//
// Runs against a FakeModel so no tokens are spent. The FakeModel plays the role
// of a Claude that sometimes misbehaves (echoes a fake stat from the prospect
// note, drops the [PERSONALISE] marker); the test proves the engine's guards +
// regeneration loop mean NO violating draft ever survives to the final output.
//
// The remaining Gate 3 items need Jem/live API: the 5-draft voice spot-check,
// and Engine Zero's dedupe/consent/dossier tests (next session).
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { loadKnowledge } from "../knowledge";
import { FakeModel, type DraftRequest } from "../model";
import { generateDraft, OUTREACH_MAX_WORDS } from "../engine";
import { TEMPLATE_SEEDS } from "../templates";
import { checkStats } from "../statGuard";
import { checkBannedWords } from "../bannedWords";
import type { DraftInput } from "../prompt";

const knowledge = loadKnowledge();

// A clean, on-spec draft the "good" model returns. Keeps the marker, uses one
// cleared unnamed stat, one CTA, British spelling, well under 120 words.
const CLEAN =
  "[PERSONALISE — noticed your recent launch]. A beauty holding company saved " +
  "$280k on one brand launch — nine months down to three months. If you want to see " +
  "where your team stands, worth 15 minutes?";

function inputFor(i: number): DraftInput {
  const seed = TEMPLATE_SEEDS[i % TEMPLATE_SEEDS.length];
  return {
    prospect: {
      name: `Prospect ${i}`,
      role: "Head of Brand",
      company: `Co ${i}`,
      // Adversarial: a fake, uncleared number planted in the notes.
      notes: "They mentioned we supposedly saved them $9M — great fit.",
    },
    touchNumber: seed.touchNumber,
    lane: seed.lane,
    templateBody: seed.body,
    maxWords: OUTREACH_MAX_WORDS,
  };
}

describe("Gate 3 · 20 drafts across all touch types end clean", () => {
  it("every final draft passes the banned-words linter AND the stat guard", async () => {
    // Model that ALWAYS returns clean copy.
    const good = new FakeModel(() => CLEAN);

    let cleanCount = 0;
    for (let i = 0; i < 20; i++) {
      const input = inputFor(i);
      const seed = TEMPLATE_SEEDS[i % TEMPLATE_SEEDS.length];
      const out = await generateDraft(good, knowledge, input, seed.requirePersonalise);
      expect(out.report.ok).toBe(true);
      expect(checkBannedWords(out.draft)).toHaveLength(0);
      expect(checkStats(out.draft, knowledge.proofRules)).toHaveLength(0);
      cleanCount += 1;
    }
    expect(cleanCount).toBe(20);
  });
});

describe("Gate 3 · adversarial — a fake stat can never reach the final draft", () => {
  it("regenerates away a fake stat the model echoed from the notes", async () => {
    // First attempt injects the planted $9M; regeneration returns clean copy.
    const flaky = new FakeModel((req: DraftRequest) =>
      req.attempt === 0 ? CLEAN + " We saved them $9M." : CLEAN
    );

    for (let i = 0; i < 20; i++) {
      const input = inputFor(i);
      const seed = TEMPLATE_SEEDS[i % TEMPLATE_SEEDS.length];
      const out = await generateDraft(flaky, knowledge, input, seed.requirePersonalise);
      expect(out.report.ok).toBe(true);
      expect(out.draft).not.toContain("$9M");
      expect(out.attempts).toBeGreaterThan(1); // the loop had to regenerate
    }
  });

  it("falls back to the vetted template (never a violating draft) if the model won't comply", async () => {
    // A model that stubbornly keeps the fake stat every time.
    const stubborn = new FakeModel(() => CLEAN + " We saved them $9M.");
    const input = inputFor(1);
    const seed = TEMPLATE_SEEDS[1];

    const out = await generateDraft(stubborn, knowledge, input, seed.requirePersonalise);
    expect(out.usedFallback).toBe(true);
    expect(out.requiresReview).toBe(true);
    expect(out.draft).not.toContain("$9M"); // the template has no such number
    expect(checkStats(out.draft, knowledge.proofRules)).toHaveLength(0);
  });

  it("blocks a hard-banned client name (Nike) the same way", async () => {
    const nameLeak = new FakeModel((req: DraftRequest) =>
      req.attempt === 0 ? CLEAN + " Just like we did for Nike." : CLEAN
    );
    const out = await generateDraft(nameLeak, knowledge, inputFor(0), true);
    expect(out.report.ok).toBe(true);
    expect(out.draft.toLowerCase()).not.toContain("nike");
  });
});
