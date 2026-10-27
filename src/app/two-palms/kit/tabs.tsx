"use client";

import type { ReactNode } from "react";
import { Tabs } from "../_ui/bits";

export function KitTabs({ rules, models, models_mental, glossary }: { rules: ReactNode; models: ReactNode; models_mental: ReactNode; glossary: ReactNode }) {
  const map: Record<string, ReactNode> = { "Rules + policy": rules, "Model board": models, "Mental models": models_mental, Glossary: glossary };
  return <Tabs tabs={Object.keys(map)}>{(a) => map[a]}</Tabs>;
}
