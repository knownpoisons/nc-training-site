"use client";

// A React mount for a custom Hairline figure (one built on the vendored kernel),
// in the shape of the package's own components: an empty 5:4 box on the server,
// the drawing in a layout effect, `play` walks the figure's tour until a hand
// arrives. Theme comes from the --hairline-* custom properties on an ancestor.

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import HL from "./kernel";

export interface CustomFigure {
  name: string;
  means: string;
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount: (ctx: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } }, value: number) => { set: (v: number) => void; destroy: () => void };
}

const at = (f: CustomFigure, i: number) => {
  const [lo, mid, hi] = f.range;
  const v = i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid);
  return Math.round(v * 1000) / 1000;
};

export function Figure({ figure, intensity = 0.5, play = false, label, className = "", style, onRead }: {
  figure: CustomFigure; intensity?: number; play?: boolean; label?: string; className?: string; style?: CSSProperties; onRead?: (t: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const handle = useRef<{ set: (v: number) => void; destroy: () => void } | null>(null);
  const readRef = useRef(onRead);
  readRef.current = onRead;

  useLayoutEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    HL.inject(document);
    stage.setAttribute("data-hairline", figure.name);
    stage.setAttribute("role", "img");
    stage.setAttribute("aria-label", label ?? figure.means);
    const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage) as SVGSVGElement;
    let text = "";
    const read = {
      get textContent() { return text; },
      set textContent(v: string) { text = v == null ? "" : String(v); readRef.current?.(text); },
    };
    const h = figure.mount({ stage, svg, read }, at(figure, intensity));
    handle.current = h;
    let lap: { stop: () => void } | null = null;
    if (play && figure.tour) lap = HL.tour(stage, figure.tour, () => {});
    return () => {
      lap?.stop();
      h.destroy();
      handle.current = null;
      stage.removeAttribute("data-hairline");
    };
    // mount once; intensity changes reach the running figure below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figure, play]);

  useLayoutEffect(() => { handle.current?.set(at(figure, intensity)); }, [figure, intensity]);

  return <div ref={ref} className={`tp-figure ${className}`} style={style} />;
}
