import { describe, it, expect } from "vitest";
import { loadProofRules, parseProof } from "../proof";
import { checkStats } from "../statGuard";
import { checkBannedWords } from "../bannedWords";
import { lintDraft } from "../lint";

const rules = loadProofRules(); // reads the real cockpit/knowledge/PROOF.md

describe("PROOF parsing — allow/ban sets from the real file", () => {
  it("clears the locked numbers (drawn from the live site)", () => {
    // $280k, 90%, 30%, $3.5M, $4.5M, $50k all appear in PROOF (live-sourced).
    expect(rules.allowed.has("cur:280000")).toBe(true); // Maesa (live)
    expect(rules.allowed.has("pct:90")).toBe(true);
    expect(rules.allowed.has("pct:30")).toBe(true); // Cash App output (live)
    expect(rules.allowed.has("cur:3500000")).toBe(true);
    expect(rules.allowed.has("cur:4500000")).toBe(true); // Herman Scheer savings (live)
    expect(rules.allowed.has("cur:50000")).toBe(true);
    // $500k was a retired framing — the live HS page states savings, not a shoot cost
    expect(rules.allowed.has("cur:500000")).toBe(false);
  });

  it("bans the retired/hard-banned numbers, even though some digits resemble real ones", () => {
    expect(rules.banned.has("pct:96")).toBe(true);
    expect(rules.banned.has("cur:380000")).toBe(true); // $380k — retired Maesa variant
    expect(rules.banned.has("cur:300000")).toBe(true); // $300k
    // and a banned token is never also allowed
    expect(rules.allowed.has("cur:380000")).toBe(false);
    // 10x is no longer a cleared stat (live Cash App says 30%, not 10x)
    expect(rules.allowed.has("mult:10")).toBe(false);
  });
});

describe("stat guard", () => {
  it("passes a draft using only cleared numbers", () => {
    const draft = "A beauty holding company saved $280k on one brand launch. Worth 15 minutes?";
    expect(checkStats(draft, rules)).toHaveLength(0);
  });

  it("blocks a number that is not in PROOF at all", () => {
    const v = checkStats("We saved them $9M last year.", rules);
    expect(v).toHaveLength(1);
    expect(v[0].reason).toBe("not-in-proof");
  });

  it("blocks an explicitly hard-banned number", () => {
    const v = checkStats("Independent audits show 96% faster output.", rules);
    expect(v.some((x) => x.reason === "banned")).toBe(true);
  });

  it("blocks a drifted variant of a real number", () => {
    expect(checkStats("nearly $4M in assets", rules).some((x) => x.reason !== undefined)).toBe(true);
    expect(checkStats("over 90% faster", rules).some((x) => x.reason === "drifted")).toBe(true);
  });

  it("allows PROOF's own hedge words (roughly / about)", () => {
    expect(checkStats("cut production time by roughly 90%", rules)).toHaveLength(0);
  });

  it("ignores innocuous numbers that are not dollar/percent/multiplier claims", () => {
    const draft = "Worth 15 minutes? The programme is 8 weeks, one hour a week. Two options: Tue or Thu.";
    expect(checkStats(draft, rules)).toHaveLength(0);
  });
});

describe("banned-words linter", () => {
  it("catches sales clichés", () => {
    const hits = checkBannedWords("Let's leverage synergy and circle back to unlock the journey.");
    const terms = hits.map((h) => h.term);
    expect(terms).toContain("leverage");
    expect(terms).toContain("synergy");
    expect(terms).toContain("circle back");
  });

  it("catches banned client names, tool names, and profanity", () => {
    expect(checkBannedWords("We did this for Nike.").some((h) => h.category === "client")).toBe(true);
    expect(checkBannedWords("We use Flora and Weavy.").some((h) => h.category === "tool")).toBe(true);
    expect(checkBannedWords("this shit is good").some((h) => h.category === "profanity")).toBe(true);
  });

  it("passes clean on-voice copy", () => {
    expect(checkBannedWords("I train creative teams to work with AI properly. No pitch.")).toHaveLength(0);
  });
});

describe("lintDraft — the aggregate verdict", () => {
  const opts = { maxWords: 120, requirePersonalise: true };

  it("passes a clean, in-spec draft", () => {
    const draft = "[PERSONALISE — noticed the rebrand]. A beauty holding company saved $280k on one launch. Worth 15 minutes?";
    expect(lintDraft(draft, rules, opts).ok).toBe(true);
  });

  it("hard-fails a missing [PERSONALISE] marker when required", () => {
    const r = lintDraft("Great work lately. Worth 15 minutes?", rules, opts);
    expect(r.ok).toBe(false);
    expect(r.hard.some((h) => /PERSONALISE/.test(h))).toBe(true);
  });

  it("hard-fails an over-length draft", () => {
    const long = "[PERSONALISE]. " + "word ".repeat(130);
    expect(lintDraft(long, rules, opts).ok).toBe(false);
  });

  it("warns (not fails) on American spelling", () => {
    const r = lintDraft("[PERSONALISE]. We optimize color for your team.", rules, opts);
    expect(r.ok).toBe(true);
    expect(r.warnings.some((w) => /American spelling/.test(w))).toBe(true);
  });
});
