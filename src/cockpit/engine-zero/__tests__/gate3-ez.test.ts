// ═══════════════════════════════════════════════════════════════════════════════
// GATE 3 (Engine Zero additions) — dedupe, consent, dossier guard, scoring, and
// importer sanity against the REAL source files.
// ═══════════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { runMorningBrief } from "../../ops/brief";
import { FakeSlack } from "../../slack/fake";
import { dedupe } from "../dedupe";
import { scoreLead } from "../score";
import { ingest } from "../ingest";
import { guardDossier, HONEST_FALLBACK } from "../dossierGuard";
import { enrichLead, enrichTierA, FakeEnrichment } from "../enrich";
import { parseCommunityCsv, parseBeehiivCsv, parseLinkedInConnections } from "../parse";
import type { RawLead } from "../types";

const TODAY = "2026-07-10";
const SRC = path.join(process.cwd(), "cockpit", "Sources of Leads");
const LI = path.join(SRC, "Complete_LinkedInDataExport_03-13-2026.zip");

function raw(partial: Partial<RawLead> & Pick<RawLead, "source">): RawLead {
  return {
    name: null, email: null, company: null, role: null, linkedinUrl: null,
    consentLane: "pipeline", engagementRecency: null, sourceDetail: {},
    ...partial,
  };
}

// ─── DEDUPE ────────────────────────────────────────────────────────────────────
describe("Gate 3 · dedupe — same person across 3 sources → one record, stacked", () => {
  it("merges on email, stacks sources, and boosts to Tier A", () => {
    const leads: RawLead[] = [
      raw({ source: "community", name: "Dana Okafor", email: "dana@ridgeline.co", company: "Ridgeline", role: "Founder", engagementRecency: "2026-06-20" }),
      raw({ source: "linkedin", name: "Dana Okafor", email: "dana@ridgeline.co", linkedinUrl: "https://linkedin.com/in/danaokafor" }),
      raw({ source: "scorecard", name: "Dana Okafor", email: "DANA@ridgeline.co", engagementRecency: "2026-07-01" }),
    ];
    const merged = dedupe(leads);
    expect(merged).toHaveLength(1);
    expect(merged[0].sources.sort()).toEqual(["community", "linkedin", "scorecard"]);
    // fields filled from across sources
    expect(merged[0].company).toBe("Ridgeline");
    expect(merged[0].linkedinUrl).toContain("danaokafor");
    // most-recent engagement kept
    expect(merged[0].engagementRecency).toBe("2026-07-01");

    const scored = scoreLead(merged[0], TODAY);
    expect(scored.tier).toBe("A"); // 3 stacked sources → A by rule
  });

  it("falls back to name+company when an email is missing", () => {
    const leads: RawLead[] = [
      raw({ source: "community", name: "Sam Ruiz", company: "Fable Studio", role: "CD" }),
      raw({ source: "linkedin", name: "Sam Ruiz", company: "Fable Studio", linkedinUrl: "https://linkedin.com/in/samruiz" }),
    ];
    const merged = dedupe(leads);
    expect(merged).toHaveLength(1);
    expect(merged[0].sources.sort()).toEqual(["community", "linkedin"]);
  });

  it("keeps genuinely different people separate", () => {
    const leads = [
      raw({ source: "community", name: "A One", email: "a@x.com" }),
      raw({ source: "community", name: "B Two", email: "b@x.com" }),
    ];
    expect(dedupe(leads)).toHaveLength(2);
  });
});

// ─── CONSENT ────────────────────────────────────────────────────────────────────
describe("Gate 3 · consent — subscribers land broadcast_only and cannot be sequenced", () => {
  it("ingests a subscriber sample as broadcast_only, stage NEW, absent from the brief", async () => {
    const store = new MemoryStore();
    const subs: RawLead[] = Array.from({ length: 8 }, (_, i) =>
      raw({ source: "beehiiv", email: `sub${i}@example.com`, consentLane: "broadcast_only" })
    );
    const res = await ingest(store, subs, TODAY);

    // every ingested sub is broadcast_only, none pipeline
    expect(res.byConsent.broadcast_only).toBe(res.created);
    expect(res.byConsent.pipeline).toBe(0);

    // stage NEW (queued), and the importer created no sequence
    const counts = await store.pipelineCounts();
    expect(counts.NEW).toBe(res.created);
    expect(counts.IN_SEQUENCE).toBe(0);

    // the brief (which only surfaces IN_SEQUENCE/REPLIED) shows none of them
    const slack = new FakeSlack();
    const brief = await runMorningBrief(store, slack, "#c", TODAY, `${TODAY}T17:00:00Z`);
    expect(brief.actionCount).toBe(0);
  });
});

