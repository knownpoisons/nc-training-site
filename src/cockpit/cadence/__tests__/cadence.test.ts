import { describe, it, expect } from "vitest";
import {
  scheduleForProspect,
  applySkip,
  applyReply,
  evaluateDormancy,
  hasConsecutiveSkipFlag,
  TOUCH_OFFSETS,
} from "../cadence";
import { addDays, dayOfWeek, isWeekend } from "../dates";
import type { Prospect, Touch } from "../types";

describe("scheduleForProspect — base schedule (days 1, 4, 12, 21)", () => {
  it("places 4 touches at the right offsets when the added day + offsets are all weekdays", () => {
    // 2026-01-05 is a Monday. Offsets 0,3,11,20 → Mon, Thu, Fri, Sun→Mon.
    const s = scheduleForProspect("P1", "2026-01-05");
    expect(s).toHaveLength(4);
    expect(s.map((t) => t.touchNumber)).toEqual([1, 2, 3, 4]);
    // touch 1 = added day
    expect(s[0].dueDate).toBe("2026-01-05");
    // touch 2 = +3 = Thu 2026-01-08
    expect(s[1].dueDate).toBe("2026-01-08");
    // touch 3 = +11 = Fri 2026-01-16
    expect(s[2].dueDate).toBe("2026-01-16");
  });

  it("never schedules a touch on a weekend", () => {
    // Sweep every start day for a fortnight; no touch may land on Sat/Sun.
    for (let i = 0; i < 14; i++) {
      const start = addDays("2026-03-01", i);
      for (const t of scheduleForProspect("P", start)) {
        expect(isWeekend(t.dueDate)).toBe(false);
      }
    }
  });

  it("shifts a weekend touch to the following Monday", () => {
    // touch 4 offset is +20. Find a start where +20 lands on a Saturday.
    // 2026-01-05 + 20 = 2026-01-25 (Sunday) → should shift to Mon 2026-01-26.
    const s = scheduleForProspect("P", "2026-01-05");
    const raw = addDays("2026-01-05", 20);
    expect(dayOfWeek(raw)).toBe(0); // Sunday
    expect(s[3].dueDate).toBe("2026-01-26"); // shifted to Monday
    expect(isWeekend(s[3].dueDate)).toBe(false);
  });

  it("keeps TOUCH_OFFSETS aligned to calendar days 1/4/12/21", () => {
    expect(TOUCH_OFFSETS).toEqual([0, 3, 11, 20]);
  });
});

describe("applySkip — push +2 days, re-shift off weekends, count the skip", () => {
  const base: Touch = {
    prospectId: "P",
    touchNumber: 2,
    dueDate: "2026-01-07", // Wednesday
    sentAt: null,
    skippedCount: 0,
  };

  it("pushes a weekday touch forward exactly 2 days", () => {
    const skipped = applySkip(base);
    expect(skipped.dueDate).toBe("2026-01-09"); // Fri
    expect(skipped.skippedCount).toBe(1);
  });

  it("re-shifts onto Monday when +2 lands on a weekend", () => {
    const fri: Touch = { ...base, dueDate: "2026-01-09" }; // Friday
    const skipped = applySkip(fri); // +2 = Sunday → Monday
    expect(skipped.dueDate).toBe("2026-01-12");
    expect(isWeekend(skipped.dueDate)).toBe(false);
  });

  it("does not mutate the original touch", () => {
    applySkip(base);
    expect(base.dueDate).toBe("2026-01-07");
    expect(base.skippedCount).toBe(0);
  });

  it("flags a prospect after two consecutive skips on the same touch", () => {
    let t = applySkip(base); // skip 1
    expect(hasConsecutiveSkipFlag([t])).toBe(false);
    t = applySkip(t); // skip 2
    expect(hasConsecutiveSkipFlag([t])).toBe(true);
  });
});

describe("applyReply — a reply halts the sequence", () => {
  it("moves the prospect to REPLIED and halts every unsent touch", () => {
    const prospect: Prospect = { id: "P", addedAt: "2026-01-05", stage: "IN_SEQUENCE" };
    const touches = scheduleForProspect("P", "2026-01-05").map((t, i) =>
      i === 0 ? { ...t, sentAt: "2026-01-05" } : t
    );

    const out = applyReply(prospect, touches);
    expect(out.prospect.stage).toBe("REPLIED");

    // touch 1 was sent → left alone; touches 2–4 → halted, never fired
    expect(out.touches[0].halted).toBeUndefined();
    expect(out.touches[1].halted).toBe(true);
    expect(out.touches[2].halted).toBe(true);
    expect(out.touches[3].halted).toBe(true);
    // no unsent touch keeps a live due date it could fire on
    expect(out.touches.filter((t) => !t.sentAt && !t.halted)).toHaveLength(0);
  });
});

describe("evaluateDormancy — dormant after touch 4, resurface in 90 days", () => {
  const prospect: Prospect = { id: "P", addedAt: "2026-01-05", stage: "IN_SEQUENCE" };

  it("does NOT go dormant while touch 4 is unsent", () => {
    const touches = scheduleForProspect("P", "2026-01-05");
    const r = evaluateDormancy(prospect, touches);
    expect(r.dormant).toBe(false);
  });

  it("goes DORMANT once touch 4 is sent with no reply, resurfacing +90 days", () => {
    const touches = scheduleForProspect("P", "2026-01-05").map((t) =>
      t.touchNumber === 4 ? { ...t, sentAt: "2026-01-26" } : { ...t, sentAt: t.dueDate }
    );
    const r = evaluateDormancy(prospect, touches);
    expect(r.dormant).toBe(true);
    expect(r.stage).toBe("DORMANT");
    expect(r.resurfaceAt).toBe(addDays("2026-01-26", 90));
  });

  it("never marks a REPLIED prospect dormant, even if touch 4 was sent", () => {
    const replied: Prospect = { ...prospect, stage: "REPLIED" };
    const touches = scheduleForProspect("P", "2026-01-05").map((t) => ({
      ...t,
      sentAt: t.dueDate,
    }));
    const r = evaluateDormancy(replied, touches);
    expect(r.dormant).toBe(false);
    expect(r.stage).toBe("REPLIED");
  });
});
