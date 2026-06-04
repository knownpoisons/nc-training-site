"use client";

import { useState } from "react";

interface Props {
  title: string;
}

export function ShareButton({ title }: Props) {
  const [state, setState] = useState<"idle" | "shared" | "copied">("idle");

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = "From the NotContent prompt library.";

    // Native share sheet on mobile / supporting browsers
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        setState("shared");
        setTimeout(() => setState("idle"), 1800);
        return;
      } catch (e) {
        // User cancelled — fall through to clipboard
        if ((e as Error)?.name === "AbortError") {
          setState("idle");
          return;
        }
      }
    }

    // Clipboard fallback (desktop)
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      // Last-ditch: prompt with the URL
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={"share" + (state !== "idle" ? " share-active" : "")}
      aria-label="Share this prompt"
    >
      {state === "shared" ? "✓ Shared" : state === "copied" ? "✓ Link copied" : "Share"}
    </button>
  );
}
