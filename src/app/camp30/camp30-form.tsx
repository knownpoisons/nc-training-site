"use client";

import { useEffect, useRef } from "react";

// Beehiiv "Camp30 Waitlist" embed. The loader renders the form adjacent to its
// own <script> tag, so we inject that script INTO this container on mount —
// React strips raw <script> from JSX, and next/script wouldn't keep it in
// place. This guarantees the form appears exactly here.
const FORM_ID = "244ebc68-bf10-4fab-b101-c6f3d6ce5838";

export function Camp30Form() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.querySelector("script")) return; // guard against double-mount
    const s = document.createElement("script");
    s.src = "https://subscribe-forms.beehiiv.com/v3/loader.js";
    s.async = true;
    s.setAttribute("data-beehiiv-form", FORM_ID);
    el.appendChild(s);
  }, []);

  return <div className="bh-embed" ref={ref} />;
}
