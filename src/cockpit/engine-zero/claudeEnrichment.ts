// ═══════════════════════════════════════════════════════════════════════════════
// CLAUDE ENRICHMENT PROVIDER — Pass 2 research via Claude's server-side web
// search. Asks for a JSON dossier where every claim carries a source URL. The
// dossier guard (enrich.ts) then strips anything uncited, so even a chatty model
// can't smuggle in an unsourced fact.
// ═══════════════════════════════════════════════════════════════════════════════

import type { EnrichmentProvider, ResearchResult } from "./enrich";
import type { MergedLead } from "./types";

/** Parse the model's JSON dossier out of its (possibly prose-wrapped) reply. */
export function parseDossierResponse(text: string): ResearchResult {
  const empty: ResearchResult = { claims: [], openerAngle: null };
  // Find the first {...} JSON object in the text (tolerates fences/prose).
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return empty;
  try {
    const parsed = JSON.parse(match[0]) as {
      claims?: Array<{ text?: string; sourceUrl?: string | null }>;
      openerAngle?: string | null;
    };
    const claims = (parsed.claims ?? [])
      .filter((c) => typeof c.text === "string" && c.text.trim().length > 0)
      .map((c) => ({ text: c.text!.trim(), sourceUrl: c.sourceUrl ?? null }));
    return { claims, openerAngle: parsed.openerAngle ?? null };
  } catch {
    return empty;
  }
}

const SYSTEM = [
  "You research a person for a 1:1 outreach dossier. Use web search. Return ONLY",
  "JSON, no prose, in this shape:",
  '{"claims":[{"text":"<one verifiable fact>","sourceUrl":"<the URL it came from>"}],',
  '"openerAngle":"<one line on how to open, or null>"}',
  "",
  "Rules: every claim MUST carry the exact source URL you found it at. If you",
  "can't find much, return few or zero claims — never invent or infer biography.",
  "No claim without a citation. Better empty than wrong.",
].join("\n");

export class ClaudeEnrichmentProvider implements EnrichmentProvider {
  constructor(
    private apiKey: string,
    private model: string = process.env.COCKPIT_ENRICH_MODEL ?? "claude-sonnet-5"
  ) {}

  async research(lead: MergedLead): Promise<ResearchResult> {
    const who = [lead.name, lead.role, lead.company].filter(Boolean).join(", ");
    const user = `Research this person for a dossier: ${who}.${lead.linkedinUrl ? ` LinkedIn: ${lead.linkedinUrl}.` : ""}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        system: SYSTEM,
        messages: [{ role: "user", content: user }],
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
      }),
    });
    if (!res.ok) throw new Error(`enrich_${res.status}: ${(await res.text()).slice(0, 200)}`);

    const json = (await res.json()) as { content: Array<{ type: string; text?: string }> };
    const text = json.content
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("\n");
    return parseDossierResponse(text);
  }
}

export function claudeEnrichmentFromEnv(): ClaudeEnrichmentProvider | null {
  const key = process.env.ANTHROPIC_API_KEY;
  return key ? new ClaudeEnrichmentProvider(key) : null;
}
