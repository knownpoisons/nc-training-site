import Link from "next/link";

// Light January Digital chrome for the client copy of the Camera Prompt
// Finder. Reuses the .library topbar/foot styles; the branding is the label
// and the back link into their hub.

export function JdTopbar() {
  return (
    <header className="topbar">
      <a href="/january-digital" className="brand" style={{ color: "var(--accent)", fontWeight: 600 }}>
        ← The Hub
      </a>
      <span className="counter">
        January Digital <span style={{ color: "var(--accent)" }}>×</span> NotContent
      </span>
    </header>
  );
}

export function JdFooter() {
  return (
    <footer className="foot">
      <span>January Digital × NotContent · Creative AI Training</span>
      <span>
        <a href="/january-digital">Back to the hub ↗</a>
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
