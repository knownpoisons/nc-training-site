"use client";

import { useEffect, useState } from "react";

// The eight steps, tickable, remembered in this browser only. It tells a new
// joiner which steps they have finished when they come back tomorrow.
const KEY = "tp-setup-done";

export function SetupSteps({ steps }: { steps: { n: string; t: string; d: string; who: string; mins: string }[] }) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { const t = setTimeout(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {} }, 0); return () => clearTimeout(t); }, []);
  const toggle = (n: string) => {
    const next = done.includes(n) ? done.filter((x) => x !== n) : [...done, n];
    setDone(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <div className="tp-progress" style={{ flex: 1 }}><i style={{ width: `${(done.length / steps.length) * 100}%` }} /></div>
        <span className="tp-eyebrow">{done.length} / {steps.length}</span>
      </div>
      <ol className="tp-steps">
        {steps.map((s) => (
          <li key={s.n} data-done={done.includes(s.n) ? "true" : "false"}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
              <span className="tp-num">{s.n}</span>
              <button type="button" className="tp-setup-check" aria-pressed={done.includes(s.n)} aria-label={done.includes(s.n) ? "Mark not done" : "Mark done"} onClick={() => toggle(s.n)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--tp-lime)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
              </button>
            </div>
            <div>
              <h3 className="tp-h3">{s.t}</h3>
              <p className="tp-small" style={{ marginTop: 6 }}>{s.d}</p>
            </div>
            <div className="tp-step-meta"><div>{s.who}</div><div>{s.mins} min</div></div>
          </li>
        ))}
      </ol>
    </>
  );
}
