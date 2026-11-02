import { describe, expect, it } from "vitest";
import { INTAKE_QS, missingQuestions } from "../intake";

function full(): Record<string, unknown> {
  const a: Record<string, unknown> = {};
  for (const q of INTAKE_QS) {
    if (q.kind === "grid") q.rows.forEach((r) => (a[r.col] = q.numeric ? 3 : q.options[1]));
    else if (q.kind === "multi") a[q.col] = [q.options[0]];
    else if (q.kind === "pills") { a[q.col] = q.options[0]; if (q.why) a[q.why.col] = "because"; }
    else if (q.kind === "scale") a[q.col] = 3;
    else a[q.col] = "an answer";
  }
  return a;
}

describe("intake gate: every question is required", () => {
  it("has no optional questions", () => expect(INTAKE_QS.some((q) => (q as { optional?: boolean }).optional)).toBe(false));
  it("a full set of answers is complete", () => expect(missingQuestions(full() as never)).toEqual([]));
  it("empty answers miss all 20", () => expect(missingQuestions({})).toHaveLength(INTAKE_QS.length));
  it("a blank long answer is caught", () => { const a = full(); a.anything_else = "   "; expect(missingQuestions(a as never)).toEqual(["anything_else"]); });
  it("one blank grid row is caught", () => { const a = full(); delete a.h_timesheets; expect(missingQuestions(a as never)).toEqual(["hours"]); });
  it("'Other' needs its text", () => { const a = full(); a.role = "Other"; expect(missingQuestions(a as never)).toEqual(["role"]); a.role_other = "Producer"; expect(missingQuestions(a as never)).toEqual([]); });
  it("the feeling follow-up is required", () => { const a = full(); a.feeling_why = ""; expect(missingQuestions(a as never)).toEqual(["feeling"]); });
});
