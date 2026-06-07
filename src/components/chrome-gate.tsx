"use client";

import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

/**
 * Suppresses the marketing chrome (header, footer, popups) on routes that
 * have their own self-contained editorial layout. Currently: the prompt
 * library at /library and the gated partner playbook at /partners.
 * Add more matchers here if other editorial properties are added later.
 */
export function ChromeGate({ children }: Props) {
  const pathname = usePathname();
  if (!pathname) return <>{children}</>;
  if (pathname === "/library" || pathname.startsWith("/library/")) return null;
  if (pathname === "/partners" || pathname.startsWith("/partners/")) return null;
  return <>{children}</>;
}
