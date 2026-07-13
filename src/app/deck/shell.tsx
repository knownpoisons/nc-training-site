import type { ReactNode } from "react";
import { AssistantRail, AssistantSheet, DeckNav } from "./ui";

// The authed shell: content column + persistent assistant rail (≥1280px);
// the rail collapses to a floating button + sheet below that.
export function DeckShell({ children }: { children: ReactNode }) {
  return (
    <div className="dk-shell">
      <main className="dk-main">
        <DeckNav />
        {children}
      </main>
      <AssistantRail />
      <AssistantSheet />
    </div>
  );
}
