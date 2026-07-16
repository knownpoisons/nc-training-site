import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Finder } from "../../../../library/_finder/finder";
import type { FinderEntry } from "../../../../library/_finder/entry-card";
import { CATEGORIES, MOVEMENTS } from "../../../../library/camera-prompts/_data/movements";
import { JdTopbar, JdFooter, JdCrosslink } from "../jd";
import "../../../../library/library.css";
import "../../../../library/_finder/finder.css";

export const metadata: Metadata = {
  title: "Camera Movements — January Digital × NotContent",
  description:
    "45 camera movements for AI video, each with a reusable scene-agnostic prompt. Built for your favourite AI video model.",
  robots: { index: false, follow: false },
  icons: { icon: "/january-digital/nct-globe.png" },
};

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

export default function JdCameraMovementsPage() {
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

  return (
    <div className="library">
      <JdTopbar />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{MOVEMENTS.length}</span>
            &nbsp;/&nbsp;{" "}
            <Link href="/january-digital/resources/camera-prompts" className="cm-breadcrumb">
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

      <JdCrosslink
        href="/january-digital/resources/camera-prompts/angles"
        label="Shooting stills instead? Camera angles"
      />

      <JdFooter />
    </div>
  );
}
