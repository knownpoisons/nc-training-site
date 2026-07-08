"use client";

import { useEffect, useRef } from "react";

// Decorative autoplaying background video (muted, looped, no controls).
// Under prefers-reduced-motion it pauses on the poster frame so it reads as
// a still image. Purely ambient — aria-hidden.
export function AmbientVideo({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
    }
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      aria-hidden="true"
      className={className}
    />
  );
}
