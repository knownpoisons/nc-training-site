// ─── Camera-angle diagrams (stills) ──────────────────────────────────────────
// Full per-slug scene system: every one of the 45 angles gets a visually
// distinct diagram in the same hairline language. Five scene families:
//   framing  — a figure with a cobalt crop bracket showing exactly what's in shot
//   height   — side-view camera positions (eye/low/high/worm/bird/…)
//   position — plan-view camera placement around a subject with a facing tick
//   optics   — lens signatures (cone width, focus rings, flares, letterbox)
//   composition — the overlay IS the story (grids, lines, negative space)
// Pure SVG, server-renderable; the only motion is the slow aperture breath.

import type { AngleDiagramSpec } from "../camera-prompts/_data/angles";

const W = 300;
const H = 200;

/* ── shared primitives ────────────────────────────────────────────────────── */

function Dots() {
  return (
    <>
      <defs>
        <pattern id="ncDots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="cm-dot" />
        </pattern>
      </defs>
      <rect x={2} y={2} width={W - 4} height={H - 4} fill="url(#ncDots)" />
    </>
  );
}

function Cam({
  x,
  y,
  rot = 0,
  reach = 0,
  spread,
}: {
  x: number;
  y: number;
  rot?: number;
  reach?: number;
  spread?: number;
}) {
  const s = spread ?? Math.max(10, reach * 0.32);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {reach > 0 && (
        <path d={`M -5 -9 L ${-s} ${-reach} L ${s} ${-reach} L 5 -9 Z`} className="cm-cone cm-aperture" />
      )}
      <rect x={-7} y={-2} width={14} height={11} rx={1.5} className="cm-cam-body" />
      <path d="M -4 -2 L 4 -2 L 7 -9 L -7 -9 Z" className="cm-cam-lens" />
    </g>
  );
}

/** Standing figure, scalable. Head-top y = ground − h. */
function Person({ x, ground, h, filled = false }: { x: number; ground: number; h: number; filled?: boolean }) {
  const hr = h * 0.105;
  const headY = ground - h + hr;
  const shoulderY = ground - h + hr * 2.3;
  const hipY = ground - h * 0.46;
  const cls = filled ? "cm-fill-figure" : "cm-figure";
  return (
    <g>
      <circle cx={x} cy={headY} r={hr} className={filled ? "cm-fill-figure-solid" : "cm-figure"} />
      <line x1={x} y1={headY + hr} x2={x} y2={hipY} className={cls} strokeWidth={filled ? h * 0.16 : undefined} />
      <line x1={x} y1={shoulderY + 2} x2={x - h * 0.16} y2={hipY - h * 0.14} className={cls} />
      <line x1={x} y1={shoulderY + 2} x2={x + h * 0.16} y2={hipY - h * 0.14} className={cls} />
      <line x1={x} y1={hipY} x2={x - h * 0.11} y2={ground} className={cls} />
      <line x1={x} y1={hipY} x2={x + h * 0.11} y2={ground} className={cls} />
    </g>
  );
}

function Ground({ y = 172 }: { y?: number }) {
  return <line x1={18} y1={y} x2={282} y2={y} className="cm-ground" />;
}

/** Cobalt crop bracket — the "what's in shot" frame. */
function Crop({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const t = Math.min(9, w * 0.22);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="cm-crop" />
      {[
        [x, y, t, 0, 0, t],
        [x + w, y, -t, 0, 0, t],
        [x, y + h, t, 0, 0, -t],
        [x + w, y + h, -t, 0, 0, -t],
      ].map(([cx, cy, dx1, , , dy2], i) => (
        <path key={i} d={`M ${(cx as number) + (dx1 as number)} ${cy} L ${cx} ${cy} L ${cx} ${(cy as number) + (dy2 as number)}`} className="cm-crop-tick" />
      ))}
    </g>
  );
}

function SubjectDot({ x, y, r = 4.5, facing }: { x: number; y: number; r?: number; facing?: number }) {
  // facing: angle in degrees the subject looks toward (0 = up/away, 180 = toward camera/bottom)
  const a = ((facing ?? 180) - 90) * (Math.PI / 180);
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="cm-subject" />
      <circle cx={x} cy={y} r={r + 5.5} className="cm-subject-halo" />
      {facing != null && (
        <line
          x1={x + Math.cos(a) * r}
          y1={y + Math.sin(a) * r}
          x2={x + Math.cos(a) * (r + 7)}
          y2={y + Math.sin(a) * (r + 7)}
          className="cm-facing"
        />
      )}
    </g>
  );
}

