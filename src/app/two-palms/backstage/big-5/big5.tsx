"use client";

import { useEffect, useMemo, useState } from "react";
import { setBig5Todo, type Big5Data, type Big5Job, type Big5Todo } from "../../_lib/big5";

const STAGES = ["Intake deep-dive", "Plan agreed", "Build", "Test with owner", "Live"];
const SHORT: Record<string, string> = {
  scoping: "Scoping",
  timesheets: "Timesheets",
  reporting: "Reporting",
  finance: "Budgets + recon",
  tasks: "Tasks + hygiene",
};

function useWho() {
  const [who, setWho] = useState("");
  useEffect(() => {
    try { const v = localStorage.getItem("tp-b5-who"); if (v) setTimeout(() => setWho(v), 0); } catch {}
  }, []);
  const save = (v: string) => { setWho(v); try { localStorage.setItem("tp-b5-who", v); } catch {} };
  return [who, save] as const;
}

function pct(list: Big5Todo[]) {
  return list.length ? Math.round((list.filter((t) => t.done).length / list.length) * 100) : 0;
}

function Status({ s }: { s: string }) {
  const key = s.toLowerCase().replace(/\s+/g, "-");
  return <span className={`tp-b5-status tp-b5-status--${key}`}>{s}</span>;
}

function Bar({ value, label }: { value: number; label: string }) {
  return (
    <div className="tp-b5-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={label}>
      <i style={{ width: `${value}%` }} />
    </div>
  );
}

function TodoList({ items, who, onWho, onToggle, persisted }: { items: Big5Todo[]; who: string; onWho: (v: string) => void; onToggle: (t: Big5Todo) => void; persisted: boolean }) {
  const sorted = [...items].sort((a, b) => Number(a.done) - Number(b.done) || a.ord - b.ord);
  const p = pct(items);
  return (
    <div>
      <div className="tp-b5-todohead">
        <Bar value={p} label={`${p}% done`} />
        <span className="tp-b5-count">{items.filter((t) => t.done).length} of {items.length} done</span>
      </div>
      {!persisted ? <p className="tp-note">Ticks aren&rsquo;t being saved right now. Tell Jem.</p> : null}
      <ul className="tp-b5-todos">
        {sorted.map((t) => (
          <li key={t.id} className="tp-b5-todo" data-done={t.done ? "true" : "false"}>
            <button type="button" className="tp-check-box" aria-pressed={t.done} aria-label={t.done ? `Mark not done: ${t.task}` : `Mark done: ${t.task}`} onClick={() => onToggle(t)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--tp-lime)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
            </button>
            <span className="tp-b5-task">{t.task}</span>
            <span className="tp-b5-owner">{t.owner}</span>
            <span className={`tp-b5-due${t.due === "TBC" ? " is-tbc" : ""}`}>{t.due}</span>
            {t.done && t.done_by ? <span className="tp-b5-by">ticked by {t.done_by}</span> : null}
          </li>
        ))}
      </ul>
      <div className="tp-b5-who">
        <label htmlFor="tp-b5-who-in">Ticking as</label>
        <input id="tp-b5-who-in" className="tp-input" value={who} onChange={(e) => onWho(e.target.value)} placeholder="Your name" />
      </div>
    </div>
  );
}

function Timeline({ stage }: { stage: number }) {
  return (
    <ol className="tp-b5-timeline" aria-label="Milestones">
      {STAGES.map((s, i) => (
        <li key={s} data-state={i < stage ? "past" : i === stage ? "now" : "next"} aria-current={i === stage ? "step" : undefined}>
          <span className="tp-b5-node" aria-hidden="true" />
          <span className="tp-b5-stage">{s}</span>
          {i === stage ? <span className="tp-b5-here">Now</span> : null}
        </li>
      ))}
    </ol>
  );
}

