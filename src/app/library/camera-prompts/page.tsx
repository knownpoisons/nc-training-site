import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { LIBRARY_GATE_ENABLED } from "../prompts";
import { LibraryGate } from "../gate";
import { LibraryTopbar } from "../topbar";
import { LibraryFooter } from "../footer";
import { MovementDiagram } from "../_finder/movement-diagram";
import { AngleDiagram } from "../_finder/angle-diagram";
import { MOVEMENTS } from "./_data/movements";
import { ANGLES } from "./_data/angles";
import "../library.css";
import "../_finder/finder.css";

const TOTAL = MOVEMENTS.length + ANGLES.length;

export const metadata: Metadata = {
  title: "The Camera Prompt Finder — NotContent Library",
  description: `${TOTAL} camera prompts for AI creation — every movement for video and every angle, framing and lens look for stills, each as a reusable scene-agnostic prompt.`,
};

export default async function CameraPromptsChooser() {
  // Email gate: no access cookie → render the gate, never the collection.
  const hasAccess =
    !LIBRARY_GATE_ENABLED ||
    (await cookies()).get("nc_library_access")?.value === "1";
  if (!hasAccess) return <LibraryGate total={TOTAL} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Camera Prompt Finder",
    description: metadata.description,
    numberOfItems: 2,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Camera movements — AI video", url: "/library/camera-prompts/movements" },
      { "@type": "ListItem", position: 2, name: "Camera angles — AI stills", url: "/library/camera-prompts/angles" },
    ],
  };

  return (
    <div className="library">
      <LibraryTopbar total={TOTAL} />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{TOTAL}</span>
            &nbsp;/&nbsp; Collection · Camera Prompts
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
        <Link href="/library/camera-prompts/movements" className="cm-choice cm-live">
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

        <Link href="/library/camera-prompts/angles" className="cm-choice cm-live">
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

      <LibraryFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
