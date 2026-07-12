// ═══════════════════════════════════════════════════════════════════════════════
// F4 — COMMAND PARSER. Plain-language Slack replies → structured intents.
//
// Jem types how he thinks: "done 1 2", "skip 3", "replied 4",
// "add Dana Lee, Head of Brand, Acme", "call booked 5", "pause dana".
// Anything we don't recognise becomes a `conversational` intent, which the
// handler routes to F5 (a stub in Phase 2, Claude in Phase 3).
// ═══════════════════════════════════════════════════════════════════════════════

export type Intent =
  | { kind: "done"; indices: number[] }
  | { kind: "skip"; indices: number[] }
  | { kind: "snooze"; indices: number[] }
  | { kind: "replied"; index: number }
  | { kind: "rewrite"; index: number; angle: string | null }
  | { kind: "add"; name: string; role: string | null; company: string | null; email: string | null; linkedinUrl: string | null }
  | { kind: "call_booked"; index: number }
  | { kind: "closed"; result: "won" | "lost"; index: number }
  | { kind: "pause"; name: string }
  | { kind: "unpause"; name: string }
  | { kind: "promote"; indices: number[] }
  | { kind: "bin"; indices: number[] }
  | { kind: "hold"; indices: number[] }
  | { kind: "set"; field: string; value: string }
  | { kind: "note"; text: string }
  | { kind: "notes" }
  | { kind: "show"; name: string }
  | { kind: "prospect_note"; name: string; text: string }
  | { kind: "set_prospect"; name: string; field: "email" | "linkedin" | "value"; value: string }
  | { kind: "stage_move"; name: string; stage: string }
  | { kind: "pipeline" }
  | { kind: "settings" }
  | { kind: "help" }
  | { kind: "conversational"; text: string };

function indices(s: string): number[] {
  const nums = s.match(/\d+/g);
  return nums ? nums.map(Number) : [];
}

function firstIndex(s: string): number | null {
  const n = s.match(/\d+/);
  return n ? Number(n[0]) : null;
}

