// Removes the six DUMMY practice prospects seeded for the test week, so the real
// week starts clean. Surgical on purpose: it deletes named rows only — never a
// whole table. Touches/events go with them via ON DELETE CASCADE. Settings,
// brief/digest history, and every other prospect are untouched.
//
// Run: RUN_WIPE=1 npx vitest run src/cockpit/ops/__tests__/wipe-run.test.ts
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

/** The practice cohort seeded during the dry-run week. Nothing else is touched. */
const DUMMY_NAMES = [
  "Maya Chen",
  "Rob Diaz",
  "Aisha Bello",
  "Leo Marsh",
  "Tom Nguyen",
  "Sana Kapoor",
];

describe.runIf(process.env.RUN_WIPE)("retire the dry-run practice prospects", () => {
  it("removes exactly the six dummies, leaves everything else alone", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const db = createClient(url, key, { auth: { persistSession: false } });

    const { count: totalBefore } = await db
      .from("cockpit_prospects")
      .select("*", { count: "exact", head: true });

    const { data: found, error: findErr } = await db
      .from("cockpit_prospects")
      .select("id,name,stage")
      .in("name", DUMMY_NAMES);
    if (findErr) throw new Error(`lookup: ${findErr.message}`);

    console.log(`\nFound ${found?.length ?? 0} practice prospects to retire:`);
    for (const p of found ?? []) console.log(`  · ${p.name} (${p.stage})`);

    if (found && found.length > 0) {
      const { error } = await db
        .from("cockpit_prospects")
        .delete()
        .in("id", found.map((p) => p.id));
      if (error) throw new Error(`delete: ${error.message}`);
    }

    // Prove the blast radius: only the named rows went.
    const { data: leftovers } = await db
      .from("cockpit_prospects")
      .select("id")
      .in("name", DUMMY_NAMES);
    expect(leftovers ?? []).toHaveLength(0);

    const { count: totalAfter } = await db
      .from("cockpit_prospects")
      .select("*", { count: "exact", head: true });
    expect((totalBefore ?? 0) - (totalAfter ?? 0)).toBe(found?.length ?? 0);

    // Settings must be intact.
    const { data: settings } = await db.from("cockpit_settings").select("*").eq("id", 1).maybeSingle();
    expect(settings, "settings must survive").toBeTruthy();

    console.log(
      `\n═══ PRACTICE COHORT RETIRED ═══\n` +
        `Prospects: ${totalBefore} → ${totalAfter} (removed ${found?.length ?? 0})\n` +
        `Settings intact: volume ${settings?.weekly_volume}, brief ${settings?.brief_hour}:00 ${settings?.timezone}\n`
    );
  }, 120_000);
});
