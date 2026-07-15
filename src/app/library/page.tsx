import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { PROMPTS, LIBRARY_GATE_ENABLED } from "./prompts";
import { LibraryTopbar } from "./topbar";
import { LibraryFooter } from "./footer";
import { LibraryGate } from "./gate";
import "./library.css";

export const metadata: Metadata = {
  title: "The Prompt Library — NotContent",
  description:
    "Reusable prompts for operators. Each one ships a system, not a single answer. Copy, paste, run.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function LibraryIndex() {
  // Email gate: no access cookie → render the gate, never the prompt list.
  const hasAccess =
    !LIBRARY_GATE_ENABLED ||
    (await cookies()).get("nc_library_access")?.value === "1";
  if (!hasAccess) return <LibraryGate total={PROMPTS.length} />;

  // Newest first
  const prompts = [...PROMPTS].sort((a, b) => a.number - b.number);

  return (
    <div className="library">
      <LibraryTopbar total={PROMPTS.length} />

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">∞</span>
            &nbsp;/&nbsp; The Library
          </span>
          <span className="rule" />
        </div>
        <h1>
          Prompts that <span className="accent">ship</span>.
        </h1>
        <p className="sub">
          These are the prompts I&rsquo;m actually running this month. When I stop using one, it comes down.
        </p>
      </section>

      {/* ─── Prompt list ─────────────────────────────────────────────── */}
      <section className="row-list">
        {prompts.map((p) =>
          p.comingSoon ? (
            // Coming soon — listed but greyed out and not clickable
            <div
              key={p.slug}
              className="row"
              aria-disabled="true"
              style={{ opacity: 0.4, cursor: "default", pointerEvents: "none" }}
            >
              <div className="num">{pad(p.number)}</div>
              <div className="body">
                <h2 className="topic">{p.title}</h2>
                <div className="summary">{p.oneLiner}</div>
              </div>
              <div className="meta">Coming soon</div>
            </div>
          ) : (
            <Link key={p.slug} href={`/library/${p.slug}`} className="row">
              <div className="num">{pad(p.number)}</div>
              <div className="body">
                <h2 className="topic">{p.title}</h2>
                <div className="summary">{p.oneLiner}</div>
              </div>
              <div className="meta">
                {p.eyebrow}
                <span className="arrow">⟶</span>
              </div>
            </Link>
          )
        )}
      </section>

      <LibraryFooter />
    </div>
  );
}
