"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { INTAKE_QS, type IntakeQ } from "../_data/intake";
import { submitIntakeV2, type IntakeV2 } from "../_lib/intake";

const DRAFT = "tp-intake-v2-draft";

function answered(q: IntakeQ, a: IntakeV2): boolean {
  if (q.optional) return true;
  if (q.kind === "grid") return q.rows.every((r) => a[r.col] !== undefined && a[r.col] !== "");
  const v = a[q.col];
  if (q.kind === "multi") {
    const arr = (v as string[] | undefined) ?? [];
    if (!arr.length) return false;
    if (q.other && arr.includes(q.other.option)) return String(a[q.other.col] ?? "").trim().length > 0;
    return true;
  }
  if (v === undefined || v === null || String(v).trim() === "") return false;
  if (q.kind === "pills" && q.other && v === q.other.option) return String(a[q.other.col] ?? "").trim().length > 0;
  return true;
}

export function IntakeForm() {
  const [i, setI] = useState(0);
  const [a, setA] = useState<IntakeV2>({});
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const top = useRef<HTMLDivElement>(null);
  const total = INTAKE_QS.length;
  const q = INTAKE_QS[i];

  // keep a draft in this browser so a closed tab doesn't lose answers
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT) || "null");
      if (d && typeof d === "object") { setA(d.a ?? {}); setI(Math.min(d.i ?? 0, total - 1)); }
    } catch {}
  }, [total]);
  useEffect(() => {
    try { if (!done) localStorage.setItem(DRAFT, JSON.stringify({ a, i })); } catch {}
  }, [a, i, done]);
  useEffect(() => { top.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }, [i]);

  const set = (col: string, v: string | string[] | number) => setA((p) => ({ ...p, [col]: v }));
  const ok = answered(q, a);

  const next = () => {
    if (!ok) return;
    if (i < total - 1) { setI(i + 1); return; }
    setErr(null);
    start(async () => {
      try {
        const r = await submitIntakeV2(a);
        if (r.ok) { setDone(true); try { localStorage.removeItem(DRAFT); } catch {} }
        else setErr("That didn't save. Try once more in a minute, or message Jem in #ai-training.");
      } catch {
        setErr("That didn't save. Try once more in a minute, or message Jem in #ai-training.");
      }
    });
  };

  if (done) {
    return (
      <div className="tp-intake tp-intake-v2">
        <div className="tp-intake-body">
          <div className="tp-intake-q tp-slide-enter">
            <p className="tp-eyebrow" style={{ marginBottom: 14 }}><span className="tp-dot" />Done</p>
            <h2 className="tp-h2">Thank you.</h2>
            <p className="tp-lede tp-mute" style={{ marginBottom: 24 }}>That&rsquo;s everything. Your answers go to Jem only, and they&rsquo;ll shape the sessions from here.</p>
            <Link className="tp-btn tp-btn-orange" href="/two-palms">Back to the hub</Link>
          </div>
        </div>
        <div className="tp-intake-foot"><span>Answers go to Jem only.</span><span>Two Palms x NotContent</span></div>
      </div>
    );
  }

  return (
    <div className="tp-intake tp-intake-v2">
      <div className="tp-intake-top">
        <div className="tp-progress" aria-hidden="true"><i style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
        <span className="tp-eyebrow">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <div className="tp-intake-body">
        <div key={q.id} className="tp-intake-q tp-slide-enter" ref={top} tabIndex={-1} style={{ outline: "none" }}>
          {i === 0 ? (
            <p className="tp-eyebrow" style={{ marginBottom: 14 }}><span className="tp-dot" />AI Foundations intake: 20 questions, about 10 minutes</p>
          ) : null}
          <h2 className="tp-h2">{q.q}</h2>
          {q.sub ? <p className="tp-lede tp-mute" style={{ marginBottom: 18 }}>{q.sub}</p> : null}
          {q.optional ? <p className="tp-small tp-mute" style={{ marginTop: -8, marginBottom: 14 }}>Optional</p> : null}

          {q.kind === "pills" ? (
            <>
              <div className="tp-pills" role="radiogroup" aria-label={q.q}>
                {q.options.map((o) => (
                  <button key={o} type="button" role="radio" className="tp-pill" aria-checked={a[q.col] === o} aria-pressed={a[q.col] === o} onClick={() => set(q.col, o)}>{o}</button>
                ))}
              </div>
              {q.other && a[q.col] === q.other.option ? (
                <input className="tp-input" style={{ marginTop: 14 }} placeholder={q.other.placeholder} value={String(a[q.other.col] ?? "")} onChange={(e) => set(q.other!.col, e.target.value)} autoFocus />
              ) : null}
              {q.why && a[q.col] ? (
                <textarea className="tp-textarea" style={{ marginTop: 14, minHeight: 80 }} placeholder={q.why.placeholder} value={String(a[q.why.col] ?? "")} onChange={(e) => set(q.why!.col, e.target.value)} />
              ) : null}
            </>
          ) : null}

          {q.kind === "multi" ? (
            <>
              <div className="tp-pills" role="group" aria-label={q.q}>
                {q.options.map((o) => {
                  const arr = (a[q.col] as string[] | undefined) ?? [];
                  const on = arr.includes(o);
                  const toggle = () => {
                    let n = on ? arr.filter((x) => x !== o) : [...arr, o];
                    if (!on && o === "None yet") n = ["None yet"];
                    else if (!on) n = n.filter((x) => x !== "None yet");
                    set(q.col, n);
                  };
                  return <button key={o} type="button" className="tp-pill" aria-pressed={on} onClick={toggle}>{o}</button>;
                })}
              </div>
              {q.other && ((a[q.col] as string[] | undefined) ?? []).includes(q.other.option) ? (
                <input className="tp-input" style={{ marginTop: 14 }} placeholder={q.other.placeholder} value={String(a[q.other.col] ?? "")} onChange={(e) => set(q.other!.col, e.target.value)} autoFocus />
              ) : null}
            </>
          ) : null}

          {q.kind === "scale" ? (
            <>
              <div className="tp-scale" role="radiogroup" aria-label={q.q}>
                {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={a[q.col] === n} aria-pressed={a[q.col] === n} onClick={() => set(q.col, n)}>{n}</button>)}
              </div>
              <div className="tp-grid-ends"><span>1 · {q.low}</span><span>5 · {q.high}</span></div>
            </>
          ) : null}

          {q.kind === "grid" ? (
            <div className="tp-gridq">
              {q.rows.map((r) => (
                <div key={r.col} className="tp-gridq-row" role="radiogroup" aria-label={r.label}>
                  <div className="tp-gridq-l">{r.label}</div>
                  <div className="tp-gridq-opts">
                    {q.options.map((o) => {
                      const v = q.numeric ? Number(o) : o;
                      const on = a[r.col] === v;
                      return <button key={o} type="button" role="radio" aria-checked={on} aria-pressed={on} className={`tp-gridq-b${q.numeric ? " is-num" : ""}`} onClick={() => set(r.col, v)}>{o}</button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {q.kind === "text" ? (
            <input className="tp-input tp-input-xl" placeholder={q.placeholder} value={String(a[q.col] ?? "")} onChange={(e) => set(q.col, e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") next(); }} autoFocus />
          ) : null}
          {q.kind === "long" ? (
            <textarea className="tp-textarea tp-input-xl" placeholder={q.placeholder} value={String(a[q.col] ?? "")} onChange={(e) => set(q.col, e.target.value)} />
          ) : null}

          {err ? <p className="tp-err" role="alert">{err}</p> : null}
          <div className="tp-intake-nav">
            {i > 0 ? <button type="button" className="tp-btn tp-btn-ghost tp-btn-sm" onClick={() => setI(i - 1)}>Back</button> : null}
            <button type="button" className="tp-btn tp-btn-orange" disabled={!ok || pending} onClick={next}>
              {i === total - 1 ? (pending ? "Sending" : "Send to Jem") : q.optional && !String(a[(q as { col?: string }).col ?? ""] ?? "").trim() ? "Skip" : "Next"}
            </button>
            {q.kind === "text" ? <span className="tp-small tp-mute">or press Enter</span> : null}
          </div>
        </div>
      </div>
      <div className="tp-intake-foot">
        <span>Answers go to Jem only, to shape the sessions. Nobody at Two Palms sees them with your name on.</span>
        <span>Your answers save in this browser as you go.</span>
      </div>
    </div>
  );
}
