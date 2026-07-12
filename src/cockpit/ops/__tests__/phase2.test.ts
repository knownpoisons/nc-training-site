// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 WAVE 1 — auto-research on add (A1), Granola debrief intake (A3),
// funnel forecast (A4), booking link (B4), deal receipt (F1), roast wiring (F2),
// playbook fortune (F5).
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { MemoryStore } from "../../store/memory";
import { FakeSlack } from "../../slack/fake";
import { handleMessage } from "../handle";
import { runMorningBrief, fortuneFor, renderBrief } from "../brief";
import { renderDealReceipt } from "../handle";
import { computeScoreboard } from "../scoreboard";
import { buildUserPrompt } from "../../draft/prompt";
import { loadKnowledge } from "../../draft/knowledge";
import { FakeModel, type DraftRequest } from "../../draft/model";
import type { StoreProspect } from "../../store/types";

const CHANNEL = "#c";
const TODAY = "2026-07-13"; // Monday
const ctx = { channel: CHANNEL, today: TODAY, nowIso: `${TODAY}T18:00:00Z`, messageTs: "u1" };

describe("A1 · auto-research on add", () => {
  it("fires the enrich hook with the created prospect and says so", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    const enriched: string[] = [];
    const enrich = async (p: StoreProspect) => {
      enriched.push(p.name);
      await store.setDossier(p.id, "Founder of Orbit (orbit.co/about).", "the rebrand");
    };
    await handleMessage(store, slack, { ...ctx, enrich }, "add Nia Park, VP Marketing, Orbit");
    expect(enriched).toEqual(["Nia Park"]);
    expect(slack.transcript).toMatch(/researching them now/i);
    const p = await store.findProspectByName("Nia Park");
    expect(p!.dossier).toMatch(/orbit\.co/);
  });
});

describe("A3 · Granola debrief intake", () => {
  const knowledge = loadKnowledge();
  const DISTILLED =
    "CARED: production speed on seasonal launches\nOBJECTIONS: price vs DIY\nPERSONAL: two kids, surfs\nNEXT: proposal by Friday\nREAD: warm, wants proof";

  it("`debrief dana` arms the pending state; the paste distills onto the card", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    store.seedProspect({ id: "P1", name: "Dana Lee", company: "Acme", addedAt: "2026-07-01", stage: "CALL" });
    const model = new FakeModel((r: DraftRequest) => (r.system.includes("distill") || r.system.includes("call brief") ? DISTILLED : "x"));

    await handleMessage(store, slack, { ...ctx, draftCtx: { model, knowledge } }, "debrief dana");
    expect(slack.transcript).toMatch(/paste the granola transcript/i);
    slack.reset();

    await handleMessage(store, slack, { ...ctx, draftCtx: { model, knowledge } }, "Jem: so tell me about your workflow... Dana: honestly our seasonal launches take forever...");
    const p = await store.getProspect("P1");
    expect(p!.callBrief).toContain("CARED:");
    expect(p!.callBrief).toContain("proposal by Friday");
    const d = await store.getProspectDetail("P1");
    expect(d!.events.some((e) => e.type === "call_debrief")).toBe(true);
    expect(slack.transcript).toMatch(/mined it/i);
    expect(await store.getPending()).toBeNull();
  });

  it("the call brief reaches the draft prompt for follow-ups", () => {
    const prompt = buildUserPrompt({
      prospect: { name: "Dana", role: null, company: "Acme", notes: null, linkedinUrl: null },
      touchNumber: 5,
      lane: "followup",
      templateBody: "Day-2 value touch: [CALL DETAIL].",
      maxWords: 120,
      callBrief: DISTILLED,
    });
    expect(prompt).toContain("Call brief");
    expect(prompt).toContain("seasonal launches");
  });
});

