import { HUB, PROMPTS, SETUP_STEPS } from "@/app/two-palms/_data/hub";
import Link from "next/link";
import { FC, SESSIONS, sessionHref, sessionTitle } from "../_data/foundations";
import { POLICY_META } from "../_data/policy";
import { Bento, IconArrow, IconHash, PageTitle, Tile, Win } from "../_ui/b";
import { LocalTime } from "../_ui/local-time";
import { LocalWhen } from "../_ui/local-when";
import { SessionFig } from "../_ui/session-figs";

export const metadata = { title: "AI Foundations" };

// Same three beats as the January Digital hub page: 01 the programme and its
// through-line, 02 the sessions, 03 what's around the sessions. In bento.

const pad = (n: number) => String(n).padStart(2, "0");
const short = (d: string) => d.replace(/^\w+ /, "").replace(/ \d{4}$/, "");

function Sec({ n, eyebrow, title, lede }: { n: string; eyebrow: string; title: string; lede?: React.ReactNode }) {
  return (
    <div className="sF fx-sec">
      <p className="fx-eye">{eyebrow}</p>
      <h2 className="fx-h2">{title}</h2>
      {lede ? <p className="fx-lede">{lede}</p> : null}
    </div>
  );
}

export default function Page() {
  const now = new Date().getTime();
  const P = FC.programme;
  const end = (s: (typeof SESSIONS)[number]) => new Date(s.when.start_iso).getTime() + s.when.duration_min * 60000;
  const doneN = SESSIONS.filter((s) => end(s) <= now).length;
  const nextS = SESSIONS.find((s) => end(s) > now) ?? null;
  const lastDone = doneN ? SESSIONS[doneN - 1] : null;
  const hwSession = lastDone && lastDone.homework.length ? lastDone : null;
  const submit = hwSession?.homework.find((h) => h.type === "submit");
  const first = SESSIONS[0], last = SESSIONS[SESSIONS.length - 1];
  const joinHref = P.meet_url || HUB.slackUrl;
  const phaseOf = (n: number) => P.phases.find((p) => p.sessions.includes(n))?.name ?? "";

  return (
    <>
      <PageTitle back={{ href: "/two-palms", label: "Home" }} title={P.name} right={<span className="lab-x">{SESSIONS.length} × 60 min</span>} />
      <Bento>
        {/* ── 01 · The programme ── */}
        <Sec n="01" eyebrow="Programme overview" title="Two Palms learns to work with AI." />

        <Tile span="F" label="Programme overview" className="fx-ov">
          <div className="fx-ov-top">
            <div>
              <p className="fx-through">{P.through_line.split(". ")[0]}. <em>{P.through_line.split(". ").slice(1).join(". ")}</em></p>
              <p className="fx-sum">{P.summary}</p>
            </div>
            <Win src="/two-palms/img/l/foundations.jpg" w={720} h={720} className="fx-ov-img" eager />
          </div>
          <dl className="fx-stats">
            <div><dt>Programme</dt><dd>{SESSIONS.length} weeks</dd><span>{short(first.when.date)} → {short(last.when.date)}</span></div>
            <div><dt>Sessions</dt><dd>{SESSIONS.length} × 60 min</dd><span>Plus {FC.office_hours.length} office hours</span></div>
            <div><dt>Cadence</dt><dd>Tuesdays</dd><span><LocalTime iso={(nextS ?? first).when.start_iso} />, your time</span></div>
            <div><dt>Phases</dt><dd>{P.phases.length}</dd><span>{P.phases.map((p) => p.name.replace(/ it$/, "")).join(" · ")}</span></div>
          </dl>
          <div className="fx-prog">
            <div className="fx-prog-h"><span>Programme progress</span><span><b>{pad(doneN)}</b> of {pad(SESSIONS.length)} sessions delivered</span></div>
            <div className="fx-track" role="progressbar" aria-valuemin={0} aria-valuemax={SESSIONS.length} aria-valuenow={doneN}>
              {SESSIONS.map((s, i) => <span key={s.n} className={`fx-seg${i < doneN ? " is-done" : i === doneN ? " is-now" : ""}`} style={{ ["--i" as string]: i }} />)}
            </div>
            <div className="fx-marks">{SESSIONS.map((s, i) => <span key={s.n} className={i === doneN ? "is-now" : undefined}>{pad(s.n)}</span>)}</div>
          </div>
        </Tile>

        {hwSession ? (
          <Tile span={2} label="Current homework" className="fx-hw">
            <div className="fx-hw-head"><span>Current homework</span><span className="mono">From session {hwSession.n}</span></div>
            <ol className="fx-hw-list">
              {hwSession.homework.map((h) => (
                <li key={h.text}><span className="mono" aria-hidden="true">·</span><span>{h.short ?? h.text}{h.type === "submit" ? <b className="fx-tag">Hand in</b> : null}</span></li>
              ))}
            </ol>
            <div className="acts">
              {submit?.cta ? <Link className="btn btn--hot" href={submit.cta.href}>Open the form <IconArrow /></Link> : null}
              <Link className="btn btn--sec" href={sessionHref(hwSession)}>Session {hwSession.n} wrap-up <IconArrow /></Link>
            </div>
          </Tile>
        ) : null}

        <Tile span={hwSession ? 2 : "F"} label="The four phases">
          <div className="fx-mini-h"><span>The four phases</span></div>
          <ol className="fx-phases">
            {P.phases.map((ph) => {
              const ss = ph.sessions.map((n) => SESSIONS.find((x) => x.n === n)!).filter(Boolean);
              const state = ss.every((s) => end(s) <= now) ? "is-done" : ss.some((s) => s === nextS) ? "is-now" : "";
              return (
                <li key={ph.name} className={state}>
                  <span className="mono">{state === "is-done" ? "✓" : "·"}</span>
                  <b>{ph.name}</b>
                  <span className="fx-ph-s">{ss.map((s) => sessionTitle(s)).join(" · ")}</span>
                </li>
              );
            })}
          </ol>
        </Tile>

        {/* ── 02 · The sessions ── */}
        <Sec n="02" eyebrow="The eight sessions" title="What we cover, week by week." lede="Every session is recorded. The wrap-up, recording and homework land on its page straight after." />

        <div className="sF fx-grid" id="schedule">
          {SESSIONS.map((s, i) => {
            const st = i < doneN ? "done" : s === nextS ? "next" : "up";
            return (
              <article key={s.n} className={`fx-tile is-${st} fx-tone-${i % 3}`}>
                <Link href={sessionHref(s)} className="fx-tile-media" aria-label={`Session ${s.n}: ${sessionTitle(s)}`}>
                  {st === "up"
                    ? <span className="fx-tile-fig"><SessionFig n={s.n} play intensity={0.35} /></span>
                    : <Win src={`/two-palms/img/l/session-${s.number}.jpg`} w={480} h={480} className="fx-tile-img" />}
                  <span className="fx-tile-num">{s.number}</span>
                  <span className={`fx-chip is-${st}`}>{st === "done" ? "✓ Complete" : st === "next" ? "● Next" : "Upcoming"}</span>
                </Link>
                <div className="fx-tile-body">
                  <span className="fx-tile-eye">{phaseOf(s.n)}</span>
                  <Link href={sessionHref(s)} className="fx-tile-t">{sessionTitle(s)}</Link>
                  <span className="fx-tile-l">{s.line}</span>
                  <span className="fx-tile-when"><LocalWhen iso={s.when.start_iso} mins={s.when.duration_min} /></span>
                </div>
                {st === "done" ? <Link href={sessionHref(s)} className="fx-act is-done">Wrap-up &amp; recording <IconArrow /></Link>
                  : st === "next" ? <a href={s.meet_url || joinHref} target="_blank" rel="noreferrer" className="fx-act is-next">{s.meet_url || P.meet_url ? "Join session" : "Join · link in #tpm_ai_training"} <IconArrow /></a>
                  : <Link href={sessionHref(s)} className="fx-act">Session details <IconArrow /></Link>}
              </article>
            );
          })}
        </div>

        <details className="t s2 fx-dd">
          <summary><span>What good looks like</span><span className="mono" /></summary>
          <ol className="b-list">{P.outcomes.map((o) => <li key={o}><span className="mono" aria-hidden="true">·</span><span>{o}</span></li>)}</ol>
        </details>
        <details className="t s2 fx-dd">
          <summary><span>Rules of engagement</span><span className="mono" /></summary>
          <ol className="b-list">{P.rules_of_engagement.map((o) => <li key={o}><span className="mono" aria-hidden="true">·</span><span>{o}</span></li>)}</ol>
        </details>

        {/* ── 03 · Around the sessions ── */}
        <Sec n="03" eyebrow="Resources" title="What's around the sessions." lede="The work happens in the hour. The support happens in between." />

        <a className="t fx-res fx-res--mustard" href={HUB.slackUrl} target="_blank" rel="noreferrer">
          <span className="fx-res-k"><IconHash /> Slack</span><span className="fx-res-t">#tpm_ai_training</span>
          <span className="fx-res-d">Post what you make, half-finished included. Stuck? Ask your Claude, then the channel, then Jem.</span>
          <span className="fx-res-go">Open the channel <IconArrow /></span>
        </a>
        <Link className="t fx-res" href="/two-palms/setup">
          <span className="fx-res-k">Start here</span><span className="fx-res-t">Set up Claude</span>
          <span className="fx-res-d">About 40 minutes, once. The onboarding prompt, then {SETUP_STEPS.length} steps.</span>
          <span className="fx-res-go">The steps <IconArrow /></span>
        </Link>
        <Link className="t fx-res" href="/two-palms/prompts">
          <span className="fx-res-k">Library</span><span className="fx-res-t">Prompt library</span>
          <span className="fx-res-d">{PROMPTS.length} prompts to steal. Every one has a copy button.</span>
          <span className="fx-res-go">Open the library <IconArrow /></span>
        </Link>
        <Link className="t fx-res" href="/two-palms/policy">
          <span className="fx-res-k">Rules</span><span className="fx-res-t">AI policy</span>
          <span className="fx-res-d">Version {POLICY_META.version.replace(/\.0$/, "")}. What can and can&apos;t go into Claude.</span>
          <span className="fx-res-go">Read it <IconArrow /></span>
        </Link>
        <div className="t s2 fx-res fx-res--oh">
          <span className="fx-res-fig"><SessionFig n="oh" play intensity={0.35} /></span>
          <span className="fx-res-c">
            <span className="fx-res-k">Drop-in</span><span className="fx-res-t">Office hours</span>
            <span className="fx-res-d">Two optional {FC.office_hours[0]?.duration_min ?? 45}-minute sessions. Bring a real job, or whatever&apos;s stuck.</span>
            <span className="fx-oh-dates">{FC.office_hours.map((o) => <span key={o.n} className="mono">{o.date.replace(/\s*\(to confirm\)/i, "").replace(/^around /, "~")}</span>)}<span className="fx-chip">To confirm</span></span>
          </span>
        </div>
        <div className="t s2 fx-res">
          <span className="fx-res-k">Every session</span><span className="fx-res-t">After each hour</span>
          <span className="fx-res-d">{(P.every_session_short ?? P.every_session).join(" ")}</span>
        </div>

        <figure className="sF fx-foot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/two-palms/img/h/foundations-flatlay.jpg" alt="Two Palms AI Training Foundations kit laid out on a desk: floppy disk, coffee, flip clock, stickers." loading="lazy" />
        </figure>
      </Bento>
    </>
  );
}
