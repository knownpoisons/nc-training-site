// ─── Parametric camera-movement diagram ──────────────────────────────────────
// ONE component renders all 46 movements from a DiagramSpec. Pure SVG — no
// hooks, no "use client" — so it server-renders and animates via CSS keyframes
// on transform only (see finder.css). Reduced motion / paused cards simply show
// the static state: guide path + arrowhead + camera glyph, which still reads.

import type { DiagramSpec } from "../camera-prompts/_data/movements";

const W = 300;
const H = 200;

const DUR: Record<string, string> = { slow: "7s", normal: "4.5s", fast: "1.5s" };
const EASE: Record<string, string> = {
  linear: "linear",
  easeInOut: "cubic-bezier(0.45, 0, 0.55, 1)",
  whip: "cubic-bezier(0.85, 0, 0.15, 1)",
};

type Vars = React.CSSProperties & Record<string, string | number>;

function vars(spec: DiagramSpec, extra: Record<string, string | number> = {}): Vars {
  return {
    "--dur": DUR[spec.speed ?? "normal"],
    "--easefn": EASE[spec.ease ?? "easeInOut"],
    ...extra,
  } as Vars;
}

/** Camera glyph — drawn facing UP (−y); rotate to aim. */
function Camera({ x, y, rot = 0, cone = false }: { x: number; y: number; rot?: number; cone?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {cone && <path d="M -5 -9 L -16 -34 L 16 -34 L 5 -9 Z" className="cm-cone" />}
      <rect x={-7} y={-2} width={14} height={11} rx={1.5} className="cm-cam-body" />
      <path d="M -4 -2 L 4 -2 L 7 -9 L -7 -9 Z" className="cm-cam-lens" />
    </g>
  );
}

/** Subject — plan view: ink dot + halo ring. */
function SubjectDot({ x, y, cls = "" }: { x: number; y: number; cls?: string }) {
  return (
    <g className={cls} style={{ transformOrigin: `${x}px ${y}px` } as Vars}>
      <circle cx={x} cy={y} r={4.5} className="cm-subject" />
      <circle cx={x} cy={y} r={10} className="cm-subject-halo" />
    </g>
  );
}

/** Subject — side view: minimal standing figure on the ground line. */
function SubjectFigure({ x, ground }: { x: number; ground: number }) {
  return (
    <g>
      <circle cx={x} cy={ground - 34} r={5} className="cm-subject" />
      <line x1={x} y1={ground - 29} x2={x} y2={ground - 8} className="cm-figure" />
      <line x1={x - 7} y1={ground} x2={x + 7} y2={ground} className="cm-figure" />
    </g>
  );
}

function Ground() {
  return <line x1={20} y1={160} x2={280} y2={160} className="cm-ground" />;
}

/** Motion-blur streak hairlines. */
function Streaks({ x, y, horizontal = true }: { x: number; y: number; horizontal?: boolean }) {
  const d = horizontal
    ? [`M ${x - 34} ${y - 8} h 22`, `M ${x - 42} ${y} h 26`, `M ${x - 34} ${y + 8} h 22`]
    : [`M ${x - 8} ${y - 34} v 22`, `M ${x} ${y - 42} v 26`, `M ${x + 8} ${y - 34} v 22`];
  return (
    <g className="cm-streaks">
      {d.map((p, i) => (
        <path key={i} d={p} className="cm-streak" />
      ))}
    </g>
  );
}

function Arrow({ x, y, rot }: { x: number; y: number; rot: number }) {
  return <path d={`M ${x} ${y} l -5 -4 m 5 4 l -5 4`} className="cm-guide-arrow" transform={`rotate(${rot} ${x} ${y})`} />;
}

// ─── Kind renders ────────────────────────────────────────────────────────────

function StaticShot() {
  return (
    <>
      <SubjectDot x={150} y={82} cls="cm-pulse" />
      <Camera x={150} y={152} cone />
      {/* tripod ticks — locked off */}
      <path d="M 143 165 l -6 8 M 157 165 l 6 8 M 150 166 v 9" className="cm-figure" />
    </>
  );
}

