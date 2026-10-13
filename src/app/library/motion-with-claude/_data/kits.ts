// ─── The kits ─────────────────────────────────────────────────────────────────
// Copy-paste markdown you drop into a project or paste straight into Claude.
// Written here rather than lifted: the techniques come from the sources in
// sources.ts (and are credited on the page), the wording is ours.
//
// The order is the order you use them in: RULES before you start, BRIEF to say
// what you want, REVIEW to fix what came back, NUMBERS when a note is a feeling
// and needs to become a number.
//
// Rules for editing these:
//   1. Every line must remove a decision or catch a failure. A line that only
//      sounds professional is noise in a file someone pastes at midnight.
//   2. Keep them readable by a beginner and useful to someone who has shipped
//      twenty of these. That usually means plain words with exact numbers.
//   3. No dollar figures or percentages that read as claims — same PROOF rule
//      as every other page. Percentages describing motion (a 3% push) are fine.

export interface Kit {
  slug: string;
  name: string;
  filename: string;
  /** when you reach for this one */
  when: string;
  /** the one-line reason it exists */
  why: string;
  body: string;
}

const RULES = `# Motion rules

Paste this under any prompt that asks for an animation. It does not describe the
film — it makes the film fixable.

## The render contract

- Output one self-contained file. Only the libraries I name, each pinned to an
  exact version.
- Every frame must be a pure function of time. Frame 84 renders identically on
  every run, on any machine.
- Expose a single entry point that draws one moment: given a time in seconds, it
  draws exactly that frame and nothing else.
- No wall-clock time, no timers, no unseeded randomness. Any variation comes
  from a fixed seed.
- For a loop of N frames, render 0 to N-1 only, and the last frame must flow
  into the first. Rendering frame N shows the first frame twice — that is the
  hiccup at the seam.
- Do not start a playback loop when a specific frame has been requested.

## Why this matters

Without it you cannot review anything. A render that differs run to run turns
every note into an argument, and a timer-driven animation cannot be frozen at
the frame you want to talk about. With it, the whole job becomes: look at a
still, name the frame, change one number.

## Working rules

- One hero move per shot. Everything else waits, holds still, or sits back.
- Say timing in frames, not vibes. Write seconds first, convert once, then work
  in frames for the rest of the job.
- Enter with an ease-out, leave with an ease-in, and make exits shorter than
  entrances. Travel across the screen with an ease-in-out.
- Linear easing belongs to rotation, progress and loop phase. On a move it is
  the fastest way to make something look machine-made.
- Text does not move while it is being read.
- Count a reading hold from the moment the words are legible, not from the
  moment they appear.
- Nothing flashes more than three times a second, and text keeps its contrast
  on every frame it is over.

## Banned by default

Name the defaults or you will get them. Start here and add to the list after
every render with whatever it reached for anyway:

- purple or blue gradients, glow, bloom, lens flares
- floating particles used as decoration
- everything fading in at once, or fade-and-slide-up on every element
- centred-everything layouts
- spinning turntable product shots
- dark backgrounds by default
- invented copy, invented logos, invented product names
`;

const BRIEF = `# Brief

Fill every line before you press enter. A blank line is a decision you are
handing to the model, and the model's decisions are what the default look is
made of.

## Goal

One sentence: what should the viewer understand or feel? If you cannot write
it, no easing curve will rescue the piece.

## Output

- Format: [one HTML file / Remotion composition]
- Size: [width x height]
- Libraries: [name them, pinned to a version]

## Time

- Length: [seconds] at [frames per second] = [total frames]
- Loop: [yes — last frame flows into the first / no]
- If cutting to music: [BPM], and every cut lands on a beat

## Look

- Palette: [background, text, one accent — hex]
- Type: [typeface, weight, size, tracking]
- Margins: [keep everything inside this edge]
- Reference: [what one thing should it feel like, and in what single respect]

## Motion

- Entrances: [easing, duration in frames]
- Springs: [damping ratio — 1.0 no bounce, 0.8 premium, 0.5 playful]
- Stagger: [frames between related elements]
- Camera: [still, or the one move it makes]

## Shots

One block per shot. Each needs a frame range, one hero move, and how it hands
off to the next.

\`\`\`
FRAMES [start]-[end]  [what the viewer sees]
  hero move: [the one thing that moves]
  hold:      [how long the key information stays readable]
  handoff:   [hard cut / match cut / carries its end state into the next shot]
\`\`\`

## Assets

- Files available: [list them, with their real sizes]
- Check every asset loads and every crop is legible before building.
- Ask me for anything missing. Do not invent a logo, a screen or a line of copy.

## Banned

[Paste the ban list from the rules file, plus anything the last render did that
I did not ask for.]

## Review

- Build only the first shot, then stop.
- Render stills at frames [list the moments that matter].
- Report what you changed, what you checked, and anything unresolved.
- Wait for approval before building the rest.
`;

