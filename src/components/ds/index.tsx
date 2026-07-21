/* ═══════════════════════════════════════════════════════════════════════════
   NOTCONTENT DESIGN SYSTEM — React components.

   These are the reusable building blocks of the NotContent brand, extracted
   from the editorial language used across the library and the JD hub.

   HOW TO USE (the whole idea): instead of hand-writing markup and CSS on every
   page, you compose a page out of these. Change a component here and every
   page that uses it updates.

       import { Page, Topbar, Hero, SectionHead, RowList, Row, Button, Footer }
         from "@/components/ds";

       <Page>
         <Topbar brand="NotContent · Library" meta={<span>06 Prompts</span>} />
         <Hero
           eyebrow="The Library"
           title={<>Prompts that <Accent>ship</Accent>.</>}
           sub="These are the prompts I'm actually running this month."
         />
         <RowList>
           <Row n="01" title="LinkedIn Prospect Intelligence"
                summary="Turn your export into a ranked dashboard."
                meta="Outreach · Sales" href="/library/x" />
         </RowList>
         <Footer left="NotContent · The Prompt Library" />
       </Page>

   Every visual value comes from src/styles/tokens.css. Nothing here hard-codes
   a colour or a size.
   ═══════════════════════════════════════════════════════════════════════════ */

import type { ElementType, ReactNode } from "react";
import "@/styles/ds.css";

/* ───────── Link primitive ─────────
   The system is deliberately framework-agnostic: links render a plain <a>, so
   these components work anywhere React does (including Claude Design). Inside
   a Next app, pass `linkComponent={Link}` to opt into client-side routing. */
type LinkComponent = ElementType;

function A({
  href,
  className,
  children,
  linkComponent: L = "a",
}: {
  href: string;
  className?: string;
  children: ReactNode;
  linkComponent?: LinkComponent;
}) {
  return (
    <L href={href} className={className}>
      {children}
    </L>
  );
}

/* ───────── Page: the ground every NotContent surface sits on ───────── */
export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`nc ${className}`.trim()}>{children}</div>;
}

/* ───────── Topbar: sticky brand bar ───────── */
export function Topbar({
  brand,
  href = "/",
  meta,
}: {
  brand: ReactNode;
  href?: string;
  meta?: ReactNode;
}) {
  return (
    <div className="nc-topbar">
      <A href={href} className="nc-brand">
        {brand}
      </A>
      {meta ? <div className="nc-topbar-meta">{meta}</div> : null}
    </div>
  );
}

/* ───────── Accent: the cobalt italic word inside a headline ───────── */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="nc-accent">{children}</span>;
}

/* ───────── Eyebrow: small uppercase label above a headline ───────── */
export function Eyebrow({
  children,
  num,
  rule = true,
}: {
  children: ReactNode;
  num?: ReactNode;
  rule?: boolean;
}) {
  return (
    <div className="nc-eyebrow">
      <span>
        {num ? <span className="nc-num">{num}</span> : null}
        {num ? <>&nbsp;/&nbsp;</> : null}
        {children}
      </span>
      {rule ? <span className="nc-rule" /> : null}
    </div>
  );
}

/* ───────── Hero: the one big statement per page ───────── */
export function Hero({
  eyebrow,
  eyebrowNum,
  title,
  sub,
  children,
}: {
  eyebrow?: ReactNode;
  eyebrowNum?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="nc-hero">
      {eyebrow ? <Eyebrow num={eyebrowNum}>{eyebrow}</Eyebrow> : null}
      <h1>{title}</h1>
      {sub ? <p className="nc-sub">{sub}</p> : null}
      {children}
    </section>
  );
}

/* ───────── SectionHead: numbered section title + hairline ───────── */
export function SectionHead({ n, title }: { n?: ReactNode; title: ReactNode }) {
  return (
    <div className="nc-hed">
      {n ? <div className="nc-num">{n}</div> : null}
      <h2>{title}</h2>
      <div className="nc-rule" />
    </div>
  );
}

/* ───────── Section: a content block with optional head ───────── */
export function Section({
  n,
  title,
  children,
}: {
  n?: ReactNode;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="nc-section">
      {title ? <SectionHead n={n} title={title} /> : null}
      <div className="nc-prose">{children}</div>
    </section>
  );
}

/* ───────── RowList / Row: the editorial index list ───────── */
export function RowList({ children }: { children: ReactNode }) {
  return <section className="nc-rows">{children}</section>;
}

export function Row({
  n,
  title,
  summary,
  meta,
  href,
  featured = false,
  quiet = false,
  arrow = true,
}: {
  n?: ReactNode;
  title: ReactNode;
  summary?: ReactNode;
  meta?: ReactNode;
  href?: string;
  /** Solid cobalt block — use for one featured item, never several. */
  featured?: boolean;
  /** Greyed and non-interactive — e.g. "coming soon". */
  quiet?: boolean;
  arrow?: boolean;
}) {
  const cls = [
    "nc-row",
    featured ? "nc-row-featured" : "",
    quiet ? "nc-row-quiet" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {n ? <div className="nc-num">{n}</div> : null}
      <div>
        <h2 className="nc-topic">{title}</h2>
        {summary ? <div className="nc-summary">{summary}</div> : null}
      </div>
      <div className="nc-meta">
        {meta}
        {arrow && !quiet ? <span className="nc-arrow">⟶</span> : null}
      </div>
    </>
  );

  if (quiet || !href) {
    return (
      <div className={cls} aria-disabled={quiet || undefined}>
        {inner}
      </div>
    );
  }
  return (
    <A href={href} className={cls}>
      {inner}
    </A>
  );
}

/* ───────── Button ───────── */
export function Button({
  children,
  href,
  variant = "ghost",
  size = "sm",
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  variant?: "ghost" | "solid";
  size?: "sm" | "lg";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = [
    "nc-btn",
    variant === "solid" ? "nc-btn-solid" : "",
    size === "lg" ? "nc-btn-lg" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <A href={href} className={cls}>
        {children}
      </A>
    );
  }
  return (
    <button className={cls} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}

/* ───────── InlineLink: cobalt underlined link inside prose ───────── */
export function InlineLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a href={href} className="nc-link" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <A href={href} className="nc-link">
      {children}
    </A>
  );
}

/* ───────── Footer ───────── */
export function Footer({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <footer className="nc-foot">
      <div>{left}</div>
      <div>{right}</div>
    </footer>
  );
}