function Rotate(spec: DiagramSpec) {
  const side = spec.view === "side";
  const sweep =
    (spec.ease === "whip" ? 34 : 24) *
    (spec.direction === "left" || spec.direction === "down" ? -1 : 1);
  const cam = side ? { x: 66, y: 152 } : { x: 150, y: 148 };
  const baseRot = side ? 55 : 0; // side view: cone aims right toward the subject
  return (
    <>
      {side ? (
        <>
          <Ground />
          <SubjectFigure x={216} ground={160} />
        </>
      ) : (
        <SubjectDot x={150} y={70} />
      )}
      {/* sweep guide arc */}
      <path
        d={
          side
            ? "M 118 106 A 68 68 0 0 1 130 132"
            : "M 116 92 A 66 66 0 0 1 184 92"
        }
        className="cm-guide"
      />
      <g
        className={spec.ease === "whip" ? "cm-whip" : "cm-sweep"}
        style={vars(spec, { "--sweep": `${sweep}deg`, transformOrigin: `${cam.x}px ${cam.y}px` })}
      >
        <Camera x={cam.x} y={cam.y} rot={baseRot} cone />
      </g>
      {spec.streaks && <Streaks x={150} y={70} />}
    </>
  );
}

function Linear(spec: DiagramSpec) {
  const side = spec.view === "side";
  const d = spec.direction ?? "right";
  const span = spec.speed === "slow" ? 34 : 56;
  let dx = 0;
  let dy = 0;
  let guide: string;
  let cam = { x: 150, y: 150, rot: 0 };

  if (d === "left" || d === "right") {
    dx = d === "right" ? span : -span;
    cam = side ? { x: 150 - dx / 2, y: 146, rot: 0 } : { x: 150 - dx / 2, y: 148, rot: 0 };
    guide = `M ${cam.x - 14} ${cam.y + 18} h ${dx + 28}`;
  } else if (d === "up" || d === "down") {
    dy = d === "up" ? -span : span;
    cam = { x: side ? 96 : 150, y: 108 - dy / 2, rot: side ? 90 : 0 };
    guide = `M ${cam.x - 20} ${cam.y - 14} v ${dy + 28}`;
    if (side) guide = `M ${cam.x - 22} ${cam.y - 14 + Math.min(0, dy)} v ${Math.abs(dy) + 28}`;
  } else {
    // in / out — travel toward or away from the subject
    dy = d === "in" ? -44 : 44;
    cam = { x: 150, y: (d === "in" ? 152 : 128) + (d === "in" ? 0 : 0), rot: 0 };
    if (side) {
      // fly toward subject horizontally
      dx = d === "in" ? 52 : -52;
      dy = 0;
      cam = { x: 92 - dx / 2, y: 92, rot: 90 };
      guide = `M ${cam.x - 16} ${cam.y + 22} h ${dx + 32}`;
    } else {
      cam = { x: 150, y: d === "in" ? 154 : 132, rot: 0 };
      guide = `M ${cam.x - 20} ${cam.y + 6} v ${dy} M ${cam.x + 20} ${cam.y + 6} v ${dy}`;
    }
  }

  return (
    <>
      {side ? (
        <>
          <Ground />
          <SubjectFigure x={224} ground={160} />
        </>
      ) : (
        <SubjectDot x={150} y={74} />
      )}
      <path d={guide} className="cm-guide" />
      <g className="cm-slide" style={vars(spec, { "--dx": `${dx}px`, "--dy": `${dy}px` })}>
        <Camera x={cam.x} y={cam.y} rot={cam.rot} cone />
      </g>
    </>
  );
}

function ArcMove(spec: DiagramSpec) {
  const ccw = spec.direction === "ccw";
  const sweep = 44 * (ccw ? -1 : 1);
  return (
    <>
      <SubjectDot x={150} y={92} />
      <path d="M 92 130 A 68 68 0 0 1 208 130" className="cm-guide" transform="rotate(180 150 92)" />
      <path d="M 96 130 A 68 68 0 0 0 204 130" className="cm-guide" />
      <g
        className="cm-sweep"
        style={vars(spec, { "--sweep": `${sweep}deg`, transformOrigin: "150px 92px" })}
      >
        <Camera x={150} y={160} rot={0} cone />
      </g>
    </>
  );
}

function Orbit(spec: DiagramSpec) {
  const ccw = spec.direction === "ccw";
  return (
    <>
      <SubjectDot x={150} y={100} />
      <circle cx={150} cy={100} r={62} className="cm-guide cm-guide-circle" />
      <Arrow x={ccw ? 88 : 212} y={100} rot={ccw ? 90 : -90} />
      <g
        className="cm-orbit"
        style={vars(spec, {
          transformOrigin: "150px 100px",
          animationDirection: ccw ? "reverse" : "normal",
        })}
      >
        <Camera x={150} y={162} rot={0} />
      </g>
    </>
  );
}

