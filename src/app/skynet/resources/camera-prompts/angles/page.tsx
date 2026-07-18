import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Finder } from "../../../../library/_finder/finder";
import type { FinderEntry } from "../../../../library/_finder/entry-card";
import { ANGLE_CATEGORIES, ANGLES, USE_CASES } from "../../../../library/camera-prompts/_data/angles";
import { JdTopbar, JdFooter, JdCrosslink } from "../jd";
import "../../../../library/library.css";
import "../../../../library/_finder/finder.css";

export const metadata: Metadata = {
  title: "Camera Angles — SKYNET × NotContent",
  description:
    "45 angles, framings and lens looks for AI still images, each with a reusable scene-agnostic prompt.",
  robots: { index: false, follow: false },
  icons: { icon: "/skynet/nct-globe.png" },
};

const IMAGE_DIR = path.join(process.cwd(), "public/images/library/camera-angles");

function discoverImage(slug: string): string | undefined {
  try {
    for (const ext of ["webp", "jpg", "png"]) {
      if (fs.existsSync(path.join(IMAGE_DIR, `${slug}.${ext}`)))
        return `/images/library/camera-angles/${slug}.${ext}`;
    }
  } catch {
    /* fall through to diagram */
  }
  return undefined;
}

export default function JdCameraAnglesPage() {
  const catLabel = Object.fromEntries(ANGLE_CATEGORIES.map((c) => [c.id, c.label]));
  const useLabel = Object.fromEntries(USE_CASES.map((u) => [u.id, u.label]));

  const entries: FinderEntry[] = ANGLES.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    categoryLabel: catLabel[a.category],
    description: a.description,
    prompt: a.prompt,
    tags: a.tags,
    badges: a.useCases.map((u) => useLabel[u]),
    diagram: { type: "angle" as const, spec: a.diagram },
    imageSrc: discoverImage(a.slug),
  }));

  const entryUseCases = Object.fromEntries(ANGLES.map((a) => [a.slug, a.useCases as string[]]));

  return (
    <div className="library">
      <JdTopbar />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{ANGLES.length}</span>
            &nbsp;/&nbsp;{" "}
            <Link href="/skynet/resources/camera-prompts" className="cm-breadcrumb">
              Camera Prompts
            </Link>{" "}
            · AI Stills
          </span>
          <span className="rule" />
        </div>
        <h1>
          Place the <span className="accent">camera</span>.
        </h1>
        <p className="sub">
          Every angle, framing and lens look worth knowing, as a prompt you can paste. Filter by
          the work — product, lifestyle, world-building — and keep the camera language separate
          from your scene.
        </p>
      </section>

      <Finder
        entries={entries}
        categories={ANGLE_CATEGORIES}
        useCases={USE_CASES}
        entryUseCases={entryUseCases}
        noun="angles"
        emptyHint="silhouette"
      />

      <JdCrosslink
        href="/skynet/resources/camera-prompts/movements"
        label="Making video instead? Camera movements"
      />

      <JdFooter />
    </div>
  );
}
