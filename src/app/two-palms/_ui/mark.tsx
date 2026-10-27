"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// THE TWO PALMS MARK, 1:1. Paths traced from "Two Palms Icon Mark Logos.ai"
// (primary icon mark, 1920 × 1920). Nothing redrawn. The animation moves the
// real shapes: each palm leans from its foot, each crown sways at its crown
// point, each frond flexes a little more than the one before it. The pointer
// is the wind (lean away from it); with no pointer the palms breathe on a
// slow idle. Springs land it; reduced motion holds it still.
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, type CSSProperties } from "react";

const DISC = "M 1747.683594 960 C 1747.683594 1362.660156 1445.464844 1694.757812 1055.546875 1741.890625 C 1040.738281 1743.691406 1025.929688 1745.109375 1010.863281 1746.007812 C 999.789062 1746.78125 988.589844 1747.296875 977.382812 1747.425781 C 971.589844 1747.6875 965.796875 1747.6875 960 1747.6875 C 942.101562 1747.6875 924.460938 1747.039062 906.816406 1745.882812 C 496.6875 1718.582031 172.316406 1377.085938 172.316406 960 C 172.316406 524.886719 525.015625 172.316406 960 172.316406 C 1394.984375 172.316406 1747.683594 524.886719 1747.683594 960";
const TALL_TRUNK = "M 1010.863281 1746.007812 C 999.789062 1746.78125 988.589844 1747.296875 977.382812 1747.425781 C 971.589844 1747.683594 965.796875 1747.683594 960 1747.683594 C 942.101562 1747.683594 924.460938 1747.039062 906.816406 1745.882812 C 722.035156 1343.089844 823.890625 866.257812 823.890625 866.257812 C 802.515625 1274.070312 917.378906 1568.953125 998.632812 1723.347656 C 1002.75 1731.332031 1006.871094 1738.800781 1010.863281 1746.007812";
const SHORT_TRUNK = "M 1248.960938 1379.660156 C 1214.578125 1507.015625 1141.695312 1630.632812 1055.546875 1741.890625 C 1040.738281 1743.691406 1025.929688 1745.109375 1010.863281 1746.007812 C 999.789062 1746.78125 988.589844 1747.296875 977.382812 1747.425781 C 984.59375 1739.3125 991.679688 1731.332031 998.632812 1723.347656 C 1163.585938 1533.671875 1248.960938 1379.660156 1248.960938 1379.660156";
const TALL_FRONDS: { d: string; p: number }[] = [{"d": "M 841.960938 848.441406 L 1008.542969 1189.605469 C 1008.542969 1189.605469 1093.769531 925.667969 841.960938 848.441406", "p": 0.0}, {"d": "M 851.832031 821.453125 L 1215.988281 1003.53125 C 1215.988281 1003.53125 1146.257812 736.222656 851.832031 821.453125", "p": 0.2}, {"d": "M 807.007812 848.441406 L 520.332031 1123.496094 C 520.332031 1123.496094 531.953125 863.9375 807.007812 848.441406", "p": 0.4}, {"d": "M 798.34375 819.902344 L 354.683594 852.996094 C 354.683594 852.996094 555.585938 666.707031 798.34375 819.902344", "p": 0.6}, {"d": "M 810.230469 804.679688 L 597.160156 526.035156 C 597.160156 526.035156 837.347656 526.035156 810.230469 804.679688", "p": 0.8}, {"d": "M 841.960938 806.222656 L 1193.085938 644.867188 C 1193.085938 644.867188 928.9375 561.691406 841.960938 806.222656", "p": 0.5}];
const SHORT_FRONDS: { d: string; p: number }[] = [{"d": "M 1260.28125 1378.023438 L 1290.273438 1632.605469 C 1290.273438 1632.605469 1431.898438 1493.148438 1260.28125 1378.023438", "p": 0.1}, {"d": "M 1267.984375 1365.265625 L 1473.941406 1547.335938 C 1473.941406 1547.335938 1480.863281 1342.230469 1267.984375 1365.265625", "p": 0.3}, {"d": "M 1235.589844 1368.070312 L 1007.082031 1508.566406 C 1007.082031 1508.566406 1032.5 1325.601562 1235.589844 1368.070312", "p": 0.5}, {"d": "M 1237.191406 1356.054688 L 959.988281 1240.335938 C 959.988281 1240.335938 1146.671875 1169.238281 1237.191406 1356.054688", "p": 0.7}, {"d": "M 1251.476562 1348.613281 L 1177.902344 1123.492188 C 1177.902344 1123.492188 1346.011719 1173.546875 1251.476562 1348.613281", "p": 0.9}, {"d": "M 1264.132812 1353.132812 L 1523.894531 1328.691406 C 1523.894531 1328.691406 1375.441406 1197.214844 1264.132812 1353.132812", "p": 0.4}];

