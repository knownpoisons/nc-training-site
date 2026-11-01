"use client";

import type { ReactNode } from "react";
import { Tabs } from "../_ui/bits";

export function BackstageTabs({ tmp, micky, leadership, intake }: { tmp: ReactNode; micky: ReactNode; leadership: ReactNode; intake: ReactNode }) {
  const map: Record<string, ReactNode> = { "Time · Money · Pain": tmp, "Micky's list": micky, Leadership: leadership, "Intake answers": intake };
  return <Tabs tabs={Object.keys(map)}>{(a) => map[a]}</Tabs>;
}
