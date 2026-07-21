# design-sync notes — nc-training-site

Repo-specific gotchas for future syncs. Read this before re-running.

## Shape and entry

- This repo is a **private Next.js app**, not a published component library: no
  `dist/`, no package `exports`, and `node_modules/nc-training-site` does not
  exist (npm won't self-install). The converter therefore **must** be run with
  `--entry ./src/components/ds/index.tsx`. Without `--entry` it dies with
  `ENOENT … node_modules/nc-training-site/package.json`.
- Because there's no `.d.ts` tree to discover from, all 12 components are pinned
  explicitly in `cfg.componentSrcMap`. **Adding a component to
  `src/components/ds/index.tsx` will NOT sync until it's added there too.**

## The CSS/tokens trick (important)

- `copyTokens` only supports tokens shipped as an npm **package**; ours are a
  local file (`src/styles/tokens.css`), so `cfg.tokensGlob` does nothing here —
  it was removed from the config to avoid implying otherwise.
- Instead `cfg.buildCmd` concatenates tokens + component CSS into
  `.design-sync/shipped.css`, and `cfg.cssEntry` points at that. **Run
  `cfg.buildCmd` before every converter run** or the bundle ships component CSS
  with no token definitions and every design renders unstyled
  (`[TOKENS_MISSING]`, 30 undefined vars). `.design-sync/shipped.css` is
  generated and gitignored — never edit it by hand.

## Framework coupling (resolved)

- The DS originally imported `next/link`, which dragged the whole Next runtime
  (wasm, `fs`/`stream`/`url` builtins, `@vercel/og`) into the esbuild bundle and
  failed with 33 errors. Fixed in commit `c7de9aa7`: links now render a plain
  `<a>` via an internal `A` helper, with an optional `linkComponent` prop for
  apps that want client-side routing. **Don't reintroduce framework imports into
  `src/components/ds/` — it breaks the bundle.**

## Fonts

- `--nc-serif` is `Iowan Old Style` (a macOS system serif) with no shipped
  `@font-face`. Declared host-provided via `cfg.runtimeFontPrefixes` with
  Jeremy's explicit OK (2026-07-15). Renders correctly on macOS, falls back to
  Georgia elsewhere — which is already how the live site behaves. If the brand
  ever adopts a licensed webfont, wire it via `cfg.extraFonts` and drop the
  matching prefix.

## Known render warns

- `[GRID_OVERFLOW]` fired for **Accent, Hero, Row** — they're wider than a grid
  cell by design (display type / full-width rows). Resolved with
  `cfg.overrides.<Name>.cardMode = "column"`. If these re-appear as `wide`, it's
  the same known cause, not a regression.

## Local-vs-remote branch trap

- The local checkout was **behind `origin/main`** and did not contain
  `src/components/ds/` at all, so the first build silently pointed at nothing.
  Site changes in this project are routinely pushed from throwaway worktrees, so
  **`git fetch && git merge --ff-only origin/main` before syncing** and confirm
  `src/components/ds/index.tsx` exists.

## Re-sync risks (what can silently go stale)

- **`.design-sync/shipped.css` is generated.** If `cfg.buildCmd` isn't run, the
  build silently ships stale or token-less CSS. This is the single most likely
  cause of a bad re-sync.
- **`componentSrcMap` is a hand-maintained list.** New DS components are
  invisible to the sync until added. Same for removals (they'd linger).
- **Previews import from the package name `nc-training-site`.** If `cfg.pkg` or
  `globalName` changes, every `.design-sync/previews/*.tsx` import breaks.
- **Only `src/components/ds/` is synced.** `src/components/ui/` (8 shadcn
  primitives) and the ~20 app components are deliberately out of scope — a
  future run may want them; that's a scope decision, not an omission.
- **Not verified:** hover/focus/active states (can't render statically) and
  responsive behaviour — cards are captured at one viewport only.
- Toolchain at time of sync: node v24.14.0, playwright installed fresh into the
  repo's devDeps for the render check.
