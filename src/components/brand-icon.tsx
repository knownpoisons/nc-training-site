/**
 * Brand icons — heavier, editorial riso-inspired style.
 * Halftone dot pattern fills + corner brackets.
 * Used on homepage Methodology preview + Why NotContent grid.
 */

interface BrandIconProps {
  icon: keyof typeof brandIcons;
  color?: string;
  size?: number;
  className?: string;
  showFrame?: boolean;
}

export function BrandIcon({
  icon,
  color = "#1549CD",
  size = 64,
  className = "",
  showFrame = true,
}: BrandIconProps) {
  const Icon = brandIcons[icon];
  // Unique pattern id per instance so multiple BrandIcons with different colors
  // don't share pattern defs
  const patternId = `halftone-${icon}-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        {/* Halftone dot pattern — approximates riso texture */}
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="2.2"
          height="2.2"
        >
          <circle cx="1.1" cy="1.1" r="0.5" fill={color} opacity="0.55" />
        </pattern>
      </defs>

      {/* Corner brackets — editorial framing */}
      {showFrame && (
        <g stroke={color} strokeWidth="1" opacity="0.3" fill="none">
          <path d="M 1.5 4.5 L 1.5 1.5 L 4.5 1.5" />
          <path d="M 43.5 1.5 L 46.5 1.5 L 46.5 4.5" />
          <path d="M 46.5 43.5 L 46.5 46.5 L 43.5 46.5" />
          <path d="M 4.5 46.5 L 1.5 46.5 L 1.5 43.5" />
        </g>
      )}

      {/* Icon content */}
      <g
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <Icon patternId={patternId} color={color} />
      </g>
    </svg>
  );
}

interface IconRenderProps {
  patternId: string;
  color: string;
}

const brandIcons = {
  /** Diverge — solid origin branching to 3 halftone circles */
  diverge: ({ patternId, color }: IconRenderProps) => (
    <>
      <circle cx="11" cy="24" r="4" fill={color} stroke="none" />
      <line x1="15" y1="24" x2="29" y2="13" />
      <line x1="15" y1="24" x2="29" y2="24" />
      <line x1="15" y1="24" x2="29" y2="35" />
      <circle cx="33" cy="13" r="3.5" fill={`url(#${patternId})`} />
      <circle cx="33" cy="24" r="3.5" fill={`url(#${patternId})`} />
      <circle cx="33" cy="35" r="3.5" fill={`url(#${patternId})`} />
      <circle cx="33" cy="13" r="3.5" />
      <circle cx="33" cy="24" r="3.5" />
      <circle cx="33" cy="35" r="3.5" />
    </>
  ),
  /** Converge — 3 halftone inputs merging to solid output */
  converge: ({ patternId, color }: IconRenderProps) => (
    <>
      <circle cx="11" cy="13" r="3.5" fill={`url(#${patternId})`} />
      <circle cx="11" cy="13" r="3.5" />
      <circle cx="11" cy="24" r="3.5" fill={`url(#${patternId})`} />
      <circle cx="11" cy="24" r="3.5" />
      <circle cx="11" cy="35" r="3.5" fill={`url(#${patternId})`} />
      <circle cx="11" cy="35" r="3.5" />
      <line x1="15" y1="14" x2="28" y2="22" />
      <line x1="15" y1="24" x2="28" y2="24" />
      <line x1="15" y1="34" x2="28" y2="26" />
      <circle cx="34" cy="24" r="5" fill={color} stroke="none" />
      <circle cx="34" cy="24" r="5" />
    </>
  ),
  /** Systemize — 3 connected filled blocks, like a flow */
  systemize: ({ patternId, color }: IconRenderProps) => (
    <>
      <rect x="5" y="7" width="13" height="9" rx="1" fill={`url(#${patternId})`} />
      <rect x="5" y="7" width="13" height="9" rx="1" />
      <rect x="26" y="7" width="13" height="9" rx="1" fill={`url(#${patternId})`} />
      <rect x="26" y="7" width="13" height="9" rx="1" />
      <rect x="15" y="32" width="18" height="9" rx="1" fill={color} stroke="none" />
      <rect x="15" y="32" width="18" height="9" rx="1" />
      {/* Connection lines */}
      <path d="M 11.5 16 L 11.5 24 L 24 24 L 24 32" />
      <path d="M 32.5 16 L 32.5 24 L 24 24" />
    </>
  ),
  /** Shield — earned in the field */
  shield: ({ patternId }: IconRenderProps) => (
    <>
      <path
        d="M 24 5 L 39 10 V 23 C 39 32 24 41 24 41 C 24 41 9 32 9 23 V 10 Z"
        fill={`url(#${patternId})`}
      />
      <path d="M 24 5 L 39 10 V 23 C 39 32 24 41 24 41 C 24 41 9 32 9 23 V 10 Z" />
      <polyline points="16 23 21 28 32 17" strokeWidth="2.5" />
    </>
  ),
  /** Compass — methodology that outlasts tools */
  compass: ({ patternId, color }: IconRenderProps) => (
    <>
      <circle cx="24" cy="24" r="17" fill={`url(#${patternId})`} />
      <circle cx="24" cy="24" r="17" />
      <circle cx="24" cy="24" r="12" fill="none" />
      {/* Tick marks around edge */}
      <line x1="24" y1="8" x2="24" y2="11" />
      <line x1="40" y1="24" x2="37" y2="24" />
      <line x1="24" y1="40" x2="24" y2="37" />
      <line x1="8" y1="24" x2="11" y2="24" />
      {/* Needle */}
      <polygon
        points="24 10 27 24 24 26 21 24"
        fill={color}
        stroke="none"
      />
      <polygon
        points="24 38 21 24 24 22 27 24"
        fill={color}
        opacity="0.3"
        stroke="none"
      />
      <circle cx="24" cy="24" r="2" fill={color} stroke="none" />
    </>
  ),
  /** Diamond — taste stays in the room */
  quality: ({ patternId }: IconRenderProps) => (
    <>
      <path
        d="M 24 5 L 43 24 L 24 43 L 5 24 Z"
        fill={`url(#${patternId})`}
      />
      <path d="M 24 5 L 43 24 L 24 43 L 5 24 Z" />
      <path d="M 24 13 L 35 24 L 24 35 L 13 24 Z" />
      {/* Inner sparkle */}
      <line x1="24" y1="19" x2="24" y2="29" strokeWidth="1.5" />
      <line x1="19" y1="24" x2="29" y2="24" strokeWidth="1.5" />
    </>
  ),
  /** Fingerprint — your brand, not a generic exercise */
  fingerprint: ({ patternId }: IconRenderProps) => (
    <>
      <circle cx="24" cy="24" r="18" fill={`url(#${patternId})`} />
      <circle cx="24" cy="24" r="18" />
      {/* Fingerprint whorls */}
      <path d="M 14 20 Q 24 12 34 20" fill="none" strokeWidth="1.5" />
      <path d="M 12 24 Q 24 16 36 24" fill="none" strokeWidth="1.5" />
      <path d="M 14 28 Q 24 20 34 28" fill="none" strokeWidth="1.5" />
      <path d="M 16 32 Q 24 26 32 32" fill="none" strokeWidth="1.5" />
      <path d="M 18 36 Q 24 32 30 36" fill="none" strokeWidth="1.5" />
    </>
  ),
  /** Team network — we don't disappear */
  team: ({ patternId, color }: IconRenderProps) => (
    <>
      {/* Center node */}
      <circle cx="24" cy="24" r="5" fill={color} stroke="none" />
      <circle cx="24" cy="24" r="5" />
      {/* Surrounding halftone nodes */}
      <circle cx="10" cy="12" r="4" fill={`url(#${patternId})`} />
      <circle cx="10" cy="12" r="4" />
      <circle cx="38" cy="12" r="4" fill={`url(#${patternId})`} />
      <circle cx="38" cy="12" r="4" />
      <circle cx="10" cy="36" r="4" fill={`url(#${patternId})`} />
      <circle cx="10" cy="36" r="4" />
      <circle cx="38" cy="36" r="4" fill={`url(#${patternId})`} />
      <circle cx="38" cy="36" r="4" />
      {/* Connection lines */}
      <line x1="13" y1="14" x2="20" y2="22" strokeWidth="1.5" />
      <line x1="35" y1="14" x2="28" y2="22" strokeWidth="1.5" />
      <line x1="13" y1="34" x2="20" y2="26" strokeWidth="1.5" />
      <line x1="35" y1="34" x2="28" y2="26" strokeWidth="1.5" />
    </>
  ),
  /** Chart — the numbers are real */
  chart: ({ patternId, color }: IconRenderProps) => (
    <>
      {/* Axis */}
      <line x1="6" y1="40" x2="42" y2="40" strokeWidth="2" />
      <line x1="6" y1="40" x2="6" y2="8" strokeWidth="2" />
      {/* Bars — escalating */}
      <rect
        x="11"
        y="28"
        width="7"
        height="12"
        fill={`url(#${patternId})`}
      />
      <rect x="11" y="28" width="7" height="12" />
      <rect
        x="21"
        y="20"
        width="7"
        height="20"
        fill={`url(#${patternId})`}
      />
      <rect x="21" y="20" width="7" height="20" />
      <rect
        x="31"
        y="10"
        width="7"
        height="30"
        fill={color}
        stroke="none"
      />
      <rect x="31" y="10" width="7" height="30" />
      {/* Trend arrow */}
      <polyline
        points="14 26 24 18 34 8"
        fill="none"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <polyline
        points="31 8 34 8 34 11"
        fill="none"
        strokeWidth="1.5"
        opacity="0.5"
      />
    </>
  ),
} as const;

export type BrandIconName = keyof typeof brandIcons;
