"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Showcase video for case-study pages. Autoplays muted+looped only while in
// view (saves bandwidth, no off-screen playback), shows the poster under
// prefers-reduced-motion instead of autoplaying, and offers a sound toggle.
export function CaseStudyVideo({
  src,
  poster,
  orientation = "landscape",
  className = "",
  href,
}: {
  src: string;
  poster: string;
  orientation?: "landscape" | "portrait";
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  // If autoplay is ever blocked, expose native controls so the poster isn't a dead end.
  const [needsControls, setNeedsControls] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return; // leave paused — poster stands in for the motion
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => setNeedsControls(true));
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    v.muted = muted; // current value; flip below
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <div
      className={
        "relative group overflow-hidden bg-foreground/5 border border-foreground/10 " +
        (orientation === "portrait" ? "mx-auto w-full max-w-[380px]" : "w-full") +
        (className ? " " + className : "")
      }
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        controls={reduced || needsControls}
        className="w-full h-auto block"
      />
      {/* Whole-video link into the case study (kept below the sound toggle) */}
      {href && !reduced && !needsControls && (
        <Link
          href={href}
          aria-label="Read the full case study"
          className="absolute inset-0 z-10"
        />
      )}
      {!reduced && !needsControls && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.15em] px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {muted ? "Sound on" : "Sound off"}
        </button>
      )}
    </div>
  );
}
