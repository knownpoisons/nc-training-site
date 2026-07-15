import type { Metadata } from "next";
import Link from "next/link";
import { PROMPTS } from "./prompts";
import { COLLECTIONS } from "./collections";
import { LibraryTopbar } from "./topbar";
import { LibraryFooter } from "./footer";
import "./library.css";

export const metadata: Metadata = {
  title: "The Prompt Library — NotContent",
  description:
    "Reusable prompts for operators. Each one ships a system, not a single answer. Copy, paste, run.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function LibraryIndex() {
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
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} href={`/library/${c.slug}`} className="row row-collection">
            <div className="num">{c.count}</div>
            <div className="body">
              <h2 className="topic">{c.title}</h2>
              <div className="summary">{c.oneLiner}</div>
            </div>
            <div className="meta">
              {c.eyebrow}
              <span className="arrow">⟶</span>
            </div>
          </Link>
        ))}

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
