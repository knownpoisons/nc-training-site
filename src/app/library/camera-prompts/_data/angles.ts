// Camera Angle Finder — 45 standard photographic angles and framings for AI
// still-image generation (Midjourney, Flux, Imagen, GPT-image and friends).
// All copy is original NotContent writing. Each `prompt` is the camera/framing
// instruction ONLY — scene-agnostic, written to paste in front of any subject
// description without edits.

export type AngleCategoryId =
  | "angle-height"
  | "framing-distance"
  | "perspective-position"
  | "lens-optics"
  | "composition";

export const ANGLE_CATEGORIES: { id: AngleCategoryId; label: string }[] = [
  { id: "angle-height", label: "Angle & Height" },
  { id: "framing-distance", label: "Framing & Distance" },
  { id: "perspective-position", label: "Perspective & Position" },
  { id: "lens-optics", label: "Lens & Optics" },
  { id: "composition", label: "Composition" },
];

export type UseCase = "product" | "lifestyle" | "world-building";

export const USE_CASES: { id: UseCase; label: string }[] = [
  { id: "product", label: "Product" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "world-building", label: "World building" },
];

// Diagram spec — drives a parametric SVG (camera glyph + subject + view cone).
// Choose values that honestly depict the angle. view "side" = elevation (shows
// height/tilt), "plan" = top-down (shows position around subject).
export interface AngleDiagramSpec {
  view: "side" | "plan";
  /** where the camera sits relative to the subject */
  camera:
    | "ground"
    | "low"
    | "hip"
    | "level"
    | "high"
    | "overhead"
    | "front"
    | "back"
    | "side"
    | "three-quarter";
  /** camera tilt */
  tilt?: "up" | "down" | "none" | "dutch";
  /** distance from subject — controls glyph distance & cone length */
  distance?: "macro" | "close" | "medium" | "far" | "vast";
  /** focus treatment drawn in the diagram */
  focus?: "shallow" | "deep" | "band" | "macro";
  /** composition overlay */
  grid?: "thirds" | "centre" | "symmetry" | "frame" | "lines" | "none";
}

export interface Angle {
  slug: string;
  title: string;
  category: AngleCategoryId;
  useCases: UseCase[];
  description: string;
  prompt: string;
  tags: string[];
  diagram: AngleDiagramSpec;
}