function JobTab({ job, todos, who, onWho, onToggle, persisted }: { job: Big5Job; todos: Big5Todo[]; who: string; onWho: (v: string) => void; onToggle: (t: Big5Todo) => void; persisted: boolean }) {
  return (
    <div className="tp-b5-job">
      <div className="tp-b5-jobhead">
        <h2 className="tp-h2">{job.name}</h2>
        <Status s={job.status} />
      </div>

      <section className="tp-b5-block" aria-labelledby={`plan-${job.id}`}>
        <h3 id={`plan-${job.id}`} className="tp-b5-blockh"><span>1</span>Plan</h3>
        <dl className="tp-b5-plan">
          <div><dt>Owner</dt><dd>{job.owner}</dd></div>
          <div><dt>Co-owners</dt><dd>{job.co_owners}</dd></div>
          <div><dt>Runs on today</dt><dd>{job.runs_on}</dd></div>
          <div><dt>Hours a week</dt><dd>{job.hours}</dd></div>
          <div className="wide"><dt>&ldquo;Done for you&rdquo; looks like</dt><dd>{job.done_looks_like}</dd></div>
          <div><dt>Deep-dive</dt><dd className={job.deep_dive === "TBC" ? "is-tbc" : ""}>{job.deep_dive}</dd></div>
          <div className="wide"><dt>Open questions</dt><dd>{job.open_questions.length ? <ul>{job.open_questions.map((q) => <li key={q}>{q}</li>)}</ul> : "None yet"}</dd></div>
        </dl>
      </section>

      <section className="tp-b5-block" aria-labelledby={`todo-${job.id}`}>
        <h3 id={`todo-${job.id}`} className="tp-b5-blockh"><span>2</span>To-do</h3>
        <TodoList items={todos} who={who} onWho={onWho} onToggle={onToggle} persisted={persisted} />
      </section>

      <section className="tp-b5-block" aria-labelledby={`tl-${job.id}`}>
        <h3 id={`tl-${job.id}`} className="tp-b5-blockh"><span>3</span>Timeline</h3>
        <Timeline stage={job.stage} />
      </section>
    </div>
  );
}

export function Big5({ data }: { data: Big5Data }) {
  const [todos, setTodos] = useState<Big5Todo[]>(data.todos);
  const [who, setWho] = useWho();
  const tabs = useMemo(() => ["overview", ...data.jobs.map((j) => j.id), "micky", "jem"], [data.jobs]);
  const label = (id: string) => (id === "overview" ? "Overview" : id === "micky" ? "Micky checklist" : id === "jem" ? "Jem" : SHORT[id] ?? data.jobs.find((j) => j.id === id)?.name ?? id);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const read = () => { const h = location.hash.slice(1); if (tabs.includes(h)) setActive(h); };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [tabs]);

  const open = (id: string) => {
    setActive(id);
    try { history.replaceState(null, "", id === "overview" ? location.pathname : `#${id}`); } catch {}
    document.getElementById("tp-b5-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggle = async (t: Big5Todo) => {
    const next = !t.done;
    setTodos((p) => p.map((x) => (x.id === t.id ? { ...x, done: next, done_by: next ? who || null : null, done_at: next ? new Date().toISOString() : null } : x)));
    const r = await setBig5Todo(t.id, next, who);
    if (!r.ok) setTodos((p) => p.map((x) => (x.id === t.id ? t : x)));
  };

  const listOf = (id: string) => todos.filter((t) => t.list === id);

  if (!data.jobs.length) {
    return <p className="tp-note">The Big 5 isn&rsquo;t connected to the database yet. Tell Jem (migration 009 needs running).</p>;
  }

  return (
    <div>
      <div className="tp-tabs tp-b5-tabs" role="tablist" id="tp-b5-tabs" aria-label="Big 5">
        {tabs.map((id) => (
          <button key={id} role="tab" id={`tab-${id}`} aria-controls={`panel-${id}`} className="tp-tab" aria-selected={active === id} onClick={() => open(id)}>{label(id)}</button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} key={active} className="tp-slide-enter">
        {active === "overview" ? (
          <div className="tp-b5-cards">
            {data.jobs.map((j) => {
              const list = listOf(j.id);
              const next = [...list].sort((a, b) => a.ord - b.ord).find((t) => !t.done);
              const p = pct(list);
              return (
                <button key={j.id} type="button" className="tp-b5-card" onClick={() => open(j.id)} aria-label={`Open ${j.name}`}>
                  <span className="tp-b5-num">{String(j.ord).padStart(2, "0")}</span>
                  <Status s={j.status} />
                  <span className="tp-b5-name">{j.name}</span>
                  <span className="tp-b5-cardowner">{j.owner}</span>
                  <Bar value={p} label={`${p}% of to-dos done`} />
                  <span className="tp-b5-pct">{p}% done</span>
                  <span className="tp-b5-next">
                    <span className="k">Next</span>
                    {next ? <><span className="t">{next.task}</span><span className={`d${next.due === "TBC" ? " is-tbc" : ""}`}>{next.due}</span></> : <span className="t">All done</span>}
                  </span>
                </button>
              );
            })}
          </div>
        ) : active === "micky" || active === "jem" ? (
          <section className="tp-b5-block">
            <h2 className="tp-h2" style={{ marginBottom: 18 }}>{active === "micky" ? "Micky checklist" : "Jem"}</h2>
            <TodoList items={listOf(active)} who={who} onWho={setWho} onToggle={toggle} persisted={data.persisted} />
          </section>
        ) : (
          (() => {
            const job = data.jobs.find((j) => j.id === active);
            return job ? <JobTab job={job} todos={listOf(job.id)} who={who} onWho={setWho} onToggle={toggle} persisted={data.persisted} /> : null;
          })()
        )}
      </div>
    </div>
  );
}
