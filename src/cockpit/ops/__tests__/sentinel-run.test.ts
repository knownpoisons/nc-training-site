// LIVE morning-sentinel check against Supabase. Gated behind RUN_SENTINEL. Prints
// SENTINEL_ISSUES: <json> so the /sentinel agent can decide whether to alert.
// Read-only — never changes state.
//
// Run: RUN_SENTINEL=1 npx vitest run --config vitest.config.ts \
//      src/cockpit/ops/__tests__/sentinel-run.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { SupabaseStore } from "../../store/supabase";
import { runSentinelChecks, renderSentinelAlert } from "../sentinel";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

describe.runIf(process.env.RUN_SENTINEL)("LIVE sentinel check", () => {
  it("reports health issues (empty = all clear)", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const store = new SupabaseStore(createClient(url, key, { auth: { persistSession: false } }));

    const issues = await runSentinelChecks(store, new Date().toISOString());
    console.log(`\nSENTINEL_ISSUES: ${JSON.stringify(issues)}\n`);
    const alert = renderSentinelAlert(issues);
    console.log(alert ? `ALERT:\n${alert}` : "ALL CLEAR — no alert needed.");
  }, 60_000);
});
