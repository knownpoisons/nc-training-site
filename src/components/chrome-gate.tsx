"use client";

import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

/**
 * Suppresses the marketing chrome (header, footer, popups) on routes that
 * have their own self-contained editorial layout. Currently: the prompt
 * library at /library. Add more matchers here if other editorial properties
 * are added later (e.g. /atlas, client hubs).
 */
export function ChromeGate({ children }: Props) {
  const pathname = usePathname();
  if (!pathname) return <>{children}</>;
  if (pathname === "/library" || pathname.startsWith("/library/")) return null;
  return <>{children}</>;
}
