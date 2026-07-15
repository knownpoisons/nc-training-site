"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EntryCard, type FinderEntry } from "./entry-card";

// The finder: search + single-select category chips (+ optional multi-select
// use-case dimension for the stills collection). Filters compose. URL state is
// mirrored via history.replaceState so filtered views are shareable without
// spamming history or triggering server round-trips.
//
// One IntersectionObserver drives both the entrance reveal (once) and the
// live/paused state of every card's diagram + video (both ways).

interface Props {
  entries: FinderEntry[];
  categories: { id: string; label: string }[];
  useCases?: { id: string; label: string }[];
  /** map entry.slug -> use-case ids (only for collections with the 2nd dimension) */
  entryUseCases?: Record<string, string[]>;
  noun: string; // "movements" | "angles"
  /** example search term suggested in the empty state */
  emptyHint: string;
}

export function Finder({ entries, categories, useCases, entryUseCases, noun, emptyHint }: Props) {
  // URL params are read on mount rather than via useSearchParams — that hook
  // forces a deferred Suspense boundary on a static page, which pops the whole
  // finder in late on slow devices. Reading location.search after hydration
  // costs one repaint on shared links and keeps the finder fully static.
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [uses, setUses] = useState<string[]>([]);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("q");
    if (q) setQuery(q);
    const c = sp.get("cat");
    if (c && categories.some((x) => x.id === c)) setCat(c);
    const u = sp.get("use");
    if (u && useCases) setUses(u.split(",").filter((id) => useCases.some((x) => x.id === id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mirror state into the URL (shareable, no history spam). Skips the first
  // run so a shared link's params survive until the mount-read above lands.
  const firstSync = useRef(true);
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false;
      return;
    }
    // Start from the live URL so params owned by others (e.g. ?type=) survive
    const sp = new URLSearchParams(window.location.search);
    sp.delete("q");
    sp.delete("cat");
    sp.delete("use");
    if (query) sp.set("q", query);
    if (cat) sp.set("cat", cat);
    if (uses.length) sp.set("use", uses.join(","));
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [query, cat, uses]);

  const q = query.trim().toLowerCase();

  // Search-filtered set (before category), so chip counts reflect the search
  const searched = useMemo(() => {
    let list = entries;
    if (q) {
      list = list.filter((e) =>
        (e.title + " " + e.tags.join(" ") + " " + e.description).toLowerCase().includes(q)
      );
    }
    if (uses.length && entryUseCases) {
      list = list.filter((e) => {
        const eu = entryUseCases[e.slug] ?? [];
        return uses.every((u) => eu.includes(u));
      });
    }
    return list;
  }, [entries, q, uses, entryUseCases]);

  const visible = useMemo(
    () => (cat ? searched.filter((e) => e.category === cat) : searched),
    [searched, cat]
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of searched) m[e.category] = (m[e.category] ?? 0) + 1;
    return m;
  }, [searched]);

  // ── "/" focuses search, Escape clears it ───────────────────────────────────
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

  // ── Shared IO: reveal (once) + live/pause (both ways) ──────────────────────
  const gridRef = useRef<HTMLDivElement>(null);
  const [liveSet, setLiveSet] = useState<Set<string>>(() => new Set());
  const [revealedSet, setRevealedSet] = useState<Set<string>>(() => new Set());

  const filterKey = `${cat ?? "all"}:${q}:${uses.join(",")}`;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".cm-card"));
    if (!cards.length) return;

    let ioFired = false;
    const io = new IntersectionObserver(
      (ents) => {
        ioFired = true;
        setLiveSet((prev) => {
          const next = new Set(prev);
          for (const en of ents) {
            const slug = (en.target as HTMLElement).dataset.slug;
            if (!slug) continue;
            if (en.isIntersecting) next.add(slug);
            else next.delete(slug);
          }
          return next;
        });
        setRevealedSet((prev) => {
          const add = ents.filter((en) => en.isIntersecting);
          if (!add.length) return prev;
          const next = new Set(prev);
          for (const en of add) {
            const slug = (en.target as HTMLElement).dataset.slug;
            if (slug) next.add(slug);
          }
          return next;
        });
      },
      { rootMargin: "120px 0px" }
    );
    cards.forEach((c) => io.observe(c));
    // Fallback: if the observer never delivers (blocked/broken environments),
    // reveal everything — animations simply run without the off-screen pause.
    const fallback = window.setTimeout(() => {
      if (ioFired) return;
      const all = new Set(cards.map((c) => c.dataset.slug ?? ""));
      setLiveSet(all);
      setRevealedSet(all);
    }, 700);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
    // Re-bind whenever the rendered set changes
  }, [filterKey, visible.length]);

  // Re-run the entrance choreography when the filter changes
  useEffect(() => {
    setRevealedSet(new Set());
  }, [filterKey]);

  function reset() {
    setQuery("");
    setCat(null);
    setUses([]);
  }

  return (
    <section className="cm-finder" aria-label={`Find a ${noun.replace(/s$/, "")}`}>
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
            placeholder={`Search ${noun}…`}
            aria-label={`Search ${noun}`}
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
            <strong>{visible.length}</strong> / {entries.length}
          </span>
        </div>

        {useCases && (
          <div className="cm-usecases">
            <span className="cm-usecase-label">Use case</span>
            {useCases.map((u) => {
              const on = uses.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  className="cm-usecase"
                  aria-pressed={on}
                  onClick={() =>
                    setUses((prev) => (on ? prev.filter((x) => x !== u.id) : [...prev, u.id]))
                  }
                >
                  {u.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="cm-chips" role="group" aria-label="Filter by category">
          <button
            type="button"
            className="cm-chip"
            aria-pressed={cat === null}
            onClick={() => setCat(null)}
          >
            All <span className="cm-chip-n">{searched.length}</span>
          </button>
          {categories.map((c) => (
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
          <span className="cm-legend" aria-hidden="true">
            <i className="cm-legend-cam" /> camera
            <i className="cm-legend-sub" /> subject
            <i className={noun === "movements" ? "cm-legend-path" : "cm-legend-crop"} />{" "}
            {noun === "movements" ? "path" : "crop"}
          </span>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="cm-grid" ref={gridRef} key={filterKey}>
          {visible.map((e, i) => (
            <EntryCard
              key={e.slug}
              entry={e}
              index={i}
              live={liveSet.has(e.slug)}
              revealed={revealedSet.has(e.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="cm-empty">
          <p>Nothing under that name. Try &lsquo;{emptyHint}&rsquo;, or clear the filters.</p>
          <button type="button" onClick={reset}>
            Show everything
          </button>
        </div>
      )}
    </section>
  );
}