/* ── framing family — crop brackets on the figure ─────────────────────────── */

function Framing({ top, bottom, fh = 118 }: { top: number; bottom: number; fh?: number }) {
  const ground = 172;
  const x = 150;
  const yTop = ground - fh + top * fh;
  const yBot = ground - fh + bottom * fh;
  const ch = yBot - yTop;
  const cw = Math.max(30, ch * 1.4);
  return (
    <>
      <Ground y={ground} />
      <Person x={x} ground={ground} h={fh} />
      <Crop x={x - cw / 2} y={yTop} w={cw} h={ch} />
    </>
  );
}

function WideFraming({ fh, inset }: { fh: number; inset: number }) {
  const ground = 168;
  return (
    <>
      <Ground y={ground} />
      <Person x={150} ground={ground} h={fh} />
      <Crop x={inset} y={inset + 6} w={W - inset * 2} h={H - inset * 2 - 18} />
    </>
  );
}

function Establishing() {
  const ground = 158;
  return (
    <>
      <Ground y={ground} />
      {[
        [58, 96, 24, 62],
        [92, 78, 28, 80],
        [130, 108, 22, 50],
        [162, 66, 30, 92],
        [202, 92, 24, 66],
        [236, 116, 22, 42],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} className="cm-block" />
      ))}
      <Person x={120} ground={ground} h={16} />
      <line x1={30} y1={66} x2={270} y2={66} className="cm-gridline" />
      <Crop x={26} y={30} w={248} h={144} />
    </>
  );
}

function MacroDetail() {
  return (
    <>
      <SubjectDot x={150} y={100} r={3} />
      <circle cx={150} cy={100} r={30} className="cm-focus-ring" />
      <circle cx={150} cy={100} r={52} className="cm-subject-halo" />
      <Crop x={128} y={82} w={44} h={36} />
      <Cam x={64} y={158} rot={40} reach={54} spread={9} />
    </>
  );
}

/* ── height family — side-view positions ──────────────────────────────────── */

function HeightScene({
  cam,
  rot,
  reach,
  extras,
  figureX = 212,
  spread,
}: {
  cam: [number, number];
  rot: number;
  reach: number;
  extras?: React.ReactNode;
  figureX?: number;
  spread?: number;
}) {
  return (
    <>
      <Ground y={160} />
      <Person x={figureX} ground={160} h={64} />
      {extras}
      <Cam x={cam[0]} y={cam[1]} rot={rot} reach={reach} spread={spread} />
    </>
  );
}

function WormsEye() {
  return (
    <>
      <Ground y={166} />
      {/* towers converging overhead */}
      <path d="M 84 166 L 102 30 M 128 166 L 132 30" className="cm-block-line" />
      <path d="M 216 166 L 198 30 M 172 166 L 168 30" className="cm-block-line" />
      <Cam x={150} y={158} rot={0} reach={112} spread={40} />
    </>
  );
}

function BirdsEye() {
  return (
    <>
      <Ground y={168} />
      <Person x={150} ground={168} h={40} />
      <Cam x={150} y={40} rot={180} reach={82} spread={30} />
    </>
  );
}

function DutchTilt() {
  return (
    <>
      <Ground y={160} />
      <Person x={206} ground={160} h={64} />
      <g transform="rotate(-12 150 100)">
        <Crop x={78} y={52} w={144} h={96} />
        <line x1={92} y1={100} x2={208} y2={100} className="cm-gridline" />
      </g>
      <Cam x={70} y={122} rot={62} reach={70} />
    </>
  );
}

/* ── position family — plan view around the subject ───────────────────────── */

function OverShoulder() {
  return (
    <>
      {/* foreground shoulder + head, cropped by the cone edge */}
      <circle cx={124} cy={142} r={7} className="cm-subject" />
      <path d="M 104 156 Q 124 146 146 154" className="cm-figure" />
      <SubjectDot x={186} y={78} facing={200} />
      <Cam x={102} y={172} rot={26} reach={96} spread={30} />
    </>
  );
}

