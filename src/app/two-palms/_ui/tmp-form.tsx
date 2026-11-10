"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { TMP_QUESTIONS, tmpAnswered, type TmpAnswers, type TmpColumn } from "../_data/tmp";
import { submitTmp } from "../_lib/tmp";

const DRAFT = "tp-tmp-draft";

export function TmpForm({ intro, due }: { intro: string; due: string }) {
  const [i, setI] = useState(-1); // -1 = intro screen
  const [a, setA] = useState<TmpAnswers>({});
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const focusRef = useRef<HTMLHeadingElement>(null);
  const total = TMP_QUESTIONS.length;

  useEffect(() => {
    const t = setTimeout(() => {
      try { const d = JSON.parse(localStorage.getItem(DRAFT) || "null"); if (d && typeof d === "object" && d.a) setA(d.a); } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => { try { if (!done) localStorage.setItem(DRAFT, JSON.stringify({ a })); } catch {} }, [a, done]);
  useEffect(() => { if (i >= 0) focusRef.current?.focus({ preventScroll: true }); }, [i]);

  const set = (col: string, v: string) => setA((p) => ({ ...p, [col]: v }));

  if (done) {
    return (
      <div className="t-body">
        <p className="lab-x">Done</p>
        <h2 className="form-q" tabIndex={-1}>Thank you. That&rsquo;s your hand-in.</h2>
        <p className="tp">Your answers go to Jem only. The patterns, with no names, shape every session from here.</p>
        <div className="acts"><Link className="btn btn--pri" href="/two-palms">Back to the hub</Link><Link className="btn btn--sec" href="/two-palms/foundations">The schedule</Link></div>
      </div>
    );
  }

  if (i < 0) {
    return (
      <div className="t-body">
        <p className="tt-lg" style={{ maxWidth: "36ch" }}>{intro}</p>
        <p className="note mono">{total} questions · Due {due}</p>
        <div className="acts"><button type="button" className="btn btn--hot" onClick={() => setI(0)}>Start</button></div>
      </div>
    );
  }

  const q = TMP_QUESTIONS[i];
  const col = q.id as TmpColumn;
  const val = a[col] ?? "";
  const ok = tmpAnswered(q, a);
  const last = i === total - 1;
  const next = () => {
    if (!ok) return;
    if (!last) { setI(i + 1); return; }
    setErr(null);
    start(async () => {
      try {
        const r = await submitTmp(a);
        if (r.ok) { setDone(true); try { localStorage.removeItem(DRAFT); } catch {} return; }
        setErr(
          r.reason === "closed" ? "The form isn't open yet. It opens after Session 1."
            : r.reason === "invalid" ? "One of the answers is missing. Go back and check."
            : "That didn't save. Your answers are kept in this browser: try again in a minute, or tell Jem in #tpm_ai_training.",
        );
      } catch {
        setErr("That didn't save. Your answers are kept in this browser: try again in a minute, or tell Jem in #tpm_ai_training.");
      }
    });
  };

  return (
    <div className="t-body">
      <ol className="form-prog" style={{ "--n": total } as React.CSSProperties} aria-hidden="true">
        {TMP_QUESTIONS.map((x, k) => <li key={x.id} className={k <= i ? "is-on" : undefined} />)}
      </ol>
      <p className="mono" style={{ marginTop: 10, fontSize: 12.5, color: "var(--text-2)" }}>{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}{q.optional ? " · optional" : ""}</p>
      <h2 className="form-q" id={`tmpq-${q.id}`} ref={focusRef} tabIndex={-1} style={{ outline: "none" }}>{q.q}</h2>
      {q.sub ? <p className="tp" style={{ marginTop: -8, marginBottom: 16 }}>{q.sub}</p> : null}

      {q.type === "choice" && q.options ? (
        <>
          <div className="opts" role="radiogroup" aria-labelledby={`tmpq-${q.id}`}>
            {q.options.map((o) => (
              <button key={o} type="button" role="radio" className="opt" aria-checked={val === o} onClick={() => set(col, o)}>
                <span className="ok" aria-hidden="true" />{o}
              </button>
            ))}
          </div>
          {q.other && val === q.other.option ? (
            <input className="fld" style={{ marginTop: 12, maxWidth: 420 }} aria-label={q.other.placeholder} placeholder={q.other.placeholder} value={a[q.other.col as TmpColumn] ?? ""} onChange={(e) => set(q.other!.col, e.target.value)} autoFocus />
          ) : null}
        </>
      ) : q.id === "name" ? (
        <input className="fld" style={{ maxWidth: 420 }} aria-labelledby={`tmpq-${q.id}`} autoComplete="name" placeholder="First and last" value={val} onChange={(e) => set(col, e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") next(); }} />
      ) : (
        <textarea className="fld" aria-labelledby={`tmpq-${q.id}`} placeholder="Say it how you'd say it. Dictation is fine." value={val} onChange={(e) => set(col, e.target.value)} />
      )}

      {err ? <p className="err" role="alert">{err}</p> : null}
      <div className="form-nav">
        <button type="button" className="btn btn--sec" onClick={() => setI(i - 1)}>Back</button>
        <button type="button" className={`btn ${last ? "btn--hot" : "btn--pri"}`} disabled={!ok || pending} onClick={next}>
          {last ? (pending ? "Sending" : "Send to Jem") : q.optional && !val.trim() ? "Skip" : "Next"}
        </button>
        <span className="hint">Saved in this browser as you go.</span>
      </div>
    </div>
  );
}
