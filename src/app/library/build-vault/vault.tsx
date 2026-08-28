"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RESOURCES,
  VAULT_CATEGORIES,
  type Resource,
  type VaultCategory,
} from "./_data/resources";

// The vault list: search + single-select category chips + one toggle for the
// entries already used on a NotContent build. Same interaction language as the
// camera finder (chips carry live counts, "/" focuses search, Escape clears),
// so anyone who has used one page already knows this one.
//
// URL params are read on mount rather than through useSearchParams — that hook
// forces a deferred Suspense boundary and pops the list in late. Reading
// location.search after hydration keeps the page fully static.

/** What the ◈ badge says, depending on where the entry came from. */
const ORIGIN_LABEL: Record<NonNullable<Resource["origin"]>, string> = {
  stack: "◈ already in this repo",
  yours: "◈ your own link",
  peers: "◈ a designer you trust sent this",
};

export function Vault() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<VaultCategory | null>(null);
  const [stackOnly, setStackOnly] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q");
    if (q) setQuery(q);
    const c = sp.get("cat") as VaultCategory | null;
    if (c && VAULT_CATEGORIES.some((x) => x.id === c)) setCat(c);
    if (sp.get("stack") === "1") setStackOnly(true);
  }, []);

  const firstSync = useRef(true);
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false;
      return;
    }
    const sp = new URLSearchParams(window.location.search);
    sp.delete("q");
    sp.delete("cat");
    sp.delete("stack");
    if (query) sp.set("q", query);
    if (cat) sp.set("cat", cat);
    if (stackOnly) sp.set("stack", "1");
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [query, cat, stackOnly]);

  const q = query.trim().toLowerCase();

  // Search + toggle applied first, so the chip counts reflect them
  const searched = useMemo(() => {
    let list: Resource[] = RESOURCES;
    if (q) {
      list = list.filter((r) =>
        (r.name + " " + r.domain + " " + r.what + " " + r.use + " " + r.tags.join(" "))
          .toLowerCase()
          .includes(q)
      );
    }
    if (stackOnly) list = list.filter((r) => r.origin);
    return list;
  }, [q, stackOnly]);

  const visible = useMemo(
    () => (cat ? searched.filter((r) => r.category === cat) : searched),
    [searched, cat]
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const r of searched) m[r.category] = (m[r.category] ?? 0) + 1;
    return m;
  }, [searched]);

  // "/" focuses search, Escape clears it
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Entrance reveal. An animation, not a transition: React can apply the class
  // before an element's first paint, and a transition from a never-painted
  // state simply wedges at the base value.
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const filterKey = `${cat ?? "all"}:${q}:${stackOnly ? 1 : 0}`;

  useEffect(() => setRevealed(new Set()), [filterKey]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".vt-card"));
    if (!cards.length) return;
    let fired = false;
    const io = new IntersectionObserver(
      (ents) => {
        fired = true;
        const add = ents.filter((e) => e.isIntersecting);
        if (!add.length) return;
        setRevealed((prev) => {
          const next = new Set(prev);
          for (const e of add) {
            const s = (e.target as HTMLElement).dataset.slug;
            if (s) next.add(s);
          }
          return next;
        });
      },
      { rootMargin: "120px 0px" }
    );
    cards.forEach((c) => io.observe(c));
    // Fallback: if the observer never delivers, show everything rather than
    // leaving an invisible page behind.
    const t = window.setTimeout(() => {
      if (!fired) setRevealed(new Set(cards.map((c) => c.dataset.slug ?? "")));
    }, 700);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [filterKey, visible.length]);

  const activeCat = cat ? VAULT_CATEGORIES.find((c) => c.id === cat) : null;

  return (
    <section className="vt" aria-label="Find a resource">
      <div className="cm-controls">
        <div className="cm-search">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && query) {
                e.preventDefault();
                setQuery("");
              }
            }}
            placeholder="Search the vault…"
            aria-label="Search the vault"
          />
          {query ? (
            <button
              type="button"
              className="cm-clear"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              Clear ×
            </button>
          ) : (
            <kbd className="cm-kbd" aria-hidden="true">
              /
            </kbd>
          )}
          <span className="cm-count" aria-live="polite">
            <strong>{visible.length}</strong> / {RESOURCES.length}
          </span>
        </div>

        <div className="cm-chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="cm-chip"
            aria-pressed={cat === null}
            onClick={() => setCat(null)}
          >
            All <span className="cm-chip-n">{searched.length}</span>
          </button>
          {VAULT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="cm-chip"
              aria-pressed={cat === c.id}
              onClick={() => setCat((prev) => (prev === c.id ? null : c.id))}
            >
              {c.label} <span className="cm-chip-n">{counts[c.id] ?? 0}</span>
            </button>
          ))}
          <button
            type="button"
            className="cm-chip vt-chip-stack"
            aria-pressed={stackOnly}
            onClick={() => setStackOnly((s) => !s)}
            title="Only the ones that came from you, from a designer you trust, or are already in the repo — the rest I found by searching"
          >
            ◈ Vouched for{" "}
            <span className="cm-chip-n">{RESOURCES.filter((r) => r.origin).length}</span>
          </button>
        </div>
      </div>

      {activeCat && <p className="vt-blurb">{activeCat.blurb}</p>}

      {visible.length > 0 ? (
        <div className="vt-grid" ref={gridRef} key={filterKey}>
          {visible.map((r, i) => (
            <a
              key={r.slug}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`vt-card${revealed.has(r.slug) ? " vt-in" : ""}`}
              data-slug={r.slug}
              style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
            >
              <div className="vt-shot">
                {/* Captured at 1440x900 and stored locally — never hotlinked, so
                    a redesign upstream can't silently change the card. */}
                <img
                  src={`/images/library/build-vault/${r.slug}.webp`}
                  alt={`${r.name} homepage`}
                  width={1200}
                  height={750}
                  /* first rows eager so the grid never opens on blank cards;
                     the rest lazy — 19 shots at ~35kb each is a cheap page */
                  loading={i < 6 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
              <div className="vt-body">
                <div className="vt-head">
                  <span className="vt-domain">{r.domain}</span>
                  <span className={`vt-cost vt-cost-${r.cost.toLowerCase().replace(/\s+/g, "-")}`}>
                    {r.cost}
                  </span>
                </div>
                <h3>
                  {r.name}
                  <span className="vt-arrow" aria-hidden="true">
                    ↗
                  </span>
                </h3>
                <p className="vt-what">{r.what}</p>
                <p className="vt-use">
                  <span className="vt-use-label">Reach for it when</span> {r.use}
                </p>
                <div className="vt-tags">
                  {r.tags.map((t) => (
                    <span key={t} className="vt-tag">
                      {t}
                    </span>
                  ))}
                  {r.origin && (
                    <span className="vt-tag vt-tag-stack">{ORIGIN_LABEL[r.origin]}</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="cm-empty">
          <p>Nothing under that name. Try &lsquo;scroll&rsquo;, or clear the filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCat(null);
              setStackOnly(false);
            }}
          >
            Show everything
          </button>
        </div>
      )}
    </section>
  );
}
