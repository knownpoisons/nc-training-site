import { requireDeck } from "../guard";
import { loadDeckData } from "../data";
import { DeckShell } from "../shell";
import { Reveal, Barcode } from "../ui";

export const dynamic = "force-dynamic";

// Read-and-point: every setting shows its Slack command. Operating stays in
// #cockpit — the Deck never grows a second set of levers to drift out of sync.
export default async function SettingsPage() {
  await requireDeck();
  const d = await loadDeckData();
  const s = d.settings;

  const rows = [
    { label: "Weekly volume", value: `${s.weeklyVolume} new prospects / week`, cmd: "set volume 8", note: "raised only when three straight weeks earn it — and only by you" },
    { label: "Brief hour", value: `${s.briefHour}:00 ${s.timezone}`, cmd: "set brief hour 6" },
    { label: "Nudge hour", value: `${s.nudgeHour}:00 — once, only if silent`, cmd: "set nudge hour 15" },
    { label: "Timezone", value: s.timezone, cmd: "set timezone Asia/Bangkok", note: "the whole schedule follows it — no redeploy" },
    { label: "Booking link", value: s.bookingUrl ?? "not set", cmd: "set booking <url>", note: "offered in ask-stage drafts" },
  ];

  return (
    <DeckShell>
      <Reveal>
        <div className="dk-label">levers live in #cockpit</div>
        <h1 className="dk-title">Settings</h1>
        <p className="dk-sub">The Deck shows the dials; Slack turns them. One set of levers, no drift.</p>
      </Reveal>

      <div className="dk-bento" style={{ marginTop: 22 }}>
        <Reveal i={1} className="dk-c6">
          <div className="dk-card">
            <span className="dk-label">Streak</span>
            <div className="dk-stat" style={{ marginTop: 10 }}>{s.streakWeeks}<sup>wks ≥80%</sup></div>
            <Barcode fill={Math.min(1, s.streakWeeks / 3)} ticks={28} />
            <p style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 10 }}>Three straight weeks earns the volume question.</p>
          </div>
        </Reveal>
        <Reveal i={2} className="dk-c6">
          <div className="dk-card">
            <span className="dk-label">The rules that don't move</span>
            <p style={{ fontSize: 13.5, marginTop: 10 }}>
              Nothing sends itself. · Max 8 actions a day. · One nudge, ever. ·
              No number leaves without proof. · Subscribers stay broadcast-only.
            </p>
          </div>
        </Reveal>

        {rows.map((r, i) => (
          <Reveal key={r.label} i={i + 3} className="dk-c12">
            <div className="dk-card" style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
              <span className="dk-label" style={{ width: 130 }}>{r.label}</span>
              <b style={{ fontSize: 14.5, overflowWrap: "anywhere" }}>{r.value}</b>
              <span style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                {r.note && <span style={{ fontSize: 12, color: "var(--text-2)" }}>{r.note}</span>}
                <code style={{ fontSize: 12, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: 4, padding: "3px 8px" }}>{r.cmd}</code>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </DeckShell>
  );
}