const REVIEW = `# Review

The first render is a draft. Two to four rounds is normal. Work in this order:
missing or unreadable information first, then timing, then visual detail.

## Look before you change anything

\`\`\`
Render stills at frames [list]. Describe each one in a sentence, as a viewer
would — not as the person who built it. Does that match the brief? Tell me what
does not before changing anything.
\`\`\`

\`\`\`
Make a contact sheet of every twelfth frame as one image. Mark every frame where
two things compete for attention, then fix the hierarchy rather than the motion.
\`\`\`

## The three questions a still has to pass

- Is the main text readable at phone size?
- Is the thing the shot is about actually visible?
- Is anything cropped, overlapping or touching an edge?

## Review against the principles

The most useful free pass in animation. Run it on a draft, never as a brief:

\`\`\`
Review this animation against the twelve principles of animation. For each one,
say whether it applies here, whether the animation honours it, and give the
frame numbers where it fails. Prioritise anticipation, squash and stretch,
overlapping action, follow-through and arcs. Return notes only — do not change
anything yet.
\`\`\`

## How to write a correction

Four fields, every time. Anything less turns an edit into a rewrite:

\`\`\`
Location:  [composition, shot, and the global frame number]
Observed:  [what is wrong, as seen in the still — not how it feels]
Change:    [the one thing to change, with numbers]
Keep fixed: [everything that must not move — other timings, geometry, copy]

Then render stills at [frames] and a preview across [range], and report the
changed values and output files.
\`\`\`

## Translating a feeling into a note

- "Make it pop" → scale 1.0 to 1.08 and back over six frames, peaking on the beat
- "Make it premium" → ease-out on entrances, springs at damping 0.8, no overshoot on text
- "It feels cheap" → usually everything arriving at once; stagger it and cut the number of moving things
- "It drags" → the hold is longer than the reading time; measure the reading time, then trim
- "It's too busy" → remove a third of the motion and keep only what guides the eye

## Before you call it done

- Watch it once at normal speed without touching anything.
- Read every line of text aloud; extend any hold that ends before you finish.
- Check it on a phone, with the sound off.
- Check the first and last frame of a loop meet cleanly.
`;

const NUMBERS = `# Numbers

The translation table for turning adjectives into values. Every adjective you
replace with a number is a decision you take back from the model.

## Easing

| Feel | cubic-bezier | Use for |
|---|---|---|
| ease-out-expo | 0.16, 1, 0.3, 1 | text and logo reveals |
| ease-out-quint | 0.22, 1, 0.36, 1 | premium entrances |
| ease-in-out-quart | 0.76, 0, 0.24, 1 | moves and camera pushes |
| ease-in-expo | 0.7, 0, 0.84, 0 | fast exits |
| ease-out-back | 0.34, 1.56, 0.64, 1 | a playful pop with overshoot |

## Springs

Libraries name their knobs differently; the damping ratio translates between
them all.

- 1.0 — no bounce. Opacity and colour live here, always.
- 0.8 — premium. Settles once, barely.
- 0.5 to 0.6 — playful. A visible overshoot.
- below 0.3 — cartoon.

Position and size may bounce. Opacity and colour never do.

## Durations

- Interface feedback: 100 to 200 milliseconds — at 100ms it reads as instant
- Interface moves: 200 to 500 milliseconds
- Hero reveals: 600 to 900 milliseconds
- Exits: around half the entrance

At 24fps one frame is about 42 milliseconds, so a 400ms move is 10 frames and a
750ms reveal is 18.

## Stagger

- Letters: one frame apart
- Words: 60 to 120 milliseconds
- List items: 40 to 80 milliseconds

Start the next element when the previous one is 30 to 50 per cent through.
Fully sequential reads as robotic; all at once reads as cheap.

## Holds

Text needs roughly 0.3 seconds per word plus half a second. A two-word title
wants about 1.1 seconds on screen. During a hold, a slow 2 per cent push keeps
the frame alive without pulling the eye off the words.

## Beat grid

Frames per beat = fps x 60 / BPM. At 120 BPM and 24fps that is 12 frames.

Compute every beat from time and round each one separately. Adding a rounded
value repeatedly drifts off the music — after 32 beats you can be two frames out.

Cut on the beat. Change the layout on the bar, every four beats. Changing
everything on every beat exhausts the viewer.

## Hierarchy

- Hero move: full travel
- Secondary: 50 to 70 per cent of the hero's travel, starting 100 to 200
  milliseconds later
- Ambient: under 5 per cent of the hero's travel, slow, never stopping
`;

export const KITS: Kit[] = [
  {
    slug: "rules",
    name: "The rules",
    filename: "MOTION-RULES.md",
    when: "Paste it under any animation prompt, before anything else.",
    why: "It does not describe the film. It makes the film fixable — and names the defaults you never want to see.",
    body: RULES,
  },
  {
    slug: "brief",
    name: "The brief",
    filename: "MOTION-BRIEF.md",
    when: "Fill it in before the first prompt. Blank lines are decisions you are giving away.",
    why: "Shot ranges, frame counts and a ban list, in the order the model needs them.",
    body: BRIEF,
  },
  {
    slug: "review",
    name: "The review loop",
    filename: "MOTION-REVIEW.md",
    when: "The moment the first render comes back.",
    why: "Stills before changes, the twelve-principles pass, and a correction format that edits one thing instead of rewriting everything.",
    body: REVIEW,
  },
  {
    slug: "numbers",
    name: "The numbers",
    filename: "MOTION-NUMBERS.md",
    when: "Whenever a note is a feeling and needs to become a value.",
    why: "Easing curves, damping ratios, durations, stagger, holds and the beat grid, on one page.",
    body: NUMBERS,
  },
];
