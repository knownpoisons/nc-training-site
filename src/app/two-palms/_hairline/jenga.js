/* eslint-disable */
// @ts-nocheck
// Built to the ten rules of lucasmarkes/hairline, on the vendored kernel.
/**
 * Jenga: a tower of eighteen blocks in six layers of three, each layer turned a
 * quarter from the one below. The pointer picks the block nearest it; that block
 * slides out along its length on a spring and its two neighbours follow it a
 * little, the nearer more. At rest two blocks sit part way out, as a tower does
 * mid-game, and the furthest-out one is bright; when the pointer chooses, the
 * bright goes to the chosen block. The slider is how far a block comes out, in
 * world units.
 *
 * The pattern: discrete items. The hit test is on the rest pose (the blocks'
 * rest centres on screen), the slide is a spring because the pointer's
 * nearness is continuous, and rest is a composition.
 */
import HL from "./kernel";

const {
  Cam, clamp, facing, fit, prism, proj, rings, spring, stepS,
  mk, pointer, put, register, disposer, solid,
} = HL;

const LAYERS = 6, PER = 3, LONG = 36, WIDE = 12, HIGH = 7, GAP = 0.6;
const REST = { "1,0": 9, "4,2": 5 }; // layer,index → how far out at rest

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.4);
  const ext = LONG + value + 2;
  fit(C, [[-2, -2, 0], [ext, ext, 0], [-2, ext, 0], [ext, -2, 0], [LONG / 2, LONG / 2, LAYERS * HIGH + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  let MAX = value, chosen = null;

  const g = mk("g", {}, svg);
  const blocks = [];
  for (let l = 0; l < LAYERS; l++) {
    const alongX = l % 2 === 0, z0 = l * HIGH, z1 = z0 + HIGH - 0.4;
    const layer = [];
    for (let i = 0; i < PER; i++) {
      const o = i * WIDE + GAP;
      const box = alongX ? [0, o, LONG, o + WIDE - 2 * GAP] : [o, 0, o + WIDE - 2 * GAP, LONG];
      const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
      const key = l + "," + i, rest = REST[key] || 0;
      layer.push({ l, i, key, alongX, box, z0, z1, rest, sp: spring(rest, { eps: 0.02 }), el: null, drawn: NaN, sx: P(cx, cy, (z0 + z1) / 2) });
    }
    // Paint back to front within the layer: ascending x + y of the block's centre.
    layer.sort((a, b) => (a.box[0] + a.box[2] + a.box[1] + a.box[3]) - (b.box[0] + b.box[2] + b.box[1] + b.box[3]));
    for (const b of layer) { b.el = solid(g); blocks.push(b); }
  }

  function draw(b) {
    const out = b.sp.x;
    if (out === b.drawn) return;
    b.drawn = out;
    const dx = b.alongX ? out : 0, dy = b.alongX ? 0 : out;
    const [ring, inner] = rings(b.box[0] + dx, b.box[1] + dy, b.box[2] + dx, b.box[3] + dy, 1.4, 1);
    put(b.el, prism(P, front, ring, inner, b.z0, b.z1));
  }

  let hiEl = null;
  function light(b) {
    if (b.el === hiEl) return;
    if (hiEl) hiEl.sil.classList.remove("hi");
    hiEl = b.el; hiEl.sil.classList.add("hi");
  }
  const restBright = blocks.reduce((a, b) => (b.rest > a.rest ? b : a));

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of blocks) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const b of blocks) {
      if (!chosen) { b.sp.t = b.rest; continue; }
      if (b === chosen) { b.sp.t = MAX; continue; }
      if (b.l === chosen.l) { b.sp.t = MAX * (0.3 - 0.1 * (Math.abs(b.i - chosen.i) - 1)); continue; }
      b.sp.t = 0;
    }
    if (chosen) { light(chosen); read.textContent = `block ${chosen.l + 1}·${chosen.i + 1}`; }
    else { light(restBright); read.textContent = "rest"; }
    B.wake();
  }

  for (const b of blocks) draw(b);
  light(restBright);
  read.textContent = "rest";

  bag.add(pointer(stage, {
    move: (p) => {
      let best = null, bd = 1e9;
      for (const b of blocks) { const d = Math.hypot(b.sx[0] - p[0], b.sx[1] - p[1]); if (d < bd) { bd = d; best = b; } }
      const next = bd < 26 ? best : null;
      if (next !== chosen) { chosen = next; retarget(); }
    },
    leave: () => { chosen = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return { set: (v) => { MAX = v; if (chosen) retarget(); }, destroy: bag.dispose };
}

export const jenga = {
  name: "jenga",
  means: "A tower of blocks; the one under the pointer slides out and its neighbours follow a little.",
  rules: [1, 2, 5, 9],
  range: [10, 16, 24],
  tour: [[150, 230], [250, 130], [185, 170], null],
  mount,
};
