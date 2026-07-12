// ═══════════════════════════════════════════════════════════════════════════════
// GATE 4 — scoreboard (hand-calculated), newsletter (paste-ready + guarded),
// weekly digest round-trip, and the volume governor.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { computeScoreboard, type ScoreboardInput } from "../scoreboard";
import { buildNewsletter } from "../newsletter";
import { runWeeklyDigest } from "../digest";
import { handleMessage } from "../handle";
import { assignPromotionDates, shouldPromptRaise, clampVolume } from "../governor";
import { promoteLeads } from "../digest";
import { MemoryStore } from "../../store/memory";
import { FakeSlack } from "../../slack/fake";
import { loadKnowledge } from "../../draft/knowledge";
import { FakeModel, type DraftRequest } from "../../draft/model";
import { FakeLinkReader } from "../linkReader";

// ─── F6 SCOREBOARD — hand-calculated week ───────────────────────────────────────
describe("Gate 4 · scoreboard computes correctly (hand-calc)", () => {
  // Week Mon 2026-06-01 … Sun 2026-06-07. Program started 2026-05-01.
  const input: ScoreboardInput = {
    weekStart: "2026-06-01",
    weekEnd: "2026-06-07",
    today: "2026-06-05",
    programStart: "2026-05-01",
    prospects: [
      { id: "P1", sourceEngine: "outbound", track: "A" },
      { id: "P2", sourceEngine: "partner", track: "A" },
      { id: "P3", sourceEngine: "list", track: "B" },
    ],
    touches: [
      { prospectId: "P1", dueDate: "2026-06-02", sentAt: "2026-06-02" }, // in week, sent
      { prospectId: "P2", dueDate: "2026-06-03", sentAt: "2026-06-03" }, // in week, sent
      { prospectId: "P3", dueDate: "2026-06-04", sentAt: "2026-06-04" }, // in week, sent
      { prospectId: "P1", dueDate: "2026-06-06", sentAt: null }, // in week, due but unsent
      { prospectId: "P1", dueDate: "2026-05-20", sentAt: "2026-05-20" }, // older, sent (all-time)
    ],
    events: [
      { prospectId: "P1", type: "reply", at: "2026-06-03" },
      { prospectId: "P2", type: "call_booked", at: "2026-06-04" },
      { prospectId: "P1", type: "closed_won", at: "2026-06-05" },
    ],
  };

  const s = computeScoreboard(input);

  it("totals: sent 3 of 4 due (75%), 1 reply, 1 call, 1 close", () => {
    expect(s.sent).toBe(3);
    expect(s.due).toBe(4);
    expect(s.completion).toBeCloseTo(0.75, 5);
    expect(s.replies).toBe(1);
    expect(s.callsBooked).toBe(1);
    expect(s.closes).toBe(1);
    expect(s.replyRate).toBeCloseTo(1 / 3, 5);
  });

  it("per track: A leads (2 sent, 1 reply, 1 call, 1 close) vs B (1 sent)", () => {
    expect(s.perTrack.A).toEqual({ sent: 2, replies: 1, calls: 1, closes: 1 });
    expect(s.perTrack.B).toEqual({ sent: 1, replies: 0, calls: 0, closes: 0 });
    expect(s.trackLeader).toBe("A");
  });

  it("per engine: outbound/partner/list each carry their one sent touch", () => {
    expect(s.perEngine.outbound.sent).toBe(1);
    expect(s.perEngine.outbound.replies).toBe(1);
    expect(s.perEngine.partner.calls).toBe(1);
    expect(s.perEngine.list.sent).toBe(1);
  });

  it("day-90 countdown: 90 − 35 days elapsed = 55 left", () => {
    expect(s.day90DaysRemaining).toBe(55);
  });

  it("honesty line uses plan assumptions below 20 all-time touches", () => {
    expect(s.allTimeSent).toBe(4);
    expect(s.usingRealData).toBe(false);
    expect(s.honestyLine).toMatch(/plan assumptions/i);
  });
});

