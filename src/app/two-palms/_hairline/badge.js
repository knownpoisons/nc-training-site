/* eslint-disable */
// @ts-nocheck
// Built to the ten rules of lucasmarkes/hairline, on the vendored kernel.
/**
 * Badge: the Two Palms mark, front on, as the logo is read. A round plate
 * standing up to face the camera, and in front of it the two palms: a tall one
 * curving up from the plate's foot to the left, a short one on the right, each a
 * tapered trunk with a crown of fronds. The pointer is the wind, read by where
 * it is across the stage: the nearer tree bends away from it on a spring, its
 * crown goes with it, and the fronds stream downwind. At rest both lean as the
 * mark draws them, and the tall palm's longest frond is bright; under wind the
 * frond streaming furthest downwind on the nearer tree takes the bright. The
 * slider is how far a crown can be pushed, in world units.
 *
 * The camera is the concept: the mark is a flat badge, so the view is the
 * elevation (azimuth 0, almost no tilt), not the 2:1 isometric.
 */
import HL from "./kernel";

const {
  Cam, clamp, fit, proj, spring, stepS, fillet, poly, open, hull, seg,
  mk, pointer, put, register, disposer, solid,
} = HL;

const R = 60, DEPTH = 3, REACH = 150, N = 11;
// Proportions from the mark: tall crown at 43% of the disc height from the top, trunk foot at the rim near 47% across;
// short crown at 76% down, 70% across; short palm about 55% of the tall one.
const TREES = [
  { foot: [0, 0], top: [-18, 76], w0: 7.5, w1: 3.2, L: 46, W: 12, az: [162, 132, 102, 72, 40, 8, -26, -62, -120], rest: 0 },
  { foot: [26, 0], top: [33, 42], w0: 5.2, w1: 2.6, L: 27, W: 8, az: [166, 126, 86, 46, 6, -40], rest: 0 },
];
const HI_REST = { tree: 0, frond: 0 }; // the long one on the upper left, as the mark has it

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(0, 0.09, 2.15);
  fit(C, [[-R, 0, 0], [R, 0, 0], [0, 0, 2 * R], [-R - 4, 0, 0], [R + 4, 0, 0], [-30, 0, 2 * R + 6]], 200, 160);
  const P = proj(C);
  let MAX = value, over = null;

  const g = mk("g", {}, svg);
  // The plate stands up: a circle in the x-z plane, with its rim a few units behind.
  const ring = (y) => { const pts = []; for (let k = 0; k < 72; k++) { const a = (k / 72) * Math.PI * 2; pts.push(P(R * Math.cos(a), y, R + R * Math.sin(a))); } return pts; };
  const inner = []; for (let k = 0; k < 72; k++) { const a = (k / 72) * Math.PI * 2; inner.push(P((R - 2.4) * Math.cos(a), 0, R + (R - 2.4) * Math.sin(a))); }
  put(solid(g), { sil: poly(hull(ring(0).concat(ring(-DEPTH)))), crease: open(inner.slice(0, 37)) });

  const leaf = (L, W) => fillet(
    [[0, 0], [L * 0.3, W / 2], [L * 0.66, W * 0.4], [L, 0], [L * 0.66, -W * 0.4], [L * 0.3, -W / 2]],
    [1, 3.5, 3.5, 1.8, 3.5, 3.5], 3,
  );

  const trees = TREES.map((t, ti) => {
    const grp = mk("g", {}, g);
    const lean = spring(0), fronds = t.az.map((a, k) => ({ a, k, el: null, outline: leaf(t.L, t.W) }));
    // Paint back to front within the crown: the fronds that point away from the camera (upwards) first.
    const back = fronds.filter((f) => f.a > 55 && f.a < 125), fore = fronds.filter((f) => !(f.a > 55 && f.a < 125));
    for (const f of back) f.el = solid(grp);
    const trunk = solid(grp);
    const ticks = mk("path", { class: "nf lo" }, grp);
    for (const f of fore) f.el = solid(grp);
    const sx = P(t.top[0], 10, t.top[1])[0];
    return { ...t, ti, lean, fronds, trunk, ticks, sx, wind: 0, dir: 0, drawn: NaN };
  });

  function drawTree(tr) {
    const lx = tr.lean.x;
    const key = Math.round(lx * 50) + "," + Math.round(tr.wind * 40);
    if (key === tr.drawn) return;
    tr.drawn = key;
    const H = tr.top[1], y = 10 + tr.ti * 4;
    // The trunk's centreline: the mark's curve plus the lean, which grows with height.
    const cx = (z) => { const u = z / H; return tr.foot[0] + (tr.top[0] - tr.foot[0]) * (3 * u * u - 2 * u * u * u) + lx * Math.pow(u, 1.7); };
    const left = [], right = [], tk = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, z = u * H, w = tr.w0 + (tr.w1 - tr.w0) * u, x = cx(z);
      left.push(P(x - w / 2, y, z)); right.push(P(x + w / 2, y, z));
      if (i > 0 && i < N && i % 2 === 0) tk.push(seg(P(x - w / 2 + 0.8, y, z), P(x + w / 2 - 0.8, y, z)));
    }
    put(tr.trunk, { sil: poly(left.concat(right.reverse())), crease: "" });
    tr.ticks.setAttribute("d", tk.join(""));
    const tx = cx(H), tz = H;
    for (const f of tr.fronds) {
      // Downwind fronds stream: they swing with the wind and droop more; upwind ones lift.
      const ux = Math.cos((f.a * Math.PI) / 180), dw = ux * tr.dir;
      const ang = ((f.a + tr.dir * 14 * tr.wind) * Math.PI) / 180;
      const droop = 0.02 + 0.016 * dw * tr.wind; // how fast the frond bends down along its length
      const pts = f.outline.map(([s, tt]) => {
        const px = tx + Math.cos(ang) * s - Math.sin(ang) * tt, pz = tz + Math.sin(ang) * s + Math.cos(ang) * tt - droop * s * s;
        return P(px, y - 1, pz);
      });
      const mid = (s) => P(tx + Math.cos(ang) * s, y - 1, tz + Math.sin(ang) * s - droop * s * s);
      put(f.el, { sil: poly(pts), crease: open([mid(2), mid(tr.L * 0.35), mid(tr.L * 0.62)]) });
    }
  }

  let hiEl = null;
  function light(ti, k) {
    const f = trees[ti].fronds.find((x) => x.k === k);
    if (f.el === hiEl) return;
    if (hiEl) hiEl.sil.classList.remove("hi");
    hiEl = f.el; hiEl.sil.classList.add("hi");
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const tr of trees) { if (stepS(tr.lean, dt)) m = true; drawTree(tr); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let near = null, strongest = 0;
    for (const tr of trees) {
      if (over === null) { tr.lean.t = 0; tr.wind = 0; tr.dir = 0; tr.drawn = NaN; continue; }
      const d = tr.sx - over, w = clamp(1 - Math.abs(d) / REACH, 0, 1), dir = d >= 0 ? 1 : -1;
      tr.wind = w; tr.dir = dir; tr.lean.t = dir * MAX * w; tr.drawn = NaN;
      if (w > strongest) { strongest = w; near = tr; }
    }
    if (near && strongest > 0.05) {
      let best = null, bd = -2;
      for (const f of near.fronds) { const dw = Math.cos((f.a * Math.PI) / 180) * near.dir; if (dw > bd) { bd = dw; best = f; } }
      light(near.ti, best.k);
      read.textContent = `wind ${Math.round(strongest * 10) / 10}`;
    } else { light(HI_REST.tree, HI_REST.frond); read.textContent = "rest"; }
    B.wake();
  }

  for (const tr of trees) drawTree(tr);
  light(HI_REST.tree, HI_REST.frond);
  read.textContent = "rest";

  bag.add(pointer(stage, {
    move: (p) => { over = p[0]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { MAX = v; if (over !== null) retarget(); }, destroy: bag.dispose };
}

export const badge = {
  name: "badge",
  means: "The Two Palms mark, front on: two palms on a round plate bend away from the pointer.",
  rules: [1, 3, 5, 9],
  range: [8, 14, 22],
  tour: [[70, 150], [330, 150], [200, 230], null],
  mount,
};
