"use client";

/**
 * Abstract geometric SVG backgrounds for hero sections.
 * Each variant is a subtle pattern in cobalt at very low opacity.
 */

interface HeroPatternProps {
  variant?: "grid" | "dots" | "diagonal" | "circles" | "waves";
  className?: string;
}

export function HeroPattern({ variant = "grid", className = "" }: HeroPatternProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {variant === "grid" && <GridPattern />}
      {variant === "dots" && <DotsPattern />}
      {variant === "diagonal" && <DiagonalPattern />}
      {variant === "circles" && <CirclesPattern />}
      {variant === "waves" && <WavesPattern />}
    </div>
  );
}

function GridPattern() {
  return (
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1549CD" strokeWidth="0.5" opacity="0.07" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
      {/* Gradient fade at bottom */}
      <defs>
        <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.7" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-fade)" />
    </svg>
  );
}

function DotsPattern() {
  return (
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hero-dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1" fill="#1549CD" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-dots)" />
      <defs>
        <linearGradient id="dots-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.7" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-fade)" />
    </svg>
  );
}

function DiagonalPattern() {
  return (
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hero-diag" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="#1549CD" strokeWidth="0.5" opacity="0.06" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-diag)" />
      <defs>
        <linearGradient id="diag-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.7" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag-fade)" />
    </svg>
  );
}

function CirclesPattern() {
  return (
    <svg className="h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <circle cx="650" cy="100" r="200" fill="none" stroke="#1549CD" strokeWidth="0.5" opacity="0.06" />
      <circle cx="650" cy="100" r="140" fill="none" stroke="#1549CD" strokeWidth="0.5" opacity="0.05" />
      <circle cx="650" cy="100" r="80" fill="none" stroke="#1549CD" strokeWidth="0.5" opacity="0.04" />
      <circle cx="100" cy="500" r="120" fill="none" stroke="#1549CD" strokeWidth="0.5" opacity="0.04" />
      <circle cx="100" cy="500" r="60" fill="none" stroke="#1549CD" strokeWidth="0.5" opacity="0.03" />
    </svg>
  );
}

function WavesPattern() {
  return (
    <svg className="h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 400 Q300 350 600 400 T1200 400" fill="none" stroke="#1549CD" strokeWidth="0.8" opacity="0.05" />
      <path d="M0 420 Q300 370 600 420 T1200 420" fill="none" stroke="#1549CD" strokeWidth="0.8" opacity="0.04" />
      <path d="M0 440 Q300 390 600 440 T1200 440" fill="none" stroke="#1549CD" strokeWidth="0.8" opacity="0.03" />
    </svg>
  );
}
