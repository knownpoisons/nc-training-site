"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, submitIntake, teamLogin, type IntakeAnswers } from "../_lib/actions";
import { Sketch, Underline } from "./bits";

// ─── Lock screens ───────────────────────────────────────────────────────────────
export function Lock({ kind, configured }: { kind: "team" | "admin"; configured: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const isAdmin = kind === "admin";
  return (
    <div className="tp-lock">
      <div className="tp-palms" />
      <div className="tp-lock-card tp-stack" style={{ "--tp-stack": "22px" } as React.CSSProperties}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/two-palms/wordmark-black.png" alt="Two Palms" style={{ height: 16, width: "auto" }} />
          <span className="tp-hand tp-orange" style={{ fontSize: "1.2rem" }}>x NotContent</span>
        </div>
        <h1 className="tp-h1">
          {isAdmin ? <><span className="tp-outline">The</span> Backstage</> : <><span className="tp-outline">Two Palms</span> AI Hub</>}
        </h1>
        <p className="tp-lede">
          {isAdmin ? "Leadership only. The checklist, the roster and the intake answers." : <>Everything from the training, in one place. <Underline delay={400}>Team password</Underline> is in the pinned post in #ai-training.</>}
        </p>
        {!configured ? (
          <p className="tp-note">This door has no password set yet. Set {isAdmin ? "TP_HUB_ADMIN_PASSWORD" : "TP_HUB_PASSWORD"} in Vercel and redeploy.</p>
        ) : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            const v = pw;
            start(async () => {
              const r = isAdmin ? await adminLogin(v) : await teamLogin(v);
              if (r.ok) router.refresh();
              else { setErr("Wrong password. Try again, or ask Micky."); setPw(""); }
            });
          }}
        >
          <label className="tp-field">
            <span style={{ position: "absolute", left: -9999 }}>Password</span>
            <input className="tp-input tp-input-xl" type="password" autoComplete="current-password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
          </label>
          {err ? <p className="tp-err">{err}</p> : null}
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <button className="tp-btn tp-btn-orange" disabled={pending || !pw}>{pending ? "Checking" : "Let me in"}</button>
            <Sketch mark="arrow" width={64} color="var(--tp-orange)" delay={900} />
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Intake: one question per screen ────────────────────────────────────────────
type Q =
  | { id: "entity"; kind: "pills"; q: string; sub?: string; options: string[] }
  | { id: "role"; kind: "text"; q: string; sub?: string; placeholder: string }
  | { id: "clients"; kind: "text"; q: string; sub?: string; placeholder: string }
  | { id: "ai_today"; kind: "pills"; q: string; sub?: string; options: string[] }
  | { id: "tools"; kind: "multi"; q: string; sub?: string; options: string[] }
  | { id: "confidence"; kind: "scale"; q: string; sub?: string }
  | { id: "time_wasters"; kind: "long"; q: string; sub?: string; placeholder: string }
  | { id: "one_win"; kind: "long"; q: string; sub?: string; placeholder: string }
  | { id: "one_fail"; kind: "long"; q: string; sub?: string; placeholder: string }
  | { id: "want"; kind: "long"; q: string; sub?: string; placeholder: string }
  | { id: "name"; kind: "text"; q: string; sub?: string; placeholder: string };

const QS: Q[] = [
  { id: "entity", kind: "pills", q: "Where are you?", sub: "Pick one.", options: ["Two Palms Sydney", "Two Palms Munich", "Only Sports", "Forward", "Freelance"] },
  { id: "role", kind: "text", q: "What do you do?", sub: "Your role, in your words.", placeholder: "Account manager, editor, strategist, ops…" },
  { id: "clients", kind: "text", q: "Which clients do you work on?", sub: "Just the names.", placeholder: "Zambrero, Bank First…" },
  { id: "ai_today", kind: "pills", q: "How often do you use AI for work right now?", options: ["Never", "Now and then", "Most days", "All day, every day"] },
  { id: "tools", kind: "multi", q: "Which AI tools have you used?", sub: "Pick all that apply.", options: ["ChatGPT", "Claude", "Gemini", "Copilot", "Canva AI", "Adobe Firefly", "Higgsfield", "Midjourney", "Runway", "Granola", "Other", "None"] },
  { id: "confidence", kind: "scale", q: "How confident are you with AI, honestly?", sub: "1 is \"I avoid it\". 5 is \"people ask me for help\"." },
  { id: "time_wasters", kind: "long", q: "What eats your week?", sub: "The most time-consuming, costly or annoying repetitive things you do. Dictate it if you like.", placeholder: "Timesheets every Friday. Pulling reports. Chasing approvals…" },
  { id: "one_win", kind: "long", q: "One thing you tried with AI that worked.", sub: "Anything. Even small.", placeholder: "…" },
  { id: "one_fail", kind: "long", q: "One thing you tried that didn't.", sub: "This is the useful one.", placeholder: "…" },
  { id: "want", kind: "long", q: "What do you want out of this?", sub: "By Christmas. One or two lines.", placeholder: "…" },
  { id: "name", kind: "text", q: "And your name.", sub: "Only leadership sees this. The hub itself never shows names.", placeholder: "First and last" },
];

const EMPTY: IntakeAnswers = { entity: "", role: "", clients: "", ai_today: "", tools: [], confidence: 0, time_wasters: "", one_win: "", one_fail: "", want: "", name: "" };

export function Intake() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [a, setA] = useState<IntakeAnswers>(EMPTY);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const q = QS[i];
  const total = QS.length;
  const val = a[q.id as keyof IntakeAnswers];
  const filled = q.kind === "multi" ? (val as string[]).length > 0 : q.kind === "scale" ? (val as number) > 0 : String(val).trim().length > 0;

  const set = (v: string | string[] | number) => setA((p) => ({ ...p, [q.id]: v }));
  const next = () => {
    if (i < total - 1) { setI(i + 1); return; }
    start(async () => {
      const r = await submitIntake(a);
      if (r.ok) router.refresh();
      else setErr("That didn't save. Try once more, or tell Micky.");
    });
  };

  return (
    <div className="tp-intake">
      <div className="tp-intake-top">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/two-palms/wordmark-black.png" alt="Two Palms" style={{ height: 14, width: "auto" }} />
        <div className="tp-progress"><i style={{ width: `${((i + 1) / total) * 100}%` }} /></div>
        <span className="tp-eyebrow">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <div className="tp-intake-body">
        <div key={q.id} className="tp-intake-q tp-slide-enter">
          {i === 0 ? (
            <p className="tp-hand tp-orange" style={{ marginBottom: 14 }}>Before you come in: eleven quick questions. About three minutes.</p>
          ) : null}
          <h2 className="tp-h2">{q.q}</h2>
          {q.sub ? <p className="tp-lede tp-mute" style={{ marginBottom: 18 }}>{q.sub}</p> : null}

          {q.kind === "pills" ? (
            <div className="tp-pills">{q.options.map((o) => <button key={o} type="button" className="tp-pill" aria-pressed={val === o} onClick={() => set(o)}>{o}</button>)}</div>
          ) : null}
          {q.kind === "multi" ? (
            <div className="tp-pills">{q.options.map((o) => {
              const on = (val as string[]).includes(o);
              return <button key={o} type="button" className="tp-pill" aria-pressed={on} onClick={() => set(on ? (val as string[]).filter((x) => x !== o) : [...(val as string[]), o])}>{o}</button>;
            })}</div>
          ) : null}
          {q.kind === "scale" ? (
            <div className="tp-scale">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={val === n} onClick={() => set(n)}>{n}</button>)}</div>
          ) : null}
          {q.kind === "text" ? (
            <input className="tp-input tp-input-xl" placeholder={q.placeholder} value={val as string} onChange={(e) => set(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && filled) next(); }} autoFocus />
          ) : null}
          {q.kind === "long" ? (
            <textarea className="tp-textarea tp-input-xl" placeholder={q.placeholder} value={val as string} onChange={(e) => set(e.target.value)} autoFocus />
          ) : null}

          {err ? <p className="tp-err">{err}</p> : null}
          <div className="tp-intake-nav">
            {i > 0 ? <button type="button" className="tp-btn tp-btn-ghost tp-btn-sm" onClick={() => setI(i - 1)}>Back</button> : null}
            <button type="button" className="tp-btn tp-btn-orange" disabled={!filled || pending} onClick={next}>
              {i === total - 1 ? (pending ? "Saving" : "Into the hub") : "Next"}
            </button>
            {q.kind === "text" ? <span className="tp-small tp-mute">or press Enter</span> : null}
          </div>
        </div>
      </div>
      <div className="tp-intake-foot">
        <span>Answers go to leadership only, to shape the sessions. Nothing here is shown on the hub.</span>
        <span>Two Palms x NotContent</span>
      </div>
    </div>
  );
}