// ─── F7 NEWSLETTER ──────────────────────────────────────────────────────────────
describe("Gate 4 · newsletter builder", () => {
  const knowledge = loadKnowledge();
  const GOOD =
    "SUBJECT 1: The month in one idea\nSUBJECT 2: What we learned\nSUBJECT 3: A short note\n" +
    "===BODY===\nThis month, a beauty holding company saved $280k on one brand launch — nine months down to three months. Here's what that actually takes.";

  it("composes from dropped ideas, paste-ready, 3 subjects, guards passing", async () => {
    const model = new FakeModel(() => GOOD);
    const out = await buildNewsletter(model, knowledge, {
      monthLabel: "July 2026",
      notes: [
        { text: "AI won't replace taste — it raises the floor." },
        { text: "This piece on creative judgement", url: "https://example.com/taste" },
      ],
    });
    expect(out.subjects).toHaveLength(3);
    expect(out.body).toContain("$280k");
    expect(out.report.ok).toBe(true);
    expect(out.usedFallback).toBe(false);
    expect(out.machineSourced).toBe(false);
  });

  it("flags machine-sourced when Jem dropped no ideas", async () => {
    const model = new FakeModel(() => GOOD);
    const out = await buildNewsletter(model, knowledge, { monthLabel: "July 2026", notes: [], activitySummary: "3 calls booked, 2 agencies replied." });
    expect(out.machineSourced).toBe(true);
  });

  it("regenerates away an unverified number, never shipping it", async () => {
    const flaky = new FakeModel((r: DraftRequest) => (r.attempt === 0 ? GOOD + " We also saved someone $9M." : GOOD));
    const out = await buildNewsletter(flaky, knowledge, { monthLabel: "July 2026", notes: [{ text: "x" }] });
    expect(out.report.ok).toBe(true);
    expect(out.body).not.toContain("$9M");
  });

  it("reads a dropped link and feeds its contents to the model", async () => {
    let capturedUser = "";
    const model = new FakeModel((r: DraftRequest) => {
      capturedUser = r.user;
      return GOOD;
    });
    const reader = new FakeLinkReader((url) => ({ url, title: "Why craft still wins", excerpt: "The piece argues taste is the moat." }));
    await buildNewsletter(
      model,
      knowledge,
      { monthLabel: "July 2026", notes: [{ text: "great read", url: "https://example.com/x" }] },
      reader
    );
    expect(capturedUser).toContain("Why craft still wins"); // link title reached the model
    expect(capturedUser).toContain("taste is the moat"); // link excerpt too
  });

  it("survives a dead link without breaking the build", async () => {
    const model = new FakeModel(() => GOOD);
    const reader = new FakeLinkReader(() => null); // link won't open
    const out = await buildNewsletter(
      model,
      knowledge,
      { monthLabel: "July 2026", notes: [{ text: "broken", url: "https://nope.example" }] },
      reader
    );
    expect(out.report.ok).toBe(true);
  });
});

describe("Gate 4 · newsletter content inbox (note capture)", () => {
  it("`note`/`idea` bank ideas for the month; a URL is captured as a link", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    const ctx = { channel: "#c", today: "2026-07-11", nowIso: "2026-07-11T10:00:00Z", messageTs: "u1" };

    await handleMessage(store, slack, ctx, "idea: taste is the skill AI can't copy");
    await handleMessage(store, slack, ctx, "note read this https://example.com/great-piece");

    const notes = await store.getNewsletterNotes("2026-07");
    expect(notes).toHaveLength(2);
    expect(notes[1].url).toBe("https://example.com/great-piece");
    expect(slack.messages.some((m) => /banked this month/i.test(m.text))).toBe(true);
  });

  it("`notes` lists what's banked for the month", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    const ctx = { channel: "#c", today: "2026-07-11", nowIso: "2026-07-11T10:00:00Z" };
    await handleMessage(store, slack, ctx, "idea one thing");
    slack.reset();
    await handleMessage(store, slack, ctx, "notes");
    expect(slack.messages[0].text).toMatch(/1\. one thing/);
  });
});

