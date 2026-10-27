/* eslint-disable */
// @ts-nocheck
// The Two Palms badge as a Hairline figure. Built to the ten rules of lucasmarkes/hairline.
/**
 * Palms: the Two Palms badge as a thick round plate with two palms standing out
 * of it, a tall one at the back-left and a short one at the front-right, as in
 * the mark. The pointer is the wind. The pointer's ground point blows the trees
 * away from it: each trunk bends on a spring, its crown goes with it, and the
 * fronds stream downwind, the upwind ones lifting and the downwind ones
 * drooping. At rest both lean a little into each other, and the tall palm's
 * longest frond is bright; under wind, the frond streaming furthest downwind
 * on the tree nearer the pointer takes the bright. The slider is how far a
 * crown can be pushed, in world units.
 *
 * The pattern: a continuous field. Springs on the lean, a falloff by distance
 * from the pointer on the ground plane (which never moves), and a composed rest.
 */
import HL from "./kernel";

const {
  Cam, clamp, facing, fit, prism, proj, rings, circ, unproj, spring, stepS,
  fillet, poly, open, mk, pointer, put, register, disposer, solid,
} = HL;

const R = 58, PLATE = 4, REACH = 125, SEGS = 8;
const TREES = [
  // base on the plate, height, frond length, frond width, trunk foot and top sizes, rest lean, fronds by azimuth (deg)
  { x: -12, y: 8, H: 70, L: 38, W: 11, f0: 7, f1: 4.6, rest: [-9, 4], az: [205, 250, 290, 335, 20, 65, 120, 160] },
  { x: 22, y: 20, H: 40, L: 24, W: 7.5, f0: 5.4, f1: 3.6, rest: [5, -3], az: [215, 270, 320, 10, 60, 120, 165] },
];
const HI_REST = { tree: 0, frond: 5 }; // the tall palm's frond toward the camera