function Reflection() {
  return (
    <>
      {/* the mirror */}
      <line x1={204} y1={44} x2={204} y2={156} className="cm-wall" />
      <line x1={209} y1={48} x2={209} y2={152} className="cm-gridline" />
      <SubjectDot x={138} y={112} facing={90} />
      {/* mirrored ghost */}
      <g opacity={0.3}>
        <circle cx={266} cy={112} r={4.5} className="cm-subject" />
      </g>
      {/* sight line bouncing off the glass */}
      <path d="M 92 158 L 204 100 L 138 112" className="cm-guide" />
      <Cam x={88} y={164} rot={58} reach={0} />
    </>
  );
}

function Silhouette() {
  return (
    <>
      <Ground y={160} />
      <circle cx={210} cy={112} r={44} className="cm-sun-soft" />
      <Person x={210} ground={160} h={62} filled />
      <Cam x={72} y={132} rot={72} reach={78} />
    </>
  );
}

function ThroughFrame() {
  return (
    <>
      <line x1={168} y1={36} x2={168} y2={78} className="cm-wall" />
      <line x1={168} y1={122} x2={168} y2={164} className="cm-wall" />
      <SubjectDot x={238} y={100} facing={270} />
      <Cam x={72} y={100} rot={90} reach={92} spread={22} />
    </>
  );
}

function DeadOn() {
  return (
    <>
      <line x1={150} y1={26} x2={150} y2={64} className="cm-gridline-dash" />
      <SubjectDot x={150} y={88} facing={180} />
      <path d="M 108 88 h 12 M 192 88 h -12" className="cm-guide-arrow" />
      <Cam x={150} y={168} rot={0} reach={62} />
    </>
  );
}

function Pov() {
  return (
    <>
      <SubjectDot x={150} y={66} />
      {/* the viewer's own field of view, opening from the bottom edge */}
      <path d="M 150 196 L 58 44 L 242 44 Z" className="cm-cone cm-aperture" />
      {/* hands entering the lower frame */}
      <path d="M 96 196 Q 106 172 122 168" className="cm-figure" />
      <path d="M 204 196 Q 194 172 178 168" className="cm-figure" />
    </>
  );
}

/* ── optics family ────────────────────────────────────────────────────────── */

function ShallowDof() {
  return (
    <>
      <SubjectDot x={150} y={104} />
      {/* blurred background — soft multi-ring dots */}
      {[
        [96, 48],
        [178, 40],
        [232, 66],
      ].map(([x, y], i) => (
        <g key={i} className="cm-blur">
          <circle cx={x} cy={y} r={4} />
          <circle cx={x} cy={y} r={8} />
        </g>
      ))}
      <line x1={62} y1={122} x2={238} y2={122} className="cm-focus-line" opacity={0.5} />
      <line x1={62} y1={86} x2={238} y2={86} className="cm-focus-line" opacity={0.5} />
      <rect x={62} y={86} width={176} height={36} className="cm-focus-band" />
      <Cam x={150} y={172} rot={0} reach={52} />
    </>
  );
}

function DeepFocus() {
  return (
    <>
      {[
        [118, 128, 4.5],
        [166, 92, 4],
        [214, 56, 3.5],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} className="cm-subject" />
          <path d={`M ${(x as number) - 6} ${(y as number) + 9} h 12`} className="cm-focus-line" opacity={0.7} />
        </g>
      ))}
      <Cam x={84} y={172} rot={32} reach={130} spread={46} />
    </>
  );
}

function Telephoto() {
  return (
    <>
      {/* long, narrow cone from the far edge */}
      <Cam x={30} y={100} rot={90} reach={0} />
      <path d="M 39 96 L 244 84 L 244 116 L 39 104 Z" className="cm-cone cm-aperture" />
      {/* compressed depth — planes stacked tight */}
      {[228, 242, 256].map((x, i) => (
        <line key={i} x1={x} y1={64} x2={x} y2={136} className="cm-figure" opacity={0.85 - i * 0.25} />
      ))}
      <path d="M 196 100 h 18 m -6 -5 l 6 5 l -6 5" className="cm-guide-arrow" />
      <path d="M 286 100 h -18 m 6 -5 l -6 5 l 6 5" className="cm-guide-arrow" />
    </>
  );
}

