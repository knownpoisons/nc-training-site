"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import type { PromptPhase } from "./prompts";

interface Props {
  phases: PromptPhase[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export function PhaseTabs({ phases }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = phases[activeIdx];

  return (
    <div className="phases">
      {/* ─── Tab bar ───────────────────────────────────────────────── */}
      <div className="phase-tabs" role="tablist" aria-label="Prompt phases">
        {phases.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={p.number}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIdx(i)}
              className={"phase-tab" + (isActive ? " phase-tab-active" : "")}
            >
              <span className="phase-tab-num">Phase {pad(p.number)}</span>
              <span className="phase-tab-dot">·</span>
              <span className="phase-tab-label">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Active phase content ─────────────────────────────────── */}
      <div className="phase-panel" role="tabpanel">
        {active.prerequisite && (
          <div className="phase-prereq">
            <span className="phase-prereq-label">Prerequisite</span>
            <span className="phase-prereq-text">{active.prerequisite}</span>
          </div>
        )}

        <p className="phase-blurb">{active.blurb}</p>

        <div className="surface">
          <CopyButton text={active.prompt} label="Copy prompt" />
          <pre>{active.prompt}</pre>
        </div>
      </div>
    </div>
  );
}
