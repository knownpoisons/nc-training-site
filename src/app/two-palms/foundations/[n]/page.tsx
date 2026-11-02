import { HUB } from "@/app/two-palms/_data/hub";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "../../_lib/auth";
import { SESSIONS, countEvents, presenterFor, sessionByParam, sessionHref, sessionTitle, teamSession, twoZones, type PresenterContent, type TeamSession } from "../../_data/foundations";
import { AdminUnlock, IsNextMark } from "../../_ui/b-client";
import { VideoEmbed } from "../../_ui/video-embed";
import { Wrap } from "../../_ui/wrap";
import { Bento, IconArrow, IconHash, Lab, PageTitle, Tile, Win } from "../../_ui/b";

type Params = { params: Promise<{ n: string }>; searchParams?: Promise<{ wrap?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = sessionByParam((await params).n);
  return { title: { absolute: s ? s.label : "Session" } };
}

const strip = (d: string) => d.replace(/ \d{4}$/, "");
const isUrl = (v: string) => /^https?:\/\//i.test(v);
const HW_LABEL: Record<string, string> = { submit: "Hand in", do: "Do", share: "Share" };

export default async function Page({ params, searchParams }: Params) {
  const p = (await params).n;
  const full = sessionByParam(p);
  if (!full) notFound();
  // /foundations/shift → /foundations/1 (one address per session)
  if (!/^\d+$/.test(p)) redirect(sessionHref(full));

  // The team view carries no presenter fields at all; presenter content only
  // exists in this render when the Backstage password checks out server-side.
  const s: TeamSession = teamSession(full);
  const presenter: PresenterContent | null = presenterFor(full, await isAdminAuthed());
  const z = twoZones(s.start_iso);
  const idx = SESSIONS.findIndex((x) => x.n === s.n);
  const prev = idx > 0 ? SESSIONS[idx - 1] : null;
  const next = idx < SESSIONS.length - 1 ? SESSIONS[idx + 1] : null;
  const delivered = !!(s.recording_url || s.cheat_sheet || s.wrap_notes);

  // After the session has run: the wrap. Same beats as the January Digital session
  // pages (cover, big idea, framework, remember, hints, homework, resources, next),
  // laid out in the hub's bento.
  const r = s.recap;
  if (r && new Date().getTime() >= s.end_ms) {
    const nz = next ? twoZones(next.when.start_iso) : null;
    const due = s.homework.find((h) => h.type === "submit")?.short?.match(/by (.+)$/)?.[1];
    const sec = (l: string) => l; // section index numbers removed (design pass, 2 Nov)
    const wv = (await searchParams)?.wrap; // preview: ?wrap=a|b|c (JD structure)
    if (wv === "a" || wv === "b" || wv === "c") return <Wrap s={s} next={next} v={wv} />;
    return (
      <>
        <PageTitle back={{ href: "/two-palms/foundations", label: "AI Foundations" }} title={s.label} right={<span className="lab-x">{s.phase}</span>} />
        <Bento>
          <Tile span="F" label="Session" className="rc-hero">
            <div className="rc-hero-in">
              <Win src={`/two-palms/img/l/session-${s.number}.jpg`} w={520} h={520} className="rc-disk" eager />
              <div className="rc-hero-c">
                <p className="lab-x">Session {s.n} · {s.phase}</p>
                <h2 className="rc-title">{s.title}</h2>
                <p className="tp rc-goal">{r.goal}</p>
                <dl className="rc-meta">
                  <div><dt>Ran</dt><dd>{strip(s.date)}</dd></div>
                  <div><dt>Length</dt><dd>{s.duration_min} minutes</dd></div>
                  <div><dt>Format</dt><dd>Google Meet</dd></div>
                </dl>
              </div>
            </div>
          </Tile>

          {s.recording_url ? (
            <Tile span="F" label="Watch it back" className="rc-watch" id="watch">
              <Lab l={sec("Watch it back")} r={`${s.duration_min} min`} />
              <VideoEmbed url={s.recording_url} title={`Session ${s.n}: ${s.title}`} />
            </Tile>
          ) : null}

          <Tile span={2} label="What we covered">
            <Lab l={sec("What we covered")} />
            <ol className="rc-agenda">
              {r.agenda.map((c) => <li key={c}><span className="mono rc-n" aria-hidden="true">·</span><span>{c}</span></li>)}
            </ol>
          </Tile>

          {r.big_idea ? (
            <Tile span={2} hue="mustard" label="The big idea">
              <Lab l={sec("The big idea")} />
              <div className="t-body">
                <h3 className="rc-h">{r.big_idea.head}</h3>
                <div className="rc-prose">{r.big_idea.body.map((p, i) => <p key={i} className={i === r.big_idea!.body.length - 1 ? "rc-kicker" : undefined}>{p}</p>)}</div>
              </div>
            </Tile>
          ) : null}

          {r.framework ? (
            <Tile span="F" label="The framework">
              <Lab l={sec("The framework")} />
              <div className="t-body">
                <div className="rc-fw-top"><h3 className="rc-h">{r.framework.head}</h3><p className="tp">{r.framework.intro}</p></div>
                <div className="rc-split">
                  {r.framework.split.map((x, i) => (
                    <div key={i} className={`rc-split-c${i === 1 ? " is-ai" : ""}`}>
                      <span className="rc-split-n">{x.n}</span><span className="rc-split-who">{x.who}</span><span className="rc-split-d">{x.d}</span>
                    </div>
                  ))}
                </div>
                <p className="rc-twist">{r.framework.twist}</p>
              </div>
            </Tile>
          ) : null}

          {r.remember ? (
            <Tile span={2} label="What to remember">
              <Lab l={sec("What to remember")} />
              <ul className="rc-cards">{r.remember.map((x) => <li key={x.t}><b>{x.t}</b><span>{x.d}</span></li>)}</ul>
            </Tile>
          ) : null}

          {r.hints ? (
            <Tile span={2} hue="sky" label="Helpful hints">
              <Lab l={sec("Helpful hints")} />
              <ul className="rc-cards rc-cards--sky">{r.hints.map((x) => <li key={x.t}><b>{x.t}</b><span>{x.d}</span></li>)}</ul>
            </Tile>
          ) : null}

          <Tile span={2} label="Homework" className="rc-hw">
            <div className="rc-hw-head"><span>{sec("Homework")}</span><span className="mono">{due ? `Due ${due}` : ""}</span></div>
            <ol className="rc-hw-list">
              {s.homework.map((h) => {
                const ext = h.cta && /^https?:/.test(h.cta.href);
                const cls = `btn ${h.type === "submit" ? "btn--hot" : "btn--sec"}`;
                return (
                  <li key={h.text} className={h.type === "submit" ? "is-submit" : undefined}>
                    <span className="mono rc-n" aria-hidden="true">·</span>
                    <span className="rc-hw-t">{h.short ?? h.text}{h.type === "submit" ? <span className="rc-tag">Hand in</span> : null}</span>
                    {h.cta ? (ext
                      ? <a className={cls} href={h.cta.href} target="_blank" rel="noreferrer">{h.cta.label} <IconArrow /></a>
                      : <Link className={cls} href={h.cta.href}>{h.cta.label} <IconArrow /></Link>) : null}
                  </li>
                );
              })}
            </ol>
          </Tile>

          <Tile span={2} label="Take it with you">
            <Lab l={sec("Take it with you")} />
            <div className="rc-res">
              {s.recording_url ? (
                <a className="rc-res-c is-rec" href="#watch">
                  <span className="rc-res-k">Recording</span><span className="rc-res-t">Session {s.n} video</span><span className="rc-res-d">The full session, start to finish. Watch it at 1.25x.</span><span className="rc-res-go">Watch it <IconArrow /></span>
                </a>
              ) : (
                <div className="rc-res-c is-rec is-wait">
                  <span className="rc-res-k">Recording</span><span className="rc-res-t">Session {s.n} video</span><span className="rc-res-d">Lands here once it&apos;s processed.</span>
                </div>
              )}
              <a className="rc-res-c is-slack" href={HUB.slackUrl} target="_blank" rel="noreferrer">
                <span className="rc-res-k"><IconHash /> Slack</span><span className="rc-res-t">#ai-training</span><span className="rc-res-d">{s.slack}</span><span className="rc-res-go">Post it <IconArrow /></span>
              </a>
            </div>
          </Tile>

          {next && nz ? (
            <Link className="t sF rc-next" href={sessionHref(next)}>
              <span className="rc-next-c">
                <span className="lab-x"><span className="mono">{sec("Coming next")}</span> · {strip(next.when.date)} · {nz.sydney} Sydney · {nz.munich} Munich</span>
                <span className="rc-next-t">Session {next.n}: {sessionTitle(next)}</span>
                <span className="tp">{next.line}</span>
              </span>
              <span className="btn btn--pri">See session {next.n} <IconArrow /></span>
            </Link>
          ) : null}

          {presenter ? null : <div className="sF unlock" style={{ padding: "6px 2px" }}><AdminUnlock /></div>}
        </Bento>
      </>
    );
  }
  return (
    <>
      <PageTitle back={{ href: "/two-palms/foundations", label: "AI Foundations" }} title={s.label} right={<span className="lab-x">{s.phase}</span>} />
      <Bento>
        <Tile span={2} hue="mustard" label="What it's for">
          <Lab l="What it's for" r={s.phase} />
          <div className="t-body">
            <p className="tt-lg">{s.line}</p>
            <p className="tp" style={{ marginTop: 14, fontSize: 15, maxWidth: "58ch" }}><b style={{ color: "var(--text)" }}>The goal:</b> {s.goal}</p>
          </div>
        </Tile>

        <Tile hue="orange" label="When">
          <Lab l={<>When <IsNextMark events={countEvents()} startIso={s.start_iso} /></>} r={`${s.duration_min} min`} />
          <div className="t-body">
            <p className="mono" style={{ fontSize: 12.5 }}>{z.sydneyDay}</p>
            <div className="lockup-t" style={{ marginTop: 8 }}><span className="big mono">{z.sydney}</span><span className="lab-x">Sydney</span></div>
            <div className="lockup-t" style={{ marginTop: 8 }}><span className="mono" style={{ fontSize: 20, fontWeight: 300 }}>{z.munich}</span><span className="lab-x">Munich{z.munichDay !== z.sydneyDay ? ` · ${z.munichDay}` : ""}</span></div>
            <p className="note">Google Meet. The link is in <a href={HUB.slackUrl} target="_blank" rel="noreferrer">#ai-training</a>. Recorded.</p>
          </div>
        </Tile>

        <Tile label="Session print">
          <Lab l={`Session ${s.n}`} r={s.title} />
          <div className="t-body">
            <Win src={`/two-palms/img/l/session-${s.number}.jpg`} w={520} h={520} style={{ width: "100%", aspectRatio: "4 / 3", flex: 1 }} />
          </div>
        </Tile>

        <Tile span={2} label="What we'll cover">
          <Lab l="What we'll cover" />
          <ol className="b-list">
            {s.cover.map((c) => <li key={c}><span className="mono" aria-hidden="true">·</span><span>{c}</span></li>)}
          </ol>
        </Tile>

        <Tile span={2} hue="ember" label="Homework">
          <Lab l="Homework" />
          <ol className="b-list hw">
            {s.homework.map((h) =>
              h.type === "submit" ? (
                <li key={h.text} className="is-submit">
                  <div className="hw-in" style={{ gridColumn: "1 / -1" }}>
                    <span className="hw-k">The hand-in</span>
                    <p style={{ marginTop: 10, fontSize: 14 }}>{h.text}</p>
                    <div className="acts"><Link className="btn btn--hot" href="/two-palms/time-money-pain">Open the Time · Money · Pain form <IconArrow /></Link></div>
                  </div>
                </li>
              ) : (
                <li key={h.text}><span className="hw-k">{HW_LABEL[h.type] ?? h.type}</span><span>{h.text}</span></li>
              ),
            )}
          </ol>
        </Tile>

        <Tile hue="sky" label="Slack prompt">
          <Lab icon={<IconHash />} l="In the channel" r="Open now" />
          <div className="t-body">
            <p className="lab-x"><a className="tt-link" href={HUB.slackUrl} target="_blank" rel="noreferrer">#ai-training</a></p>
            <p className="tt" style={{ marginTop: 8 }}>{s.slack}</p>
          </div>
        </Tile>

        <Tile label="After the session">
          <Lab l="After the session" r={delivered ? "In" : "Pending"} />
          <ul className="b-rows" style={{ marginTop: 10 }}>
            <li>
              <div className="row">
                <span className="row-c"><span className="row-t">Recording</span>{!s.recording_url ? <span className="row-s">Lands here after the session</span> : null}</span>
                {s.recording_url ? <a className="btn btn--sec" style={{ marginLeft: "auto" }} href={s.recording_url} target="_blank" rel="noreferrer">Watch</a> : null}
              </div>
            </li>
            <li>
              <div className="row">
                <span className="row-c"><span className="row-t">Cheat sheet</span>
                  {!s.cheat_sheet ? <span className="row-s">Lands here after the session</span> : !isUrl(s.cheat_sheet) ? <span className="row-s" style={{ whiteSpace: "pre-wrap", color: "var(--text)" }}>{s.cheat_sheet}</span> : null}
                </span>
                {s.cheat_sheet && isUrl(s.cheat_sheet) ? <a className="btn btn--sec" style={{ marginLeft: "auto" }} href={s.cheat_sheet} target="_blank" rel="noreferrer">Open</a> : null}
              </div>
            </li>
            <li>
              <div className="row">
                <span className="row-c"><span className="row-t">Wrap notes</span><span className="row-s" style={s.wrap_notes ? { whiteSpace: "pre-wrap", color: "var(--text)" } : undefined}>{s.wrap_notes ?? "Lands here after the session"}</span></span>
              </div>
            </li>
          </ul>
        </Tile>

        <Tile span={2} label="Sessions">
          <Lab l="Sessions" />
          <ul className="b-rows" style={{ marginTop: 10 }}>
            <li>
              {prev ? (
                <Link className="row" href={sessionHref(prev)}><IconArrow back /><span className="row-c"><span className="row-s">Previous · Session {prev.n}</span><span className="row-t">{sessionTitle(prev)}</span></span><span className="row-st">{strip(prev.when.date)}</span></Link>
              ) : (
                <Link className="row" href="/two-palms/foundations#pre-brief"><IconArrow back /><span className="row-c"><span className="row-s">Before this</span><span className="row-t">The pre-brief</span></span></Link>
              )}
            </li>
            <li>
              {next ? (
                <Link className="row" href={sessionHref(next)}><span className="row-c"><span className="row-s">Next · Session {next.n}</span><span className="row-t">{sessionTitle(next)}</span></span><span className="row-st">{strip(next.when.date)} <IconArrow /></span></Link>
              ) : (
                <Link className="row" href="/two-palms/foundations"><span className="row-c"><span className="row-s">That&rsquo;s the programme</span><span className="row-t">All sessions</span></span><span className="row-st"><IconArrow /></span></Link>
              )}
            </li>
          </ul>
        </Tile>

        {presenter ? (
          <Tile span="F" className="t--presenter" label="Presenter">
            <Lab l="Presenter" sub="Backstage only, never shown to the team" r={`S${s.number}`} />
            <div className="pres-grid">
              <div>
                <table className="ros">
                  <thead><tr><th scope="col">Minutes</th><th scope="col">Run of show</th></tr></thead>
                  <tbody>{presenter.ros.map(([t, d]) => <tr key={t + d}><td className="mono">{t}</td><td>{d}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="pres-side">
                <h3 className="lab-x">Slides</h3>
                <ol className="b-list">{presenter.slides.map((x, i) => <li key={x}><span className="mono">{String(i + 1).padStart(2, "0")}</span><span>{x}</span></li>)}</ol>
                <h3 className="lab-x" style={{ marginTop: 18 }}>Notes</h3>
                <p className="tp">{presenter.notes || "None."}</p>
              </div>
            </div>
          </Tile>
        ) : (
          <div className="sF unlock" style={{ padding: "6px 2px" }}><AdminUnlock /></div>
        )}
      </Bento>
    </>
  );
}
