"use client";

// The hub's figures. The badge and the jenga tower are ours (built on the
// vendored kernel to Hairline's ten rules); the rest come from
// @lucasmarkes/hairline. All themed to Two Palms through --hairline-* in tp.css.

import { Loupe, Riffle } from "@lucasmarkes/hairline/react";
import { Figure, type CustomFigure } from "./figure";
import { Mark } from "../_ui/mark";

/** The Two Palms mark, 1:1 from the .ai file, swaying in the pointer's wind. */
export function Badge({ tone = "black", className = "" }: { tone?: "black" | "orange" | "white"; play?: boolean; intensity?: number; className?: string }) {
  return <Mark tone={tone} className={className} />;
}
import { jenga as jengaFigure } from "./jenga";

const jenga = jengaFigure as unknown as CustomFigure;


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
