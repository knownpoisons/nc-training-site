// The page cover from the style guide (DESIGN.md): back link, then one box with the big title on the left
// and a photo running to the right edge. Used by the inner pages so they open like Home.
import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrow, Win } from "./b";

export function PageCover({ label, title, lede, img, back = { href: "/two-palms", label: "Home" }, aside }: {
  label: ReactNode; title: ReactNode; lede: ReactNode; img: string; back?: { href: string; label: string }; aside?: ReactNode;
}) {
  return (
    <div className="pc-wrap">
      <div className="pc-back"><Link className="tpb-back" href={back.href}><IconArrow back />{back.label}</Link></div>
      <section className="t pc">
        <div className="pc-c">
          <span className="pl-k">{label}</span>
          <h1 className="pc-h">{title}</h1>
          <p className="pc-lede">{lede}</p>
          {aside ? <div className="pc-aside">{aside}</div> : null}
        </div>
        <Win src={img} w={1400} h={1000} eager className="pc-img" />
      </section>
    </div>
  );
}
