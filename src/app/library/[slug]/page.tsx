import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PROMPTS, getPrompt, getAllPromptSlugs } from "../prompts";
import { CopyButton } from "../copy-button";
import { LibraryTopbar } from "../topbar";
import { LibraryFooter } from "../footer";
import "../library.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPromptSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPrompt(slug);
  if (!p) return { title: "Prompt — NotContent Library" };
  return {
    title: `${p.title} — NotContent Library`,
    description: p.oneLiner,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function PromptPage({ params }: Props) {
  const { slug } = await params;
  const p = getPrompt(slug);
  if (!p) notFound();

  return (
    <div className="library">
      <LibraryTopbar currentNumber={p.number} total={PROMPTS.length} />

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="eyebrow">
          <span>
            <span className="num">{pad(p.number)}</span>
            &nbsp;/&nbsp; {p.eyebrow}
          </span>
          <span className="rule" />
        </div>
        <h1>{p.title}.</h1>
        <p className="sub">{p.oneLiner}</p>

        {p.heroImage && (
          <div style={{ marginTop: "44px" }}>
            <Image
              src={p.heroImage}
              alt={`Illustration for ${p.title}`}
              width={1100}
              height={500}
              priority
              style={{
                width: "100%",
                height: "auto",
                border: "1px solid var(--rule)",
              }}
            />
          </div>
        )}
      </section>

      {/* ─── What it does ────────────────────────────────────────────── */}
      <section className="section">
        <div className="head">
          <span className="eyebrow">
            <span className="num">01</span>&nbsp; What it does
          </span>
          <span className="rule" />
        </div>
        {p.whatItDoes.split("\n\n").map((para, i) => (
          <p key={i}>{para.trim()}</p>
        ))}
      </section>

      {/* ─── When to use ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="head">
          <span className="eyebrow">
            <span className="num">02</span>&nbsp; When to use it
          </span>
          <span className="rule" />
        </div>
        <ul>
          {p.whenToUse.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* ─── What you'll get ─────────────────────────────────────────── */}
      <section className="section">
        <div className="head">
          <span className="eyebrow">
            <span className="num">03</span>&nbsp; What you&rsquo;ll get
          </span>
          <span className="rule" />
        </div>
        <ul>
          {p.whatYoullGet.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* ─── Quick-fire instructions ─────────────────────────────────── */}
      <section className="section">
        <div className="head">
          <span className="eyebrow">
            <span className="num">04</span>&nbsp; Quick-fire instructions
          </span>
          <span className="rule" />
        </div>
        <ol>
          {p.quickFire.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* ─── The prompt ──────────────────────────────────────────────── */}
      <section className="prompt-block">
        <div className="head">
          <span className="eyebrow">
            <span className="num">05</span>&nbsp; The prompt
          </span>
          <span className="rule" />
        </div>
        <div className="surface">
          <CopyButton text={p.prompt} label="Copy prompt" />
          <pre>{p.prompt}</pre>
        </div>
      </section>

      <LibraryFooter />
    </div>
  );
}
