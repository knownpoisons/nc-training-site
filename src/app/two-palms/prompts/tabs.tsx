"use client";

import type { Prompt } from "../_data/hub";
import { CopyButton, Tabs } from "../_ui/bits";

export function PromptTabs({ tabs, prompts }: { tabs: string[]; prompts: Prompt[] }) {
  return (
    <Tabs tabs={tabs}>
      {(active) => (
        <div className="tp-grid tp-grid-2">
          {prompts.filter((p) => p.tab === active).map((p) => (
            <div key={p.id} className="tp-prompt">
              <div className="tp-prompt-head">
                <div><h3 className="tp-h3">{p.title}</h3><div className="tp-prompt-when">{p.when}</div></div>
                <CopyButton text={p.body} />
              </div>
              <pre>{p.body}</pre>
            </div>
          ))}
        </div>
      )}
    </Tabs>
  );
}