function Zoom(spec: DiagramSpec) {
  const zoomIn = spec.direction !== "out";
  const scale = zoomIn ? 0.5 : 1.45;
  return (
    <>
      <SubjectDot x={150} y={88} />
      {/* the travelling frame — breathes toward / away from the subject */}
      <g
        className={spec.ease === "whip" ? "cm-zoom-whip" : "cm-zoom"}
        style={vars(spec, { "--scale": scale, transformOrigin: "150px 88px" })}
      >
        <rect x={96} y={48} width={108} height={80} className="cm-zoom-frame" />
        <path d="M 96 48 l -8 -6 M 204 48 l 8 -6 M 96 128 l -8 6 M 204 128 l 8 6" className="cm-guide" />
      </g>
      <rect x={70} y={30} width={160} height={116} className="cm-zoom-outer" />
      <Camera x={150} y={168} rot={0} />
      {spec.streaks && <Streaks x={150} y={88} horizontal={false} />}
    </>
  );
}

function Follow(spec: DiagramSpec) {
  const side = spec.view === "side";
  const d = spec.direction ?? "right";
  const horiz = d === "left" || d === "right";
  const span = spec.speed === "fast" ? 46 : 36;
  const dx = horiz ? (d === "left" ? -span : span) : 0;
  const dy = horiz ? 0 : d === "in" ? -span : span;
  // camera aims at the subject; both travel together
  const camRot = horiz ? 0 : d === "in" ? 0 : 180;

  return (
    <>
      {side && <Ground />}
      {/* parallax ticks — the world streaming past, counter to travel */}
      <g className="cm-slide cm-counter" style={vars(spec, { "--dx": `${-dx * 1.6}px`, "--dy": `${-dy * 1.6}px` })}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={
              horiz
                ? `M ${52 + i * 62} ${side ? 160 : 36} ${side ? "v 0 m 0 0 v 0" : "v 10"}`
                : `M ${44} ${44 + i * 36} h 10 M ${256} ${44 + i * 36} h -10`
            }
            className="cm-tick"
          />
        ))}
        {side &&
          [0, 1, 2, 3].map((i) => (
            <path key={`g${i}`} d={`M ${40 + i * 64} 160 l 8 8`} className="cm-tick" />
          ))}
      </g>
      <g className="cm-slide" style={vars(spec, { "--dx": `${dx}px`, "--dy": `${dy}px` })}>
        {side ? (
          <>
            <SubjectFigure x={168} ground={160} />
            <Camera x={112} y={150} rot={55} cone />
          </>
        ) : horiz ? (
          <>
            <SubjectDot x={150} y={78} />
            <Camera x={150} y={140} rot={camRot} cone />
          </>
        ) : (
          <>
            <SubjectDot x={150} y={d === "in" ? 74 : 130} />
            <Camera x={150} y={d === "in" ? 142 : 74} rot={camRot} cone />
          </>
        )}
      </g>
    </>
  );
}

