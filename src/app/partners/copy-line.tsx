"use client";

import { useState } from "react";

interface Props {
  /** The text to copy to the clipboard. */
  text: string;
  /** What the user sees in the page — defaults to the same as `text`. */
  children?: React.ReactNode;
  /** Small label override for the button. Defaults to "Copy". */
  label?: string;
  /** Visual style: 'quote' = italic serif, 'plain' = inline. */
  variant?: "quote" | "plain" | "block";
}

export function CopyLine({ text, children, label = "Copy", variant = "quote" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      } catch {
        /* swallow */
      }
      document.body.removeChild(ta);
    }
  }

  return (
    <div className={`copy-line copy-line-${variant}`}>
      <div className="copy-line-body">{children ?? text}</div>
      <button
        type="button"
        onClick={handleCopy}
        className={"copy-line-btn" + (copied ? " copy-line-btn-copied" : "")}
        aria-label="Copy this line"
      >
        {copied ? "✓ Copied" : label}
      </button>
    </div>
  );
}
