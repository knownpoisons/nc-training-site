import { describe, it, expect } from "vitest";
import { runSimulation } from "../simulate";
import { isWeekend } from "../dates";
import { DAILY_CAP } from "../loadBalancer";
import { TOTAL_TOUCHES } from "../cadence";

describe("14-day simulation — Gate 1 dry run", () => {
  const sim = runSimulation("2026-01-05"); // a Monday

  it("prints the day-by-day schedule for eyeball review", () => {
    // Printed once so Jem can read the whole fortnight in the test output.
    console.log("\n" + sim.printout + "\n");
    expect(sim.printout).toContain("14-DAY SIMULATION");
  });

  it("seeds 12 prospects and loses no touches (12 × 4 = 48)", () => {
    expect(sim.prospects).toHaveLength(12);
    expect(sim.totalTouches).toBe(12 * TOTAL_TOUCHES);
    expect(sim.totalTouches).toBe(48);
  });

  it("never exceeds the daily cap of 8", () => {
    expect(sim.maxPerDay).toBeLessThanOrEqual(DAILY_CAP);
  });

  it("fires no touch on a weekend", () => {
    expect(sim.weekendTouches).toBe(0);
    for (const t of sim.scheduled) expect(isWeekend(t.dueDate)).toBe(false);
  });

  it("gives every prospect exactly 4 touches, numbered 1–4", () => {
    for (const p of sim.prospects) {
      const mine = sim.scheduled
        .filter((t) => t.prospectId === p.id)
        .map((t) => t.touchNumber)
        .sort();
      expect(mine).toEqual([1, 2, 3, 4]);
    }
  });
});
