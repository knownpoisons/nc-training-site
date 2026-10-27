import Link from "next/link";
import { PROMPTS, SETUP_STEPS } from "../_data/hub";
import { CopyButton, Reveal, Sketch, Underline } from "../_ui/bits";
import { HeadMark } from "../_hairline";

export const metadata = { title: "Setup" };

export default function Page() {
  const onboarding = PROMPTS.find((p) => p.id === "onboarding")!;
  return (
    <>
      <section className="tp-hero" style={{ paddingBottom: 24 }}>
        <div className="tp-wrap tp-headrow">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}><span className="tp-dot" />Setup · about 40 minutes, once</div>
            <h1 className="tp-h1"><span className="tp-outline">Fresh account,</span><br />done <Underline delay={600}>right</Underline>.</h1>
            <p className="tp-lede" style={{ marginTop: 18 }}>
              Start clean. Claude finds your context in Drive, Slack and your client projects, so nothing old needs importing. Eight steps. Do them in order.
            </p>
          </Reveal>
          <HeadMark mark="keyboard" />
        </div>
      </section>

      <section className="tp-section" style={{ paddingTop: 24 }}>
        <div className="tp-wrap tp-split">
          <div>
            <ol className="tp-steps">
              {SETUP_STEPS.map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 60}>
                  <div className="tp-num">{s.n}</div>
                  <div>
                    <h3 className="tp-h3">{s.t}</h3>
                    <p className="tp-small" style={{ marginTop: 6 }}>{s.d}</p>
                  </div>
                  <div className="tp-step-meta"><div>{s.who}</div><div>{s.mins} min</div></div>
                </Reveal>
              ))}
            </ol>
          </div>
          <div className="tp-stack" style={{ position: "sticky", top: 84 } as React.CSSProperties}>
            <Reveal delay={200}>
              <div className="tp-prompt">
                <div className="tp-prompt-head">
                  <div><h3 className="tp-h3">{onboarding.title}</h3><div className="tp-prompt-when">{onboarding.when}</div></div>
                  <CopyButton text={onboarding.body} />
                </div>
                <pre>{onboarding.body}</pre>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="tp-card tp-card-tint">
                <div className="tp-eyebrow"><span className="tp-dot" />Not coming across</div>
                <p className="tp-small">Shared ChatGPT history (Two Palms, Only Sports): mostly search use, it stays behind. Personal chat histories and old exports: same. One live piece of work: move it with the <Link href="/two-palms/prompts" style={{ textDecoration: "underline" }}>Moving work</Link> prompts.</p>
                <p className="tp-hand tp-orange" style={{ marginTop: 10 }}>Projects matter. Chats don&rsquo;t.</p>
                <Sketch mark="tick" width={30} color="var(--tp-palm)" delay={400} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
