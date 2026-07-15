// ─── Camera Movement Finder data ─────────────────────────────────────────────
// 45 standard filmmaking camera moves, written for AI video generation.
// Every description and prompt here is original NotContent copy (British
// spelling). The prompt is the CAMERA INSTRUCTION ONLY — keep it separate from
// your scene so you can reuse it across Kling, Runway, Veo, Seedance, etc.
//
// Video upgrade path: drop `<slug>.mp4` (+ optional `<slug>.jpg` poster) into
// public/videos/library/camera-movements/ and redeploy — the card upgrades
// from diagram to looping video automatically. An explicit videoSrc here wins.

export type CategoryId =
  | "pan-tilt"
  | "zoom-lens"
  | "dolly-track"
  | "physical"
  | "drone-crane"
  | "specials";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "dolly-track", label: "Dolly / Track" },
  { id: "physical", label: "Physical Moves" },
  { id: "pan-tilt", label: "Pan / Tilt" },
  { id: "zoom-lens", label: "Zoom / Lens" },
  { id: "drone-crane", label: "Drone / Crane" },
  { id: "specials", label: "Specials" },
];

// ─── Diagram spec ─────────────────────────────────────────────────────────────
// Drives the single parametric <MovementDiagram/>. Eight shared kinds cover
// forty movements; the six Specials get bespoke sub-renders.

export type DiagramKind =
  | "static"
  | "rotate" // camera fixed, view cone sweeps (pan, whip pan, tilt)
  | "linear" // camera translates along a straight guide
  | "arc" // partial sweep around the subject
  | "orbit" // full circle around the subject
  | "zoom" // camera fixed, frame rings converge / expand
  | "follow" // camera and subject both travel
  | "shake" // handheld jitter loop
  | "fpv"
  | "tiltShift"
  | "infiniteZoom"
  | "earthZoom"
  | "timeLapse"
  | "passThrough";

export interface DiagramSpec {
  kind: DiagramKind;
  /** "plan" = top-down (default) · "side" = elevation with ground line */
  view?: "plan" | "side";
  direction?: "left" | "right" | "up" | "down" | "in" | "out" | "cw" | "ccw";
  /** slow = 6s, normal = 4s, fast = 1.6s loop */
  speed?: "slow" | "normal" | "fast";
  ease?: "linear" | "easeInOut" | "whip";
  /** follow kind only — how the subject travels relative to the camera */
  subjectMotion?: "withCamera" | "toward" | "away";
  /** motion-blur hairlines for whip pans / crash zooms */
  streaks?: boolean;
}

export interface Movement {
  slug: string;
  title: string;
  category: CategoryId;
  /** 1–2 sentences, editorial voice */
  description: string;
  /** Camera instruction only — scene-agnostic, paste-able */
  prompt: string;
  /** Search synonyms */
  tags: string[];
  diagram: DiagramSpec;
  /** Explicit overrides — normally auto-discovered from public/videos/library/camera-movements/<slug>.mp4 */
  videoSrc?: string;
  posterSrc?: string;
}

// ─── The 45 ──────────────────────────────────────────────────────────────────

