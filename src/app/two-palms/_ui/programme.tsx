import Link from "next/link";
import { PROMPTS, type Programme, type Session } from "../_data/hub";
import { CopyButton, LocalTime, Reveal, Sketch } from "./bits";
import { ComingSoonMark, Jenga } from "../_hairline";

function SessionCard({ s, live }: { s: Session; live: boolean }) {
  const dim = s.status === "upcoming" && !live;
  const prompts = (s.prompts ?? []).map((id) => PROMPTS.find((p) => p.id === id)).filter(Boolean);
  return (
    <Reveal as="li" className={`tp-session ${dim ? "tp-session-dim" : ""}`}>
      <div className="tp-session-n"><small>Session</small>{String(s.number).padStart(2, "0")}</div>
      <div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <h3 className="tp-h3">{s.title ?? <span className="tp-outline">To be announced</span>}</h3>
          {live ? <span className="tp-lime-chip">Next</span> : null}
          {s.status === "delivered" ? <span className="tp-chip">Done</span> : null}
        </div>
        <div className="tp-session-meta">
          <span>{s.phase}</span>
          {s.startsAt ? <span><LocalTime iso={s.startsAt} provisional={s.provisional} /></span> : <span className="tp-mute">Date coming</span>}
          <span className="tp-mute">{s.durationMinutes} min</span>
        </div>
        {live ? (
          <div className="tp-session-body">
            <div className="tp-session-live">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {s.meetUrl ? <a className="tp-btn tp-btn-orange" href={s.meetUrl} target="_blank" rel="noreferrer">Join on Meet</a> : <span className="tp-inert">Meet link: here and in #ai-training by Fri</span>}
                <span className="tp-small tp-mute">Cameras on. Phones away. Slack closed.</span>
              </div>
              {s.homework ? (
                <div className="tp-callout" style={{ marginTop: 18 }}>
                  <div className="tp-eyebrow">Before the session</div>
                  <p>{s.homework}</p>
                </div>
              ) : null}
              {prompts.length ? (
                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {prompts.map((p) => <CopyButton key={p!.id} text={p!.body} label={`Copy: ${p!.title}`} />)}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        {s.status === "delivered" ? (
          <div className="tp-session-body">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {s.recordingUrl ? <a className="tp-btn tp-btn-sm" href={s.recordingUrl} target="_blank" rel="noreferrer">Watch the recording</a> : null}
              {s.cheatSheetSlug ? <Link className="tp-btn tp-btn-sm tp-btn-ghost" href={`/two-palms/cheat-sheets/${s.cheatSheetSlug}`}>Cheat sheet</Link> : null}
            </div>
            {s.wrapNotes ? <div className="tp-callout"><div className="tp-eyebrow">Wrap notes</div><p>{s.wrapNotes}</p></div> : null}
            {s.homework ? <div className="tp-callout"><div className="tp-eyebrow">Homework</div><p>{s.homework}</p></div> : null}
            {s.resources?.length ? (
              <div><div className="tp-eyebrow" style={{ marginBottom: 6 }}>Mentioned</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>{s.resources.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>{r.name}</a>{r.note ? <span className="tp-mute"> · {r.note}</span> : null}</li>)}</ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export function ProgrammePage({ p }: { p: Programme }) {
  const nextIdx = p.sessions.findIndex((s) => s.status === "upcoming");
  const delivered = p.sessions.filter((s) => s.status === "delivered").length;
  const comingSoon = p.status === "coming_soon";
  return (
    <div className={comingSoon ? "tp-dimwrap" : undefined}>
      {comingSoon ? (
        <div className="tp-soon" role="status">
          <div>
            <div className="tp-eyebrow" style={{ color: "#a9a9a9" }}><span className="tp-dot" />Programme 02</div>
            <h2 className="tp-h2" style={{ marginTop: 8 }}><span className="tp-outline">Coming</span> soon.</h2>
            <p className="tp-small" style={{ marginTop: 10, color: "#ddd" }}>{p.startsLabel}. Once everyone has the base. Dates, cohorts and the first session land here.</p>
          </div>
          <ComingSoonMark />
        </div>
      ) : null}
    <div className={comingSoon ? "tp-dim" : undefined} aria-hidden={comingSoon || undefined}>
      <section className="tp-hero" style={{ paddingBottom: 24 }}>
        <div className="tp-wrap">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}>
              <span className="tp-dot" />{comingSoon ? "Programme 02" : "Programme 01"} · {p.startsLabel}
            </div>
            <h1 className="tp-h1">{p.name.includes(" ") ? <>{p.name.split(" ")[0]} <span className="tp-outline">{p.name.split(" ").slice(1).join(" ")}</span></> : p.name}</h1>
            <p className="tp-hand tp-orange" style={{ marginTop: 14, fontSize: "1.8rem" }}>{p.tagline}</p>
            <p className="tp-lede" style={{ marginTop: 16 }}>{p.shape}</p>
            <p className="tp-small tp-mute" style={{ marginTop: 8 }}>{p.who}</p>
          </Reveal>
          {!comingSoon && delivered > 0 ? (
            <Reveal delay={120}>
              <div className="tp-stat-strip">
                <div className="tp-stat"><div className="tp-stat-n">{String(delivered).padStart(2, "0")} <span className="tp-outline" style={{ fontSize: "0.6em" }}>/ {String(p.sessions.length).padStart(2, "0")}</span></div><div className="tp-stat-l">sessions delivered</div></div>
                <div className="tp-stat"><div className="tp-stat-n">{p.phases.length < 10 ? `0${p.phases.length}` : p.phases.length}</div><div className="tp-stat-l">phases</div></div>
                <div className="tp-stat"><div className="tp-stat-n">02</div><div className="tp-stat-l">office hours, bring a build problem</div></div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="tp-section tp-section-tint" style={{ paddingTop: 40 }}>
        <div className="tp-wrap">
          <div className="tp-eyebrow" style={{ marginBottom: 18 }}><span className="tp-dot" />The shape</div>
          <div className="tp-grid tp-grid-4">
            {p.phases.map((ph, i) => (
              <Reveal key={ph.label} delay={i * 90}>
                <div className="tp-card" style={{ height: "100%" }}>
                  <div className="tp-num">{String(i + 1).padStart(2, "0")}</div>
                  <h3 className="tp-h3" style={{ marginTop: 6 }}>{ph.label}</h3>
                  <div className="tp-small tp-mute" style={{ marginTop: 4 }}>{ph.weeks}</div>
                  <p className="tp-small" style={{ marginTop: 10 }}>{ph.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {comingSoon ? null : (
      <section className="tp-section">
        <div className="tp-wrap">
          <Reveal>
            <div className="tp-headrow">
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
                <h2 className="tp-h2"><span className="tp-outline">The</span> sessions</h2>
                <Sketch mark="arrow-down" width={28} color="var(--tp-orange)" delay={500} />
              </div>
              {comingSoon ? null : <Jenga />}
            </div>
          </Reveal>
          {comingSoon ? (
            <div className="tp-card tp-card-black">
              <div className="tp-eyebrow" style={{ color: "#a9a9a9" }}><span className="tp-dot" />Coming soon</div>
              <h3 className="tp-h2" style={{ marginTop: 8 }}><span className="tp-outline">After</span> Foundations</h3>
              <p style={{ marginTop: 12, color: "#ddd", maxWidth: "60ch" }}>The Creative Programme starts once everyone has the base. Dates, cohorts and the first session land here. Until then: the stance is on the home page, and the Kit has which models do what.</p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {p.sessions.filter((s) => s.title || s.status === "delivered").map((s) => <SessionCard key={s.number} s={s} live={p.sessions.indexOf(s) === nextIdx} />)}
            </ul>
          )}
          {p.sessions.some((s) => !s.title && s.status === "upcoming") ? (
            <div className="tp-card tp-card-tint" style={{ marginTop: 20 }}>
              <div className="tp-eyebrow"><span className="tp-dot" />Sessions {String(p.sessions.find((s) => !s.title)!.number).padStart(2, "0")} to {String(p.sessions.length).padStart(2, "0")}</div>
              <p className="tp-small" style={{ marginTop: 6 }}>Same time each week. Titles land after session 01. Dates to be confirmed by Two Palms.</p>
              <div className="tp-sessions-compact">
                {p.sessions.filter((s) => !s.title && s.status === "upcoming").map((s) => (
                  <span key={s.number} className="tp-chip">{String(s.number).padStart(2, "0")} · {s.startsAt ? new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Sydney", weekday: "short", day: "numeric", month: "short" }).format(new Date(s.startsAt)) : "date coming"}</span>
                ))}
              </div>
            </div>
          ) : null}
          {p.officeHours.length ? (
            <div className="tp-grid tp-grid-2" style={{ marginTop: 28 }}>
              {p.officeHours.map((o) => (
                <div key={o.label} className="tp-card tp-card-tint">
                  <div className="tp-eyebrow"><span className="tp-dot" />{o.label}</div>
                  <p style={{ marginTop: 6 }}>{o.startsAt ? <LocalTime iso={o.startsAt} provisional={o.provisional} /> : "Date coming"}</p>
                  <p className="tp-small tp-mute" style={{ marginTop: 6 }}>Open Q&amp;A. Bring something you&rsquo;re stuck on and we fix it live.</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      )}
    </div>
    </div>
  );
}
