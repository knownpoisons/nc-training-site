"use client";

// One hairline figure per Foundations session, picked for what the session does.
// 01 Shift: crooked tiles settle into order. 02 Brief: a messy ask snaps square.
// 03 Context: the drawer where Claude keeps who you are. 04 Connect: the plug.
// 05 Make: a tool, layer by layer. 06 Share: links turn solid. 07 Show: browse
// the rack. 08 Run: work arrives on the belt. Office hours: the question.
import { Drawer, Exploded, Format, Hub, Plug, Query, Rail, Settle, Slow } from "@lucasmarkes/hairline/react";
import type { ComponentType } from "react";

type F = ComponentType<{ play?: boolean; intensity?: number; theme?: "light" | "dark" | "auto"; className?: string; label?: string }>;
const BY_N: Record<number, F> = { 1: Settle, 2: Format, 3: Drawer, 4: Plug, 5: Exploded, 6: Hub, 7: Rail, 8: Slow };

export function SessionFig({ n, play = false, intensity = 0.6, className = "", label }: { n: number | "oh"; play?: boolean; intensity?: number; className?: string; label?: string }) {
  const Fig = n === "oh" ? (Query as F) : BY_N[n];
  if (!Fig) return null;
  return <Fig play={play} intensity={intensity} theme="light" className={`fx-fig ${className}`} label={label} />;
}
