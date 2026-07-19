import type { Metadata } from "next";
import Link from "next/link";
import { MovementDiagram } from "../../../library/_finder/movement-diagram";
import { AngleDiagram } from "../../../library/_finder/angle-diagram";
import { MOVEMENTS } from "../../../library/camera-prompts/_data/movements";
import { ANGLES } from "../../../library/camera-prompts/_data/angles";
import { JdTopbar, JdFooter } from "./jd";
import "../../../library/library.css";
import "../../../library/_finder/finder.css";

const TOTAL = MOVEMENTS.length + ANGLES.length;

export const metadata: Metadata = {
  title: "The Camera Prompt Finder — SKYNET × NotContent",
  description: `${TOTAL} camera prompts for AI creation — every movement for video and every angle, framing and lens look for stills.`,
  robots: { index: false, follow: false },
  icons: { icon: "/samplehub/nct-globe.png" },
};

export default function JdCameraPromptsChooser() {
  return (
    <div className="library">
      <JdTopbar />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{TOTAL}</span>
            &nbsp;/&nbsp; Client Resource · Camera Prompts
          </span>
          <span className="rule" />
        </div>
        <h1>
          Command the <span className="accent">camera</span>.
        </h1>
        <p className="sub">
          Every movement for video, every angle for stills — as prompts you can paste. The camera
          language stays separate from your scene: swap the subject, keep the shot. Pick your
          medium.
        </p>
      </section>

      <section className="cm-choose" aria-label="Choose a finder">
        <Link href="/samplehub/resources/camera-prompts/movements" className="cm-choice">
          <div className="cm-choice-media">
            <MovementDiagram
              spec={{ kind: "orbit", view: "plan", direction: "cw", speed: "slow", ease: "linear" }}
            />
          </div>
          <div className="cm-choice-body">
            <div className="cm-card-eyebrow">
              <span className="cm-card-num">{MOVEMENTS.length}</span>
              <span>AI Video</span>
            </div>
            <h2>
              Camera <em>movements</em>.
            </h2>
            <p>
              Orbits, whip pans, crash zooms, drone pulls — every move worth knowing, each one a
              paste-ready prompt.
            </p>
            <span className="cm-choice-cta">
              Open the finder <span className="cm-choice-arrow">⟶</span>
            </span>
          </div>
        </Link>

        <Link href="/samplehub/resources/camera-prompts/angles" className="cm-choice">
          <div className="cm-choice-media">
            <AngleDiagram
              slug="medium-shot"
              spec={{ view: "side", camera: "level", distance: "medium" }}
            />
          </div>
          <div className="cm-choice-body">
            <div className="cm-card-eyebrow">
              <span className="cm-card-num">{ANGLES.length}</span>
              <span>AI Stills</span>
            </div>
            <h2>
              Camera <em>angles</em>.
            </h2>
            <p>
              Framings, heights, lens looks and compositions — filterable by product, lifestyle
              and world-building work.
            </p>
            <span className="cm-choice-cta">
              Open the finder <span className="cm-choice-arrow">⟶</span>
            </span>
          </div>
        </Link>
      </section>

      <JdFooter />
    </div>
  );
}
