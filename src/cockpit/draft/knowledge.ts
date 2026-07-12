// ═══════════════════════════════════════════════════════════════════════════════
// KNOWLEDGE — load the files injected into every draft call. PLAYBOOK.md and
// PROOF.md are authored by Jem; SEQUENCES.md holds the templates. Parsed once and
// reused. `proofRules` is the compiled allow/ban list the stat guard enforces.
// ═══════════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import { KNOWLEDGE_DIR, parseProof, type ProofRules } from "./proof";

export interface Knowledge {
  playbook: string;
  proof: string;
  sequences: string;
  proofRules: ProofRules;
}

export function loadKnowledge(dir: string = KNOWLEDGE_DIR): Knowledge {
  const read = (f: string) => fs.readFileSync(path.join(dir, f), "utf8");
  const proof = read("PROOF.md");
  return {
    playbook: read("PLAYBOOK.md"),
    proof,
    sequences: fs.existsSync(path.join(dir, "SEQUENCES.md")) ? read("SEQUENCES.md") : "",
    proofRules: parseProof(proof),
  };
}
