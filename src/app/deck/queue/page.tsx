import { requireDeck } from "../guard";
import { loadDeckData } from "../data";
import { DeckShell } from "../shell";
import { Reveal } from "../ui";

export const dynamic = "force-dynamic";

// The Monday digest, as cards. Reviewing happens here; PROMOTING happens in
// Slack (`promote 1 3`) — the one door out of the queue stays where the day runs.
export default async function QueuePage() {
  await requireDeck();
  const d = await loadDeckData();

  return (
    <DeckShell>
      <Reveal>
        <div className="dk-label">{d.queue.length} awaiting your call · governor {d.settings.weeklyVolume}/week</div>
        <h1 className="dk-title">Lead queue</h1>
        <p className="dk-sub">Engine Zero fills this; only you empty it. Promote from Monday's digest in #cockpit — <code>promote 1 3</code>, <code>bin 2</code>, <code>hold 5</code>.</p>
      </Reveal>

      <div className="dk-bento" style={{ marginTop: 22 }}>
        {d.queue.length === 0 && (
          <Reveal i={1} className="dk-c12">
            <div className="dk-card">
              <p className="dk-sub">No leads queued. The importer and the scorecard fill this — the Monday digest will show the top ten.</p>
            </div>
          </Reveal>
        )}
        {d.queue.map((p, i) => (
          <Reveal key={p.id} i={i + 1} className="dk-c6">
            <div className="dk-card">
              <div className="dk-cardhead" style={{ marginBottom: 8 }}>
                <span className="dk-chip">{i + 1}</span>
                <b style={{ fontSize: 15 }}>{p.name}</b>
                {p.company && <span style={{ color: "var(--text-2)", fontSize: 13 }}>· {p.company}</span>}
                <span className="dk-chip glow" style={{ marginLeft: "auto" }}>
                  {p.tier ?? "?"} · {p.score != null ? Math.round(p.score) : "—"}
                </span>
              </div>
              {p.role && <div className="dk-label" style={{ marginBottom: 6 }}>{p.role}</div>}
              <p style={{ fontSize: 13.5, margin: "0 0 10px", color: "#2a2a28" }}>
                {p.dossier ?? "No dossier yet — Tier-A enrichment runs daily."}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(p.sources ?? []).map((s) => (
                  <span key={s} className="dk-chip line">{s}</span>
                ))}
                {p.consentLane === "broadcast_only" && <span className="dk-chip line">🔒 broadcast-only</span>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </DeckShell>
  );
}
