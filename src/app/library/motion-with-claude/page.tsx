import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LIBRARY_GATE_ENABLED } from "../prompts";
import { LibraryGate } from "../gate";
import { LibraryTopbar } from "../topbar";
import { LibraryFooter } from "../footer";
import { CopyButton } from "../copy-button";
import { KITS } from "./_data/kits";
import { SOURCES } from "./_data/sources";
import "../library.css";
import "./motion.css";

const TOTAL = KITS.length;

export const metadata: Metadata = {
  title: "Motion with Claude — NotContent Library",
  description:
    "Four copy-paste markdown kits for directing Claude to make video and animation — the rules, the brief, the review loop and the numbers — plus the six sources worth reading, each with what to take and what to ignore.",
};

export default async function MotionWithClaudePage() {
  const hasAccess =
    !LIBRARY_GATE_ENABLED ||
    (await cookies()).get("nc_library_access")?.value === "1";
  if (!hasAccess) return <LibraryGate total={TOTAL} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Motion with Claude",
    description: metadata.description,
    numberOfItems: SOURCES.length,
    itemListElement: SOURCES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.what,
      url: s.url,
    })),
  };

  return (
    <div className="library">
      <LibraryTopbar total={TOTAL} noun="kit" />

      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{TOTAL}</span>
            &nbsp;/&nbsp; Collection · Motion with Claude
          </span>
          <span className="rule" />
        </div>
        <h1>
          Direct it like a <span className="accent">film</span>.
        </h1>
        <p className="sub">
          Claude does not generate video. It writes a program that draws every frame — which means
          the whole job is directing, and the difference between amateur and studio output is
          whether you gave it numbers or adjectives.
        </p>
        <p className="sub sub-second">
          Four files to copy, in the order you use them. Then the six sources they were built from,
          each with the one thing worth taking and the part to ignore. New to this? Start with the
          rules and the brief and ignore everything else until something comes back.
        </p>
      </section>

      {/* ── The kits ─────────────────────────────────────────────────────── */}
      <section className="section mk-section">
        <h2 className="mk-h2">
          <span className="mk-h2-n">01</span> The kits
        </h2>
        <p className="mk-lede">
          Drop these in a project as markdown, or paste them straight into Claude. They work the
          same either way: the rules make a render reviewable, the brief says what you want, the
          review loop fixes what came back, and the numbers turn a feeling into a value.
        </p>

        <div className="mk-kits">
          {KITS.map((k, i) => (
            <article key={k.slug} className="mk-kit" id={k.slug}>
              <header className="mk-kit-head">
                <div>
                  <span className="mk-kit-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{k.name}</h3>
                  <code className="mk-file">{k.filename}</code>
                </div>
                <CopyButton text={k.body} label="Copy the file" />
              </header>
              <p className="mk-when">
                <span className="mk-label">Reach for it</span> {k.when}
              </p>
              <p className="mk-why">{k.why}</p>
              <details className="mk-details">
                <summary>Read it</summary>
                <pre className="mk-pre">{k.body}</pre>
              </details>
            </article>
          ))}
        </div>
      </section>

      {/* ── The sources ──────────────────────────────────────────────────── */}
      <section className="section mk-section">
        <h2 className="mk-h2">
          <span className="mk-h2-n">02</span> The sources
        </h2>
        <p className="mk-lede">
          Where the kits came from, in the order worth reading them. Every one carries what to take
          and what to ignore — because most of these are long, and the useful part is rarely the
          part being sold.
        </p>

        <ol className="mk-sources">
          {SOURCES.map((s, i) => (
            <li key={s.slug} className="mk-source">
              <div className="mk-source-head">
                <span className="mk-source-n">{String(i + 1).padStart(2, "0")}</span>
                <div className="mk-source-id">
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.name}
                    <span className="mk-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                  <span className="mk-byline">
                    {s.byline} · {s.domain}
                  </span>
                </div>
                <div className="mk-source-tags">
                  <span className="mk-kind">{s.kind}</span>
                  <span
                    className={`mk-cost mk-cost-${s.cost.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {s.cost}
                  </span>
                </div>
              </div>
              <p className="mk-what">{s.what}</p>
              <p className="mk-take">
                <span className="mk-label mk-label-good">Take</span> {s.take}
              </p>
              <p className="mk-watch">
                <span className="mk-label mk-label-warn">Watch</span> {s.watch}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section mk-foot">
        <p className="muted">
          The one rule underneath all of it: <strong>every frame is a pure function of time</strong>
          . Get that right and a note becomes &ldquo;frame 84 peaks late&rdquo; instead of
          &ldquo;something feels off&rdquo; — and one number fixes it. Get it wrong and you are
          re-rolling a video model and hoping.
        </p>
        <p className="muted">
          Looking for web motion instead — scroll, hover, micro-interaction?{" "}
          <a href="/library/build-vault">The Build Vault →</a>
        </p>
      </section>

      <LibraryFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
