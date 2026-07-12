// ═══════════════════════════════════════════════════════════════════════════════
// BULK IMPORT — one-time load of the real source files into the reviewed queue.
// Parses community + Beehiiv + LinkedIn connections, combines them so a person
// appearing in several stacks into ONE scored lead, and ingests as stage NEW.
// Newsletter subs land broadcast_only. Nothing is sequenced — Jem promotes from
// the Monday digest.
// ═══════════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import type { CockpitStore } from "../store/types";
import type { Day } from "../cadence/dates";
import { ingest, type IngestResult } from "./ingest";
import { parseBeehiivCsv, parseCommunityCsv, parseLinkedInConnections } from "./parse";
import type { RawLead } from "./types";

export interface ImportPaths {
  community?: string;
  beehiiv?: string;
  linkedinConnections?: string;
}

/** Default paths inside the repo's sources folder. */
export function defaultImportPaths(root: string = process.cwd()): ImportPaths {
  const dir = path.join(root, "cockpit", "Sources of Leads");
  const li = path.join(dir, "Complete_LinkedInDataExport_03-13-2026.zip");
  return {
    community: path.join(dir, "Creative Agency Owners Community - Intake Form.csv"),
    beehiiv: path.join(dir, "notcontent-a-not-confusing-newsletter-about-ai-for-creatives-brands-subscribers-2026-07-10.csv"),
    linkedinConnections: path.join(li, "Connections.csv"),
  };
}

export function readRawLeads(paths: ImportPaths): { leads: RawLead[]; counts: Record<string, number> } {
  const leads: RawLead[] = [];
  const counts: Record<string, number> = {};
  const add = (name: string, rows: RawLead[]) => {
    counts[name] = rows.length;
    leads.push(...rows);
  };
  if (paths.community && fs.existsSync(paths.community)) {
    add("community", parseCommunityCsv(fs.readFileSync(paths.community, "utf8")));
  }
  if (paths.beehiiv && fs.existsSync(paths.beehiiv)) {
    add("beehiiv", parseBeehiivCsv(fs.readFileSync(paths.beehiiv, "utf8")));
  }
  if (paths.linkedinConnections && fs.existsSync(paths.linkedinConnections)) {
    add("linkedin", parseLinkedInConnections(fs.readFileSync(paths.linkedinConnections, "utf8")));
  }
  return { leads, counts };
}

export async function importSources(
  store: CockpitStore,
  today: Day,
  paths: ImportPaths = defaultImportPaths()
): Promise<{ counts: Record<string, number>; ingest: IngestResult }> {
  const { leads, counts } = readRawLeads(paths);
  const result = await ingest(store, leads, today);
  return { counts, ingest: result };
}
