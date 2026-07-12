// One-off LIVE bulk import into Supabase. Gated behind RUN_IMPORT so it never
// runs in the normal suite. Reads Supabase creds from .env.local.
// Run: RUN_IMPORT=1 npx vitest run --config vitest.config.ts src/cockpit/engine-zero/__tests__/import-run.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { SupabaseStore } from "../../store/supabase";
import { importSources } from "../importSources";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

describe.runIf(process.env.RUN_IMPORT)("LIVE bulk import → Supabase", () => {
  it("loads community + Beehiiv + LinkedIn into the reviewed queue", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const store = new SupabaseStore(createClient(url, key, { auth: { persistSession: false } }));
    const today = new Date().toISOString().slice(0, 10);

    const { counts, ingest } = await importSources(store, today);
    console.log(
      `\n═══ BULK IMPORT COMPLETE ═══\n` +
        `Parsed: ${JSON.stringify(counts)}\n` +
        `Created: ${ingest.created} leads (of ${ingest.merged} distinct)\n` +
        `By tier: ${JSON.stringify(ingest.byTier)}\n` +
        `By consent: ${JSON.stringify(ingest.byConsent)}\n`
    );
  }, 120_000);
});
