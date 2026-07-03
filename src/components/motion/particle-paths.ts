// Deterministic fragment trajectories for the Diverge → Converge → Build scrub.
// Positions are computed once from a fixed seed so server and client render the
// SAME markup (no hydration mismatch) and no per-frame math runs at scroll time —
// Motion only interpolates between these precomputed stops.
//
// Fragments are brand-consistent: methodology words in serif, [NC] marks,
// hairline ticks — never glowing dots. The point is "50 options generated,
// refined to one direction, documented into a system."

export type Fragment = {
  /** rendered content — a word, a mark, or a tick */
  label: string;
  /** is this a serif word (vs a mono mark) */
  serif: boolean;
  /** exploded scatter position, in % of stage (Diverge peak) */
  ex: number;
  ey: number;
  /** funnel/converge position, pulled toward the centre column */
  cx: number;
  cy: number;
  /** final documented-grid cell position (Build) */
  gx: number;
  gy: number;
  /** rotation at the exploded stage (deg) */
  rot: number;
  /** stagger 0..1 — drives per-fragment delay across the scrub */
  stagger: number;
  /** font scale multiplier */
  scale: number;
};

// mulberry32 — tiny deterministic PRNG
function rng(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The exploration vocabulary — what a team generates in Diverge.
const WORDS = [
  "concept", "route", "angle", "draft", "variant", "headline",
  "frame", "cut", "take", "option", "motion", "still",
  "layout", "hook", "line", "board", "look", "pass",
];
const MARKS = ["[NC]", "+", "×", "—", "01", "02", "03", "→"];

const COLS = 9;
const ROWS = 4;
export const FRAGMENT_COUNT = COLS * ROWS; // 36 — busy enough to read as "many", calm when gridded

export const FRAGMENTS: Fragment[] = (() => {
  const rand = rng(20260703);
  const out: Fragment[] = [];
  for (let i = 0; i < FRAGMENT_COUNT; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const isWord = rand() > 0.34;
    const label = isWord
      ? WORDS[Math.floor(rand() * WORDS.length)]!
      : MARKS[Math.floor(rand() * MARKS.length)]!;

    // Exploded: scatter across the stage, biased outward from centre.
    const ang = rand() * Math.PI * 2;
    const radius = 22 + rand() * 30; // 22–52% from centre
    const ex = 50 + Math.cos(ang) * radius;
    const ey = 50 + Math.sin(ang) * radius * 0.62; // flatten vertically for landscape

    // Converge: pulled toward a narrow central column, flowing down.
    const cx = 50 + (rand() - 0.5) * 10;
    const cy = 30 + rand() * 40;

    // Build: snap to a documented grid, centred.
    const gridW = 62; // % width the grid occupies
    const gridH = 46;
    const gx = 50 - gridW / 2 + (col + 0.5) * (gridW / COLS);
    const gy = 50 - gridH / 2 + (row + 0.5) * (gridH / ROWS);

    out.push({
      label,
      serif: isWord,
      ex, ey, cx, cy, gx, gy,
      rot: (rand() - 0.5) * 70,
      stagger: rand(),
      scale: isWord ? 0.9 + rand() * 0.5 : 1,
    });
  }
  return out;
})();

// Grid cell labels for the Build backdrop (documented-system look).
export const GRID_CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const major = Math.floor(i / COLS);
  const minor = (i % COLS) + 1;
  return `NC.${major}.${minor}`;
});

export const GRID_DIMS = { COLS, ROWS };
