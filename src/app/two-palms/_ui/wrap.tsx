// Session wrap-up page, JD structure (preview, 2 Nov): one calm column, big title, quiet ruled lists,
// boxes only for the things you act on. Three variants: a (cheat sheet), b (cover band), c (side rail).
import Link from "next/link";
import type { ReactNode } from "react";
import { HUB } from "../_data/hub";
import { sessionHref, sessionTitle, twoZones, type FSession, type TeamSession } from "../_data/foundations";
import { IconArrow, Win } from "./b";

const strip = (d: string) => d.replace(/ \d{4}$/, "");
const DAYS: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday" };
/** Dates inside homework lines set in mono: "…, by Fri 6 Nov" */
function withDates(t: string): ReactNode {
  const m = t.match(/^(.*?)((?:by|before) )((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{1,2} \w{3})(.*)$/);
  return m ? <>{m[1]}{m[2]}<span className="wp-date">{m[3]}</span>{m[4]}</> : t;
}

function Sec({ k, h, children, id }: { k: string; h?: string; children: ReactNode; id?: string }) {
  return (
    <section className="wp-sec" id={id}>
      <p className="wp-k">{k}</p>
      {h ? <h2 className="wp-h">{h}</h2> : null}
      {children}
    </section>
  );
}

export function Wrap({ s, next, v }: { s: TeamSession; next: FSession | null; v: "a" | "b" | "c" }) {
  const r = s.recap!;
  const nz = next ? twoZones(next.when.start_iso) : null;

  const title = (
    <header className="wp-title">
      <p className="wp-k">Session {s.n} · Wrap-up</p>
      <h1 className="wp-h1">{s.title}</h1>
      <p className="wp-goal">{r.goal}</p>
      <dl className="wp-meta">
        <div><dt>Date</dt><dd>{strip(s.date)}</dd></div>
        <div><dt>Length</dt><dd>{s.duration_min} min</dd></div>
        <div><dt>Format</dt><dd>Google Meet</dd></div>
      </dl>
    </header>
  );

  const homework = (
    <section className="wp-hw" aria-label="Homework">
      <div className="wp-hw-head"><span>Homework for Session {s.n + 1}</span></div>
      <ul className="wp-hw-list">
        {s.homework.map((h) => {
          const ext = h.cta && /^https?:/.test(h.cta.href);
          const cls = `btn ${h.type === "submit" ? "btn--hot" : "btn--sec"}`;
          return (
            <li key={h.text}>
              <span className="wp-hw-t">{h.type === "submit" ? <em className="wp-tag">Hand in</em> : null}{withDates(h.short ?? h.text)}</span>
              {h.cta ? (ext
                ? <a className={cls} href={h.cta.href} target="_blank" rel="noreferrer">{h.cta.label} <IconArrow /></a>
                : <Link className={cls} href={h.cta.href}>{h.cta.label} <IconArrow /></Link>) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );

  const covered = (
    <Sec k="What we covered" h={`${DAYS[s.date.slice(0, 3)] ?? "The"}'s session.`}>
      <ol className="wp-list">{r.agenda.map((c) => <li key={c}>{c}</li>)}</ol>
    </Sec>
  );

  const bigIdea = r.big_idea ? (
    <Sec k="The big idea" h={r.big_idea.head}>
      <div className="wp-idea">
        {v === "c" ? null : <Win src={`/two-palms/img/l/session-${s.number}.jpg`} w={520} h={520} className="wp-idea-img" />}
        <div className="wp-prose">{r.big_idea.body.map((p, i) => <p key={i} className={i === r.big_idea!.body.length - 1 ? "wp-kicker" : undefined}>{p}</p>)}</div>
      </div>
    </Sec>
  ) : null;

  const framework = r.framework ? (
    <Sec k="The framework" h={r.framework.head}>
      <p className="wp-intro">{r.framework.intro}</p>
      <div className="wp-split">
        {r.framework.split.map((x, i) => (
          <div key={i} className={`wp-split-c${i === 1 ? " is-ai" : ""}`}><b>{x.n}</b><span className="wp-who">{x.who}</span><span>{x.d}</span></div>
        ))}
      </div>
      <p className="wp-twist">{r.framework.twist}</p>
    </Sec>
  ) : null;

  const cards = (k: string, h: string, items?: { t: string; d: string }[]) => items ? (
    <Sec k={k} h={h}>
      <ul className="wp-cards">{items.map((x) => <li key={x.t}><b>{x.t}</b><span>{x.d}</span></li>)}</ul>
    </Sec>
  ) : null;

  const takeIt = (
    <Sec k="Take it with you" h="Watch it back, then post." id="watch">
      <div className="wp-res">
        {s.recording_url ? (
          <a className="wp-res-c is-rec" href={s.recording_url} target="_blank" rel="noreferrer">
            <Win src="/two-palms/img/h/recording.jpg" w={480} h={300} className="wp-res-img" />
            <span className="wp-res-b"><span className="wp-k">Recording</span><span className="wp-res-t">Session {s.n} video <IconArrow /></span><span className="wp-res-d">The full session. Watch it at 1.25×.</span></span>
          </a>
        ) : null}
        <a className="wp-res-c is-slack" href={HUB.slackUrl} target="_blank" rel="noreferrer">
          <Win src="/two-palms/img/h/spotlight.jpg" w={480} h={300} className="wp-res-img" />
          <span className="wp-res-b"><span className="wp-k">Slack</span><span className="wp-res-t">#ai-training <IconArrow /></span><span className="wp-res-d">{s.slack}</span></span>
        </a>
      </div>
    </Sec>
  );

  const comingNext = next && nz ? (
    <Link className="wp-next" href={sessionHref(next)}>
      <span><span className="wp-k">Coming next</span><span className="wp-when">{strip(next.when.date)} · {nz.sydney} Sydney · {nz.munich} Munich</span><span className="wp-next-t">Session {next.n}: {sessionTitle(next)}</span><span className="wp-res-d">{next.line}</span></span>
      <span className="btn btn--pri">See session {next.n} <IconArrow /></span>
    </Link>
  ) : null;

  const back = <div className="wp-back"><Link className="tpb-back" href="/two-palms/foundations"><IconArrow back />AI Foundations</Link></div>;

  if (v === "c") {
    return (
      <div className="wp wp--c">
        {back}
        <div className="wp-grid">
          <aside className="wp-rail">
            <Win src={`/two-palms/img/l/session-${s.number}.jpg`} w={520} h={520} className="wp-rail-img" eager />
            {title}
            {homework}
          </aside>
          <div className="wp-main">
            {covered}{bigIdea}{framework}
            {cards("What to remember", "Worth remembering.", r.remember)}
            {cards("Helpful hints", "Habits that help.", r.hints)}
            {takeIt}{comingNext}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`wp wp--${v}`}>
      {back}
      {v === "a" ? (
        <div className="wp-col">
          <Win src="/two-palms/img/h/foundations-flatlay.jpg" w={1600} h={900} className="wp-banner" eager />
          {title}
        </div>
      ) : (
        <div className="wp-cover">
          <Win src="/two-palms/img/h/recording.jpg" w={1600} h={900} className="wp-cover-img" eager />
          <div className="wp-cover-plate">{title}</div>
        </div>
      )}
      <div className="wp-col">
        {homework}
        {covered}{bigIdea}{framework}
        {v === "b" ? (
          <div className="wp-two">
            <Sec k="What to remember"><ul className="wp-plain">{(r.remember ?? []).map((x) => <li key={x.t}><b>{x.t}</b> {x.d}</li>)}</ul></Sec>
            <Sec k="Helpful hints"><ul className="wp-plain">{(r.hints ?? []).map((x) => <li key={x.t}><b>{x.t}</b> {x.d}</li>)}</ul></Sec>
          </div>
        ) : (
          <>
            {cards("What to remember", "Worth remembering.", r.remember)}
            {cards("Helpful hints", "Habits that help.", r.hints)}
          </>
        )}
        {takeIt}{comingNext}
      </div>
    </div>
  );
}
