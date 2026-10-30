import { LEADERSHIP_CHECKLIST, MICKY_CHECKLIST } from "../_data/hub";
import { readChecklist } from "../_lib/actions";
import { hubConfigured, isAdminAuthed } from "../_lib/auth";
import { getSupabaseServer } from "@/lib/supabase";
import { Reveal } from "../_ui/bits";
import { Checklist, Lock } from "../_ui/gates";
import Link from "next/link";
import { BackstageTabs } from "./tabs";

export const metadata = { title: "Backstage" };

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) {
    return <Lock kind="admin" configured={cfg.admin} />;
  }
  const persisted = !!getSupabaseServer();
  const sb = getSupabaseServer();
  const [state, countRes] = await Promise.all([readChecklist(), sb ? sb.from("tp_intake_v2").select("id", { count: "exact", head: true }) : Promise.resolve({ count: 0 })]);
  const intakeCount = (countRes as { count: number | null }).count ?? 0;

  return (
    <>
      <section className="tp-hero" style={{ paddingBottom: 24 }}>
        <div className="tp-wrap tp-headrow">
          <Reveal>
            <div className="tp-eyebrow" style={{ marginBottom: 16 }}><span className="tp-dot" />Backstage · leadership only</div>
            <h1 className="tp-h1"><span className="tp-outline">The</span> Backstage.</h1>
            <p className="tp-lede" style={{ marginTop: 18 }}>What has to happen before the team walks in, who&rsquo;s doing it, and what the intake is telling us. Ticks save for everyone with this password.</p>
            <Link href="/two-palms/backstage/big-5" className="tp-b5-link"><b>The Big 5</b><span>Five jobs, who owns them, what&rsquo;s due next</span><i>Open →</i></Link>
          </Reveal>
        </div>
        <div className="tp-wrap">
          <Reveal delay={120}>
            <div className="tp-stat-strip">
              <div className="tp-stat"><div className="tp-stat-n">{String(intakeCount).padStart(2, "0")}</div><div className="tp-stat-l">intake forms in</div></div>
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
                <p className="tp-small tp-mute" style={{ marginBottom: 20 }}>The AI Foundations intake is shared with the team after Session 1, to fill in before Session 2. Answers go to Jem only; he&rsquo;ll share the overall picture.</p>
                {!persisted ? <p className="tp-note">Answers aren&rsquo;t being stored right now. Tell Jem.</p> : null}
                <div className="tp-stat-strip"><div className="tp-stat"><div className="tp-stat-n">{String(intakeCount).padStart(2, "0")}</div><div className="tp-stat-l">forms in so far</div></div></div>
                <p className="tp-small" style={{ marginTop: 16 }}>Link for the team: <Link href="/two-palms/intake">/two-palms/intake</Link></p>
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}
