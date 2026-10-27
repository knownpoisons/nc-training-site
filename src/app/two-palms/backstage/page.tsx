import { LEADERSHIP_CHECKLIST, MICKY_CHECKLIST } from "../_data/hub";
import { readChecklist, readIntake } from "../_lib/actions";
import { hubConfigured, isAdminAuthed } from "../_lib/auth";
import { getSupabaseServer } from "@/lib/supabase";
import { Reveal } from "../_ui/bits";
import { HeadMark } from "../_hairline";
import { Checklist, Lock } from "../_ui/gates";
import { BackstageTabs } from "./tabs";

export const metadata = { title: "Backstage" };

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) {
    return <Lock kind="admin" configured={cfg.admin} />;
  }
  const persisted = !!getSupabaseServer();
  const [state, intake] = await Promise.all([readChecklist(), readIntake()]);
  const avg = intake.length ? (intake.reduce((a, r) => a + (r.confidence || 0), 0) / intake.length).toFixed(1) : "–";
  const byEntity = Object.entries(intake.reduce<Record<string, number>>((m, r) => { m[r.entity || "?"] = (m[r.entity || "?"] ?? 0) + 1; return m; }, {}));

  return (
    <>
      <section className="tp-hero" style={{ paddingBottom: 24 }}>
        <div className="tp-wrap tp-headrow">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}><span className="tp-dot" />Backstage · leadership only</div>
            <h1 className="tp-h1"><span className="tp-outline">The</span> Backstage.</h1>
            <p className="tp-lede" style={{ marginTop: 18 }}>What has to happen before the team walks in, who&rsquo;s doing it, and what the intake is telling us. Ticks save for everyone with this password.</p>
          </Reveal>
          <HeadMark mark="lockers" />
        </div>
        <div className="tp-wrap">
          <Reveal delay={120}>
            <div className="tp-stat-strip">
              <div className="tp-stat"><div className="tp-stat-n">{String(intake.length).padStart(2, "0")}</div><div className="tp-stat-l">intake forms in</div></div>
              <div className="tp-stat"><div className="tp-stat-n">{avg}</div><div className="tp-stat-l">average confidence, out of 5</div></div>
              <div className="tp-stat"><div className="tp-stat-n">{String(MICKY_CHECKLIST.filter((i) => state.find((s) => s.id === i.id)?.done).length).padStart(2, "0")} <span className="tp-outline" style={{ fontSize: "0.6em" }}>/ {String(MICKY_CHECKLIST.length).padStart(2, "0")}</span></div><div className="tp-stat-l">of Micky&rsquo;s list done</div></div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="tp-section" style={{ paddingTop: 8 }}>
        <div className="tp-wrap">
          <BackstageTabs
            micky={
              <div>
                <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">For</span> Micky.</h2>
                <p className="tp-small tp-mute" style={{ marginBottom: 20 }}>The kickoff list from the 21 and 27 Oct calls. Tick as you go; type your name once so the ticks say who.</p>
                <Checklist items={MICKY_CHECKLIST} state={state} persisted={persisted} />
              </div>
            }
            leadership={
              <div>
                <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">For</span> leadership.</h2>
                <p className="tp-small tp-mute" style={{ marginBottom: 20 }}>Decisions and set-up that sit with Ed, Allyssa, Fergus, Sam and Nicky.</p>
                <Checklist items={LEADERSHIP_CHECKLIST} state={state} persisted={persisted} />
              </div>
            }
            intake={
              <div>
                <h2 className="tp-h2" style={{ marginBottom: 6 }}><span className="tp-outline">The</span> intake.</h2>
                <p className="tp-small tp-mute" style={{ marginBottom: 20 }}>Every answer, newest first. Names live here and nowhere else on the hub.</p>
                {byEntity.length ? <div className="tp-chip-row" style={{ marginBottom: 18 }}>{byEntity.map(([e, n]) => <span key={e} className="tp-chip">{e} · {n}</span>)}</div> : null}
                {!persisted ? <p className="tp-note">No database connected, so intake answers are only in the server log. Run migration 008 in Supabase.</p> : null}
                {intake.length === 0 ? <p className="tp-mute">Nothing in yet.</p> : (
                  <div className="tp-stack">
                    {intake.map((r) => (
                      <div key={r.id} className="tp-card">
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                          <strong>{r.name || "No name"}</strong>
                          <span className="tp-chip">{r.entity}</span>
                          <span className="tp-chip">{r.role}</span>
                          <span className="tp-chip tp-chip-orange">confidence {r.confidence}/5</span>
                          <span className="tp-small tp-mute" style={{ marginLeft: "auto" }}>{new Date(r.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span>
                        </div>
                        <dl className="tp-gloss" style={{ marginTop: 10 }}>
                          <div><dt>Clients</dt><dd>{r.clients}</dd></div>
                          <div><dt>AI today</dt><dd>{r.ai_today} · {(r.tools ?? []).join(", ")}</dd></div>
                          <div><dt>Eats the week</dt><dd>{r.time_wasters}</dd></div>
                          <div><dt>Worked</dt><dd>{r.one_win}</dd></div>
                          <div><dt>Didn&rsquo;t</dt><dd>{r.one_fail}</dd></div>
                          <div><dt>Wants</dt><dd>{r.want}</dd></div>
                        </dl>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}
