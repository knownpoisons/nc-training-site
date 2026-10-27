import { CLAUDE_BOARD, CREATIVE_BOARD, GLOSSARY, MENTAL_MODELS, POLICY_ONE_PAGER, RULES, TOOL_REGISTER } from "../_data/hub";
import { Circled, CopyButton, Reveal, Sketch } from "../_ui/bits";
import { KitTabs } from "./tabs";

export const metadata = { title: "The Kit" };

function Status({ s }: { s: "Approved" | "Testing" | "Not approved" }) {
  const cls = s === "Approved" ? "tp-status-ok" : s === "Testing" ? "tp-status-test" : "tp-status-no";
  return <span className={`tp-status ${cls}`}>{s}</span>;
}

export default function Page() {
  return (
    <>
      <section className="tp-hero" style={{ paddingBottom: 24 }}>
        <div className="tp-wrap">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}><span className="tp-dot" />The Kit · rules, models, words</div>
            <h1 className="tp-h1"><span className="tp-outline">The</span> Kit.</h1>
            <p className="tp-lede" style={{ marginTop: 18 }}>The policy on one page. Which model for which job. The mental models we keep coming back to. And the words, explained once.</p>
          </Reveal>
        </div>
      </section>

      <section className="tp-section" style={{ paddingTop: 8 }}>
        <div className="tp-wrap">
          <KitTabs
            rules={
              <div className="tp-split">
                <div>
                  <Reveal>
                    <h2 className="tp-h2" style={{ marginBottom: 18 }}><span className="tp-outline">The</span> ten <Circled delay={500}>rules</Circled>.</h2>
                  </Reveal>
                  <ul className="tp-rules">
                    {RULES.map((r, i) => (
                      <Reveal as="li" key={r.n} delay={i * 50}>
                        <span className="tp-num">{r.n}</span>
                        <div><h3 className="tp-h3">{r.t}</h3><div className="tp-small tp-mute">{r.d}</div></div>
                      </Reveal>
                    ))}
                  </ul>
                </div>
                <div className="tp-stack">
                  <Reveal delay={200}>
                    <div className="tp-prompt">
                      <div className="tp-prompt-head">
                        <div><h3 className="tp-h3">AI policy, the short version</h3><div className="tp-prompt-when">The one page everyone reads. Full policy in Drive, and inside Claude as a skill.</div></div>
                        <CopyButton text={POLICY_ONE_PAGER} />
                      </div>
                      <pre style={{ maxHeight: 520 }}>{POLICY_ONE_PAGER}</pre>
                    </div>
                  </Reveal>
                  <Reveal delay={300}>
                    <div className="tp-grid tp-grid-3">
                      <div className="tp-card tp-card-pina"><div className="tp-eyebrow">Green</div><p className="tp-small">Public info, your own drafts, general research, non-sensitive internal stuff.</p></div>
                      <div className="tp-card" style={{ background: "var(--tp-orange-tint)", borderColor: "transparent" }}><div className="tp-eyebrow" style={{ color: "var(--tp-orange-deep)" }}>Amber</div><p className="tp-small">Client material. Claude or Granola only, minimum needed, and only if the client&rsquo;s AI level allows.</p></div>
                      <div className="tp-card tp-card-black"><div className="tp-eyebrow" style={{ color: "#a9a9a9" }}>Red</div><p className="tp-small">Passwords, bank details, ID numbers, health, children, anything a client said no to. Never.</p></div>
                    </div>
                  </Reveal>
                </div>
              </div>
            }
            models={
              <div className="tp-stack" style={{ "--tp-stack": "40px" } as React.CSSProperties}>
                <Reveal>
                  <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">Which</span> Claude for what.</h2>
                  <p className="tp-small tp-mute" style={{ marginBottom: 16 }}>Team seats are flat-priced. This is about your usage allowance and speed, not money.</p>
                  <div className="tp-table-wrap">
                    <table className="tp-table">
                      <thead><tr><th>The job</th><th>Pick</th><th>Effort</th><th>Why</th></tr></thead>
                      <tbody>{CLAUDE_BOARD.map((r) => <tr key={r.job}><td>{r.job}</td><td>{r.pick}</td><td>{r.effort}</td><td className="tp-mute">{r.note}</td></tr>)}</tbody>
                    </table>
                  </div>
                </Reveal>
                <Reveal>
                  <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">Creative</span> models.</h2>
                  <p className="tp-small tp-mute" style={{ marginBottom: 16 }}>Updated as the Creative Programme runs. Quick test is for looking, production is for shipping.</p>
                  <div className="tp-table-wrap">
                    <table className="tp-table">
                      <thead><tr><th>Lane</th><th>Quick test</th><th>Production</th><th>Upscale</th><th>Status</th></tr></thead>
                      <tbody>{CREATIVE_BOARD.map((r) => <tr key={r.lane}><td>{r.lane}</td><td>{r.test}</td><td>{r.production}</td><td>{r.upscale}</td><td><span className="tp-chip">{r.status}</span></td></tr>)}</tbody>
                    </table>
                  </div>
                </Reveal>
                <Reveal>
                  <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">Tool</span> register.</h2>
                  <p className="tp-small tp-mute" style={{ marginBottom: 16 }}>Approved means on a Two Palms account, for client work. Testing means the creative director is using it; not yet for everyone.</p>
                  <div className="tp-table-wrap">
                    <table className="tp-table">
                      <thead><tr><th>Tool</th><th>Status</th><th>Note</th></tr></thead>
                      <tbody>{TOOL_REGISTER.map((r) => <tr key={r.tool}><td>{r.tool}</td><td><Status s={r.status} /></td><td className="tp-mute">{r.note}</td></tr>)}</tbody>
                    </table>
                  </div>
                </Reveal>
              </div>
            }
            models_mental={
              <div>
                <Reveal>
                  <h2 className="tp-h2" style={{ marginBottom: 20 }}><span className="tp-outline">Mental</span> models.</h2>
                </Reveal>
                <div className="tp-grid tp-grid-3">
                  {MENTAL_MODELS.map((m, i) => (
                    <Reveal key={m.t} delay={i * 60}>
                      <div className="tp-card tp-card-hover" style={{ height: "100%" }}>
                        <div className="tp-num">{String(i + 1).padStart(2, "0")}</div>
                        <h3 className="tp-h3" style={{ marginTop: 6 }}>{m.t}</h3>
                        <p className="tp-small" style={{ marginTop: 10 }}>{m.d}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div style={{ marginTop: 20 }}><Sketch mark="star" width={36} color="var(--tp-orange)" /></div>
              </div>
            }
            glossary={
              <div>
                <Reveal>
                  <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">The</span> words.</h2>
                  <p className="tp-small tp-mute" style={{ marginBottom: 20 }}>As deep as MCP and API. No deeper. You don&rsquo;t need deeper.</p>
                </Reveal>
                <dl className="tp-gloss">
                  {GLOSSARY.map((g) => <div key={g.term}><dt>{g.term}</dt><dd>{g.d}</dd></div>)}
                </dl>
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}
