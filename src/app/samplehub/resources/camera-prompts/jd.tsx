import Link from "next/link";

// Light SKYNET chrome for the client copy of the Camera Prompt
// Finder. Reuses the .library topbar/foot styles; the branding is the label
// and the back link into their hub.

export function JdTopbar() {
  return (
    <header className="topbar">
      <a href="/samplehub" className="brand" style={{ color: "var(--accent)", fontWeight: 600 }}>
        ← The Hub
      </a>
      <span className="counter">
        SKYNET <span style={{ color: "var(--accent)" }}>×</span> NotContent
      </span>
    </header>
  );
}

export function JdFooter() {
  return (
    <footer className="foot">
      <span>SKYNET × NotContent · Creative AI Training</span>
      <span>
        <a href="/samplehub">Back to the hub ↗</a>
      </span>
    </footer>
  );
}

export function JdCrosslink({ href, label }: { href: string; label: string }) {
  return (
    <div className="cm-crosslink">
      <Link href={href}>
        <span className="cm-crosslink-title">
          <em>{label}</em>
        </span>
        <span className="cm-crosslink-arrow" aria-hidden="true">
          ⟶
        </span>
      </Link>
    </div>
  );
}