function Shake(spec: DiagramSpec) {
  const snorri = spec.subjectMotion === "withCamera";
  if (snorri) {
    // Snorricam — subject + camera locked; the world lurches around them
    return (
      <>
        <g className="cm-shake" style={vars(spec)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M ${44 + i * 54} 36 v 10 M ${58 + i * 50} 158 v 10`} className="cm-tick" />
          ))}
          <rect x={34} y={24} width={232} height={152} className="cm-zoom-outer" />
        </g>
        <SubjectDot x={150} y={86} />
        <line x1={150} y1={96} x2={150} y2={126} className="cm-rig" />
        <Camera x={150} y={138} rot={0} cone />
      </>
    );
  }
  return (
    <>
      <SubjectDot x={150} y={76} />
      <g className="cm-shake" style={vars(spec)}>
        <Camera x={150} y={146} rot={0} cone />
      </g>
    </>
  );
}

// ─── Specials ────────────────────────────────────────────────────────────────

function Fpv(spec: DiagramSpec) {
  return (
    <>
      <path d="M 150 176 C 118 148 184 120 150 92 C 124 70 158 52 150 30" className="cm-guide" />
      <Arrow x={150} y={32} rot={90} />
      <g className="cm-slide" style={vars(spec, { "--dx": "0px", "--dy": "-56px" })}>
        <g className="cm-sway" style={vars(spec)}>
          <Camera x={150} y={150} rot={0} cone />
        </g>
      </g>
    </>
  );
}

function TiltShift(spec: DiagramSpec) {
  return (
    <>
      <Ground />
      {/* skyline blocks */}
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
      {/* razor-thin focus band drifting over the miniature */}
      <g className="cm-slide" style={vars(spec, { "--dx": "0px", "--dy": "14px" })}>
        <line x1={30} y1={112} x2={270} y2={112} className="cm-focus-line" />
        <line x1={30} y1={136} x2={270} y2={136} className="cm-focus-line" />
        <rect x={30} y={112} width={240} height={24} className="cm-focus-band" />
      </g>
      <Camera x={44} y={44} rot={135} cone />
    </>
  );
}

function InfiniteZoom(spec: DiagramSpec) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className="cm-tunnel"
          style={vars(spec, {
            transformOrigin: "150px 100px",
            animationDelay: `calc(var(--dur) / -3 * ${i})`,
          })}
        >
          <rect x={60} y={40} width={180} height={120} className="cm-zoom-frame" />
        </g>
      ))}
      <SubjectDot x={150} y={100} />
    </>
  );
}

function EarthZoom(spec: DiagramSpec) {
  return (
    <>
      <SubjectDot x={150} y={112} />
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          className="cm-ring"
          style={vars(spec, {
            transformOrigin: "150px 112px",
            animationDelay: `calc(var(--dur) / -3 * ${i})`,
          })}
        >
          <circle cx={150} cy={112} r={22} className="cm-guide cm-guide-circle" />
        </g>
      ))}
      {/* camera pulling up and away */}
      <g className="cm-slide" style={vars(spec, { "--dx": "0px", "--dy": "-30px" })}>
        <Camera x={150} y={58} rot={180} />
      </g>
    </>
  );
}

function TimeLapse(spec: DiagramSpec) {
  return (
    <>
      <Ground />
      <SubjectFigure x={224} ground={160} />
      {/* the sun wheeling across the sky — time sprinting past a locked camera */}
      <path d="M 60 128 A 96 96 0 0 1 244 128" className="cm-guide" />
      <g className="cm-orbit" style={vars(spec, { transformOrigin: "152px 176px" })}>
        <circle cx={62} cy={130} r={7} className="cm-sun" />
      </g>
      <Camera x={110} y={150} rot={35} cone />
      <path d="M 103 163 l -6 8 M 117 163 l 6 8" className="cm-figure" />
    </>
  );
}

function PassThrough(spec: DiagramSpec) {
  return (
    <>
      {/* the wall with a slot the camera slips through */}
      <line x1={44} y1={96} x2={128} y2={96} className="cm-wall" />
      <line x1={172} y1={96} x2={256} y2={96} className="cm-wall" />
      <SubjectDot x={150} y={44} />
      <path d="M 150 176 V 24" className="cm-guide" />
      <g className="cm-pass" style={vars(spec)}>
        <Camera x={150} y={150} rot={0} cone />
      </g>
    </>
  );
}

// ─── The component ───────────────────────────────────────────────────────────

export function MovementDiagram({ spec }: { spec: DiagramSpec }) {
  let scene: React.ReactNode;
  switch (spec.kind) {
    case "static":
      scene = <StaticShot />;
      break;
    case "rotate":
      scene = <Rotate {...spec} />;
      break;
    case "linear":
      scene = <Linear {...spec} />;
      break;
    case "arc":
      scene = <ArcMove {...spec} />;
      break;
    case "orbit":
      scene = <Orbit {...spec} />;
      break;
    case "zoom":
      scene = <Zoom {...spec} />;
      break;
    case "follow":
      scene = <Follow {...spec} />;
      break;
    case "shake":
      scene = <Shake {...spec} />;
      break;
    case "fpv":
      scene = <Fpv {...spec} />;
      break;
    case "tiltShift":
      scene = <TiltShift {...spec} />;
      break;
    case "infiniteZoom":
      scene = <InfiniteZoom {...spec} />;
      break;
    case "earthZoom":
      scene = <EarthZoom {...spec} />;
      break;
    case "timeLapse":
      scene = <TimeLapse {...spec} />;
      break;
    case "passThrough":
      scene = <PassThrough {...spec} />;
      break;
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="cm-diagram"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="ncDotsM" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="cm-dot" />
        </pattern>
      </defs>
      <rect x={2} y={2} width={W - 4} height={H - 4} fill="url(#ncDotsM)" />
      <rect x={0.75} y={0.75} width={W - 1.5} height={H - 1.5} className="cm-frame" />
      {scene}
    </svg>
  );
}
