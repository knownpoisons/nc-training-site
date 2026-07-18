// LIVE Granola debrief filer → Supabase. Gated behind RUN_DEBRIEF. The
// /debrief-sync agent matches Granola meetings to prospects (Granola connector),
// writes [{prospectId, transcript}] to a JSON file, then this distils each brief
// (real Claude model) and files it onto the card — the same write path as a
// manual Slack paste.
//
// Run: DEBRIEF_INPUT=/abs/path/debrief-input.json \
//      RUN_DEBRIEF=1 npx vitest run --config vitest.config.ts \
//      src/cockpit/ops/__tests__/debrief-run.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { SupabaseStore } from "../../store/supabase";
import { claudeModelFromEnv } from "../../draft/model";
import { fileDebrief } from "../debrief";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

interface DebriefRow {
  prospectId: string;
  transcript: string;
}

describe.runIf(process.env.RUN_DEBRIEF)("LIVE Granola debrief → Supabase", () => {
  it("distils and files each matched transcript", async () => {
    const inputPath = process.env.DEBRIEF_INPUT;
    if (!inputPath) throw new Error("Set DEBRIEF_INPUT to the debrief-input JSON path");
    const rows = JSON.parse(fs.readFileSync(inputPath, "utf8")) as DebriefRow[];

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const store = new SupabaseStore(createClient(url, key, { auth: { persistSession: false } }));
    const model = claudeModelFromEnv();
    const today = new Date().toISOString().slice(0, 10);
    const nowIso = new Date().toISOString();

    let filed = 0;
    for (const row of rows) {
      const res = await fileDebrief(store, model, row.prospectId, row.transcript, {
        today,
        nowIso,
        noteSource: "auto-filed from Granola",
      });
      if (res) {
        filed += 1;
        console.log(`\n─── ${res.prospectName} ───\n${res.callBrief}\n`);
      }
    }
    console.log(`\n═══ DEBRIEF SYNC COMPLETE ═══\nFiled ${filed} of ${rows.length} briefs.\n`);
  }, 180_000);
});
