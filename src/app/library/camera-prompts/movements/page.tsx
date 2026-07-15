import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { LibraryTopbar } from "../../topbar";
import { LibraryFooter } from "../../footer";
import { Finder } from "../../_finder/finder";
import type { FinderEntry } from "../../_finder/entry-card";
import { CATEGORIES, MOVEMENTS } from "../_data/movements";
import "../../library.css";
import "../../_finder/finder.css";

export const metadata: Metadata = {
  title: "Camera Movements — The Camera Prompt Finder — NotContent Library",
  description:
    "45 camera movements for AI video, each with a reusable scene-agnostic prompt. Search, filter, copy, generate — built for your favourite AI video model.",
};

// Drop <slug>.mp4 (+ optional <slug>.jpg) into public/videos/library/camera-movements/
// and redeploy — the card upgrades from diagram to looping clip automatically.
const VIDEO_DIR = path.join(process.cwd(), "public/videos/library/camera-movements");

function discoverVideo(slug: string): { videoSrc?: string; posterSrc?: string } {
  try {
    const out: { videoSrc?: string; posterSrc?: string } = {};
    if (fs.existsSync(path.join(VIDEO_DIR, `${slug}.mp4`)))
      out.videoSrc = `/videos/library/camera-movements/${slug}.mp4`;
    if (fs.existsSync(path.join(VIDEO_DIR, `${slug}.jpg`)))
      out.posterSrc = `/videos/library/camera-movements/${slug}.jpg`;
    return out;
  } catch {
    return {};
  }
}

export default function CameraMovementsPage() {
  const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

  const entries: FinderEntry[] = MOVEMENTS.map((m) => {
    const discovered = discoverVideo(m.slug);
    return {
      slug: m.slug,
      title: m.title,
      category: m.category,
      categoryLabel: catLabel[m.category],
      description: m.description,
      prompt: m.prompt,
      tags: m.tags,
      diagram: { type: "movement" as const, spec: m.diagram },
      videoSrc: m.videoSrc ?? discovered.videoSrc,
      posterSrc: m.posterSrc ?? discovered.posterSrc,
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Camera Movements — The Camera Prompt Finder",
    description: metadata.description,
    numberOfItems: MOVEMENTS.length,
    itemListElement: MOVEMENTS.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.title,
    })),
  };

  return (
    <div className="library">
      <LibraryTopbar total={MOVEMENTS.length} />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{MOVEMENTS.length}</span>
            &nbsp;/&nbsp;{" "}
            <Link href="/library/camera-prompts" className="cm-breadcrumb">
              Camera Prompts
            </Link>{" "}
            · AI Video
          </span>
          <span className="rule" />
        </div>
        <h1>
          Move the <span className="accent">camera</span>.
        </h1>
        <p className="sub">
          Every camera move worth knowing, as a prompt you can paste. The camera instruction stays
          separate from your scene — swap the subject, keep the move. Built for your favourite AI
          video model.
        </p>
      </section>

      <Finder entries={entries} categories={CATEGORIES} noun="movements" emptyHint="orbit" />

      <div className="cm-crosslink">
        <Link href="/library/camera-prompts/angles">
          <span className="cm-crosslink-title">
            Shooting stills instead? <em>Camera angles</em>
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