export const MOVEMENTS: Movement[] = [
  // ── Pan / Tilt (7) ──────────────────────────────────────────────────────────
  {
    slug: "static-shot",
    title: "Static shot",
    category: "pan-tilt",
    description:
      "The camera doesn't move at all — everything that happens, happens inside the frame. The hardest one to get from an AI model, and the foundation of every other move.",
    prompt:
      "Static shot. The camera is locked off on a tripod and does not move — no pan, no tilt, no zoom, no drift. All motion comes from within the scene. Framing stays identical from first frame to last.",
    tags: ["locked off", "tripod", "fixed", "no movement", "still"],
    diagram: { kind: "static", view: "plan" },
  },
  {
    slug: "pan-right",
    title: "Pan right",
    category: "pan-tilt",
    description:
      "The camera stays planted and rotates to the right, sweeping the frame across the scene like turning your head.",
    prompt:
      "Slow pan right. The camera stays fixed in place and rotates smoothly to the right at a steady speed, sweeping horizontally across the scene. No forward or sideways travel — rotation only. Ends settled on the new framing.",
    tags: ["rotate", "sweep", "horizontal", "turn"],
    diagram: { kind: "rotate", view: "plan", direction: "right", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "pan-left",
    title: "Pan left",
    category: "pan-tilt",
    description:
      "Same planted rotation, sweeping left. Useful for reveals that read right-to-left or for returning from one.",
    prompt:
      "Slow pan left. The camera stays fixed in place and rotates smoothly to the left at a steady speed, sweeping horizontally across the scene. No forward or sideways travel — rotation only. Ends settled on the new framing.",
    tags: ["rotate", "sweep", "horizontal", "turn"],
    diagram: { kind: "rotate", view: "plan", direction: "left", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "whip-pan-right",
    title: "Whip pan — right",
    category: "pan-tilt",
    description:
      "A violent, blurred snap of rotation to the right. The blur is the point — it hides a cut, injects energy, or slams attention onto something new.",
    prompt:
      "Whip pan right. From a settled frame, the camera snaps its rotation hard to the right in a fraction of a second, streaking the image with horizontal motion blur, then stops dead on a new subject. Fast, aggressive, decisive.",
    tags: ["swish pan", "fast", "blur", "snap", "transition"],
    diagram: { kind: "rotate", view: "plan", direction: "right", speed: "fast", ease: "whip", streaks: true },
  },
  {
    slug: "whip-pan-left",
    title: "Whip pan — left",
    category: "pan-tilt",
    description:
      "The same blurred snap, mirrored. Pair one of each around a cut and two shots feel like a single move.",
    prompt:
      "Whip pan left. From a settled frame, the camera snaps its rotation hard to the left in a fraction of a second, streaking the image with horizontal motion blur, then stops dead on a new subject. Fast, aggressive, decisive.",
    tags: ["swish pan", "fast", "blur", "snap", "transition"],
    diagram: { kind: "rotate", view: "plan", direction: "left", speed: "fast", ease: "whip", streaks: true },
  },
  {
    slug: "tilt-up",
    title: "Tilt up",
    category: "pan-tilt",
    description:
      "The camera pivots upward from a fixed point — floor to face, face to skyline. The classic way to make something feel tall.",
    prompt:
      "Tilt up. The camera stays fixed in position and pivots smoothly upward at a steady speed, travelling from a low framing to a higher one. No lift, no travel — rotation on the horizontal axis only. Ends settled on the upper framing.",
    tags: ["pivot", "vertical", "look up", "reveal height"],
    diagram: { kind: "rotate", view: "side", direction: "up", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "tilt-down",
    title: "Tilt down",
    category: "pan-tilt",
    description:
      "The downward pivot — from the wide world to the detail at your feet. Often the quiet close of a scene.",
    prompt:
      "Tilt down. The camera stays fixed in position and pivots smoothly downward at a steady speed, travelling from a high framing to a lower one. No descent, no travel — rotation on the horizontal axis only. Ends settled on the lower framing.",
    tags: ["pivot", "vertical", "look down"],
    diagram: { kind: "rotate", view: "side", direction: "down", speed: "normal", ease: "easeInOut" },
  },

  // ── Zoom / Lens (6) ─────────────────────────────────────────────────────────
  {
    slug: "slow-zoom-in",
    title: "Slow zoom in",
    category: "zoom-lens",
    description:
      "The lens tightens gradually while the camera stays put. Builds pressure without announcing itself — the audience leans in before they know why.",
    prompt:
      "Slow zoom in. The camera body stays completely still while the lens focal length increases very gradually, tightening the frame on the subject. Even, creeping pace throughout — no physical movement, no perspective shift. Ends on the tighter composition.",
    tags: ["push", "tighten", "creep", "tension"],
    diagram: { kind: "zoom", direction: "in", speed: "slow", ease: "linear" },
  },
  {
    slug: "slow-zoom-out",
    title: "Slow zoom out",
    category: "zoom-lens",
    description:
      "The frame widens by degrees, revealing context around the subject. The slower it goes, the heavier the reveal lands.",
    prompt:
      "Slow zoom out. The camera body stays completely still while the lens focal length decreases very gradually, widening the frame around the subject to reveal more of the scene. Even, creeping pace throughout — no physical movement. Ends on the wider composition.",
    tags: ["widen", "reveal", "pull", "context"],
    diagram: { kind: "zoom", direction: "out", speed: "slow", ease: "linear" },
  },
  {
    slug: "fast-zoom-in",
    title: "Fast zoom in",
    category: "zoom-lens",
    description:
      "A quick, confident tighten onto the subject. More energy than a slow zoom, more control than a crash.",
    prompt:
      "Fast zoom in. The camera body stays still while the lens zooms quickly and smoothly toward the main subject, tightening the frame in roughly a second. Controlled and deliberate — brisk, not violent. Ends locked on the tight framing.",
    tags: ["quick", "punch in", "tighten"],
    diagram: { kind: "zoom", direction: "in", speed: "fast", ease: "easeInOut" },
  },
  {
    slug: "fast-zoom-out",
    title: "Fast zoom out",
    category: "zoom-lens",
    description:
      "The quick widening — subject to setting in about a second. Good for comic beats and scale reveals that shouldn't linger.",
    prompt:
      "Fast zoom out. The camera body stays still while the lens zooms quickly and smoothly away from the subject, widening the frame in roughly a second to show the surrounding scene. Controlled and deliberate. Ends locked on the wide framing.",
    tags: ["quick", "widen", "reveal"],
    diagram: { kind: "zoom", direction: "out", speed: "fast", ease: "easeInOut" },
  },
  {
    slug: "crash-zoom-in",
    title: "Crash zoom — in",
    category: "zoom-lens",
    description:
      "The lens slams onto the subject with visible blur. Loud, cheap in the best way, and unmistakably intentional.",
    prompt:
      "Crash zoom in. The lens snaps violently toward the main subject in a fraction of a second, with visible motion blur during the zoom, then stops hard on a tight framing. Abrupt and punchy — the speed itself is the effect. Camera body does not move.",
    tags: ["snap zoom", "violent", "blur", "punch"],
    diagram: { kind: "zoom", direction: "in", speed: "fast", ease: "whip", streaks: true },
  },
  {
    slug: "crash-zoom-out",
    title: "Crash zoom — out",
    category: "zoom-lens",
    description:
      "The reverse slam — tight to wide before the eye can follow. Undercuts a moment or gags a reveal.",
    prompt:
      "Crash zoom out. The lens snaps violently away from the subject in a fraction of a second, with visible motion blur during the zoom, then stops hard on a wide framing that reveals the full scene. Abrupt and punchy. Camera body does not move.",
    tags: ["snap zoom", "violent", "blur", "reveal"],
    diagram: { kind: "zoom", direction: "out", speed: "fast", ease: "whip", streaks: true },
  },

  // ── Dolly / Track (9) ───────────────────────────────────────────────────────
  {
    slug: "dolly-in",
    title: "Dolly in",
    category: "dolly-track",
    description:
      "The whole camera travels forward toward the subject. Unlike a zoom, the perspective shifts as it moves — the world slides past the edges of frame. This is the one that feels like walking closer.",
    prompt:
      "Dolly in. The camera physically travels forward toward the subject at a slow, steady pace, as if on rails. Perspective shifts naturally as it moves — foreground elements slide past the frame edges. No zoom, no rotation. Ends settled at the closer framing.",
    tags: ["push in", "rails", "travel forward", "approach"],
    diagram: { kind: "linear", view: "plan", direction: "in", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "dolly-out",
    title: "Dolly out",
    category: "dolly-track",
    description:
      "The camera physically retreats from the subject, letting the scene grow around them. The classic ending move — the world gets bigger, the person gets smaller.",
    prompt:
      "Dolly out. The camera physically travels backward away from the subject at a slow, steady pace, as if on rails. The scene expands around the subject as the camera retreats, with natural perspective shift. No zoom, no rotation. Ends settled at the wider framing.",
    tags: ["pull back", "rails", "retreat", "reveal"],
    diagram: { kind: "linear", view: "plan", direction: "out", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "tracking-shot",
    title: "Tracking shot",
    category: "dolly-track",
    description:
      "The camera travels with a moving subject, holding them in frame at a constant distance. The scene streams past; they stay anchored.",
    prompt:
      "Tracking shot. The camera travels smoothly alongside the moving subject, matching their pace exactly so they hold a constant position and size in frame while the environment streams past. Stable, rail-smooth motion. The subject never drifts out of frame.",
    tags: ["track", "travel with", "match pace", "moving subject"],
    diagram: { kind: "follow", view: "plan", direction: "right", speed: "normal", subjectMotion: "withCamera" },
  },
  {
    slug: "follow-shot",
    title: "Follow shot",
    category: "dolly-track",
    description:
      "The camera falls in behind the subject and follows their route — over the shoulder, into whatever they're walking toward.",
    prompt:
      "Follow shot from behind. The camera travels directly behind the moving subject at a fixed distance, over-the-shoulder height, following their exact route as they move through the scene. Smooth, steady pursuit — the subject stays centred, their destination visible beyond them.",
    tags: ["over the shoulder", "behind", "pursue", "third person"],
    diagram: { kind: "follow", view: "plan", direction: "in", speed: "normal", subjectMotion: "withCamera" },
  },
  {
    slug: "reverse-tracking",
    title: "Reverse tracking",
    category: "dolly-track",
    description:
      "The camera retreats in front of a walking subject, holding their face as the world unspools behind them. The walk-and-talk.",
    prompt:
      "Reverse tracking shot. The camera travels smoothly backward, staying directly in front of the moving subject and matching their walking pace, keeping their face in a steady framing while the background recedes behind them. Rail-smooth, constant distance throughout.",
    tags: ["walk and talk", "backward", "lead", "face"],
    diagram: { kind: "follow", view: "plan", direction: "out", speed: "normal", subjectMotion: "toward" },
  },
  {
    slug: "side-tracking",
    title: "Side tracking",
    category: "dolly-track",
    description:
      "The camera runs parallel to the subject, side-on, like a profile portrait in motion. Great for journeys and montage legs.",
    prompt:
      "Side tracking shot. The camera travels laterally, parallel to the moving subject, holding them in profile at a constant distance and matching their pace. The environment streams past in the background. Smooth, level, rail-like motion throughout.",
    tags: ["lateral", "parallel", "profile", "side on"],
    diagram: { kind: "follow", view: "plan", direction: "right", speed: "normal", subjectMotion: "withCamera" },
  },
  {
    slug: "low-tracking",
    title: "Low tracking",
    category: "dolly-track",
    description:
      "The same travelling move, dropped to ankle height. Ground rushes through the bottom of frame and everything above feels monumental.",
    prompt:
      "Low tracking shot. The camera travels smoothly alongside the moving subject from very low to the ground — ankle height — angled slightly upward, matching their pace. The ground surface rushes through the lower frame while the subject looms above. Stable, rail-like motion.",
    tags: ["ground level", "ankle", "low angle", "hero"],
    diagram: { kind: "follow", view: "side", direction: "right", speed: "normal", subjectMotion: "withCamera" },
  },
  {
    slug: "vehicle-tracking",
    title: "Vehicle tracking",
    category: "dolly-track",
    description:
      "The camera paces a moving vehicle, holding it steady in frame while the road and scenery blur past. The car-commercial staple.",
    prompt:
      "Vehicle tracking shot. The camera travels alongside a moving vehicle at matching speed, holding it at a constant position and size in frame while the road surface and scenery stream past with motion blur. Smooth, stabilised, chase-car feel. The vehicle never leaves frame.",
    tags: ["car", "chase car", "road", "automotive"],
    diagram: { kind: "follow", view: "plan", direction: "right", speed: "fast", subjectMotion: "withCamera" },
  },
  {
    slug: "chase-shot",
    title: "Chase shot",
    category: "dolly-track",
    description:
      "A fast, close pursuit of a fleeing subject. The camera barely keeps up — and that struggle is the energy.",
    prompt:
      "Chase shot. The camera pursues the fast-moving subject from close behind, travelling at high speed, swaying slightly with the effort of keeping up. The subject shifts within frame as the camera fights to hold them. Urgent, kinetic, breathless pacing throughout.",
    tags: ["pursuit", "run", "fast", "action"],
    diagram: { kind: "follow", view: "plan", direction: "in", speed: "fast", subjectMotion: "away" },
  },

  // ── Physical Moves (10) ─────────────────────────────────────────────────────
  {
    slug: "truck-right",
    title: "Truck right",
    category: "physical",
    description:
      "The whole camera slides right on a horizontal path, facing forward the entire time. The frame glides across the scene like a window moving along a wall.",
    prompt:
      "Truck right. The camera travels laterally to the right along a straight horizontal path while continuing to face forward — no rotation. The scene slides across the frame with natural parallax between foreground and background. Smooth, level, constant speed.",
    tags: ["lateral", "slide", "crab", "sideways"],
    diagram: { kind: "linear", view: "plan", direction: "right", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "truck-left",
    title: "Truck left",
    category: "physical",
    description:
      "The same lateral glide, moving left. Parallax between foreground and background does the visual work.",
    prompt:
      "Truck left. The camera travels laterally to the left along a straight horizontal path while continuing to face forward — no rotation. The scene slides across the frame with natural parallax between foreground and background. Smooth, level, constant speed.",
    tags: ["lateral", "slide", "crab", "sideways"],
    diagram: { kind: "linear", view: "plan", direction: "left", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "pedestal-up",
    title: "Pedestal up",
    category: "physical",
    description:
      "The entire camera rises vertically — no tilt, no travel — like a lift. The eyeline climbs and the composition re-stacks as it goes.",
    prompt:
      "Pedestal up. The entire camera rises smoothly along a vertical path while continuing to face directly forward — no tilting. The framing elevates evenly, as if the camera is on a lift, changing the vertical composition as it climbs. Constant, steady speed.",
    tags: ["rise", "elevate", "vertical", "boom up"],
    diagram: { kind: "linear", view: "side", direction: "up", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "pedestal-down",
    title: "Pedestal down",
    category: "physical",
    description:
      "The vertical descent. The camera sinks level and straight, bringing high framing down to eye level or below.",
    prompt:
      "Pedestal down. The entire camera descends smoothly along a vertical path while continuing to face directly forward — no tilting. The framing lowers evenly, as if the camera is on a lift, changing the vertical composition as it sinks. Constant, steady speed.",
    tags: ["descend", "sink", "vertical", "boom down"],
    diagram: { kind: "linear", view: "side", direction: "down", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "slider-right",
    title: "Slider right",
    category: "physical",
    description:
      "A short, precise lateral drift to the right — a truck in miniature. The move you barely notice, which is exactly why it works on product and detail shots.",
    prompt:
      "Slider move right. The camera drifts a short distance to the right along a perfectly smooth horizontal rail, facing forward throughout. Subtle, elegant, slow — just enough lateral travel to create gentle parallax across the subject. No rotation, no bounce.",
    tags: ["drift", "subtle", "rail", "product"],
    diagram: { kind: "linear", view: "plan", direction: "right", speed: "slow", ease: "easeInOut" },
  },
  {
    slug: "push-past",
    title: "Push past",
    category: "physical",
    description:
      "The camera drives forward past a foreground object — a doorframe, a shoulder, a branch — and lets it wipe the frame on the way to the real subject.",
    prompt:
      "Push past. The camera travels steadily forward, passing close beside a foreground element so it slides across and out of frame, then continues on to reveal the main subject beyond. The foreground pass creates a natural wipe. Smooth, continuous forward motion.",
    tags: ["pass by", "foreground wipe", "reveal", "through"],
    diagram: { kind: "linear", view: "plan", direction: "in", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "arc-right",
    title: "Arc right",
    category: "physical",
    description:
      "The camera sweeps a partial circle around the subject to the right, keeping them centred while the background rotates behind them.",
    prompt:
      "Arc right. The camera travels along a smooth curved path around the subject, moving to the right while staying aimed at them, keeping them centred as the background rotates behind. A partial orbit — roughly a quarter circle — at constant radius and speed.",
    tags: ["curve", "sweep", "partial orbit", "around"],
    diagram: { kind: "arc", view: "plan", direction: "cw", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "arc-left",
    title: "Arc left",
    category: "physical",
    description:
      "The mirrored sweep. Arcs give a subject dimension without the full carousel of an orbit.",
    prompt:
      "Arc left. The camera travels along a smooth curved path around the subject, moving to the left while staying aimed at them, keeping them centred as the background rotates behind. A partial orbit — roughly a quarter circle — at constant radius and speed.",
    tags: ["curve", "sweep", "partial orbit", "around"],
    diagram: { kind: "arc", view: "plan", direction: "ccw", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "orbit-clockwise",
    title: "Orbit — clockwise",
    category: "physical",
    description:
      "A full, even circle around the subject, clockwise, camera locked on them the whole way round. The AI-video signature move — models love it.",
    prompt:
      "Orbit clockwise. The camera travels a complete, even circle around the subject in a clockwise direction at constant radius, height and speed, staying aimed at them throughout so they remain centred while the entire environment rotates behind them.",
    tags: ["360", "circle", "rotate around", "carousel"],
    diagram: { kind: "orbit", view: "plan", direction: "cw", speed: "slow", ease: "linear" },
  },
  {
    slug: "orbit-counterclockwise",
    title: "Orbit — counter-clockwise",
    category: "physical",
    description:
      "The same full circle, anticlockwise. Direction matters when you're cutting orbits together — alternate them and the sequence breathes.",
    prompt:
      "Orbit counter-clockwise. The camera travels a complete, even circle around the subject in an anticlockwise direction at constant radius, height and speed, staying aimed at them throughout so they remain centred while the entire environment rotates behind them.",
    tags: ["360", "circle", "anticlockwise", "carousel"],
    diagram: { kind: "orbit", view: "plan", direction: "ccw", speed: "slow", ease: "linear" },
  },

  // ── Drone / Crane (5) ───────────────────────────────────────────────────────
  {
    slug: "crane-up",
    title: "Crane up",
    category: "drone-crane",
    description:
      "The camera lifts up and away through open space, usually easing back as it rises. The scene resolves into geography.",
    prompt:
      "Crane up. The camera rises smoothly through open air, lifting up and slightly back from the scene in one continuous sweep, the view widening as altitude increases. Gentle acceleration, then a settled finish looking down over the scene. Fluid, weightless motion.",
    tags: ["jib", "rise", "aerial", "lift"],
    diagram: { kind: "linear", view: "side", direction: "up", speed: "slow", ease: "easeInOut" },
  },
  {
    slug: "crane-down",
    title: "Crane down",
    category: "drone-crane",
    description:
      "The descent from overview into the scene — geography first, then the human detail inside it.",
    prompt:
      "Crane down. The camera descends smoothly through open air from a high position, sweeping down and slightly forward into the scene in one continuous move, the framing narrowing from overview toward ground-level detail. Fluid, weightless, evenly paced.",
    tags: ["jib", "descend", "aerial", "lower"],
    diagram: { kind: "linear", view: "side", direction: "down", speed: "slow", ease: "easeInOut" },
  },
  {
    slug: "drone-push-in",
    title: "Drone push in",
    category: "drone-crane",
    description:
      "A flying approach — the camera glides forward through the air toward the subject, covering distance no dolly could.",
    prompt:
      "Drone push in. The camera flies smoothly forward through open air toward the subject, gliding at a steady altitude and closing distance in one continuous, stabilised move. Slight floating quality, no jitter. Ends approaching a closer framing of the subject.",
    tags: ["fly forward", "aerial approach", "glide"],
    diagram: { kind: "linear", view: "side", direction: "in", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "drone-pull-back",
    title: "Drone pull back",
    category: "drone-crane",
    description:
      "The airborne retreat. The subject shrinks into their surroundings as the camera flies backward and often climbs — the scale reveal.",
    prompt:
      "Drone pull back. The camera flies smoothly backward through open air away from the subject, often gaining a little altitude as it retreats, so the subject shrinks into a widening landscape in one continuous, stabilised move. Floating, effortless, evenly paced.",
    tags: ["fly backward", "aerial reveal", "scale"],
    diagram: { kind: "linear", view: "side", direction: "out", speed: "normal", ease: "easeInOut" },
  },
  {
    slug: "helicopter-shot",
    title: "Helicopter shot",
    category: "drone-crane",
    description:
      "High altitude, broad sweeping path over the landscape. The establishing shot at its most cinematic — motion measured in postcodes, not metres.",
    prompt:
      "Helicopter shot. The camera travels along a broad, sweeping flight path at high altitude above the scene, moving fast over the landscape in one continuous aerial pass, with a slow drift in heading as it goes. Vast scale, stabilised motion, epic establishing feel.",
    tags: ["aerial", "flyover", "establishing", "landscape"],
    diagram: { kind: "orbit", view: "plan", direction: "cw", speed: "slow", ease: "linear" },
  },

  // ── Specials (8: handheld + snorricam folded in from the old Human category) ─
  {
    slug: "handheld",
    title: "Handheld",
    category: "specials",
    description:
      "The camera breathes — held at eye height with the natural sway and micro-shake of a human operator. Instant documentary energy.",
    prompt:
      "Handheld shot. The camera is held by a human operator at eye height, with natural micro-shake, gentle sway and small corrective drifts throughout. Framing is alive but controlled — documentary energy, not chaos. Motion never fully settles.",
    tags: ["shaky", "documentary", "organic", "verite"],
    diagram: { kind: "shake", view: "plan", speed: "normal" },
  },
  {
    slug: "snorricam",
    title: "Snorricam",
    category: "specials",
    description:
      "The camera is rigged to the subject's body, facing them — they stay locked dead-centre while the whole world lurches around them. Disorienting by design.",
    prompt:
      "Snorricam shot. The camera is fixed rigidly to the subject's body, facing them, so their face and torso stay perfectly locked in frame while the entire background swings, bobs and lurches around them as they move. Disorienting, subjective, dreamlike energy.",
    tags: ["body mount", "body rig", "locked face", "disorienting"],
    diagram: { kind: "shake", view: "plan", speed: "normal", subjectMotion: "withCamera" },
  },

  {
    slug: "first-person-view",
    title: "First-person view",
    category: "specials",
    description:
      "The camera is the character. Eye height, walking pace, looking where they look — the audience wears the scene.",
    prompt:
      "First-person view. The camera moves forward at walking pace from a character's exact eye height, seeing precisely what they see — subtle head bob, natural gaze drift toward points of interest, hands occasionally entering the lower frame. Immersive, embodied, continuous motion.",
    tags: ["POV", "fpv", "eye level", "immersive", "gaming"],
    diagram: { kind: "fpv", view: "plan", speed: "normal" },
  },
  {
    slug: "tilt-shift",
    title: "Tilt-shift",
    category: "specials",
    description:
      "A high angle plus a razor-thin band of focus turns the real world into a miniature. Cities become train sets.",
    prompt:
      "Tilt-shift miniature effect. The camera looks down on the scene from a high angle, with an extremely narrow horizontal band of sharp focus across the middle of frame and heavy blur above and below it, making the scene read as a tiny scale model. Camera static or drifting very slowly.",
    tags: ["miniature", "diorama", "selective focus", "toy"],
    diagram: { kind: "tiltShift", view: "side", speed: "slow" },
  },
  {
    slug: "infinite-zoom",
    title: "Infinite zoom",
    category: "specials",
    description:
      "The zoom that never lands — the frame keeps tunnelling into the centre of the image, scene inside scene. Pure AI-era spectacle.",
    prompt:
      "Infinite zoom. The camera zooms continuously inward toward the centre of frame without ever stopping, each layer of the scene dissolving seamlessly into a new scene nested inside it, maintaining constant zoom speed so the motion feels endless and hypnotic.",
    tags: ["endless", "tunnel", "seamless", "loop", "fractal"],
    diagram: { kind: "infiniteZoom", speed: "normal" },
  },
  {
    slug: "earth-zoom-out",
    title: "Earth zoom out",
    category: "specials",
    description:
      "From a face to the whole planet in one continuous pull — street, city, coastline, cloud, orbit. The ultimate scale move.",
    prompt:
      "Earth zoom out. Starting close on the subject, the camera pulls continuously upward and away through accelerating scales — rooftops, then the city grid, then coastline and cloud cover, ending in high orbit with the curve of the Earth. One unbroken, accelerating ascent.",
    tags: ["planet", "space", "scale", "google earth", "pull to orbit"],
    diagram: { kind: "earthZoom", speed: "normal" },
  },
  {
    slug: "time-lapse",
    title: "Time-lapse",
    category: "specials",
    description:
      "The camera holds still while time sprints — clouds streak, shadows wheel, crowds become rivers. Motion made of hours, not movement.",
    prompt:
      "Time-lapse. The camera is locked off and completely static while time passes at extreme speed within the frame — clouds streaking across the sky, shadows wheeling, light shifting from one condition to another, crowds and traffic reduced to flowing streams.",
    tags: ["timelapse", "hyperspeed", "clouds", "static", "passage of time"],
    diagram: { kind: "timeLapse", view: "side", speed: "normal" },
  },
  {
    slug: "pass-through",
    title: "Pass-through",
    category: "specials",
    description:
      "The camera glides forward straight through something solid — a window, a wall, a keyhole — and out into the space beyond. Impossible on set, trivial for a model.",
    prompt:
      "Pass-through shot. The camera glides steadily forward and passes directly through a solid obstacle — glass, wall or narrow opening — without cutting, emerging seamlessly into the space beyond and continuing the same smooth forward motion. One continuous, impossible move.",
    tags: ["through wall", "through window", "impossible", "seamless"],
    diagram: { kind: "passThrough", view: "plan", speed: "normal" },
  },
];

export const CATEGORY_COUNTS: Record<CategoryId, number> = MOVEMENTS.reduce(
  (acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1;
    return acc;
  },
  {} as Record<CategoryId, number>
);
