import { describe, it, expect } from "vitest";
import { balance, DAILY_CAP, loadByDay } from "../loadBalancer";
import { isWeekend } from "../dates";
import type { Touch } from "../types";

/** Build N touches all due on the same day, one per prospect. */
function sameDayTouches(day: string, prospectAddedDays: Record<string, string>): {
  touches: Touch[];
  addedAt: Map<string, string>;
} {
  const touches: Touch[] = Object.keys(prospectAddedDays).map((pid) => ({
    prospectId: pid,
    touchNumber: 1,
    dueDate: day,
    sentAt: null,
    skippedCount: 0,
  }));
  return { touches, addedAt: new Map(Object.entries(prospectAddedDays)) };
}

describe("load balancer — daily cap of 8", () => {
  it("keeps a day at or under the cap and rolls overflow to the next weekday", () => {
    // 10 prospects all due Wednesday 2026-01-07. Cap 8 → 2 roll to Thursday.
    const added: Record<string, string> = {};
    for (let i = 1; i <= 10; i++) {
      added[`P${String(i).padStart(2, "0")}`] = `2026-01-0${i <= 9 ? i : 0}`.slice(0, 10);
    }
    // Give them distinct, ascending added days so priority is unambiguous.
    for (let i = 1; i <= 10; i++) added[`P${String(i).padStart(2, "0")}`] = `2025-12-${String(10 + i)}`;

    const { touches, addedAt } = sameDayTouches("2026-01-07", added);
    const out = balance(touches, addedAt);

    const counts = loadByDay(out);
    for (const [, n] of counts) expect(n).toBeLessThanOrEqual(DAILY_CAP);

    // Nothing lost.
    expect(out).toHaveLength(10);
    // Wednesday holds exactly the cap; the 2 latest-added overflow forward.
    expect(counts.get("2026-01-07")).toBe(DAILY_CAP);
  });

  it("earliest-added prospect keeps the slot; latest-added overflows", () => {
    const added: Record<string, string> = {};
    // P01 added first … P10 added last.
    for (let i = 1; i <= 10; i++) added[`P${String(i).padStart(2, "0")}`] = `2025-12-${String(10 + i)}`;

    const { touches, addedAt } = sameDayTouches("2026-01-07", added);
    const out = balance(touches, addedAt);

    const wed = out.filter((t) => t.dueDate === "2026-01-07").map((t) => t.prospectId).sort();
    // The 8 earliest-added (P01..P08) keep Wednesday.
    expect(wed).toEqual(["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08"]);

    // The 2 latest-added (P09, P10) rolled forward off Wednesday.
    const overflow = out.filter((t) => ["P09", "P10"].includes(t.prospectId));
    for (const t of overflow) expect(t.dueDate).not.toBe("2026-01-07");
  });

  it("rolls overflow across multiple days when a day is very overloaded", () => {
    const added: Record<string, string> = {};
    for (let i = 1; i <= 20; i++) added[`P${String(i).padStart(2, "0")}`] = `2025-12-${String(i).padStart(2, "0")}`;

    const { touches, addedAt } = sameDayTouches("2026-01-06", added); // Tuesday
    const out = balance(touches, addedAt);

    // No day over cap, nothing lost, nothing on a weekend.
    const counts = loadByDay(out);
    for (const [, n] of counts) expect(n).toBeLessThanOrEqual(DAILY_CAP);
    expect(out).toHaveLength(20);
    for (const t of out) expect(isWeekend(t.dueDate)).toBe(false);
  });

  it("never places rolled-over touches on a weekend", () => {
    const added: Record<string, string> = {};
    for (let i = 1; i <= 30; i++) added[`P${String(i).padStart(2, "0")}`] = `2025-12-${String(i).padStart(2, "0")}`;
    const { touches, addedAt } = sameDayTouches("2026-01-09", added); // Friday — overflow would hit the weekend
    const out = balance(touches, addedAt);
    for (const t of out) expect(isWeekend(t.dueDate)).toBe(false);
    expect(out).toHaveLength(30);
  });

  it("counts already-sent touches against the cap but never moves them", () => {
    const added: Record<string, string> = {};
    for (let i = 1; i <= 9; i++) added[`P${String(i).padStart(2, "0")}`] = `2025-12-${String(10 + i)}`;
    const { touches, addedAt } = sameDayTouches("2026-01-07", added);
    // Mark the latest-added prospect's touch as already sent — it must stay put.
    const sent = touches.map((t) => (t.prospectId === "P09" ? { ...t, sentAt: "2026-01-07" } : t));

    const out = balance(sent, addedAt);
    const p09 = out.find((t) => t.prospectId === "P09")!;
    expect(p09.dueDate).toBe("2026-01-07"); // sent touch never moved
    const counts = loadByDay(out);
    expect(counts.get("2026-01-07")).toBeLessThanOrEqual(DAILY_CAP);
  });
});
