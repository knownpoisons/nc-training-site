"use client";

import { useEffect, useState } from "react";
import { setBig5Todo, type Big5RolloutTodo, type Big5Tick } from "../../_lib/big5";
import { B5_STAGES, type B5Todo } from "../../_data/big5";

function useWho() {
  const [who, setWho] = useState("");
  useEffect(() => {
    try { const v = localStorage.getItem("tp-b5-who"); if (v) setTimeout(() => setWho(v), 0); } catch {}
  }, []);
  const save = (v: string) => { setWho(v); try { localStorage.setItem("tp-b5-who", v); } catch {} };
  return [who, save] as const;
}

type Row = { id: string; task: string; who: string; when: string; done: boolean; by: string | null };

function useTicks(initial: Row[]) {
  const [rows, setRows] = useState(initial);
  const [err, setErr] = useState(false);
  const toggle = async (id: string, by: string) => {
    const cur = rows.find((r) => r.id === id);
    if (!cur) return;
    const done = !cur.done;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, done, by: done ? by || null : null } : r)));
    const res = await setBig5Todo(id, done, by);
    if (!res.ok) { setErr(true); setRows((rs) => rs.map((r) => (r.id === id ? cur : r))); }
  };
  return { rows, toggle, err };
}

function Check({ r, onClick }: { r: Row; onClick: () => void }) {
  return (
    <li className="b5-todo" data-done={r.done ? "true" : "false"}>
      <button type="button" className="b5-box" aria-pressed={r.done} aria-label={r.done ? `Mark not done: ${r.task}` : `Mark done: ${r.task}`} onClick={onClick}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
      </button>
      <span className="b5-task">{r.task}</span>
      <span className="b5-meta"><span>{r.who}</span><span className={`mono${r.when === "to confirm" ? " is-tbc" : ""}`}>{r.when}</span>{r.done && r.by ? <span className="b5-by">ticked by {r.by}</span> : null}</span>
    </li>
  );
}

function WhoBar({ who, onWho, err, persisted }: { who: string; onWho: (v: string) => void; err: boolean; persisted: boolean }) {
  return (
    <div className="b5-whobar">
      <label htmlFor="b5-who">Ticking as</label>
      <input id="b5-who" className="tp-input" value={who} onChange={(e) => onWho(e.target.value)} placeholder="Your name" />
      {!persisted || err ? <span className="b5-warn">Ticks aren&rsquo;t saving right now. Tell Jem.</span> : null}
    </div>
  );
}

/** The timeline: each stage with its to-dos underneath, tickable. */
export function StageTodos({ todos, ticks, stage, persisted }: { todos: B5Todo[]; ticks: Record<string, Big5Tick>; stage: number; persisted: boolean }) {
  const [who, setWho] = useWho();
  const { rows, toggle, err } = useTicks(todos.map((t) => {
    const k = ticks[t.id];
    return { id: t.id, task: t.task, who: t.who, when: t.when, done: k ? k.done : !!t.done, by: k?.done_by ?? null };
  }));
  return (
    <>
      <WhoBar who={who} onWho={setWho} err={err} persisted={persisted} />
      <ol className="b5-tl">
        {B5_STAGES.map((name, i) => {
          const items = todos.map((t, ti) => ({ t, r: rows[ti] })).filter((x) => x.t.stage === i);
          const state = stage < 0 ? "is-later" : i < stage ? "is-done" : i === stage ? "is-now" : "is-later";
          const left = items.filter((x) => !x.r.done).length;
          return (
            <li key={name} className={`b5-st ${state}`}>
              <div className="b5-st-h">
                <span className="b5-dot" aria-hidden="true" />
                <h3>{name}</h3>
                <span className="b5-st-s">{state === "is-done" ? "Done" : state === "is-now" ? "Now" : items.length ? `${left} to do` : "Later"}</span>
              </div>
              {items.length ? (
                <ul className="b5-todos">{items.map(({ r }) => <Check key={r.id} r={r} onClick={() => toggle(r.id, who)} />)}</ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/** The training rollout lists (Micky, Jem) kept from the first Big 5 page. */
export function Rollout({ items, persisted }: { items: Big5RolloutTodo[]; persisted: boolean }) {
  const [who, setWho] = useWho();
  const { rows, toggle, err } = useTicks(items.map((t) => ({ id: t.id, task: t.task, who: t.owner, when: t.due === "TBC" ? "to confirm" : t.due, done: t.done, by: t.done_by })));
  const group = (l: string) => rows.filter((_, i) => items[i].list === l);
  return (
    <>
      <WhoBar who={who} onWho={setWho} err={err} persisted={persisted} />
      <div className="b5-roll">
        {[["micky", "Micky's set-up list"], ["jem", "Jem's list"]].map(([l, h]) => (
          <div key={l}>
            <h3 className="b5-sub">{h}</h3>
            <ul className="b5-todos">{group(l).sort((a, b) => Number(a.done) - Number(b.done)).map((r) => <Check key={r.id} r={r} onClick={() => toggle(r.id, who)} />)}</ul>
          </div>
        ))}
      </div>
    </>
  );
}