// ─── DOSSIER GUARD ──────────────────────────────────────────────────────────────
describe("Gate 3 · dossier guard — no citation, no claim", () => {
  it("keeps only cited claims", () => {
    const g = guardDossier(
      [
        { text: "Founded Ridgeline in 2019", sourceUrl: "https://ridgeline.co/about" },
        { text: "Reportedly loves sailing", sourceUrl: null }, // uncited → stripped
      ],
      "Lead with the rebrand angle"
    );
    expect(g.honest).toBe(false);
    expect(g.claims).toHaveLength(1);
    expect(g.line).toContain("ridgeline.co/about");
    expect(g.line).not.toContain("sailing");
  });

  it("thin web presence → honest fallback, no filler, no opener biography", () => {
    const g = guardDossier([{ text: "Might be a designer", sourceUrl: null }], "some angle");
    expect(g.honest).toBe(true);
    expect(g.line).toBe(HONEST_FALLBACK);
    expect(g.claims).toHaveLength(0);
    expect(g.openerAngle).toBeNull(); // can't assert an angle with no facts
  });

  it("rejects a non-http citation as uncited", () => {
    const g = guardDossier([{ text: "x", sourceUrl: "not-a-url" }], null);
    expect(g.honest).toBe(true);
  });

  it("enrichment runs the guard regardless of provider output", async () => {
    const provider = new FakeEnrichment(() => ({
      claims: [{ text: "Invented bio with no source", sourceUrl: null }],
      openerAngle: "fabricated angle",
    }));
    const dossier = await enrichLead(provider, dedupe([raw({ source: "linkedin", name: "Ghost" })])[0]);
    expect(dossier.honest).toBe(true); // the uncited claim never survives
  });

  it("Tier-A enrichment caps at 10/day and defers the rest", async () => {
    const provider = new FakeEnrichment(() => ({ claims: [{ text: "cited", sourceUrl: "https://x.com" }], openerAngle: null }));
    const leads = Array.from({ length: 14 }, (_, i) => dedupe([raw({ source: "scorecard", email: `p${i}@x.com` })])[0]);
    const { dossiers, deferred } = await enrichTierA(provider, leads);
    expect(dossiers).toHaveLength(10);
    expect(deferred).toBe(4);
  });
});

// ─── SCORING ────────────────────────────────────────────────────────────────────
describe("Gate 3 · Pass-1 scoring", () => {
  it("a cold single subscriber with no role scores Tier C", () => {
    const m = dedupe([raw({ source: "beehiiv", email: "x@y.com", consentLane: "broadcast_only", engagementRecency: "2023-01-01" })]);
    expect(scoreLead(m[0], TODAY).tier).toBe("C");
  });

  it("a senior, recent, single-source community lead scores well", () => {
    const m = dedupe([raw({ source: "community", name: "Jo Lee", company: "Lee Agency", role: "Founder / CEO", engagementRecency: "2026-07-01" })]);
    expect(scoreLead(m[0], TODAY).tier).not.toBe("C");
  });
});

// ─── REAL-FILE IMPORTER SANITY ──────────────────────────────────────────────────
describe("Gate 3 · importers parse the REAL files", () => {
  it("community CSV → leads, pipeline consent, test row filtered", () => {
    const csv = fs.readFileSync(path.join(SRC, "Creative Agency Owners Community - Intake Form.csv"), "utf8");
    const leads = parseCommunityCsv(csv);
    expect(leads.length).toBeGreaterThan(150);
    expect(leads.every((l) => l.consentLane === "pipeline")).toBe(true);
    expect(leads.every((l) => l.source === "community")).toBe(true);
    // the "Tes"/"Test" seed row is filtered out
    expect(leads.some((l) => (l.name ?? "").toLowerCase() === "tes")).toBe(false);
  });

  it("Beehiiv CSV → active subs, ALL broadcast_only", () => {
    const csv = fs.readFileSync(path.join(SRC, "notcontent-a-not-confusing-newsletter-about-ai-for-creatives-brands-subscribers-2026-07-10.csv"), "utf8");
    const leads = parseBeehiivCsv(csv);
    expect(leads.length).toBeGreaterThan(1000);
    expect(leads.every((l) => l.consentLane === "broadcast_only")).toBe(true);
    expect(leads.every((l) => l.email)).toBe(true);
  });

  it("LinkedIn Connections → leads past the 3-line preamble", () => {
    const csv = fs.readFileSync(path.join(LI, "Connections.csv"), "utf8");
    const leads = parseLinkedInConnections(csv);
    expect(leads.length).toBeGreaterThan(2000);
    expect(leads.every((l) => l.source === "linkedin")).toBe(true);
    expect(leads.some((l) => l.company)).toBe(true);
  });
});
