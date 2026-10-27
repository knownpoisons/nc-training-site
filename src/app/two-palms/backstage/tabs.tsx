"use client";

import type { ReactNode } from "react";
import { Tabs } from "../_ui/bits";

export function BackstageTabs({ micky, leadership, intake }: { micky: ReactNode; leadership: ReactNode; intake: ReactNode }) {
  const map: Record<string, ReactNode> = { "Micky's list": micky, Leadership: leadership, "Intake answers": intake };
  return <Tabs tabs={Object.keys(map)}>{(a) => map[a]}</Tabs>;
}
