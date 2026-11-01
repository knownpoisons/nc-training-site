// Server-safe building blocks of the Bento hub: tiles, label lines, prints,
// page titles, icons. Content comes in as props; nothing here is copy.

import Link from "next/link";
import type { ReactNode } from "react";

export type Hue = "ember" | "mustard" | "sky" | "blush" | "bone" | "orange";

export function Lab({ l, sub, r, hot, icon, bare }: { l: ReactNode; sub?: ReactNode; r?: ReactNode; hot?: boolean; icon?: ReactNode; bare?: boolean }) {
  return (
    <div className={`lab${bare ? " lab--bare" : ""}`}>
      <span className="lab-l">{icon}{l}{sub ? <span className="lab-sub">{sub}</span> : null}</span>
      {r !== undefined && r !== null ? <span className={`lab-r${hot ? " is-hot" : ""}`}>{r}</span> : null}
    </div>
  );
}

export function Tile({ children, span, hue, href, ext, className = "", next, id, label, style }: { children: ReactNode; span?: 2 | 3 | "F"; hue?: Hue; href?: string; ext?: boolean; className?: string; next?: boolean; id?: string; label?: string; style?: React.CSSProperties }) {
  const cls = `t${span ? ` s${span}` : ""}${next ? " t--next" : ""} ${className}`.trim();
  if (href && ext) return <a href={href} target="_blank" rel="noreferrer" className={cls} data-hue={hue} id={id} aria-label={label} style={style}>{children}</a>;
  if (href) return <Link href={href} className={cls} data-hue={hue} id={id} aria-label={label} style={style}>{children}</Link>;
  return <section className={cls} data-hue={hue} id={id} aria-label={label} style={style}>{children}</section>;
}

export function Win({ src, w, h, wait, eager, className = "", style }: { src: string; w: number; h: number; wait?: boolean; eager?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`win${wait ? " is-wait" : ""} ${className}`.trim()} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={w} height={h} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" />
    </span>
  );
}

/** A tile carried by its photo: label line, a framed print, then a title and one short line.
 *  Stacks in narrow tiles; sits side by side once the tile is wide (container query). */
export function PrintTile({ lab, title, line, img, w, h, wait, eager, href, ext, hue, label, style, className = "", children, next }: {
  lab: ReactNode; title: ReactNode; line?: ReactNode; img: string; w: number; h: number; wait?: boolean; eager?: boolean;
  href?: string; ext?: boolean; hue?: Hue; label?: string; style?: React.CSSProperties; className?: string; children?: ReactNode; next?: boolean;
}) {
  return (
    <Tile href={href} ext={ext} hue={hue} label={label} style={style} className={`t--print ${className}`} next={next}>
      {lab}
      <div className="pt">
        <Win src={img} w={w} h={h} wait={wait} eager={eager} className="pt-img" />
        <div className="pt-c">
          <h3 className="tt">{title}</h3>
          {line ? <p className="tp">{line}</p> : null}
          {children}
        </div>
      </div>
    </Tile>
  );
}

export function PageTitle({ title, lede, back, right }: { title: ReactNode; lede?: ReactNode; back?: { href: string; label: string }; right?: ReactNode }) {
  return (
    <div className="tpb-ptitle">
      {back ? <Link className="tpb-back" href={back.href}><IconArrow back />{back.label}</Link> : null}
      <div className="tpb-pt-m">
        <h1 className="tpb-title">{title}</h1>
        {lede ? <p className="tpb-lede">{lede}</p> : null}
      </div>
      {right ? <div className="tpb-pt-r">{right}</div> : null}
    </div>
  );
}

export function Bento({ children, kind = "page" }: { children: ReactNode; kind?: "home" | "page" }) {
  return <div className={`tpb-bento tpb-bento--${kind}`}>{children}</div>;
}

// ─── icons (1.5 stroke, 24 box) ─────────────────────────────────────────────────
const I = ({ children, cls = "ic" }: { children: ReactNode; cls?: string }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{children}</svg>
);
export const IconLock = () => <I><rect x="5" y="10.5" width="14" height="10" rx="1.5" /><path d="M8 10.5v-3a4 4 0 0 1 8 0v3" /><path d="M12 14.5V17" /></I>;
export const IconArrow = ({ back }: { back?: boolean }) => <I cls={`ic${back ? " ic--back" : ""}`}><path d={back ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} /></I>;
export const IconClock = () => <I><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></I>;
export const IconHash = () => <I><path d="M9 4 7 20M17 4l-2 16M4.5 9h15M4 15h15" /></I>;
export const IconCheck = () => <I><path d="m5 12.5 4.5 4.5L19 7.5" /></I>;
