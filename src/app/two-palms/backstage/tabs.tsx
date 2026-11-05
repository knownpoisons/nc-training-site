"use client";

import type { ReactNode } from "react";
import { Tabs } from "../_ui/bits";

export function BackstageTabs({ big5, tmp, micky, leadership, intake }: { big5: ReactNode; tmp: ReactNode; micky: ReactNode; leadership: ReactNode; intake: ReactNode }) {
  const map: Record<string, ReactNode> = { "The Big 5": big5, "Time · Money · Pain": tmp, "Micky's list": micky, Leadership: leadership, "Intake answers": intake };
  return <Tabs tabs={Object.keys(map)} hot="The Big 5">{(a) => map[a]}</Tabs>;
}