const unit = (x, y) => { const d = Math.hypot(x, y) || 1; return [x / d, y / d]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  const ext = [];
  for (const t of TREES) for (const [dx, dy] of [[value + 4, 0], [-value - 4, 0], [0, value + 4], [0, -value - 4]])
    ext.push([t.x + dx, t.y + dy, t.H + 6]);
  fit(C, [[-R, -R, -PLATE], [R, -R, -PLATE], [-R, R, -PLATE], [R, R, -PLATE], ...ext], 200, 168);
  const P = proj(C), front = facing(C);
  let MAX = value, over = null;

  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 72), circ(R - 2.2, 72), -PLATE, 0));

  // One flat leaf outline in leaf space: s along the frond, t across it. Rounded once.
  const leaf = (L, W) => fillet(
    [[0, 0], [L * 0.3, W / 2], [L * 0.66, W * 0.4], [L, 0], [L * 0.66, -W * 0.4], [L * 0.3, -W / 2]],
    [1.2, 4, 4, 2, 4, 4], 3,
  );

  const trees = TREES.map((t, ti) => {
    const grp = mk("g", {}, g);
    const sx = spring(t.rest[0]), sy = spring(t.rest[1]);
    const fronds = t.az.map((a, k) => {
      const u = [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)];
      return { u, k, el: null, outline: leaf(t.L, t.W), drawn: NaN };
    });
    // Paint back to front: fronds whose tip has a smaller x + y than the crown go behind the trunk.
    fronds.sort((p, q) => (p.u[0] + p.u[1]) - (q.u[0] + q.u[1]));
    const back = fronds.filter((f) => f.u[0] + f.u[1] < 0), fore = fronds.filter((f) => f.u[0] + f.u[1] >= 0);
    for (const f of back) f.el = solid(grp);
    const segs = [];
    for (let i = 0; i < SEGS; i++) segs.push({ el: solid(grp), z0: (t.H * i) / SEGS, z1: (t.H * (i + 1)) / SEGS, drawn: NaN });
    for (const f of fore) f.el = solid(grp);
    return { ...t, ti, sx, sy, fronds, segs, wind: 0, dir: [0, 0] };
  });

  function drawTree(tr) {
    const lx = tr.sx.x, ly = tr.sy.x;
    const key = Math.round(lx * 50) + "," + Math.round(ly * 50) + "," + Math.round(tr.wind * 40);
    if (key === tr.drawn) return;
    tr.drawn = key;
    const bend = (z) => Math.pow(z / tr.H, 1.7);
    for (const s of tr.segs) {
      const zm = (s.z0 + s.z1) / 2, b = bend(zm), w = tr.f0 + (tr.f1 - tr.f0) * (zm / tr.H);
      const cx = tr.x + lx * b, cy = tr.y + ly * b;
      const [ring, inner] = rings(cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2, w * 0.42, 1);
      put(s.el, prism(P, front, ring, inner, s.z0, s.z1));
    }
    const cx = tr.x + lx, cy = tr.y + ly;
    for (const f of tr.fronds) {
      // Droop: 32° at rest; downwind fronds stream (droop more), upwind ones lift.
      const dw = f.u[0] * tr.dir[0] + f.u[1] * tr.dir[1];
      const droop = (16 + 28 * dw * tr.wind) * Math.PI / 180;
      const cd = Math.cos(droop), sd = Math.sin(droop), v = [-f.u[1], f.u[0]];
      const pts = f.outline.map(([s, tt]) => {
        const sag = 0.034 * s * s; // the tip sags more than the base
        return P(cx + f.u[0] * s * cd + v[0] * tt, cy + f.u[1] * s * cd + v[1] * tt, tr.H - s * sd - sag);
      });
      const rib = [P(cx, cy, tr.H), P(cx + f.u[0] * tr.L * 0.55 * cd, cy + f.u[1] * tr.L * 0.55 * cd, tr.H - tr.L * 0.55 * sd - 0.034 * (tr.L * 0.55) ** 2)];
      put(f.el, { sil: poly(pts), crease: open(rib) });
    }
  }

  let hiTree = HI_REST.tree, hiFrond = HI_REST.frond, hiEl = null;
  function light() {
    const tr = trees[hiTree], f = tr.fronds.find((x) => x.k === hiFrond);
    if (f.el === hiEl) return;
    if (hiEl) hiEl.sil.classList.remove("hi");
    hiEl = f.el;
    hiEl.sil.classList.add("hi");
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const tr of trees) {
      if (stepS(tr.sx, dt)) m = true;
      if (stepS(tr.sy, dt)) m = true;
      drawTree(tr);
    }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let strongest = 0, near = null;
    for (const tr of trees) {
      if (!over) { tr.sx.t = tr.rest[0]; tr.sy.t = tr.rest[1]; tr.wind = 0; tr.dir = [0, 0]; continue; }
      const dx = tr.x - over[0], dy = tr.y - over[1], dist = Math.hypot(dx, dy);
      const w = clamp(1 - dist / REACH, 0, 1), d = unit(dx, dy);
      tr.wind = w; tr.dir = d;
      tr.sx.t = tr.rest[0] * (1 - w) + d[0] * MAX * w;
      tr.sy.t = tr.rest[1] * (1 - w) + d[1] * MAX * w;
      tr.drawn = NaN;
      if (w > strongest) { strongest = w; near = tr; }
    }
    if (over && near && strongest > 0.05) {
      let best = null, bd = -2;
      for (const f of near.fronds) { const dw = f.u[0] * near.dir[0] + f.u[1] * near.dir[1]; if (dw > bd) { bd = dw; best = f; } }
      hiTree = near.ti; hiFrond = best.k;
      read.textContent = `wind ${Math.round(strongest * 10) / 10}`;
    } else { hiTree = HI_REST.tree; hiFrond = HI_REST.frond; read.textContent = "rest"; }
    light();
    B.wake();
  }

  for (const tr of trees) drawTree(tr);
  light();
  read.textContent = "rest";

  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { MAX = v; if (over) retarget(); },
    destroy: bag.dispose,
  };
}

export const palms = {
  name: "palms",
  means: "Two palms on a round plate bend away from the pointer, their fronds streaming downwind.",
  rules: [1, 3, 5, 9],
  range: [10, 16, 24],
  tour: [[96, 150], [300, 176], [214, 262], null],
  mount,
};
