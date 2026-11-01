import Link from "next/link";
import { FC, SESSIONS, countEvents, scheduleEvents, sessionHref, sessionTitle, twoZones } from "../_data/foundations";
import { IsNextMark } from "../_ui/b-client";
import { Bento, IconArrow, IconHash, Lab, PageTitle, Tile, Win } from "../_ui/b";
import { NextUpTile, TmpTile } from "../_ui/b-parts";

export const metadata = { title: "AI Foundations" };

const strip = (d: string) => d.replace(/ \d{4}$/, "");

export default function Page() {
  const now = new Date();
  const P = FC.programme;
  const ev = scheduleEvents();
  const cev = countEvents();
  const pb = FC.pre_brief;
  return (
    <>
      <PageTitle back={{ href: "/two-palms", label: "Home" }} title={P.name} lede={P.slot} right={<span className="lab-x">Times in Sydney · Munich</span>} />
      <Bento>
        <Tile span={2} hue="mustard" label="Programme overview">
          <Lab l="Programme overview" r={`${SESSIONS.length} × 60 min`} />
          <div className="t-body">
            <p className="through">{P.through_line}</p>
            <p className="tp" style={{ marginTop: 14, maxWidth: "60ch", fontSize: 15 }}>{P.summary}</p>
          </div>
          <ul className="trio">
            <li><b className="mono">{String(SESSIONS.length).padStart(2, "0")}</b><span>Sessions</span></li>
            <li><b className="mono">{String(FC.office_hours.length).padStart(2, "0")}</b><span>Office hours</span></li>
            <li><b className="mono">{String(P.phases.length).padStart(2, "0")}</b><span>Phases</span></li>
          </ul>
        </Tile>
        <NextUpTile now={now} />
        <TmpTile now={now} />

        <Tile span={2} label="Outcomes">
          <Lab l="What good looks like" r={`${String(P.outcomes.length).padStart(2, "0")} outcomes`} />
          <ol className="b-list">
            {P.outcomes.map((o, i) => <li key={o}><span className="mono">{String(i + 1).padStart(2, "0")}</span><span>{o}</span></li>)}
          </ol>
        </Tile>
        <Tile span={2} label="Rules of engagement">
          <Lab l="Rules of engagement" r={`${String(P.rules_of_engagement.length).padStart(2, "0")} rules`} />
          <ol className="b-list">
            {P.rules_of_engagement.map((o, i) => <li key={o}><span className="mono">{String(i + 1).padStart(2, "0")}</span><span>{o}</span></li>)}
          </ol>
        </Tile>

        <Tile span="F" label="The four phases">
          <Lab l="The four phases" r={String(P.phases.length).padStart(2, "0")} />
          <ol className="phases">
            {P.phases.map((ph, i) => (
              <li key={ph.name}>
                <div className="ph-h"><span className="tt">{ph.name}</span><span className="ph-n mono">{String(i + 1).padStart(2, "0")}</span></div>
                <Win src={`/two-palms/img/session-0${ph.sessions[0]}.jpg`} w={320} h={180} wait />
                <ul>
                  {ph.sessions.map((n) => {
                    const s = SESSIONS.find((x) => x.n === n);
                    if (!s) return null;
                    return <li key={n}><Link href={sessionHref(s)}><span>{n}. {sessionTitle(s)}</span><span className="mono">{strip(s.when.date)}</span></Link></li>;
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </Tile>

        <Tile span="F" id="schedule" label="The schedule">
          <Lab l="The schedule" sub="Pre-brief, eight sessions, two office hours" r="Sydney · Munich" />
          <div className="sched-h" aria-hidden="true"><span>No.</span><span /><span>Session</span><span className="dt">Date</span><span>Sydney</span><span>Munich</span><span style={{ textAlign: "right" }}>Status</span></div>
          <ol className="sched">
            {ev.map((e) => {
              const z = e.start_iso ? twoZones(e.start_iso) : null;
              const sess = e.kind === "session" ? SESSIONS.find((s) => `s${s.n}` === e.id) : null;
              const img = sess ? `/two-palms/img/session-${sess.number}.jpg` : e.kind === "prebrief" ? "/two-palms/img/spotlight.jpg" : "/two-palms/img/office-hours.jpg";
              const inner = (
                <>
                  <span className="tag">{e.tag}</span>
                  <Win src={img} w={44} h={44} wait={e.kind !== "prebrief" && sess?.n !== 1} />
                  <span className="c">
                    <span className="nm" style={{ display: "block" }}>{e.title}</span>
                    <span className="ln" style={{ display: "block" }}>{e.line}{sess ? ` · ${sess.phase}` : ""}</span>
                  </span>
                  <span className="dt">{e.dateLabel}{e.kind === "office" ? "" : ` · ${e.duration_min} min`}</span>
                  <span className="tzs">
                    <span className="tz"><small>Sydney</small>{z ? `${z.sydneyDay.split(" ")[0]} ${z.sydney}` : "to confirm"}</span>
                    <span className="tz"><small>Munich</small>{z ? `${z.munichDay.split(" ")[0]} ${z.munich}` : "to confirm"}</span>
                  </span>
                  {e.toConfirm ? <span className="st">To confirm</span> : e.start_iso ? (
                    <span style={{ justifySelf: "end", display: "inline-flex", alignItems: "center", gap: 8 }} className="st-wrap">
                      <IsNextMark events={cev} startIso={e.start_iso} />
                      {e.href ? <IconArrow /> : null}
                    </span>
                  ) : null}
                  {e.note ? <span className="mnote">{e.note}</span> : null}
                </>
              );
              return (
                <li key={e.id} id={e.kind === "prebrief" ? "pre-brief" : undefined}>
                  {e.kind === "session" && e.href ? <Link className="srow" href={e.href}>{inner}</Link> : <div className="srow">{inner}</div>}
                </li>
              );
            })}
          </ol>
        </Tile>

        <Tile span={2} label="The pre-brief">
          <Lab l={pb.label} r={`${strip(pb.date)} · ${pb.duration_min} min`} />
          <div className="t-body">
            <h3 className="tt">{pb.line}</h3>
            <p className="zone2"><b>{twoZones(pb.start_iso).sydney}</b> Sydney · <b>{twoZones(pb.start_iso).munich}</b> Munich · {pb.where}</p>
            <ol className="b-list" style={{ marginTop: 8 }}>
              {pb.cover.map((c, i) => <li key={c}><span className="mono">{String(i + 1).padStart(2, "0")}</span><span>{c}</span></li>)}
            </ol>
            <p className="note">{pb.munich_note}</p>
          </div>
        </Tile>
        <Tile label="Every session">
          <Lab l="Every session" r={String(P.every_session.length).padStart(2, "0")} />
          <ul className="b-list b-list--dash">
            {P.every_session.map((o) => <li key={o}><span>{o}</span></li>)}
          </ul>
        </Tile>
        <Tile hue="sky" label="Slack">
          <Lab icon={<IconHash />} l="Slack" r="Link to confirm" />
          <div className="t-body">
            <h3 className="tt">#ai-training</h3>
            <p className="tp">Post what you make, half-finished included. Stuck? Ask your Claude first, then the channel, then Jem.</p>
            <p className="note">Office hours: {FC.office_hours.map((o) => o.date).join(" and ")}.</p>
          </div>
        </Tile>
      </Bento>
    </>
  );
}