function WideAngle() {
  return (
    <>
      <Cam x={150} y={162} rot={0} reach={0} />
      <path d="M 145 153 L 26 40 L 274 40 L 155 153 Z" className="cm-cone cm-aperture" />
      {/* near thing huge, far thing tiny */}
      <circle cx={116} cy={124} r={11} className="cm-subject" />
      <circle cx={182} cy={54} r={3} className="cm-subject" />
      <circle cx={182} cy={54} r={7.5} className="cm-subject-halo" />
    </>
  );
}

function Fisheye() {
  return (
    <>
      {/* barrel-distorted frame */}
      <path
        d="M 62 42 Q 150 24 238 42 Q 262 100 238 158 Q 150 176 62 158 Q 38 100 62 42 Z"
        className="cm-crop"
      />
      <path d="M 58 100 Q 150 76 242 100" className="cm-gridline" />
      <path d="M 58 100 Q 150 124 242 100" className="cm-gridline" />
      <SubjectDot x={150} y={100} />
    </>
  );
}

function LensFlare() {
  return (
    <>
      <Ground y={158} />
      <circle cx={196} cy={70} r={16} className="cm-sun" />
      {[0, 30, 60, 120, 150].map((a) => (
        <line
          key={a}
          x1={196 + Math.cos((a * Math.PI) / 180) * 22}
          y1={70 - Math.sin((a * Math.PI) / 180) * 22}
          x2={196 + Math.cos((a * Math.PI) / 180) * 38}
          y2={70 - Math.sin((a * Math.PI) / 180) * 38}
          className="cm-focus-line"
          opacity={0.55}
        />
      ))}
      {/* flare ghosts marching down the diagonal */}
      {[
        [156, 96, 5],
        [124, 118, 8],
        [92, 140, 4],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} className="cm-ghost" />
      ))}
      <Person x={230} ground={158} h={52} />
      <Cam x={56} y={148} rot={62} reach={0} />
    </>
  );
}

function SoftFocus() {
  return (
    <>
      <SubjectDot x={150} y={94} />
      {[16, 26, 38].map((r, i) => (
        <circle key={r} cx={150} cy={94} r={r} className="cm-subject-halo" opacity={0.3 - i * 0.08} />
      ))}
      {[
        [96, 60],
        [212, 78],
        [186, 140],
      ].map(([x, y], i) => (
        <path key={i} d={`M ${(x as number) - 5} ${y} h 10 M ${x} ${(y as number) - 5} v 10`} className="cm-sparkle" />
      ))}
      <Cam x={150} y={170} rot={0} reach={50} spread={20} />
    </>
  );
}

function Anamorphic() {
  return (
    <>
      <rect x={2} y={2} width={296} height={34} className="cm-bar" />
      <rect x={2} y={164} width={296} height={34} className="cm-bar" />
      <line x1={20} y1={100} x2={280} y2={100} className="cm-focus-line" opacity={0.65} />
      <ellipse cx={106} cy={78} rx={7} ry={10} className="cm-ghost" />
      <ellipse cx={228} cy={124} rx={6} ry={9} className="cm-ghost" />
      <SubjectDot x={158} y={100} r={4} />
    </>
  );
}

/* ── composition family ───────────────────────────────────────────────────── */

function FlatLay({ knolled }: { knolled: boolean }) {
  const objects: React.ReactNode = knolled ? (
    <>
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => {
          const x = 96 + c * 54;
          const y = 74 + r * 52;
          return c === 1 && r === 0 ? (
            <circle key={`${c}${r}`} cx={x + 12} cy={y + 12} r={12} className="cm-object" />
          ) : (
            <rect key={`${c}${r}`} x={x} y={y} width={26} height={24} className="cm-object" />
          );
        })
      )}
    </>
  ) : (
    <>
      <rect x={92} y={66} width={34} height={28} className="cm-object" transform="rotate(-14 109 80)" />
      <circle cx={172} cy={84} r={15} className="cm-object" />
      <line x1={124} y1={128} x2={182} y2={142} className="cm-figure" />
      <rect x={196} y={112} width={26} height={34} className="cm-object" transform="rotate(11 209 129)" />
    </>
  );
  return (
    <>
      <rect x={66} y={48} width={168} height={116} className="cm-table" />
      {objects}
      {/* top-down camera indicator */}
      <Cam x={262} y={36} rot={180} reach={0} />
      <path d="M 262 48 v 12 m -5 -6 l 5 6 l 5 -6" className="cm-guide-arrow" />
    </>
  );
}