// ─── Backstage checklist ────────────────────────────────────────────────────────
import { setCheck, type CheckState } from "../_lib/actions";
import type { CheckItem } from "../_data/hub";

export function Checklist({ items, state, persisted }: { items: CheckItem[]; state: CheckState[]; persisted: boolean }) {
  const [s, setS] = useState<Record<string, CheckState>>(() => Object.fromEntries(state.map((x) => [x.id, x])));
  const [who, setWho] = useState("");
  const done = items.filter((it) => s[it.id]?.done).length;
  const groups = Array.from(new Set(items.map((it) => it.group)));
  return (
    <div className="tp-stack" style={{ "--tp-stack": "22px" } as React.CSSProperties}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div className="tp-progress" style={{ flex: "1 1 220px" }}><i style={{ width: `${(done / Math.max(1, items.length)) * 100}%` }} /></div>
        <span className="tp-eyebrow">{done} / {items.length} done</span>
        <input className="tp-input" style={{ maxWidth: 200, padding: "8px 12px", fontSize: "0.95rem" }} placeholder="Ticking as…" value={who} onChange={(e) => setWho(e.target.value)} />
      </div>
      {!persisted ? <p className="tp-note">Ticks aren&rsquo;t saving yet: run migration 008 in Supabase. Until then they reset on reload.</p> : null}
      {groups.map((g) => (
        <div key={g}>
          <div className="tp-eyebrow" style={{ marginTop: 10 }}><span className="tp-dot" />{g}</div>
          {items.filter((it) => it.group === g).map((it) => {
            const st = s[it.id];
            const isDone = !!st?.done;
            return (
              <div key={it.id} className="tp-check" data-done={isDone ? "true" : "false"}>
                <button
                  type="button"
                  className="tp-check-box"
                  aria-pressed={isDone}
                  aria-label={isDone ? "Mark not done" : "Mark done"}
                  onClick={async () => {
                    const nextDone = !isDone;
                    setS((p) => ({ ...p, [it.id]: { id: it.id, done: nextDone, done_by: nextDone ? who || null : null, done_at: nextDone ? new Date().toISOString() : null } }));
                    await setCheck(it.id, nextDone, who);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--tp-lime)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
                </button>
                <div>
                  <div className="tp-check-t" style={{ fontWeight: 700 }}>{it.t}</div>
                  {it.d ? <div className="tp-small tp-mute" style={{ marginTop: 2 }}>{it.d}</div> : null}
                </div>
                <div className="tp-check-meta">
                  <div>{it.owner}</div>
                  {it.due ? <div>{it.due}</div> : null}
                  {isDone && st?.done_by ? <div>by {st.done_by}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
