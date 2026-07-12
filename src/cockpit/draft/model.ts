// ═══════════════════════════════════════════════════════════════════════════════
// DRAFT MODEL — the LLM seam. FakeModel (tests, fully deterministic) and
// ClaudeModel (production, Anthropic Messages API). The engine depends only on
// this interface, so the guard/regeneration logic is tested without spending a
// token, and the live wiring drops in unchanged.
//
// Model decision (2026-07-10): claude-sonnet-5 — current generation, supersedes
// the handoff's older claude-sonnet-4-6. Cheap to change via env.
// ═══════════════════════════════════════════════════════════════════════════════

export interface DraftRequest {
  system: string;
  user: string;
  attempt: number; // 0 = first try; >0 = regeneration after a lint failure
  violations: string[]; // what failed last time, fed back so the model fixes it
}

export interface DraftModel {
  generate(req: DraftRequest): Promise<string>;
}

// ─── Fake (tests) ─────────────────────────────────────────────────────────────
/** A model whose output a test fully controls via a callback. */
export class FakeModel implements DraftModel {
  constructor(private fn: (req: DraftRequest) => string) {}
  async generate(req: DraftRequest): Promise<string> {
    return this.fn(req);
  }
}

// ─── Claude (production) ──────────────────────────────────────────────────────
const DEFAULT_MODEL = "claude-sonnet-5";

export class ClaudeModel implements DraftModel {
  constructor(
    private apiKey: string,
    private model: string = process.env.COCKPIT_DRAFT_MODEL ?? DEFAULT_MODEL
  ) {}

  async generate(req: DraftRequest): Promise<string> {
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
        system: req.system,
        messages: [{ role: "user", content: req.user }],
      }),
    });
    if (!res.ok) {
      throw new Error(`anthropic_${res.status}: ${(await res.text()).slice(0, 200)}`);
    }
    const json = (await res.json()) as { content: Array<{ type: string; text?: string }> };
    return json.content
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("")
      .trim();
  }
}

export function claudeModelFromEnv(): ClaudeModel | null {
  const key = process.env.ANTHROPIC_API_KEY;
  return key ? new ClaudeModel(key) : null;
}