function Thirds() {
  return (
    <>
      <line x1={101} y1={12} x2={101} y2={188} className="cm-gridline" />
      <line x1={199} y1={12} x2={199} y2={188} className="cm-gridline" />
      <line x1={16} y1={67} x2={284} y2={67} className="cm-gridline" />
      <line x1={16} y1={133} x2={284} y2={133} className="cm-gridline" />
      <SubjectDot x={199} y={67} />
      <circle cx={199} cy={67} r={16} className="cm-focus-ring" />
    </>
  );
}

function Symmetry() {
  return (
    <>
      <line x1={150} y1={14} x2={150} y2={186} className="cm-gridline-dash" />
      <SubjectDot x={150} y={100} />
      <path d="M 96 100 l 14 0 m -5 -4 l 5 4 l -5 4" className="cm-guide-arrow" />
      <path d="M 204 100 l -14 0 m 5 -4 l -5 4 l 5 4" className="cm-guide-arrow" />
      {[
        [58, 44],
        [242, 44],
        [58, 156],
        [242, 156],
      ].map(([x, y], i) => (
        <path key={i} d={`M ${(x as number) - 6} ${y} h 12 M ${x} ${(y as number) - 6} v 12`} className="cm-gridline" />
      ))}
    </>
  );
}

function NegativeSpace() {
  return (
    <>
      <SubjectDot x={234} y={148} r={4} />
      <Crop x={222} y={136} w={26} h={24} />
    </>
  );
}

function LeadingLines() {
  return (
    <>
      <line x1={26} y1={188} x2={146} y2={74} className="cm-figure" opacity={0.6} />
      <line x1={274} y1={188} x2={154} y2={74} className="cm-figure" opacity={0.6} />
      <line x1={92} y1={188} x2={148} y2={80} className="cm-gridline" />
      <line x1={208} y1={188} x2={152} y2={80} className="cm-gridline" />
      <SubjectDot x={150} y={66} />
    </>
  );
}

function FrameInFrame() {
  return (
    <>
      <rect x={102} y={50} width={96} height={104} className="cm-doorway" />
      <SubjectDot x={150} y={104} />
    </>
  );
}

function Pattern() {
  return (
    <>
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => {
          const x = 72 + c * 52;
          const y = 52 + r * 48;
          const accent = c === 2 && r === 1;
          return accent ? (
            <circle key={`${c}${r}`} cx={x} cy={y} r={9} className="cm-sun" />
          ) : (
            <circle key={`${c}${r}`} cx={x} cy={y} r={9} className="cm-object" />
          );
        })
      )}
    </>
  );
}

function GoldenHour() {
  return (
    <>
      <Ground y={156} />
      <circle cx={48} cy={144} r={15} className="cm-sun" />
      {[18, 38, 58].map((a) => (
        <line
          key={a}
          x1={48 + Math.cos((a * Math.PI) / 180) * 21}
          y1={144 - Math.sin((a * Math.PI) / 180) * 21}
          x2={48 + Math.cos((a * Math.PI) / 180) * 36}
          y2={144 - Math.sin((a * Math.PI) / 180) * 36}
          className="cm-focus-line"
          opacity={0.55}
        />
      ))}
      <Person x={190} ground={156} h={58} />
      {/* the long shadow */}
      <path d="M 196 156 L 272 164" className="cm-shadow" />
    </>
  );
}

/* ── the component ────────────────────────────────────────────────────────── */

