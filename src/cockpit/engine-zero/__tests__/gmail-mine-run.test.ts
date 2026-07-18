// LIVE Gmail inbox-mine → Supabase. Gated behind RUN_GMAIL_MINE so it never runs
// in the normal suite. The /inbox-mine agent gathers sent-mail correspondents
// (Gmail connector) into a JSON file, then this ingests them via the real
// dedupe/score pipeline as reviewed-queue leads (stage NEW).
//
// Run: GMAIL_MINE_INPUT=/abs/path/gmail-correspondents.json \
//      RUN_GMAIL_MINE=1 npx vitest run --config vitest.config.ts \
//      src/cockpit/engine-zero/__tests__/gmail-mine-run.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { SupabaseStore } from "../../store/supabase";
import { ingestGmailCorrespondents, type GmailCorrespondent } from "../gmailIntake";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

describe.runIf(process.env.RUN_GMAIL_MINE)("LIVE Gmail mine → Supabase", () => {
  it("ingests gathered correspondents into the reviewed queue", async () => {
    const inputPath = process.env.GMAIL_MINE_INPUT;
    if (!inputPath) throw new Error("Set GMAIL_MINE_INPUT to the correspondents JSON path");
    const rows = JSON.parse(fs.readFileSync(inputPath, "utf8")) as GmailCorrespondent[];

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const store = new SupabaseStore(createClient(url, key, { auth: { persistSession: false } }));
    const today = new Date().toISOString().slice(0, 10);

    const res = await ingestGmailCorrespondents(store, rows, today);
    console.log(
      `\n═══ GMAIL MINE COMPLETE ═══\n` +
        `Received: ${res.received} correspondents\n` +
        `Created: ${res.created} leads (of ${res.merged} distinct)\n` +
        `By tier: ${JSON.stringify(res.byTier)}\n` +
        `All queued as NEW — review in Monday's digest.\n`
    );
  }, 120_000);
});
