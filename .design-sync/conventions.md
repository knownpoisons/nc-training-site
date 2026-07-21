# NotContent — how to build with this system

An editorial, typography-first system. Square corners, hairline rules, one cobalt
accent, a serif that does the talking. Restraint is the brand: quiet everywhere,
one loud moment per page.

## Wrapping

Wrap any surface in `<Page>`. It sets the platinum ground, the ink text colour and
the sans stack via the `.nc` class — **without it, components render on a white
browser-default ground and look wrong**. There is no theme provider and no context;
`<Page>` is the only wrapper.

```jsx
import { Page, Topbar, Hero, Accent, RowList, Row, Footer } from '<pkg>';

<Page>
  <Topbar brand={<>NotContent · Library</>} meta={<span>06 Prompts</span>} />
  <Hero
    eyebrow="The Library" eyebrowNum="00"
    title={<>Prompts that <Accent>ship</Accent>.</>}
    sub="These are the prompts I'm actually running this month."
  />
  <RowList>
    <Row n="01" title="The Copy Autopsy"
         summary="Eight rewrites. Five judges. Ship what survives."
         meta="Conversion · Copy" href="/library/copy-autopsy" />
  </RowList>
  <Footer left="NotContent · The Prompt Library" right="notcontent.ai ↗" />
</Page>
```

Links render a plain `<a>` by default. In a Next app pass `linkComponent={Link}` to
`Topbar`, `Row`, `Button` or `InlineLink` for client-side routing.

## The styling idiom: tokens, not ad-hoc CSS

For your own layout glue, style with the `--nc-*` custom properties — never
hard-coded hex or px. Real names, all defined in the shipped stylesheet:

| Purpose | Tokens |
|---|---|
| Brand | `--nc-cobalt` `--nc-cobalt-deep` `--nc-cobalt-soft` `--nc-hot` |
| Neutrals | `--nc-ink` `--nc-platinum` `--nc-cream` `--nc-surface` `--nc-muted` `--nc-rule` `--nc-white` |
| Type families | `--nc-serif` `--nc-sans` `--nc-mono` |
| Type scale | `--nc-size-display` `--nc-size-h1` `--nc-size-h2` `--nc-size-lead` `--nc-size-body` `--nc-size-small` `--nc-size-label` `--nc-size-micro` |
| Type detail | `--nc-leading-display` `--nc-leading-head` `--nc-leading-body` `--nc-track-display` `--nc-track-head` `--nc-track-label` `--nc-track-eyebrow` |
| Layout | `--nc-measure` (1100px) `--nc-gutter` `--nc-gutter-sm` `--nc-radius` (0 — the brand is square) |
| Spacing (8pt) | `--nc-space-4` `-8` `-16` `-24` `-32` `-40` `-48` `-64` `-80` `-96` |
| Grid | `--nc-grid-columns` (12) `--nc-grid-margin` (64px) `--nc-grid-gutter` (24px) |
| Containers | `--nc-container-desktop` (1280) `--nc-container-tablet` (768) `--nc-container-mobile` (375) |
| Radius scale | `--nc-radius-sm` `-md` `-lg` `-full` — see the square-corners rule below |
| Icons | `--nc-icon-stroke` (2px) `--nc-icon-stroke-lg` (2.5px) |
| Motion | `--nc-ease` `--nc-dur-fast` `--nc-dur-base` `--nc-dur-slow` |

```jsx
<div style={{ maxWidth: 'var(--nc-measure)', padding: '0 var(--nc-gutter)',
              borderTop: '1px solid var(--nc-rule)', color: 'var(--nc-muted)' }} />
```

A small set of classes is also available when composing outside the components:
`.nc-shell` (centred measure + gutter), `.nc-prose` (body copy), `.nc-muted`,
`.nc-rule` (hairline), `.nc-section`. Component internals (`.nc-row`, `.nc-hed`,
`.nc-topic`…) are owned by the components — don't hand-write them.

## Rules that matter

- **Serif for statement, sans for utility.** Display and titles are serif; labels,
  meta and buttons are uppercase sans tracked at `--nc-track-label`.
- **One accent.** `<Accent>` renders the cobalt italic inside a headline — one per
  headline, never a whole line.
- **One featured row.** `<Row featured>` is a solid cobalt block; use it for a
  single item. Several featured rows kill the effect. `<Row quiet>` is the
  greyed, non-interactive "coming soon" state.
- **Square corners by default.** `--nc-radius` is `0` — editorial surfaces
  (heroes, rows, sections, buttons) are square. The `--nc-radius-sm/md/lg/full`
  scale exists for programme and application surfaces only: badges, chips,
  stickers, avatars. When in doubt, square.
- **Spacing is an 8pt system.** Use the `--nc-space-*` steps rather than
  arbitrary px. `--nc-space-64` is the standard page margin.
- **Icons** are line icons in cobalt: 2px stroke (`--nc-icon-stroke`) at 24px,
  2.5px at larger sizes, rounded caps and joins. Keep them simple and universally
  recognisable; don't fill them.
- **Imagery** is authentic and human-centred — real people, real work. Apply a
  subtle blue overlay or duotone for brand consistency; avoid over-saturated
  colour that competes with cobalt, and leave generous space for type.
- Numbers (`n`, `eyebrowNum`) are zero-padded strings: `"01"`, not `1`.

## Where the truth lives

`styles.css` and its imports are the shipped styling — read them before styling
anything yourself. Per-component API and examples are in each component's
`.d.ts` and `.prompt.md`.
