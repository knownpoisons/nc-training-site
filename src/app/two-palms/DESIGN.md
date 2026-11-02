# Two Palms AI Hub: style guide

Approved by Jem with Home D on Mon 2 Nov 2026. Every new or reworked hub page follows this. Where a rule here and an older page disagree, this file wins; fix the page.

## The idea

**Cover, then contents.** Each page has one big moment (the thing that matters this week), then a tidy contents grid of everything else. The '84 product photography does the decorating; the interface stays quiet.

## Colour

| Role | Value | Where |
|---|---|---|
| Ground | `#efe9df` | Page background |
| Card | `#f8f4ed` | Every box, the plates on photos |
| Well | `#f4efe7` | Recessed areas, split-flap tiles |
| Ink | `#1b1714` | Text, primary buttons |
| Ink 60 | `#5f554c` | Secondary text, labels |
| Header orange | `#c4572c` | The header bar only |
| Orange (text/fill) | `#b8441f` | The one "do this now" thing per page |
| Keyline | `rgba(27,23,20,.14)` | Box edges at rest |

Rules:
- **Orange once per page** (plus the small live dot): the current call to action. On Home that's the session wrap-up. Session pages keep their homework header and the 80% framework panel; those were approved earlier.
- **Hover colours stay.** Each card has its own hue (mustard, ember, sky, blush, bone) and tints to it on hover, with the edge going dark.
- No gradients, glass, glows or drop shadows on things at rest.

## Corners (one system, no exceptions)

- **Boxes: 12px.** Cards, tiles, session cards, menus, prompt boxes.
- **Anything inside a box: 6px.** Photos, inner panels, the orange wrap-up, inputs, the plates on photos.
- **Controls: fully round.** Buttons, the header pill, copy buttons, chips.
- **Photos that run to a box edge: 0** on the edges they touch (the box's 12px clips them).
- Never sharp corners next to rounded ones.

## Type

- **DM Serif Display** for titles. One big moment per page (the cover title runs up to 120px), section titles 28 to 56px, card titles 22 to 32px.
- **Archivo** for everything you read: body 15px, labels 11px uppercase with +0.06em tracking.
- **DM Mono** only for times, dates and durations. Never as decoration.

## Numbers

Keep a number only when it tells you something you need:
- **Keep:** session dates and times (shown once per page, in the viewer's two cities), due dates, office-hour dates, durations ("about 40 min"), the countdown (header pill only).
- **Cut:** S01 to S08 codes (say "Session 1" or just the name), 01/02/03 list numbering, section index numbers ("01 · Watch it back"), counts in labels ("13 prompts", "08", "3 things"), step meters like 0/8 and V-numbers.
- Real sequences (the set-up steps) may keep numbers, in ink 60, not orange.

## Lines and boxes

- No underline under card labels; the label is a quiet line of type.
- No grid lines between cells. Use space.
- Dividers only inside real lists and tables.
- Never put a box inside a box inside a box.

## Photos

- The photo is the decoration. Let it run big and to the edge where it can.
- Words on a photo sit on a small cream plate (6px corners), never straight on the image.
- **Not ready yet = greyed out**, coming into colour on hover. Done and current = full colour.

## Components (Home D)

- **Ticket band:** a one-off job (Set up Claude) as a slim strip, with the photo at the left edge and the buttons on the right.
- **Cover:** this week's session. Photo on 7 of 12 columns, title huge, time as split-flap digits.
- **Disk rack:** all eight sessions as disks, with a name and a date or state.
- **Photo plate:** a resource tile (prompts, policy, Slack and so on), with the photo filling the tile and the words on a plate.

## Motion

- One signature move per page. On Home it's the split-flap time, which drops in on load and flips again on hover.
- Hover: a colour tint plus a 1.02 photo scale. Nothing animates on scroll.
- Reduced motion: no movement, but colour changes stay.

## Copy

- Plain English, short, warm. Name the action ("Open the session", "Copy the prompt").
- No staff names or money on the team side. Unknown dates read "to confirm".

## Where it lives in code

- Tokens and global rules: `bento.css`, block "THE SYSTEM" at the end.
- Home: `_ui/home-d.tsx` and the "Home D" block in `bento.css`.
- Shared parts: `_ui/b.tsx` (Tile, Win, Lab, PrintTile), `_ui/b-parts.tsx`.
