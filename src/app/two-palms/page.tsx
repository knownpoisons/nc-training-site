import Link from "next/link";
import { CREATIVE, FOUNDATIONS, HUB, PROMPTS } from "./_data/hub";
import { Circled, Countdown, CopyButton, LocalTime, Reveal, Sketch, Underline } from "./_ui/bits";
import { Badge, HeadMark } from "./_hairline";

const Arrow = () => (
  <svg className="tp-card-arrow" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 28 C 12 16, 18 10, 28 6" /><path d="M18 5 L 28 6 L 27 16" />
  </svg>
);

export default function Home() {
  const next = FOUNDATIONS.sessions.find((s) => s.status === "upcoming" && s.startsAt) ?? null;
  const onboarding = PROMPTS.find((p) => p.id === "onboarding")!;
  return (
    <>
      <section className="tp-hero">
        <div className="tp-wrap tp-split" style={{ alignItems: "center" }}>
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 18 }}><span className="tp-dot" />Two Palms x NotContent · 2026 to 2027</div>
            <h1 className="tp-h1">
              <span className="tp-outline">One agency.</span><br />
              One way of <Underline delay={700}>working</Underline><br />
              <span className="tp-outline">with</span> AI.
            </h1>
            <p className="tp-lede tp-hero-sub">
              Two programmes, one hub. Foundations for everyone, the Creative Programme for the makers. Sessions, recordings, prompts and the rules, all here. Nothing lives in Slack.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="tp-hero-badge"><Badge play intensity={0.6} /><div className="tp-read" style={{ textAlign: "right", marginTop: 6 }}>Move over the palms</div></div>
          </Reveal>
        </div>
        <div className="tp-wrap">
          <Reveal delay={150}>
            <div className="tp-stat-strip">
              <div className="tp-stat"><div className="tp-stat-n">02</div><div className="tp-stat-l">programmes</div></div>
              <div className="tp-stat"><div className="tp-stat-n">08 <span className="tp-outline" style={{ fontSize: "0.6em" }}>+ 01</span></div><div className="tp-stat-l">Foundations sessions, plus kickoff for Creative</div></div>
              <div className="tp-stat"><div className="tp-stat-n">04</div><div className="tp-stat-l">{HUB.entities.join(" · ")}</div></div>
              <div className="tp-stat"><div className="tp-stat-n">10 <span className="tp-outline" style={{ fontSize: "0.6em" }}>/ 80 / 10</span></div><div className="tp-stat-l">human brief, AI execution, human QA</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* This week */}
      <section className="tp-section tp-section-tint" style={{ paddingTop: 48 }}>
        <div className="tp-wrap tp-split">
          <Reveal>
            <div className="tp-card tp-card-black" style={{ minHeight: 280 }}>
              <div className="tp-eyebrow" style={{ color: "#a9a9a9" }}><span className="tp-dot" />Next up</div>
              {next ? (
                <>
                  <h2 className="tp-h2" style={{ marginTop: 6 }}>
                    <span className="tp-outline">Foundations</span> Session {String(next.number).padStart(2, "0")}
                  </h2>
                  {next.title ? <p className="tp-lede" style={{ marginTop: 10, color: "#ddd" }}>{next.title}</p> : null}
                  <p style={{ marginTop: 14, color: "#ddd" }}><LocalTime iso={next.startsAt!} provisional={next.provisional} /></p>
                  <div style={{ marginTop: 22 }}><Countdown iso={next.startsAt!} label="Counting down" /></div>
                  <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {next.meetUrl ? <a className="tp-btn tp-btn-orange" href={next.meetUrl} target="_blank" rel="noreferrer">Join the session</a> : <span className="tp-lime-chip">Meet link lands here</span>}
                    <Link className="tp-btn tp-btn-ghost" style={{ borderColor: "#fff", color: "#fff" }} href="/two-palms/foundations">The programme</Link>
                  </div>
                </>
              ) : (
                <h2 className="tp-h2" style={{ marginTop: 6 }}>Dates coming</h2>
              )}
            </div>
          </Reveal>
          <div className="tp-stack" style={{ "--tp-stack": "16px" } as React.CSSProperties}>
            <Reveal delay={100}>
              <div className="tp-card tp-card-hover">
                <div className="tp-eyebrow"><span className="tp-dot" />Do this first</div>
                <h3 className="tp-h3">Set up your Claude account</h3>
                <p className="tp-small" style={{ marginTop: 8 }}>Ten minutes. Paste the onboarding prompt into your first chat and answer its questions. Then you&rsquo;re set for your role and your clients.</p>
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  <CopyButton text={onboarding.body} label="Copy the prompt" />
                  <Link className="tp-copy" href="/two-palms/setup">The full setup</Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="tp-card tp-card-pina">
                <div className="tp-eyebrow"><span className="tp-dot" />{HUB.spotlight.eyebrow}</div>
                <h3 className="tp-h3">{HUB.spotlight.headline}</h3>
                <p className="tp-small" style={{ marginTop: 8 }}>{HUB.spotlight.body}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="tp-section">
        <div className="tp-wrap">
          <Reveal>
            <div className="tp-headrow">
              <div>
                <div className="tp-eyebrow"><span className="tp-dot" />The two programmes</div>
                <h2 className="tp-h2" style={{ marginTop: 10 }}>
                  <span className="tp-outline">Everyone</span> learns the base.<br />The makers go <Circled delay={600}>further</Circled>.
                </h2>
              </div>
              <HeadMark mark="hub" />
            </div>
          </Reveal>
          <div className="tp-grid tp-grid-2">
            {[FOUNDATIONS, CREATIVE].map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <Link href={`/two-palms/${p.slug}`} className={`tp-card tp-card-link ${p.status === "live" ? "" : "tp-card-tint"}`} style={{ display: "block", minHeight: 260 }}>
                  <Arrow />
                  <div className="tp-eyebrow">{p.status === "live" ? <span className="tp-lime-chip">Live</span> : <span className="tp-chip">Coming soon</span>}</div>
                  <h3 className="tp-h2" style={{ marginTop: 14 }}>{p.name}</h3>
                  <p className="tp-hand tp-orange" style={{ marginTop: 6 }}>{p.tagline}</p>
                  <p className="tp-small" style={{ marginTop: 14 }}>{p.who}</p>
                  <p className="tp-small tp-mute" style={{ marginTop: 6 }}>{p.startsLabel}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stance */}
      <section className="tp-section tp-section-tint">
        <div className="tp-wrap tp-split">
          <Reveal>
            <div className="tp-eyebrow"><span className="tp-dot" />The stance</div>
            <h2 className="tp-h2" style={{ marginTop: 10 }}>
              AI <span className="tp-outline">amplifies</span> production.<br />It doesn&rsquo;t replace the shoot.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="tp-callout">
              <div className="tp-eyebrow">10 / 80 / 10</div>
              <p>{HUB.tenEightyTen} Clients only ever see the middle. We sell the two tens.</p>
              <p className="tp-hand tp-orange">Same budget, ten times the content, a tenth of the time.</p>
            </div>
            <div style={{ marginTop: 16 }}><Sketch mark="zigzag" width={180} color="var(--tp-orange)" /></div>
          </Reveal>
        </div>
      </section>

      {/* Quick links */}
      <section className="tp-section">
        <div className="tp-wrap">
          <div className="tp-grid tp-grid-3">
            {[
              { href: "/two-palms/prompts", t: "Prompt library", d: "Good prompts to steal. Every one has a copy button." },
              { href: "/two-palms/kit", t: "The Kit", d: "The policy on one page, the ten rules, which model for what, and the glossary." },
              { href: "/two-palms/setup", t: "Setup", d: "Fresh account, done right. Eight steps, about 40 minutes." },
            ].map((c, i) => (
              <Reveal key={c.href} delay={i * 100}>
                <Link href={c.href} className="tp-card tp-card-link" style={{ display: "block" }}>
                  <Arrow />
                  <h3 className="tp-h3">{c.t}</h3>
                  <p className="tp-small" style={{ marginTop: 8 }}>{c.d}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