// Pivots in viewBox units. Feet sit where the trunks meet the rim; crowns where the fronds meet.
const TALL = { foot: [960, 1740], crown: [826, 846] };
const SHORT = { foot: [1112, 1740], crown: [1252, 1362] };

export function Mark({ tone = "black", idle = true, className = "", style }: { tone?: "black" | "orange" | "white"; idle?: boolean; className?: string; style?: CSSProperties }) {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tall = svg.querySelector<SVGGElement>("[data-tall]")!, tallCrown = svg.querySelector<SVGGElement>("[data-tall-crown]")!;
    const short = svg.querySelector<SVGGElement>("[data-short]")!, shortCrown = svg.querySelector<SVGGElement>("[data-short-crown]")!;
    const tf = Array.from(svg.querySelectorAll<SVGPathElement>("[data-tall-crown] path"));
    const sf = Array.from(svg.querySelectorAll<SVGPathElement>("[data-short-crown] path"));
    let wind = 0, target = 0, v = 0, over = false, raf = 0, last = performance.now();
    const t0 = last;
    const k = 60, c = 11;
    const rot = (el: Element, deg: number, [x, y]: number[]) => el.setAttribute("transform", `rotate(${deg.toFixed(3)} ${x} ${y})`);
    const draw = (now: number) => {
      const tIdle = (now - t0) / 1000;
      const breathe = idle && !over && !reduced ? Math.sin(tIdle * 0.55) * 0.22 + Math.sin(tIdle * 1.3) * 0.06 : 0;
      const w = wind + breathe;
      rot(tall, w * -4.5, TALL.foot);
      rot(tallCrown, w * -6, TALL.crown);
      rot(short, w * -3.5, SHORT.foot);
      rot(shortCrown, w * -5, SHORT.crown);
      tf.forEach((p, i) => rot(p, w * -3 * (0.6 + TALL_FRONDS[i].p) + breathe * 1.5 * Math.sin(tIdle * 0.9 + i), TALL.crown));
      sf.forEach((p, i) => rot(p, w * -2.5 * (0.6 + SHORT_FRONDS[i].p) + breathe * 1.2 * Math.sin(tIdle * 1.1 + i), SHORT.crown));
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (reduced) { wind = target; } else { const a = -k * (wind - target) - c * v; v += a * dt; wind += v * dt; }
      draw(now);
      const moving = Math.abs(wind - target) > 0.002 || Math.abs(v) > 0.002 || (idle && !over && !reduced);
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const onMove = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1; // -1 left … 1 right
      over = true; target = Math.max(-1, Math.min(1, x)) * 1.0; wake();
    };
    const onLeave = () => { over = false; target = 0; wake(); };
    svg.addEventListener("pointermove", onMove); svg.addEventListener("pointerleave", onLeave);
    wake();
    return () => { svg.removeEventListener("pointermove", onMove); svg.removeEventListener("pointerleave", onLeave); if (raf) cancelAnimationFrame(raf); };
  }, [idle]);

  const disc = tone === "orange" ? "#ce6240" : tone === "white" ? "#ffffff" : "#000000";
  const palm = tone === "white" ? "#000000" : "#ffffff";
  return (
    <svg ref={ref} className={`tp-mark ${className}`} viewBox="0 0 1920 1920" role="img" aria-label="Two Palms" style={{ touchAction: "pan-y", ...style }}>
      <defs><clipPath id="tp-mark-clip"><path d={DISC} /></clipPath></defs>
      <path d={DISC} fill={disc} />
      <g clipPath="url(#tp-mark-clip)">
      <g data-tall>
        <path d={TALL_TRUNK} fill={palm} />
        <g data-tall-crown>{TALL_FRONDS.map((f, i) => <path key={i} d={f.d} fill={palm} />)}</g>
      </g>
      <g data-short>
        <path d={SHORT_TRUNK} fill={palm} />
        <g data-short-crown>{SHORT_FRONDS.map((f, i) => <path key={i} d={f.d} fill={palm} />)}</g>
      </g>
      </g>
    </svg>
  );
}
