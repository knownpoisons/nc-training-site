// ═══════════════════════════════════════════════════════════════════════════════
// GO-LIVE KIT — dossier-response parsing + the bulk importer against real files.
// ═══════════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from "vitest";
import { parseDossierResponse } from "../claudeEnrichment";
import { readRawLeads, defaultImportPaths, importSources } from "../importSources";
import { MemoryStore } from "../../store/memory";

describe("parseDossierResponse — pulls cited claims out of the model reply", () => {
  it("parses clean JSON", () => {
    const r = parseDossierResponse('{"claims":[{"text":"Founded X in 2019","sourceUrl":"https://x.com"}],"openerAngle":"the rebrand"}');
    expect(r.claims).toHaveLength(1);
    expect(r.claims[0].sourceUrl).toBe("https://x.com");
    expect(r.openerAngle).toBe("the rebrand");
  });

  it("tolerates prose/markdown around the JSON", () => {
    const r = parseDossierResponse('Here is the dossier:\n```json\n{"claims":[{"text":"a","sourceUrl":"https://a.com"}],"openerAngle":null}\n```\nDone.');
    expect(r.claims).toHaveLength(1);
  });

  it("returns empty on garbage (guard then produces the honest fallback)", () => {
    expect(parseDossierResponse("no json here").claims).toHaveLength(0);
    expect(parseDossierResponse("{bad json").claims).toHaveLength(0);
  });

  it("drops claim objects with no text", () => {
    const r = parseDossierResponse('{"claims":[{"sourceUrl":"https://x.com"},{"text":"real","sourceUrl":"https://y.com"}]}');
    expect(r.claims).toHaveLength(1);
    expect(r.claims[0].text).toBe("real");
  });
});

describe("bulk importer — reads the real source files", () => {
  const paths = defaultImportPaths();

  it("reads community + Beehiiv + LinkedIn into one RawLead batch", () => {
    const { leads, counts } = readRawLeads(paths);
    expect(counts.community).toBeGreaterThan(150);
    expect(counts.beehiiv).toBeGreaterThan(1000);
    expect(counts.linkedin).toBeGreaterThan(2000);
    expect(leads.length).toBe(counts.community + counts.beehiiv + counts.linkedin);
  });

  it("ingests into the queue: all NEW, subs broadcast_only, nothing sequenced", async () => {
    const store = new MemoryStore();
    const { ingest } = await importSources(store, "2026-07-11", paths);
    expect(ingest.created).toBeGreaterThan(1000);
    expect(ingest.byConsent.broadcast_only).toBeGreaterThan(1000); // the subs
    const counts = await store.pipelineCounts();
    expect(counts.IN_SEQUENCE).toBe(0); // importer never sequences
    expect(counts.NEW).toBe(ingest.created);
  }, 20_000);
});
