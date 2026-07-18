// LIVE read: prospects awaiting a call debrief. Gated behind RUN_DEBRIEF_ROSTER.
// Prints AWAITING_DEBRIEF: <json> ({id,name,company,email,callAt}) so the
// /debrief-sync agent can match Granola meetings to cockpit ids. Read-only.
//
// Run: RUN_DEBRIEF_ROSTER=1 npx vitest run --config vitest.config.ts \
//      src/cockpit/ops/__tests__/debrief-roster-run.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { SupabaseStore } from "../../store/supabase";
import { addDays } from "../../cadence/dates";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

describe.runIf(process.env.RUN_DEBRIEF_ROSTER)("LIVE awaiting-debrief roster", () => {
  it("prints prospects with a recent call but no brief", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const store = new SupabaseStore(createClient(url, key, { auth: { persistSession: false } }));

    // Look back 10 days — a call from last week may still need its brief.
    const since = addDays(new Date().toISOString().slice(0, 10), -10);
    const awaiting = await store.prospectsAwaitingDebrief(since);
    const rows = awaiting.map((p) => ({
      id: p.id,
      name: p.name,
      company: p.company,
      email: p.email,
      callAt: p.callAt,
    }));
    console.log(`\nAWAITING_DEBRIEF: ${JSON.stringify(rows)}\n`);
  }, 60_000);
});
