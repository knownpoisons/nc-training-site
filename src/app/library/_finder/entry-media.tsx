"use client";

import { useEffect, useRef, useState } from "react";

// Diagram is always the base layer. When a videoSrc exists, a muted loop sits
// above it at opacity 0 and fades in once it can play — driven by the card's
// visibility (the `live` prop, from the finder's shared IntersectionObserver).
// Reduced motion never autoplays video; any video error falls back silently.

interface Props {
  diagram: React.ReactNode;
  videoSrc?: string;
  posterSrc?: string;
  /** stills collections: an example render shown over the diagram */
  imageSrc?: string;
  live: boolean;
  title: string;
}

export function EntryMedia({ diagram, videoSrc, posterSrc, imageSrc, live, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showVideo = Boolean(videoSrc) && !failed && !reduced;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !showVideo) return;
    if (live) {
      v.play().catch(() => {
        /* autoplay blocked — the diagram remains */
      });
    } else {
      v.pause();
    }
  }, [live, showVideo]);

  const [imgReady, setImgReady] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="cm-media">
      {diagram}
      {imageSrc && !imgFailed && !showVideo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={`${title} — example still`}
          loading="lazy"
          className={imgReady ? "cm-video-ready" : undefined}
          onLoad={() => setImgReady(true)}
          onError={() => setImgFailed(true)}
        />
      )}
      {showVideo && (
        <video
          ref={videoRef}
          className={ready ? "cm-video-ready" : undefined}
          src={live || ready ? videoSrc : undefined}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${title} — example clip`}
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