describe("A4 · funnel forecast", () => {
  const base = {
    weekStart: "2026-07-13", weekEnd: "2026-07-19", today: "2026-07-17", programStart: "2026-07-01",
    prospects: [{ id: "P1", name: "X", sourceEngine: "outbound" as const, track: null }],
  };

  it("uses plan assumptions below 20 touches and names the basis", () => {
    const sb = computeScoreboard({ ...base, touches: [], events: [] });
    expect(sb.forecastLine).toMatch(/plan assumptions/);
    expect(sb.forecastLine).toMatch(/\$\d+k\/yr/);
  });

  it("hand-calc with real data: 40 sent, 8 replies, 4 calls, 2 wins → ~$130k/yr, lever = reply rate", () => {
    const touches = Array.from({ length: 40 }, (_, i) => ({ prospectId: "P1", dueDate: "2026-06-01", sentAt: "2026-06-01", skippedCount: 0 }));
    const events = [
      ...Array.from({ length: 8 }, () => ({ prospectId: "P1", type: "reply" as const, at: "2026-06-02" })),
      ...Array.from({ length: 4 }, () => ({ prospectId: "P1", type: "call_booked" as const, at: "2026-06-03" })),
      ...Array.from({ length: 2 }, () => ({ prospectId: "P1", type: "closed_won" as const, at: "2026-06-04" })),
    ];
    const sb = computeScoreboard({ ...base, touches, events, weeklyVolume: 6, avgDealValue: 50000, annualTarget: 700000 });
    // 6*52 * (8/40) * (4/8) * (2/4) * 50k = 312 * .2 * .5 * .5 * 50000 = $780k → on pace
    expect(sb.forecastLine).toMatch(/on pace|\$780k/);
  });
});

describe("B4 · booking link", () => {
  it("threads settings.bookingUrl into draft prompts via the brief", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    await store.updateSettings({ bookingUrl: "https://calendar.app.google/t363uRxBKHW53Ggr7" });
    store.seedProspect({ id: "P1", name: "Dana Lee", addedAt: "2026-07-01" });
    const ts = store.seedSchedule("P1", "2026-07-01");
    store.setTouch(ts[0].id, { dueDate: TODAY });

    let captured = "";
    const model = new FakeModel((r: DraftRequest) => {
      captured = r.user;
      return "Hey Dana — quick hello. No stress if the timing's off.";
    });
    await runMorningBrief(store, slack, CHANNEL, TODAY, `${TODAY}T17:00:00Z`, { model, knowledge: loadKnowledge() });
    expect(captured).toContain("calendar.app.google");
  });

  it("`set booking <url>` updates settings", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    await handleMessage(store, slack, ctx, "set booking https://cal.example/jem");
    expect((await store.getSettings()).bookingUrl).toBe("https://cal.example/jem");
  });
});

describe("F1 · the deal receipt", () => {
  it("`won` prints a receipt with the barcode and running total", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    store.seedProspect({ id: "P1", name: "Dana Lee", company: "Acme", addedAt: "2026-06-01", dealValue: 50000 });
    const ts = store.seedSchedule("P1", "2026-06-01");
    store.setTouch(ts[0].id, { dueDate: TODAY });
    await runMorningBrief(store, slack, CHANNEL, TODAY, `${TODAY}T17:00:00Z`);
    slack.reset();

    await handleMessage(store, slack, ctx, "won 1");
    expect(slack.transcript).toMatch(/DEAL RECEIPT/);
    expect(slack.transcript).toMatch(/▮/);
    expect(slack.transcript).toMatch(/\$50k of \$700k/);
    expect(slack.transcript).toMatch(/Door→close 42 days/);
  });

  it("renderDealReceipt is deterministic and proportional", () => {
    const r = renderDealReceipt({ dealNumber: 3, name: "X", company: null, value: 50000, daysToClose: 10, lane: "community", wonValue: 350000, target: 700000 });
    expect(r).toContain("No.       003");
    expect((r.match(/▮/g) ?? []).length).toBe(10); // half the 20-tick bar
  });
});

describe("F2 · roast wiring", () => {
  it("`roast` calls the roaster and posts its output", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    await handleMessage(store, slack, { ...ctx, roast: async () => "Your pipeline has one prospect and it's you." }, "roast me");
    expect(slack.transcript).toMatch(/one prospect and it's you/);
  });
});

describe("F5 · playbook fortune", () => {
  it("each brief ends with a doctrine line; stable per day", () => {
    expect(fortuneFor("2026-07-13")).toBe(fortuneFor("2026-07-13"));
    expect(fortuneFor("2026-07-13")).toMatch(/^_.+_$/);
    const brief = renderBrief(
      [{ n: 1, kind: "touch", prospectId: "P", touchId: "t", touchNumber: 1, label: "X · touch 1", contextLine: "c", draftText: "d", intel: { wayIn: null, linkedinUrl: null, dossier: null } }],
      0,
      "2026-07-13"
    );
    expect(brief).toMatch(/_.+_$/m);
  });
});