export function parseCommand(raw: string): Intent {
  const text = raw.trim();
  const lower = text.toLowerCase();

  // ── multi-word keywords first ──────────────────────────────────────────────
  if (/^call\s+booked\b/.test(lower) || /^booked\b/.test(lower)) {
    const i = firstIndex(lower);
    if (i !== null) return { kind: "call_booked", index: i };
  }
  if (/^closed\s+won\b/.test(lower) || /^won\b/.test(lower)) {
    const i = firstIndex(lower);
    if (i !== null) return { kind: "closed", result: "won", index: i };
  }
  if (/^closed\s+lost\b/.test(lower) || /^lost\b/.test(lower)) {
    const i = firstIndex(lower);
    if (i !== null) return { kind: "closed", result: "lost", index: i };
  }

  // ── single-word verbs with index lists ─────────────────────────────────────
  if (/^done\b/.test(lower)) return { kind: "done", indices: indices(lower) };
  if (/^skip\b/.test(lower)) return { kind: "skip", indices: indices(lower) };
  if (/^snooze\b/.test(lower)) return { kind: "snooze", indices: indices(lower) };

  if (/^replied\b/.test(lower)) {
    const i = firstIndex(lower);
    if (i !== null) return { kind: "replied", index: i };
  }

  if (/^rewrite\b/.test(lower)) {
    const i = firstIndex(lower);
    if (i !== null) {
      // Everything after the number is the requested angle ("shorter", "warmer").
      const after = text.replace(/^rewrite\s+\d+\s*/i, "").trim();
      return { kind: "rewrite", index: i, angle: after || null };
    }
  }

  // ── add [name, role, company, email?, linkedin?] — free text after the verb.
  //    Email/URL parts are recognised anywhere in the comma list. ──────────────
  if (/^add\b/.test(lower)) {
    const payload = text.replace(/^add\s+/i, "").trim();
    const parts = payload.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      let email: string | null = null;
      let linkedinUrl: string | null = null;
      const rest: string[] = [];
      for (const part of parts) {
        if (!email && /\S+@\S+\.\S+/.test(part)) email = part;
        else if (!linkedinUrl && /https?:\/\/|linkedin\.com/i.test(part)) linkedinUrl = part;
        else rest.push(part);
      }
      return {
        kind: "add",
        name: rest[0] ?? parts[0],
        role: rest[1] ?? null,
        company: rest[2] ?? null,
        email,
        linkedinUrl,
      };
    }
  }

  // ── pause / resume [name] ──────────────────────────────────────────────────
  if (/^pause\b/.test(lower)) {
    const name = text.replace(/^pause\s+/i, "").trim();
    if (name) return { kind: "pause", name };
  }
  if (/^(unpause|resume)\b/.test(lower)) {
    const name = text.replace(/^(unpause|resume)\s+/i, "").trim();
    if (name) return { kind: "unpause", name };
  }

  // ── digest actions (F11) ────────────────────────────────────────────────────
  if (/^promote\b/.test(lower)) return { kind: "promote", indices: indices(lower) };
  if (/^bin\b/.test(lower)) return { kind: "bin", indices: indices(lower) };
  if (/^hold\b/.test(lower)) return { kind: "hold", indices: indices(lower) };

  // ── prospect edit first: "set dana email x" / "set dana value 80k" ──────────
  {
    const m = text.match(/^set\s+(.+)\s+(email|linkedin|value)\s+(\S+)$/i);
    if (m) return { kind: "set_prospect", name: m[1].trim(), field: m[2].toLowerCase() as "email" | "linkedin" | "value", value: m[3].trim() };
  }

  // ── settings edit: "set brief hour 6", "set volume 8", "set timezone X" ──────
  if (/^set\b/.test(lower)) {
    const m = text.replace(/^set\s+/i, "").match(/^(.+)\s+(\S+)$/);
    if (m) return { kind: "set", field: m[1].trim().toLowerCase(), value: m[2].trim() };
  }

  // ── prospect context: "note dana: budget approved" (colon = prospect note;
  //    a URL's "://" doesn't count) ─────────────────────────────────────────────
  {
    const m = text.match(/^note\s+([^:]+):(?!\/\/)\s*(.+)$/i);
    if (m) return { kind: "prospect_note", name: m[1].trim(), text: m[2].trim() };
  }

  // ── manual stage move: "move dana to proposal" / "stage dana proposal" ──────
  {
    const m =
      text.match(/^move\s+(.+?)\s+(?:to|→)\s+(\w+)$/i) ?? text.match(/^stage\s+(.+?)\s+(\w+)$/i);
    if (m) return { kind: "stage_move", name: m[1].trim(), stage: m[2].toUpperCase() };
  }

  // ── newsletter content inbox ─────────────────────────────────────────────────
  if (/^notes\b/.test(lower)) return { kind: "notes" };
  if (/^(note|idea)\b/.test(lower)) {
    const t = text.replace(/^(note|idea)\s*/i, "").trim();
    if (t) return { kind: "note", text: t };
  }

  // ── show a prospect's full card: "show dana" / "profile dana" / "who is dana" ─
  if (/^(show|profile|who)\b/.test(lower) && !/^show\s+pipeline\b/.test(lower)) {
    const name = text.replace(/^(show|profile|who)\s+/i, "").replace(/^is\s+/i, "").trim();
    if (name) return { kind: "show", name };
  }

  // ── standalone words ───────────────────────────────────────────────────────
  if (/^(show\s+)?pipeline\b/.test(lower)) return { kind: "pipeline" };
  if (/^settings\b/.test(lower)) return { kind: "settings" };
  if (/^help\b/.test(lower) || lower === "?") return { kind: "help" };

  // ── everything else → conversational (F5) ──────────────────────────────────
  return { kind: "conversational", text };
}
