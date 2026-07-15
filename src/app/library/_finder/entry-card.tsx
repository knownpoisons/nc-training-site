"use client";

import { useState } from "react";
import { CopyButton } from "../copy-button";
import { EntryMedia } from "./entry-media";
import { MovementDiagram } from "./movement-diagram";
import { AngleDiagram } from "./angle-diagram";
import type { DiagramSpec } from "../camera-prompts/_data/movements";
import type { AngleDiagramSpec } from "../camera-prompts/_data/angles";

// One card = one movement or one angle. The diagram/video media block sits on
// top; the prompt lives in an in-place disclosure (0fr → 1fr grid animation).
//
// The diagram arrives as SPEC DATA (not JSX) so the server → client prop
// payload stays small and plainly serialisable; the card renders the right
// diagram component itself.

export type EntryDiagram =
  | { type: "movement"; spec: DiagramSpec }
  | { type: "angle"; spec: AngleDiagramSpec };

export interface FinderEntry {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  prompt: string;
  tags: string[];
  badges?: string[]; // e.g. use-case labels on stills cards
  diagram: EntryDiagram;
  videoSrc?: string;
  posterSrc?: string;
  imageSrc?: string;
}

interface Props {
  entry: FinderEntry;
  index: number;
  live: boolean;
  revealed: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function EntryCard({ entry, index, live, revealed }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={"cm-card" + (live ? " cm-live" : "") + (revealed ? " cm-in" : "")}
      style={{ "--i": index % 9 } as React.CSSProperties}
      data-slug={entry.slug}
    >
      <EntryMedia
        diagram={
          entry.diagram.type === "movement" ? (
            <MovementDiagram spec={entry.diagram.spec} />
          ) : (
            <AngleDiagram slug={entry.slug} spec={entry.diagram.spec} />
          )
        }
        videoSrc={entry.videoSrc}
        posterSrc={entry.posterSrc}
        imageSrc={entry.imageSrc}
        live={live}
        title={entry.title}
      />
      <div className="cm-card-body">
        <div className="cm-card-eyebrow">
          <span className="cm-card-num">{pad(index + 1)}</span>
          <span>{entry.categoryLabel}</span>
        </div>
        <h3>{entry.title}</h3>
        <p className="cm-card-desc">{entry.description}</p>
        {entry.badges && entry.badges.length > 0 && (
          <div className="cm-badges" style={{ marginBottom: 14 }}>
            {entry.badges.map((b) => (
              <span key={b} className="cm-badge">
                {b}
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          className="cm-toggle"
          aria-expanded={open}
          aria-controls={`prompt-${entry.slug}`}
          onClick={() => setOpen((o) => !o)}
        >
          The prompt
          <span className="cm-toggle-mark" aria-hidden="true">
            +
          </span>
        </button>
        <div className={"cm-panel" + (open ? " cm-open" : "")} id={`prompt-${entry.slug}`}>
          <div className="cm-panel-inner">
            <pre className="cm-prompt">{entry.prompt}</pre>
            <CopyButton text={entry.prompt} label="Copy prompt" />
          </div>
        </div>
      </div>
    </article>
  );
}