const SCENES: Record<string, () => React.ReactNode> = {
  // Angle & Height
  "eye-level": () => <HeightScene cam={[92, 122]} rot={72} reach={92} />,
  "low-angle": () => <HeightScene cam={[98, 148]} rot={58} reach={92} />,
  "high-angle": () => <HeightScene cam={[88, 52]} rot={116} reach={100} />,
  "worms-eye-view": WormsEye,
  "birds-eye-view": BirdsEye,
  "dutch-tilt": DutchTilt,
  "hip-level": () => (
    <HeightScene
      cam={[96, 134]}
      rot={78}
      reach={90}
      extras={<line x1={70} y1={134} x2={236} y2={134} className="cm-gridline-dash" />}
    />
  ),
  "ground-level": () => (
    <HeightScene cam={[84, 152]} rot={86} reach={104} spread={16} extras={<line x1={18} y1={160} x2={282} y2={160} className="cm-ground-strong" />} />
  ),

  // Framing & Distance
  "extreme-close-up": () => <Framing top={-0.02} bottom={0.13} />,
  "close-up": () => <Framing top={-0.07} bottom={0.23} />,
  "medium-close-up": () => <Framing top={-0.08} bottom={0.36} />,
  "medium-shot": () => <Framing top={-0.09} bottom={0.54} />,
  "cowboy-shot": () => <Framing top={-0.09} bottom={0.72} />,
  "full-shot": () => <Framing top={-0.16} bottom={1.06} />,
  "wide-shot": () => <WideFraming fh={72} inset={38} />,
  "extreme-wide": () => <WideFraming fh={30} inset={16} />,
  "establishing-shot": Establishing,
  "macro-detail": MacroDetail,

  // Perspective & Position
  "pov-shot": Pov,
  "over-the-shoulder": OverShoulder,
  profile: () => (
    <>
      <SubjectDot x={150} y={88} facing={90} />
      <Cam x={150} y={168} rot={0} reach={62} />
    </>
  ),
  "three-quarter-view": () => (
    <>
      <SubjectDot x={162} y={84} facing={205} />
      <Cam x={92} y={164} rot={38} reach={86} />
    </>
  ),
  "from-behind": () => (
    <>
      <SubjectDot x={150} y={88} facing={0} />
      <Cam x={150} y={168} rot={0} reach={62} />
    </>
  ),
  "reflection-shot": Reflection,
  silhouette: Silhouette,
  "through-a-frame": ThroughFrame,
  "dead-on-front": DeadOn,

  // Lens & Optics
  "shallow-depth-of-field": ShallowDof,
  "deep-focus": DeepFocus,
  "telephoto-compression": Telephoto,
  "wide-angle-exaggeration": WideAngle,
  fisheye: Fisheye,
  "tilt-shift-miniature": () => (
    <>
      <Ground y={160} />
      {[
        [52, 118, 26, 42],
        [88, 104, 22, 56],
        [120, 124, 30, 36],
        [160, 96, 26, 64],
        [196, 116, 22, 44],
        [228, 128, 26, 32],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} className="cm-block" />
      ))}
      <line x1={30} y1={112} x2={270} y2={112} className="cm-focus-line" />
      <line x1={30} y1={136} x2={270} y2={136} className="cm-focus-line" />
      <rect x={30} y={112} width={240} height={24} className="cm-focus-band" />
      <Cam x={44} y={44} rot={135} reach={30} />
    </>
  ),
  "lens-flare-backlit": LensFlare,
  "soft-focus-glow": SoftFocus,
  "anamorphic-feel": Anamorphic,

  // Composition
  "flat-lay": () => <FlatLay knolled={false} />,
  knolling: () => <FlatLay knolled={true} />,
  "centred-symmetry": Symmetry,
  "rule-of-thirds": Thirds,
  "negative-space": NegativeSpace,
  "leading-lines": LeadingLines,
  "frame-within-frame": FrameInFrame,
  "pattern-repetition": Pattern,
  "golden-hour-side-light": GoldenHour,
};

export function AngleDiagram({ slug, spec }: { slug: string; spec: AngleDiagramSpec }) {
  const scene = SCENES[slug];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="cm-diagram" aria-hidden="true" focusable="false">
      <Dots />
      <rect x={0.75} y={0.75} width={W - 1.5} height={H - 1.5} className="cm-frame" />
      {scene ? (
        scene()
      ) : (
        // Fallback for any future entry without a bespoke scene: simple
        // side-view placement from the spec.
        <>
          <Ground y={160} />
          <Person x={212} ground={160} h={64} />
          <Cam
            x={spec.camera === "high" || spec.camera === "overhead" ? 96 : 92}
            y={spec.camera === "high" ? 52 : spec.camera === "overhead" ? 36 : spec.camera === "low" || spec.camera === "ground" ? 148 : 122}
            rot={spec.camera === "overhead" ? 180 : spec.camera === "high" ? 116 : spec.camera === "low" || spec.camera === "ground" ? 58 : 72}
            reach={92}
          />
        </>
      )}
    </svg>
  );
}
