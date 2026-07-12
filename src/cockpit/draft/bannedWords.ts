// ═══════════════════════════════════════════════════════════════════════════════
// BANNED-WORDS LINTER — hard gate on language, in code (not just prompt).
//
// Three layers, each traceable to a source:
//   1. Sales-automation clichés (handoff F2).
//   2. PLAYBOOK HARD BANS — unsigned/NDA client names (Nike above all), tool
//      names + seat costs, charisma-gated lines, profanity.
//   3. Voice bans that read as generic AI copy.
// A hit is a hard fail → regenerate.
// ═══════════════════════════════════════════════════════════════════════════════

export interface BannedHit {
  term: string;
  category: "cliché" | "client" | "tool" | "charisma" | "profanity" | "flex";
}

// PLAYBOOK/PROOF: unverifiable flexes the stat guard can't catch (bare counts,
// not $ or %). Blocked explicitly.
const BANNED_FLEXES = ["50,000 stores", "50000 stores", "three of the four", "big tech giants"];

// 1) handoff F2 cliché list
const CLICHES = [
  "synergy", "leverage", "unlock", "journey", "empower", "robust", "ecosystem",
  "holistic", "disrupt", "game-changing", "game changing", "best-in-class",
  "best in class", "circle back", "touch base", "deep dive",
];

// 2a) PLAYBOOK: unsigned / NDA / never-name clients. Nike above all.
const BANNED_CLIENTS = ["nike"];

// 2b) PLAYBOOK: tool names + seat costs invite the DIY calculation.
const BANNED_TOOLS = ["flora", "weavy", "midjourney", "runway", "per-seat", "per seat"];

// 2c) PLAYBOOK: charisma-gated lines — charming live, radioactive in writing.
const CHARISMA = [
  "so much better than you", "bet my children", "crack cocaine", "crack-cocaine",
];

// 2d) profanity — a live-call tool only; Jem adds by hand if earned.
const PROFANITY = ["fuck", "shit", "damn", "bloody", "bastard", "arse", "ass "];

function scan(draft: string, terms: string[], category: BannedHit["category"]): BannedHit[] {
  const hay = draft.toLowerCase();
  const hits: BannedHit[] = [];
  for (const term of terms) {
    // word-ish boundary so "unlock" doesn't match inside "unlocked" unintentionally?
    // We WANT to catch inflections, so use includes for phrases and a loose
    // boundary for single words.
    const t = term.toLowerCase();
    if (t.includes(" ")) {
      if (hay.includes(t)) hits.push({ term, category });
    } else {
      if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(hay)) {
        hits.push({ term, category });
      }
    }
  }
  return hits;
}

export function checkBannedWords(draft: string): BannedHit[] {
  return [
    ...scan(draft, CLICHES, "cliché"),
    ...scan(draft, BANNED_CLIENTS, "client"),
    ...scan(draft, BANNED_TOOLS, "tool"),
    ...scan(draft, CHARISMA, "charisma"),
    ...scan(draft, PROFANITY, "profanity"),
    ...scan(draft, BANNED_FLEXES, "flex"),
  ];
}

export const BANNED_WORD_LIST = { CLICHES, BANNED_CLIENTS, BANNED_TOOLS, CHARISMA, PROFANITY };
