import { PROMPTS } from "../_data/hub";
import { PageCover } from "../_ui/cover";
import { PromptTabs } from "./tabs";

export const metadata = { title: "Prompt library" };

export default function Page() {
  const tabs = Array.from(new Set(PROMPTS.map((p) => p.tab)));
  return (
    <>
      <PageCover label="Prompt library · new ones after each session" title="Good prompts to steal." lede="Every one has a copy button. Replace the brackets. Better still, read it once, then say it out loud in your own words." img="/two-palms/img/h/prompts.jpg" />
      <section className="tp-section" style={{ paddingTop: 16 }}>
        <div className="tp-wrap">
          <PromptTabs tabs={tabs} prompts={PROMPTS} />
        </div>
      </section>
    </>
  );
}
