"use client";

// The hub's figures. The badge is ours (palms.js, on the vendored kernel); the
// rest come from @lucasmarkes/hairline, themed to Two Palms through the
// --hairline-* properties in tp.css (.tp-hl). Every one answers the pointer.

import { Cabinet, Hub, Keyboard, Loupe, Lockers, Plot, Riffle, Terrain, Vault } from "@lucasmarkes/hairline/react";
import { Figure } from "./figure";
import { palms as palmsFigure } from "./palms";
import type { CustomFigure } from "./figure";

const palms = palmsFigure as unknown as CustomFigure;

export function Badge({ play = false, intensity = 0.5, className = "", onRead }: { play?: boolean; intensity?: number; className?: string; onRead?: (t: string) => void }) {
  return <Figure figure={palms} play={play} intensity={intensity} className={className} label="The Two Palms badge: two palms that bend away from the pointer." onRead={onRead} />;
}

export type Mark = "hub" | "riffle" | "keyboard" | "vault" | "plot" | "terrain" | "loupe" | "cabinet" | "lockers";

const MARKS = { hub: Hub, riffle: Riffle, keyboard: Keyboard, vault: Vault, plot: Plot, terrain: Terrain, loupe: Loupe, cabinet: Cabinet, lockers: Lockers };

/** A small hairline figure beside a headline. */
export function HeadMark({ mark, play = false, intensity = 0.6, className = "" }: { mark: Mark; play?: boolean; intensity?: number; className?: string }) {
  const M = MARKS[mark];
  return <M play={play} intensity={intensity} theme="light" className={`tp-headmark ${className}`} />;
}
