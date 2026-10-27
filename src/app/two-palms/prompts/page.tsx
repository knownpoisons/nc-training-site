import { PROMPTS } from "../_data/hub";
import { Reveal, Sketch } from "../_ui/bits";
import { PromptTabs } from "./tabs";

export const metadata = { title: "Prompt library" };

export default function Page() {
  const tabs = Array.from(new Set(PROMPTS.map((p) => p.tab)));
  return (
    <>
      <section className="tp-hero" style={{ paddingBottom: 24 }}>
        <div className="tp-wrap">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}><span className="tp-dot" />Prompt library · {PROMPTS.length} and growing</div>
            <h1 className="tp-h1"><span className="tp-outline">Good prompts</span><br />to steal.</h1>
            <p className="tp-lede" style={{ marginTop: 18 }}>
              Every one has a copy button. Replace the brackets. Better still, read it once, then say it out loud in your own words. New ones land here after each session.
            </p>
            <div style={{ marginTop: 12 }}><Sketch mark="bubble" width={56} color="var(--tp-orange)" delay={500} /></div>
          </Reveal>
        </div>
      </section>
      <section className="tp-section" style={{ paddingTop: 16 }}>
        <div className="tp-wrap">
          <PromptTabs tabs={tabs} prompts={PROMPTS} />
        </div>
      </section>
    </>
  );
}
