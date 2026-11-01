import { HUB } from "@/app/two-palms/_data/hub";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "../../_lib/auth";
import { SESSIONS, countEvents, presenterFor, sessionByParam, sessionHref, sessionTitle, teamSession, twoZones, type PresenterContent, type TeamSession } from "../../_data/foundations";
import { AdminUnlock, IsNextMark } from "../../_ui/b-client";
import { Bento, IconArrow, IconHash, Lab, PageTitle, Tile, Win } from "../../_ui/b";

type Params = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = sessionByParam((await params).n);
  return { title: { absolute: s ? s.label : "Session" } };
}

const strip = (d: string) => d.replace(/ \d{4}$/, "");
const isUrl = (v: string) => /^https?:\/\//i.test(v);
const HW_LABEL: Record<string, string> = { submit: "Hand in", do: "Do", share: "Share" };

export default async function Page({ params }: Params) {
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

  return (
    <>
      <PageTitle back={{ href: "/two-palms/foundations", label: "AI Foundations" }} title={s.label} right={<><span className="mono">S{s.number}</span><span className="lab-x">{s.phase}</span></>} />
      <Bento>
        <Tile span={2} hue="mustard" label="What it's for">
          <Lab l="What it's for" r={`S${s.number} · ${s.phase}`} />
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
          <Lab l="What we'll cover" r={String(s.cover.length).padStart(2, "0")} />
          <ol className="b-list">
            {s.cover.map((c, i) => <li key={c}><span className="mono">{String(i + 1).padStart(2, "0")}</span><span>{c}</span></li>)}
          </ol>
        </Tile>

        <Tile span={2} hue="ember" label="Homework">
          <Lab l="Homework" r={`${String(s.homework.length).padStart(2, "0")} things`} />
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
          <Lab l="Sessions" r={`${s.number}/${String(SESSIONS.length).padStart(2, "0")}`} />
          <ul className="b-rows" style={{ marginTop: 10 }}>
            <li>
              {prev ? (
                <Link className="row" href={sessionHref(prev)}><IconArrow back /><span className="row-c"><span className="row-s">Previous · S{prev.number}</span><span className="row-t">{sessionTitle(prev)}</span></span><span className="row-st">{strip(prev.when.date)}</span></Link>
              ) : (
                <Link className="row" href="/two-palms/foundations#pre-brief"><IconArrow back /><span className="row-c"><span className="row-s">Before this</span><span className="row-t">The pre-brief</span></span></Link>
              )}
            </li>
            <li>
              {next ? (
                <Link className="row" href={sessionHref(next)}><span className="row-c"><span className="row-s">Next · S{next.number}</span><span className="row-t">{sessionTitle(next)}</span></span><span className="row-st">{strip(next.when.date)} <IconArrow /></span></Link>
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
