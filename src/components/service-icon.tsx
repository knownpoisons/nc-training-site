/**
 * Monoline geometric icons for service/feature cards.
 * All rendered in cobalt (#1549CD) stroke at consistent sizing.
 */

interface ServiceIconProps {
  icon: keyof typeof icons;
  className?: string;
  size?: number;
}

export function ServiceIcon({ icon, className = "", size = 40 }: ServiceIconProps) {
  const Icon = icons[icon];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="#1549CD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <Icon />
    </svg>
  );
}

const icons = {
  /** Diverge — expanding arrows */
  diverge: () => (
    <>
      <circle cx="8" cy="20" r="3" />
      <line x1="11" y1="20" x2="20" y2="12" />
      <line x1="11" y1="20" x2="20" y2="20" />
      <line x1="11" y1="20" x2="20" y2="28" />
      <circle cx="23" cy="12" r="2" />
      <circle cx="23" cy="20" r="2" />
      <circle cx="23" cy="28" r="2" />
    </>
  ),
  /** Converge — focusing arrows */
  converge: () => (
    <>
      <circle cx="8" cy="12" r="2" />
      <circle cx="8" cy="20" r="2" />
      <circle cx="8" cy="28" r="2" />
      <line x1="10" y1="12" x2="20" y2="20" />
      <line x1="10" y1="20" x2="20" y2="20" />
      <line x1="10" y1="28" x2="20" y2="20" />
      <circle cx="32" cy="20" r="3" />
      <line x1="23" y1="20" x2="29" y2="20" />
    </>
  ),
  /** Systemize — gear/process */
  systemize: () => (
    <>
      <rect x="6" y="8" width="12" height="8" rx="1" />
      <rect x="22" y="8" width="12" height="8" rx="1" />
      <rect x="14" y="24" width="12" height="8" rx="1" />
      <line x1="12" y1="16" x2="12" y2="20" />
      <line x1="12" y1="20" x2="20" y2="20" />
      <line x1="20" y1="20" x2="20" y2="24" />
      <line x1="28" y1="16" x2="28" y2="20" />
      <line x1="28" y1="20" x2="20" y2="20" />
    </>
  ),
  /** Team — people */
  team: () => (
    <>
      <circle cx="20" cy="12" r="4" />
      <path d="M12 30 C12 24 28 24 28 30" />
      <circle cx="8" cy="16" r="3" />
      <path d="M2 30 C2 26 10 25 12 27" />
      <circle cx="32" cy="16" r="3" />
      <path d="M38 30 C38 26 30 25 28 27" />
    </>
  ),
  /** Speed — lightning bolt */
  speed: () => (
    <>
      <path d="M22 4 L12 20 H20 L18 36 L30 18 H22 Z" />
    </>
  ),
  /** Quality — diamond */
  quality: () => (
    <>
      <path d="M20 4 L36 20 L20 36 L4 20 Z" />
      <path d="M20 12 L28 20 L20 28 L12 20 Z" />
    </>
  ),
  /** Shield — trust/earned */
  shield: () => (
    <>
      <path d="M20 4 L34 10 V22 C34 30 20 36 20 36 C20 36 6 30 6 22 V10 Z" />
      <polyline points="14 20 18 24 26 16" />
    </>
  ),
  /** Compass — methodology */
  compass: () => (
    <>
      <circle cx="20" cy="20" r="14" />
      <circle cx="20" cy="20" r="2" />
      <polygon points="20 6 22 18 20 20 18 18" opacity="0.4" fill="#1549CD" stroke="none" />
      <polygon points="20 34 18 22 20 20 22 22" opacity="0.15" fill="#1549CD" stroke="none" />
    </>
  ),
  /** Chart — results */
  chart: () => (
    <>
      <line x1="6" y1="34" x2="34" y2="34" />
      <rect x="8" y="22" width="6" height="12" rx="1" opacity="0.3" fill="#1549CD" stroke="none" />
      <rect x="17" y="14" width="6" height="20" rx="1" opacity="0.5" fill="#1549CD" stroke="none" />
      <rect x="26" y="8" width="6" height="26" rx="1" opacity="0.7" fill="#1549CD" stroke="none" />
    </>
  ),
  /** Workflow — connected nodes */
  workflow: () => (
    <>
      <circle cx="8" cy="20" r="4" />
      <circle cx="20" cy="10" r="4" />
      <circle cx="20" cy="30" r="4" />
      <circle cx="32" cy="20" r="4" />
      <line x1="12" y1="18" x2="16" y2="12" />
      <line x1="12" y1="22" x2="16" y2="28" />
      <line x1="24" y1="12" x2="28" y2="18" />
      <line x1="24" y1="28" x2="28" y2="22" />
    </>
  ),
} as const;

export type ServiceIconName = keyof typeof icons;
