import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { cookies } from "next/headers";
import { LIBRARY_GATE_ENABLED } from "../../prompts";
import { LibraryGate } from "../../gate";
import { LibraryTopbar } from "../../topbar";
import { LibraryFooter } from "../../footer";
import { Finder } from "../../_finder/finder";
import type { FinderEntry } from "../../_finder/entry-card";
import { ANGLE_CATEGORIES, ANGLES, USE_CASES } from "../_data/angles";
import "../../library.css";
import "../../_finder/finder.css";

export const metadata: Metadata = {
  title: "Camera Angles — The Camera Prompt Finder — NotContent Library",
  description:
    "45 angles, framings and lens looks for AI still images, each with a reusable scene-agnostic prompt. Filter by product, lifestyle or world-building work.",
};

// Drop <slug>.jpg / <slug>.webp into public/images/library/camera-angles/
// and redeploy — the card upgrades from diagram to an example still.
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

export default async function CameraAnglesPage() {
  // Email gate: no access cookie → render the gate, never the prompts.
  const hasAccess =
    !LIBRARY_GATE_ENABLED ||
    (await cookies()).get("nc_library_access")?.value === "1";
  if (!hasAccess) return <LibraryGate total={ANGLES.length} />;

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Camera Angles — The Camera Prompt Finder",
    description: metadata.description,
    numberOfItems: ANGLES.length,
    itemListElement: ANGLES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
    })),
  };

  return (
    <div className="library">
      <LibraryTopbar total={ANGLES.length} />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{ANGLES.length}</span>
            &nbsp;/&nbsp;{" "}
            <Link href="/library/camera-prompts" className="cm-breadcrumb">
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

      <div className="cm-crosslink">
        <Link href="/library/camera-prompts/movements">
          <span className="cm-crosslink-title">
            Making video instead? <em>Camera movements</em>
          </span>
          <span className="cm-crosslink-arrow" aria-hidden="true">
            ⟶
          </span>
        </Link>
      </div>

      <LibraryFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