export const ANGLES: Angle[] = [
  // ── Angle & Height ────────────────────────────────────────────────────────
  {
    slug: "eye-level",
    title: "Eye level",
    category: "angle-height",
    useCases: ["product", "lifestyle", "world-building"],
    description:
      "The camera sits exactly where a person's eyes would — no looking up, no looking down. It's the most neutral, honest angle there is, which is why it's the default when you want the viewer to simply meet the subject.",
    prompt:
      "Eye-level shot. The camera is positioned at the subject's eye height with the lens perfectly horizontal — no upward or downward tilt. Neutral, natural perspective with straight vertical lines.",
    tags: ["neutral", "straight-on height", "natural perspective", "level camera", "eyeline"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", grid: "none" },
  },
  {
    slug: "low-angle",
    title: "Low angle",
    category: "angle-height",
    useCases: ["product", "lifestyle", "world-building"],
    description:
      "The camera drops below the subject and looks up, so whatever's in frame gains height, weight and authority. Reach for it when something needs to feel powerful, premium or just a bit heroic.",
    prompt:
      "Low-angle shot. The camera is placed well below the subject, tilted upward so the subject towers in the frame against the space above. Strong upward perspective with converging vertical lines.",
    tags: ["looking up", "heroic", "power angle", "upshot", "dominance"],
    diagram: { view: "side", camera: "low", tilt: "up", distance: "medium", grid: "none" },
  },
  {
    slug: "high-angle",
    title: "High angle",
    category: "angle-height",
    useCases: ["product", "lifestyle"],
    description:
      "The camera looks down from above head height, making the subject feel smaller, softer or more vulnerable. Also quietly brilliant for showing the tops of things and how a scene is laid out.",
    prompt:
      "High-angle shot. The camera is raised above the subject and tilted downward at roughly forty-five degrees, looking down on the subject so the ground becomes the backdrop.",
    tags: ["looking down", "downshot", "diminishing", "overview", "top angle"],
    diagram: { view: "side", camera: "high", tilt: "down", distance: "medium", grid: "none" },
  },
  {
    slug: "worms-eye-view",
    title: "Worm's-eye view",
    category: "angle-height",
    useCases: ["lifestyle", "world-building"],
    description:
      "The camera lies right on the ground and stares straight up — the low angle taken to its extreme. Everything above becomes monumental: ceilings, canopies and skylines turn into the whole world.",
    prompt:
      "Worm's-eye view. The camera sits directly on the ground pointing almost vertically upward, with extreme upward perspective — everything overhead converges dramatically toward the sky.",
    tags: ["extreme low angle", "straight up", "ground looking up", "towering", "vertigo"],
    diagram: { view: "side", camera: "ground", tilt: "up", distance: "close", grid: "none" },
  },
  {
    slug: "birds-eye-view",
    title: "Bird's-eye / top-down",
    category: "angle-height",
    useCases: ["product", "world-building"],
    description:
      "The camera hovers directly overhead and shoots straight down at ninety degrees, flattening the scene into a graphic map of itself. Perfect when arrangement and shape matter more than depth.",
    prompt:
      "Bird's-eye top-down shot. The camera is positioned directly overhead, pointing straight down at a perfect ninety-degree angle, flattening the scene into a graphic overhead plane with no horizon visible.",
    tags: ["top-down", "overhead", "directly above", "aerial", "god's-eye"],
    diagram: { view: "side", camera: "overhead", tilt: "down", distance: "medium", grid: "none" },
  },
  {
    slug: "dutch-tilt",
    title: "Dutch tilt",
    category: "angle-height",
    useCases: ["lifestyle", "world-building"],
    description:
      "The camera rolls off its horizontal axis so the horizon runs diagonally through the frame. Instant unease, energy or edge — use it when a scene needs to feel slightly off-balance on purpose.",
    prompt:
      "Dutch tilt. The camera is rotated on its roll axis so the horizon sits at a deliberate diagonal of roughly fifteen to thirty degrees, throwing the whole frame off-kilter while the subject stays sharp.",
    tags: ["canted angle", "tilted horizon", "diagonal frame", "off-kilter", "dutch angle"],
    diagram: { view: "side", camera: "level", tilt: "dutch", distance: "medium", grid: "none" },
  },
  {
    slug: "hip-level",
    title: "Hip level",
    category: "angle-height",
    useCases: ["lifestyle"],
    description:
      "The camera sits at waist height — the candid, walked-past-and-shot-from-the-hip feel of street photography. It reads as unposed and human without ever being dramatic about it.",
    prompt:
      "Hip-level shot. The camera is held at waist height with the lens horizontal, giving a slightly lower-than-eyeline vantage that feels candid and unposed, as if shot casually from the hip.",
    tags: ["waist level", "candid", "street style", "from the hip", "mid height"],
    diagram: { view: "side", camera: "hip", tilt: "none", distance: "medium", grid: "none" },
  },
  {
    slug: "ground-level",
    title: "Ground level",
    category: "angle-height",
    useCases: ["product", "world-building"],
    description:
      "The camera rests on the floor and shoots horizontally across it, so the ground plane sweeps into the frame as a giant foreground. Small things suddenly stand on a stage.",
    prompt:
      "Ground-level shot. The camera rests directly on the ground with the lens horizontal, skimming across the surface so the floor stretches out as a vast foreground plane leading to the subject.",
    tags: ["floor level", "surface skim", "low vantage", "foreground plane", "on the ground"],
    diagram: { view: "side", camera: "ground", tilt: "none", distance: "close", grid: "none" },
  },

  // ── Framing & Distance ────────────────────────────────────────────────────
  {
    slug: "extreme-close-up",
    title: "Extreme close-up",
    category: "framing-distance",
    useCases: ["product", "lifestyle"],
    description:
      "The frame is filled by a single detail — an eye, a texture, an edge — with everything else cropped away. Nothing says 'this matters' louder than showing only this.",
    prompt:
      "Extreme close-up. The camera frames one small detail of the subject so tightly that it fills the entire frame, cropping out all surrounding context. Razor-thin focus on the detail itself.",
    tags: ["ECU", "tight crop", "detail shot", "filling the frame", "extreme tight"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "close", focus: "shallow", grid: "centre" },
  },
  {
    slug: "close-up",
    title: "Close-up",
    category: "framing-distance",
    useCases: ["product", "lifestyle"],
    description:
      "The subject's face — or a product's front — fills the frame with just a whisper of surroundings. This is the intimacy setting: expression, texture and character, nothing else.",
    prompt:
      "Close-up shot. The camera frames the subject tightly from the shoulders up, filling most of the frame, with the background reduced to a soft, minimal presence behind it.",
    tags: ["CU", "head shot", "tight framing", "intimate", "face filling frame"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "close", focus: "shallow", grid: "none" },
  },
  {
    slug: "medium-close-up",
    title: "Medium close-up",
    category: "framing-distance",
    useCases: ["lifestyle"],
    description:
      "Framed from the chest up — close enough to read the face, far enough to catch gesture and wardrobe. The interview framing, and the safest portrait crop in the book.",
    prompt:
      "Medium close-up. The camera frames the subject from mid-chest to just above the head, balancing facial detail with a hint of posture and clothing, background gently softened.",
    tags: ["MCU", "chest up", "portrait crop", "interview framing", "bust shot"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", focus: "shallow", grid: "thirds" },
  },
  {
    slug: "medium-shot",
    title: "Medium shot",
    category: "framing-distance",
    useCases: ["lifestyle"],
    description:
      "Waist up — the conversational distance. You get the face, the hands and enough environment to know where you are, which makes it the workhorse of storytelling frames.",
    prompt:
      "Medium shot. The camera frames the subject from the waist up at a natural conversational distance, keeping face and hands visible with a readable slice of the surrounding environment.",
    tags: ["MS", "waist up", "mid shot", "conversational distance", "half body"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", grid: "thirds" },
  },
  {
    slug: "cowboy-shot",
    title: "Cowboy shot",
    category: "framing-distance",
    useCases: ["lifestyle"],
    description:
      "Framed from mid-thigh up — the crop the westerns invented so the holster stayed in shot. It gives a figure stance and swagger without stepping back to a full body.",
    prompt:
      "Cowboy shot. The camera frames the subject from mid-thigh to just above the head, slightly wider than a medium shot, keeping the full stance and hips in frame for a grounded, confident posture.",
    tags: ["mid-thigh crop", "american shot", "three-quarter body", "stance framing", "western crop"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", grid: "thirds" },
  },
  {
    slug: "full-shot",
    title: "Full shot",
    category: "framing-distance",
    useCases: ["lifestyle", "product"],
    description:
      "Head to toe in frame, with a little air above and below. The whole silhouette gets to speak — essential for fashion, posture and anything where the complete form is the point.",
    prompt:
      "Full shot. The camera frames the subject head to toe with a small margin of space above and below, showing the complete figure and its stance within a modest slice of environment.",
    tags: ["head to toe", "full body", "full length", "whole figure", "FS"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "far", grid: "centre" },
  },
  {
    slug: "wide-shot",
    title: "Wide shot",
    category: "framing-distance",
    useCases: ["lifestyle", "world-building"],
    description:
      "The subject and its surroundings share the frame roughly equally. It's the shot that answers 'where are we?' while still keeping the subject clearly the point.",
    prompt:
      "Wide shot. The camera stands back so the subject occupies roughly a third of the frame height, surrounded by generous visible environment that gives full context to the scene.",
    tags: ["WS", "long shot", "environmental", "context framing", "stepped back"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "far", grid: "thirds" },
  },
  {
    slug: "extreme-wide",
    title: "Extreme wide",
    category: "framing-distance",
    useCases: ["world-building", "lifestyle"],
    description:
      "The subject becomes a speck in a vast frame — the landscape does the talking. Use it for scale, solitude and that little jolt of awe when the world dwarfs the figure in it.",
    prompt:
      "Extreme wide shot. The camera is positioned far from the subject so it appears tiny within a vast, sweeping environment — the landscape dominates the frame and the subject reads as a small point of scale.",
    tags: ["EWS", "epic scale", "vast landscape", "tiny subject", "extreme long shot"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "vast", grid: "thirds" },
  },
  {
    slug: "establishing-shot",
    title: "Establishing shot",
    category: "framing-distance",
    useCases: ["world-building"],
    description:
      "A wide, scene-setting frame that introduces the whole location before anything happens in it. Think of it as the sentence that opens the chapter.",
    prompt:
      "Establishing shot. The camera frames the entire location in one wide, scene-setting view — full setting visible edge to edge, horizon clearly placed, composed to introduce the world before any single subject.",
    tags: ["scene-setting", "location shot", "opening frame", "master wide", "context shot"],
    diagram: { view: "side", camera: "high", tilt: "down", distance: "vast", focus: "deep", grid: "thirds" },
  },
  {
    slug: "macro-detail",
    title: "Macro detail",
    category: "framing-distance",
    useCases: ["product"],
    description:
      "Closer than close — the camera magnifies a surface until texture becomes terrain. Stitching, grain, condensation: macro turns craftsmanship into the hero.",
    prompt:
      "Macro detail shot. The camera is positioned centimetres from the surface with true macro magnification, revealing fine texture at larger-than-life scale, with an extremely thin plane of sharp focus falling away fast on either side.",
    tags: ["macro photography", "magnified texture", "micro detail", "1:1 magnification", "surface study"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "macro", focus: "macro", grid: "centre" },
  },

  // ── Perspective & Position ────────────────────────────────────────────────
  {
    slug: "pov-shot",
    title: "POV shot",
    category: "perspective-position",
    useCases: ["lifestyle", "product"],
    description:
      "The camera becomes someone's eyes — you see exactly what they see, hands and all. Nothing puts the viewer inside a moment faster.",
    prompt:
      "First-person point-of-view shot. The camera is positioned exactly where a person's eyes would be, looking outward at the scene as if the viewer is living the moment — hands may enter the frame from the bottom edge, naturally foreshortened.",
    tags: ["first person", "point of view", "through their eyes", "immersive", "subjective camera"],
    diagram: { view: "plan", camera: "front", tilt: "none", distance: "close", grid: "none" },
  },
  {
    slug: "over-the-shoulder",
    title: "Over-the-shoulder",
    category: "perspective-position",
    useCases: ["lifestyle"],
    description:
      "The camera peers past a soft, out-of-focus shoulder in the foreground toward what that person is facing. It creates instant relationship — someone is looking, and we're looking with them.",
    prompt:
      "Over-the-shoulder shot. The camera is positioned just behind and slightly to one side of a foreground figure, whose blurred shoulder and head edge occupy one side of the frame, looking past them toward the sharply focused subject beyond.",
    tags: ["OTS", "past the shoulder", "two-person framing", "foreground shoulder", "dialogue angle"],
    diagram: { view: "plan", camera: "back", tilt: "none", distance: "close", focus: "shallow", grid: "thirds" },
  },
  {
    slug: "profile",
    title: "Profile",
    category: "perspective-position",
    useCases: ["lifestyle", "product"],
    description:
      "The camera sits at exactly ninety degrees to the subject, capturing it in pure side-on silhouette-of-form. Clean, graphic and quietly formal — outlines never lie in profile.",
    prompt:
      "Profile shot. The camera is positioned exactly ninety degrees to the side of the subject at its own height, capturing a pure side-on view where the full outline and contour read cleanly against the background.",
    tags: ["side view", "side-on", "90 degrees", "outline", "lateral"],
    diagram: { view: "plan", camera: "side", tilt: "none", distance: "medium", grid: "centre" },
  },
  {
    slug: "three-quarter-view",
    title: "Three-quarter view",
    category: "perspective-position",
    useCases: ["product", "lifestyle"],
    description:
      "The camera swings about forty-five degrees off front-on, showing the face and one side at once. It's the most flattering, most dimensional default angle — which is why every portrait and product hero seems to use it.",
    prompt:
      "Three-quarter view. The camera is angled roughly forty-five degrees off the subject's front axis, revealing the front and one side simultaneously so the form reads with full depth and dimension.",
    tags: ["45 degrees", "quarter turn", "hero angle", "dimensional", "off-axis"],
    diagram: { view: "plan", camera: "three-quarter", tilt: "none", distance: "medium", grid: "thirds" },
  },
  {
    slug: "from-behind",
    title: "From behind",
    category: "perspective-position",
    useCases: ["lifestyle", "world-building"],
    description:
      "The camera sits squarely behind the subject, who faces away into the scene. The viewer borrows their gaze and their anonymity — perfect for wanderlust, mystery and 'come with me' energy.",
    prompt:
      "Shot from directly behind. The camera is positioned behind the subject, who faces away from the lens into the scene beyond, so the viewer looks where they look — back of the head and shoulders anchoring the lower frame.",
    tags: ["back view", "facing away", "rear angle", "follow shot", "gazing into scene"],
    diagram: { view: "plan", camera: "back", tilt: "none", distance: "medium", grid: "thirds" },
  },
  {
    slug: "reflection-shot",
    title: "Reflection shot",
    category: "perspective-position",
    useCases: ["product", "lifestyle"],
    description:
      "The subject appears in a mirror, still water or glass — sometimes alongside its real self, sometimes only as the reflection. A cheap trick in the best sense: instant doubling, symmetry and intrigue.",
    prompt:
      "Reflection shot. The camera is angled so the subject appears reflected in a mirrored or glossy surface within the frame, the reflection composed as a deliberate second image — crisp at the point of reflection with subtle distortion at the edges.",
    tags: ["mirror shot", "water reflection", "glass", "doubled image", "mirrored"],
    diagram: { view: "plan", camera: "three-quarter", tilt: "none", distance: "medium", grid: "symmetry" },
  },
  {
    slug: "silhouette",
    title: "Silhouette",
    category: "perspective-position",
    useCases: ["lifestyle", "world-building"],
    description:
      "The subject is lit only from behind, collapsing into a pure black shape against a bright background. Detail disappears; outline, mood and drama take over.",
    prompt:
      "Silhouette shot. The camera faces directly into a bright background with the subject placed between lens and light source, exposed for the background so the subject renders as a clean, fully black shape with a crisp outline and no interior detail.",
    tags: ["backlit shape", "black outline", "contre-jour", "shadow figure", "high contrast"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "far", grid: "centre" },
  },
  {
    slug: "through-a-frame",
    title: "Through a frame",
    category: "perspective-position",
    useCases: ["lifestyle", "world-building"],
    description:
      "The camera shoots through a doorway, window or gap, so the scene sits inside a natural border. It adds depth, a hint of voyeurism and a strong 'you are here, looking in there' feeling.",
    prompt:
      "Shot through a framing aperture. The camera is positioned outside a doorway, window or opening and shoots through it, so the dark or soft edges of the opening border the frame while the subject sits sharply lit in the space beyond.",
    tags: ["doorway framing", "through the window", "aperture framing", "peering in", "layered depth"],
    diagram: { view: "plan", camera: "front", tilt: "none", distance: "far", grid: "frame" },
  },
  {
    slug: "dead-on-front",
    title: "Dead-on front",
    category: "perspective-position",
    useCases: ["product", "lifestyle"],
    description:
      "The camera faces the subject head-on, perfectly square, perfectly centred. Flat, formal and graphic — the deadpan stare that makes catalogues, portraits and title frames feel intentional.",
    prompt:
      "Dead-on frontal shot. The camera faces the subject perfectly straight-on and square, centred on its front axis with zero rotation or tilt, producing a flat, symmetrical, almost architectural composition.",
    tags: ["straight-on", "frontal", "head-on", "symmetrical facing", "square to camera"],
    diagram: { view: "plan", camera: "front", tilt: "none", distance: "medium", grid: "symmetry" },
  },

  // ── Lens & Optics ─────────────────────────────────────────────────────────
  {
    slug: "shallow-depth-of-field",
    title: "Shallow depth of field",
    category: "lens-optics",
    useCases: ["product", "lifestyle", "world-building"],
    description:
      "A wide-open lens melts everything except the subject into creamy blur. It's the fastest way to say 'look here' — and the blur itself becomes part of the beauty.",
    prompt:
      "Shallow depth of field, shot wide open at around f/1.8. Only a thin plane at the subject is in sharp focus; foreground and background dissolve into smooth, creamy bokeh with soft circular highlights.",
    tags: ["bokeh", "wide aperture", "background blur", "f/1.8", "subject isolation"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "close", focus: "shallow", grid: "none" },
  },
  {
    slug: "deep-focus",
    title: "Deep focus",
    category: "lens-optics",
    useCases: ["world-building", "product"],
    description:
      "Everything from the nearest object to the far horizon is pin-sharp. Nothing is hidden and nothing is prioritised — the viewer's eye is free to wander the whole frame.",
    prompt:
      "Deep focus, stopped down to around f/11. Everything from the immediate foreground through to the far distance is rendered pin-sharp, with no depth-of-field blur anywhere in the frame.",
    tags: ["everything sharp", "small aperture", "f/11", "front-to-back focus", "pan focus"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "far", focus: "deep", grid: "none" },
  },
  {
    slug: "telephoto-compression",
    title: "Telephoto compression",
    category: "lens-optics",
    useCases: ["lifestyle", "world-building"],
    description:
      "A long lens from far away stacks the layers of a scene together, making backgrounds loom huge and close. Distance flattens into intimacy — mountains lean over streets, crowds become walls.",
    prompt:
      "Telephoto shot on a long lens around 200mm from a distant position. Perspective is heavily compressed so background elements appear dramatically enlarged and stacked close behind the subject, with layers of the scene flattened together.",
    tags: ["long lens", "200mm", "compressed perspective", "stacked layers", "flattened depth"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "vast", focus: "shallow", grid: "none" },
  },
  {
    slug: "wide-angle-exaggeration",
    title: "Wide-angle exaggeration",
    category: "lens-optics",
    useCases: ["world-building", "lifestyle"],
    description:
      "A short lens up close stretches the space — foregrounds balloon, distances yawn, lines rush toward the edges. It makes any scene feel bigger, faster and slightly larger than life.",
    prompt:
      "Wide-angle shot on a short lens around 20mm, positioned close to the subject. Perspective is exaggerated and stretched — foreground elements loom large, the background recedes dramatically, and straight lines rush toward the frame edges.",
    tags: ["20mm", "short lens", "stretched perspective", "exaggerated depth", "dynamic distortion"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "close", focus: "deep", grid: "lines" },
  },
  {
    slug: "fisheye",
    title: "Fisheye",
    category: "lens-optics",
    useCases: ["lifestyle", "world-building"],
    description:
      "An ultra-wide lens bends the whole world into a bulging sphere — horizons curve, edges warp, the centre pushes forward. Loud, playful and unmistakably itself.",
    prompt:
      "Fisheye lens shot with an ultra-wide field of view around 180 degrees. The entire frame bulges spherically — the horizon bows into a curve, straight lines bend outward at the edges, and the centre of the image pushes toward the viewer.",
    tags: ["ultra-wide", "barrel distortion", "curved horizon", "180 degrees", "spherical warp"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "close", focus: "deep", grid: "none" },
  },
  {
    slug: "tilt-shift-miniature",
    title: "Tilt-shift miniature",
    category: "lens-optics",
    useCases: ["world-building"],
    description:
      "A high vantage plus a razor-thin band of focus tricks the eye into reading a real scene as a tiny model village. Utterly charming, and strangely good at making big systems feel legible.",
    prompt:
      "Tilt-shift miniature effect. The camera looks down on the scene from a high vantage while a narrow horizontal band of sharp focus crosses the middle of the frame, blurring rapidly above and below so the whole scene reads as a tiny scale model. Slightly boosted colour saturation completes the toy-like illusion.",
    tags: ["miniature effect", "model village", "focus band", "diorama look", "selective focus"],
    diagram: { view: "side", camera: "high", tilt: "down", distance: "far", focus: "band", grid: "none" },
  },
  {
    slug: "lens-flare-backlit",
    title: "Lens flare / backlit",
    category: "lens-optics",
    useCases: ["lifestyle", "product"],
    description:
      "The camera shoots toward the light source, letting flare streaks and glowing halos spill into the lens. Edges catch fire with rim light, and everything feels warmer and more alive.",
    prompt:
      "Backlit shot facing toward the main light source, which sits just outside or at the edge of frame. Light spills into the lens as visible flare — soft streaks, glowing halation and a gentle wash of haze — while the subject's edges catch a bright rim of light.",
    tags: ["contre-jour", "rim light", "flare streaks", "shooting into the light", "halation"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", focus: "shallow", grid: "none" },
  },
  {
    slug: "soft-focus-glow",
    title: "Soft focus glow",
    category: "lens-optics",
    useCases: ["lifestyle", "product"],
    description:
      "A diffusion filter (or a dreamy old lens) blooms the highlights and gently softens every edge without losing the image. It reads as romance, nostalgia and expensive skincare all at once.",
    prompt:
      "Soft-focus shot with a diffusion filter effect. Highlights bloom gently outward, fine detail is softly veiled while overall shapes stay clearly legible, and the whole image carries a dreamy, luminous glow with lifted, milky shadows.",
    tags: ["diffusion filter", "dreamy glow", "bloomed highlights", "romantic softness", "pro-mist look"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "close", focus: "shallow", grid: "none" },
  },
  {
    slug: "anamorphic-feel",
    title: "Anamorphic feel",
    category: "lens-optics",
    useCases: ["world-building", "lifestyle"],
    description:
      "The widescreen cinema look: an extra-wide frame, oval out-of-focus highlights and thin horizontal flares streaking across light sources. One prompt line and everything feels like a film still.",
    prompt:
      "Anamorphic cinematic shot in a wide 2.39:1 aspect ratio. Out-of-focus highlights stretch into vertical ovals, light sources throw long thin horizontal streak flares across the frame, and there is a subtle gentle squeeze to the background blur — the unmistakable widescreen film look.",
    tags: ["2.39:1", "widescreen", "oval bokeh", "horizontal flares", "cinematic film look"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", focus: "shallow", grid: "none" },
  },

  // ── Composition ───────────────────────────────────────────────────────────
  {
    slug: "flat-lay",
    title: "Flat lay",
    category: "composition",
    useCases: ["product"],
    description:
      "Objects arranged on a flat surface, shot from directly above so the whole spread reads as one designed image. The editorial staple for anything that can be laid out and admired.",
    prompt:
      "Flat lay. The camera points straight down from directly overhead at items arranged on a flat surface, everything in the same plane and uniformly sharp, composed as a considered overhead spread with even, shadow-soft lighting.",
    tags: ["overhead spread", "top-down arrangement", "tabletop", "styled surface", "lay flat"],
    diagram: { view: "side", camera: "overhead", tilt: "down", distance: "close", focus: "deep", grid: "none" },
  },
  {
    slug: "knolling",
    title: "Knolling",
    category: "composition",
    useCases: ["product"],
    description:
      "The obsessive cousin of the flat lay: every object aligned at perfect right angles with even gaps, shot dead overhead. It turns a pile of things into an inventory of beautiful order.",
    prompt:
      "Knolling shot. The camera points straight down from directly overhead at objects arranged at strict ninety-degree angles to one another, evenly spaced in a tidy grid on a plain surface, everything parallel or perpendicular, uniformly lit and uniformly sharp.",
    tags: ["organised neatly", "right-angle layout", "grid arrangement", "inventory shot", "things organised"],
    diagram: { view: "side", camera: "overhead", tilt: "down", distance: "close", focus: "deep", grid: "lines" },
  },
  {
    slug: "centred-symmetry",
    title: "Centred symmetry",
    category: "composition",
    useCases: ["product", "world-building"],
    description:
      "The subject sits dead centre with the frame mirrored around it, left answering right. Formal, calm and quietly obsessive — symmetry makes anything look deliberate.",
    prompt:
      "Centred symmetrical composition. The camera is squared perfectly to the scene with the subject placed dead centre on the vertical axis, the left and right halves of the frame mirroring each other, all lines level and balanced.",
    tags: ["dead centre", "mirrored frame", "formal balance", "one-point symmetry", "axial"],
    diagram: { view: "plan", camera: "front", tilt: "none", distance: "medium", grid: "symmetry" },
  },
  {
    slug: "rule-of-thirds",
    title: "Rule of thirds",
    category: "composition",
    useCases: ["lifestyle", "world-building", "product"],
    description:
      "The subject sits on one of the frame's third-lines rather than in the middle, leaving room for the scene to breathe. The oldest trick in composition, because it simply works.",
    prompt:
      "Rule-of-thirds composition. The subject is placed on one of the vertical third-lines of the frame, its key point of interest at an intersection of thirds, with the horizon aligned to a horizontal third and open space balancing the opposite side.",
    tags: ["thirds grid", "off-centre subject", "balanced framing", "intersection points", "classic composition"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", grid: "thirds" },
  },
  {
    slug: "negative-space",
    title: "Negative space",
    category: "composition",
    useCases: ["product", "world-building"],
    description:
      "A small subject surrounded by a vast, empty field — sky, wall, water, nothing. The emptiness is the design: it isolates, it calms, and it leaves room for a headline.",
    prompt:
      "Negative-space composition. The subject occupies only a small portion of the frame, placed off-centre, while the vast remainder is a clean, uncluttered expanse of empty space in a single tone — minimal, quiet and deliberately unfilled.",
    tags: ["minimalist", "empty space", "small subject", "breathing room", "isolation"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "far", grid: "thirds" },
  },
  {
    slug: "leading-lines",
    title: "Leading lines",
    category: "composition",
    useCases: ["world-building", "lifestyle"],
    description:
      "Roads, rails, shadows or edges converge through the frame and drag the eye straight to the subject. Composition as a guided tour — the viewer looks exactly where you planned.",
    prompt:
      "Leading-lines composition. Strong linear elements run from the frame edges and converge toward the subject, pulling the eye along their path into the depth of the scene, with the subject positioned at or near the vanishing point.",
    tags: ["converging lines", "vanishing point", "eye path", "depth lines", "directional composition"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "far", focus: "deep", grid: "lines" },
  },
  {
    slug: "frame-within-frame",
    title: "Frame within frame",
    category: "composition",
    useCases: ["world-building", "lifestyle"],
    description:
      "Elements inside the scene — an arch, branches, a gap between walls — form a second border around the subject. Depth doubles, and the eye is fenced in exactly where you want it.",
    prompt:
      "Frame-within-frame composition. Elements within the scene form a natural secondary border around the subject — an arch, opening or surrounding shapes enclosing it — so the subject sits inside a frame inside the frame, with the bordering elements slightly darker or softer.",
    tags: ["natural framing", "nested frame", "enclosed subject", "archway composition", "internal border"],
    diagram: { view: "plan", camera: "front", tilt: "none", distance: "medium", grid: "frame" },
  },
  {
    slug: "pattern-repetition",
    title: "Pattern & repetition",
    category: "composition",
    useCases: ["product", "world-building"],
    description:
      "The frame fills with a repeating rhythm — rows, grids, multiples — often broken by one deliberate exception. Repetition is hypnotic; the break is where the story lives.",
    prompt:
      "Pattern-and-repetition composition. The frame is filled edge to edge with a repeating arrangement of identical or near-identical elements in a regular rhythm, shot square-on so the pattern stays graphic — optionally with a single element breaking the repetition as the focal point.",
    tags: ["repeating elements", "rhythm", "grid of multiples", "pattern break", "graphic repetition"],
    diagram: { view: "plan", camera: "front", tilt: "none", distance: "medium", focus: "deep", grid: "lines" },
  },
  {
    slug: "golden-hour-side-light",
    title: "Golden hour side light",
    category: "composition",
    useCases: ["lifestyle", "product", "world-building"],
    description:
      "Low, warm, directional light rakes across the scene from the side, stretching long shadows and gilding every texture. The most flattering hour of the day, bottled as a composition choice.",
    prompt:
      "Golden-hour side lighting. Warm, low-angled sunlight enters from one side of the frame, raking across the scene to carve out texture, cast long soft-edged shadows and wrap the subject in an amber glow, with the shadow side falling into gentle warm darkness.",
    tags: ["warm directional light", "long shadows", "low sun", "raking light", "magic hour"],
    diagram: { view: "side", camera: "level", tilt: "none", distance: "medium", focus: "shallow", grid: "thirds" },
  },
];
