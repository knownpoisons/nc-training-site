import { requireDeck } from "../guard";
import { loadDeckData } from "../data";
import { DeckShell } from "../shell";
import { Reveal, CountUp, Barcode, GlassDeck } from "../ui";

export const dynamic = "force-dynamic";

// The Friday numbers as a living dashboard. Computed, never generated —
// numbers first, one sentence of read, no cheerleading.
export default async function ScoreboardPage() {
  await requireDeck();
  const d = await loadDeckData();
  const s = d.scoreboard;

  const hero = [
    {
      label: "Day-90 gate · the hero insight",
      title: `${Math.max(0, s.day90DaysRemaining)} days`,
      body:
        (s.trackLeader === "tie"
          ? "Tracks level — agencies and brand teams neck and neck. "
          : `Track ${s.trackLeader} leads. `) + s.forecastLine,
      fill: Math.max(0, Math.min(1, (90 - s.day90DaysRemaining) / 90)),
      footer: s.honestyLine,
    },
  ];

  const tracks: Array<["A · agencies" | "B · brand teams", typeof s.perTrack.A]> = [
    ["A · agencies", s.perTrack.A],
    ["B · brand teams", s.perTrack.B],
  ];

  return (
    <DeckShell>
      <Reveal>
        <div className="dk-label">week {d.weekLabel}</div>
        <h1 className="dk-title">Scoreboard</h1>
      </Reveal>
      <Reveal i={1}>
        <GlassDeck slides={hero} />
      </Reveal>

      <div className="dk-bento">
        {[
          { n: s.sent, cap: `sent of ${s.due} due`, fill: s.due ? s.completion : 0 },
          { n: s.replies, cap: "replies", fill: s.sent ? s.replies / s.sent : 0 },
          { n: s.callsBooked, cap: "calls booked", fill: s.replies ? s.callsBooked / s.replies : 0 },
          { n: s.closes, cap: "closes", fill: s.callsBooked ? s.closes / s.callsBooked : 0 },
        ].map((x, i) => (
          <Reveal key={x.cap} i={i + 2} className="dk-c3">
            <div className="dk-card">
              <span className="dk-label">{x.cap}</span>
              <div className="dk-stat" style={{ marginTop: 10 }}><CountUp value={x.n} /></div>
              <Barcode fill={x.fill} ticks={28} />
            </div>
          </Reveal>
        ))}

        {tracks.map(([label, t], i) => (
          <Reveal key={label} i={i + 6} className="dk-c6">
            <div className="dk-card">
              <div className="dk-cardhead">
                <span className="dk-icochip">{i === 0 ? "A" : "B"}</span>
                <span className="dk-label">Track {label}</span>
                {s.trackLeader === (i === 0 ? "A" : "B") && <span className="dk-chip blue" style={{ marginLeft: "auto" }}>leading</span>}
              </div>
              <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
                {[
                  ["sent", t.sent], ["replies", t.replies], ["calls", t.calls], ["closes", t.closes],
                ].map(([c, n]) => (
                  <div key={c as string}>
                    <div className="dk-stat" style={{ fontSize: 34 }}><CountUp value={n as number} /></div>
                    <span className="dk-label">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal i={8} className="dk-c12">
          <div className="dk-card">
            <div className="dk-cardhead">
              <span className="dk-icochip">§</span>
              <span className="dk-label">The read</span>
            </div>
            <p style={{ fontSize: 14.5, margin: 0 }}>{s.forecastLine}</p>
            <p style={{ fontSize: 13.5, margin: "8px 0 0", color: "var(--text-2)" }}>{s.honestyLine}</p>
            {s.flagged.length > 0 && (
              <p style={{ fontSize: 13.5, margin: "8px 0 0" }}>
                <b>Avoided twice:</b> {s.flagged.join(", ")} — skip or send, but decide.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </DeckShell>
  );
}
