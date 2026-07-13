import { requireDeck } from "../guard";
import { loadDeckData } from "../data";
import { DeckShell } from "../shell";
import { Reveal, CountUp, Barcode, GlassDeck } from "../ui";
import { ProspectTable } from "./table";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  await requireDeck();
  const d = await loadDeckData();
  const k = (n: number) => Math.round(n / 1000);

  const live = (d.counts["REPLIED"] ?? 0) + (d.counts["CALL"] ?? 0) + (d.counts["PROPOSAL"] ?? 0);
  const slides = [
    {
      label: "The stakes",
      title: `$${k(d.pipeline.wonValue)}k of $${k(d.pipeline.target)}k`,
      body: `$${k(d.pipeline.openValue)}k in play across ${d.pipeline.openCount} live conversation${d.pipeline.openCount === 1 ? "" : "s"}. The system drafts. You send.`,
      fill: d.pipeline.target ? d.pipeline.wonValue / d.pipeline.target : 0,
      footer: "swipe →",
    },
    {
      label: "Day-90 gate",
      title: `${Math.max(0, d.scoreboard.day90DaysRemaining)} days left`,
      body:
        d.scoreboard.trackLeader === "tie"
          ? "Tracks level — agencies and brand teams neck and neck."
          : `Track ${d.scoreboard.trackLeader} leads. By day 90, the winner takes the focus.`,
      fill: Math.max(0, Math.min(1, (90 - d.scoreboard.day90DaysRemaining) / 90)),
    },
    {
      label: "This week",
      title: `${d.scoreboard.sent} of ${d.scoreboard.due} sent`,
      body: d.scoreboard.forecastLine,
      fill: d.scoreboard.due ? d.scoreboard.completion : 0,
    },
  ];

  return (
    <DeckShell>
      <Reveal>
        <div className="dk-label">{d.today} · {d.prospects.length} tracked</div>
        <h1 className="dk-title">Pipeline</h1>
      </Reveal>
      <Reveal i={1}>
        <GlassDeck slides={slides} />
      </Reveal>

      <div className="dk-bento">
        {[
          { n: live, cap: "live conversations", icon: "◍" },
          { n: d.counts["IN_SEQUENCE"] ?? 0, cap: "in sequence", icon: "⟶" },
          { n: d.counts["NEW"] ?? 0, cap: "queued for review", icon: "☰" },
          { n: d.counts["WON"] ?? 0, cap: "won", icon: "✓" },
        ].map((s, i) => (
          <Reveal key={s.cap} i={i + 2} className="dk-c3">
            <div className="dk-card">
              <div className="dk-cardhead">
                <span className="dk-icochip">{s.icon}</span>
                <span className="dk-label">{s.cap}</span>
              </div>
              <div className="dk-stat"><CountUp value={s.n} /></div>
            </div>
          </Reveal>
        ))}

        <Reveal i={6} className="dk-c12">
          <div className="dk-card">
            <div className="dk-cardhead">
              <span className="dk-icochip">☷</span>
              <span className="dk-label">Everyone, warmest first</span>
            </div>
            {d.prospects.length === 0 ? (
              <p className="dk-sub">No prospects yet. In #cockpit: <code>add Dana Lee, Head of Brand, Acme</code> — or run the lead import. The Monday digest fills the queue.</p>
            ) : (
              <ProspectTable rows={d.prospects.map((p) => ({
                id: p.id,
                name: p.name,
                company: p.company,
                role: p.role,
                stage: p.stage,
                tier: p.tier ?? null,
                score: p.score != null ? Math.round(p.score) : null,
                value: p.dealValue ?? 50000,
                sources: p.sources ?? [],
                added: p.addedAt,
                dossier: p.dossier ?? null,
                callAt: p.callAt ?? null,
              }))} />
            )}
          </div>
        </Reveal>
      </div>
    </DeckShell>
  );
}