// ─── F11 DIGEST + governor ──────────────────────────────────────────────────────
describe("Gate 4 · weekly digest + promotion", () => {
  const MON = "2026-06-01"; // a Monday

  function seedLeads(store: MemoryStore, n: number) {
    for (let i = 1; i <= n; i++) {
      store.seedProspect({
        id: `L${i}`, name: `Lead ${i}`, company: `Co ${i}`, addedAt: "2026-05-15",
        stage: "NEW", score: 100 - i, tier: "A", sources: ["community"], consentLane: "pipeline",
        dossier: `Dossier for lead ${i}.`,
      });
    }
  }

  it("posts the top queued leads and saves the digest", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedLeads(store, 12);
    const res = await runWeeklyDigest(store, slack, "#c", MON, `${MON}T15:00:00Z`);
    expect(res.count).toBe(10); // capped at DIGEST_SIZE
    expect(slack.messages).toHaveLength(1);
    const digest = await store.getDigest(MON);
    expect(digest!.actions).toHaveLength(10);
    expect(digest!.actions[0].label).toContain("Lead 1"); // highest score first
  });

  it("promote round-trips: NEW lead → IN_SEQUENCE with a schedule", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedLeads(store, 3);
    await runWeeklyDigest(store, slack, "#c", MON, `${MON}T15:00:00Z`);
    slack.reset();

    await handleMessage(store, slack, { channel: "#c", today: MON, nowIso: `${MON}T16:00:00Z`, messageTs: "u1" }, "promote 1 2");

    const counts = await store.pipelineCounts();
    expect(counts.IN_SEQUENCE).toBe(2);
    expect(counts.NEW).toBe(1);
    // promoted leads got a 4-touch schedule
    const l1 = (await store.getQueuedLeads(10)).find((p) => p.id === "L1");
    expect(l1).toBeUndefined(); // no longer NEW
    expect(store.allTouchesFor("L1")).toHaveLength(4);
    expect(slack.messages.some((m) => /promoted into sequence/i.test(m.text))).toBe(true);
  });

  it("bin round-trips: NEW lead → LOST, out of the queue", async () => {
    const store = new MemoryStore();
    const slack = new FakeSlack();
    seedLeads(store, 3);
    await runWeeklyDigest(store, slack, "#c", MON, `${MON}T15:00:00Z`);
    await handleMessage(store, slack, { channel: "#c", today: MON, nowIso: `${MON}T16:00:00Z` }, "bin 3");
    const counts = await store.pipelineCounts();
    expect(counts.LOST).toBe(1);
  });

  it("governor staggers promotions past the weekly cap into future weeks", async () => {
    const store = new MemoryStore();
    seedLeads(store, 8);
    const summary = await promoteLeads(store, ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"], MON, 6, "test");
    expect(summary.promotedThisWeek).toHaveLength(6); // cap 6 this week
    expect(summary.deferred).toHaveLength(2); // 2 pushed forward
    expect(summary.deferred.every((d) => d.date === "2026-06-08")).toBe(true); // next Monday
  });
});

describe("Gate 4 · volume governor rules", () => {
  it("assigns dates respecting remaining slots this week", () => {
    const dates = assignPromotionDates(4, 5, 6, "2026-06-01"); // 1 slot left this week
    expect(dates[0]).toBe("2026-06-01");
    expect(dates.slice(1)).toEqual(["2026-06-08", "2026-06-08", "2026-06-08"]);
  });

  it("prompts to raise only after 3 straight weeks ≥80%, never above 8", () => {
    expect(shouldPromptRaise([0.9, 0.85, 0.82], 6)).toBe(true);
    expect(shouldPromptRaise([0.7, 0.9, 0.9], 6)).toBe(false); // one week below
    expect(shouldPromptRaise([0.9, 0.9, 0.9], 8)).toBe(false); // already at ceiling
  });

  it("clamps volume to 1–8", () => {
    expect(clampVolume(12)).toBe(8);
    expect(clampVolume(0)).toBe(1);
    expect(clampVolume(7)).toBe(7);
  });
});
