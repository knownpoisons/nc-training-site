"use client";

// The hub's figures. The badge and the jenga tower are ours (built on the
// vendored kernel to Hairline's ten rules); the rest come from
// @lucasmarkes/hairline. All themed to Two Palms through --hairline-* in tp.css.

import { Loupe, Riffle } from "@lucasmarkes/hairline/react";
import { Figure, type CustomFigure } from "./figure";
import { badge as badgeFigure } from "./badge";
import { jenga as jengaFigure } from "./jenga";

const badge = badgeFigure as unknown as CustomFigure;
const jenga = jengaFigure as unknown as CustomFigure;

export function Badge({ play = false, intensity = 0.5, className = "", onRead }: { play?: boolean; intensity?: number; className?: string; onRead?: (t: string) => void }) {
  return <Figure figure={badge} play={play} intensity={intensity} className={className} label="The Two Palms mark: two palms that bend away from the pointer." onRead={onRead} />;
}

/** The headline figure on every page: a Jenga tower whose blocks slide out under the pointer. */
export function Jenga({ play = false, intensity = 0.6, className = "" }: { play?: boolean; intensity?: number; className?: string }) {
  return <Figure figure={jenga} play={play} intensity={intensity} className={`tp-headmark ${className}`} label="A tower of blocks. The one under the pointer slides out." />;
}

export function ComingSoonMark({ className = "" }: { className?: string }) {
  return <Loupe play intensity={0.6} theme="light" className={`tp-headmark ${className}`} />;
}

export function PromptsMark({ className = "" }: { className?: string }) {
  return <Riffle intensity={0.6} theme="light" className={`tp-headmark ${className}`} />;
}
