import { LEADERSHIP_CHECKLIST, MICKY_CHECKLIST } from "../_data/hub";
import { readChecklist } from "../_lib/actions";
import { hubConfigured, isAdminAuthed } from "../_lib/auth";
import { getSupabaseServer } from "@/lib/supabase";
import { Checklist, Lock } from "../_ui/gates";
import Link from "next/link";
import { BackstageTabs } from "./tabs";
import { readTmp } from "../_lib/tmp";
import { tmpSummary, TMP_QUESTIONS } from "../_data/tmp";
import { FC } from "../_data/foundations";
import { PageTitle } from "../_ui/b";

function Bars({ title, items, total }: { title: string; items: { label: string; n: number }[]; total: number }) {
  return (
    <div className="t" style={{ minWidth: 0 }}>
      <div className="lab"><span className="lab-l">{title}</span><span className="lab-r">{String(total).padStart(2, "0")}</span></div>
      <ul className="bars">
        {items.map((it) => (
          <li key={it.label}><span>{it.label}</span><span className="mono">{it.n}</span><span className="bar"><i style={{ width: `${total ? (it.n / total) * 100 : 0}%` }} /></span></li>
        ))}
      </ul>
    </div>
  );
}

export const metadata = { title: "Backstage" };

export default async function Page() {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) {
    return <Lock kind="admin" configured={cfg.admin} />;
  }
  const persisted = !!getSupabaseServer();
  const sb = getSupabaseServer();
  const [state, countRes, tmpRows] = await Promise.all([readChecklist(), sb ? sb.from("tp_intake_v2").select("id", { count: "exact", head: true }) : Promise.resolve({ count: 0 }), readTmp()]);
  const tmp = tmpSummary(tmpRows);
  const qText = (id: string) => TMP_QUESTIONS.find((q) => q.id === id)?.q.split(":")[0] ?? id;
  const intakeCount = (countRes as { count: number | null }).count ?? 0;

  return (
    <>
      <PageTitle
        title="Backstage"
        lede="What has to happen before the team walks in, who's doing it, and what the forms are telling us. Leadership and the trainer only."
        right={<><span className="mono">{String(tmp.total).padStart(2, "0")} TMP · {String(intakeCount).padStart(2, "0")} intake</span><Link className="lnk" href="/two-palms/backstage/big-5">The Big 5 →</Link></>}
      />
      <section className="tp-section" style={{ paddingTop: 8 }}>
        <div className="tp-wrap">
          <BackstageTabs
            tmp={
              <div>
                <h2 className="tp-h2" style={{ marginBottom: 6 }}>{FC.forms.time_money_pain.label}</h2>
                <p className="tp-small tp-mute" style={{ marginBottom: 16 }}>Every answer, with names. Backstage only, never shown on the team side. Opens after Session 1, due {FC.forms.time_money_pain.due}. Team link: <Link href="/two-palms/time-money-pain" style={{ textDecoration: "underline" }}>/two-palms/time-money-pain</Link></p>
                {!persisted ? <p className="tp-note">Answers aren&rsquo;t being stored right now (no database). Tell Jem.</p> : null}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                  <span className="mono" style={{ fontSize: 13 }}>{tmp.total} answer{tmp.total === 1 ? "" : "s"} in</span>
                  <a className="btn btn--sec" href="/two-palms/backstage/tmp-csv" download>Download CSV</a>
                </div>
                <div className="bars-grid">
                  <Bars title="By role" items={tmp.role} total={tmp.total} />
                  <Bars title="By office" items={tmp.office} total={tmp.total} />
                  <Bars title="Dream: take one off my plate" items={tmp.dream} total={tmp.total} />
                  <Bars title="Time · hours a week" items={tmp.hours.time} total={tmp.total} />
                  <Bars title="Money · hours a week" items={tmp.hours.money} total={tmp.total} />
                  <Bars title="Pain · hours a week" items={tmp.hours.pain} total={tmp.total} />
                </div>
                <div className="t" style={{ marginTop: 8 }}>
                  <div className="lab"><span className="lab-l">Every answer</span><span className="lab-r">{String(tmp.total).padStart(2, "0")}</span></div>
                  {tmpRows.length === 0 ? <p className="tp" style={{ marginTop: 12 }}>No answers yet.</p> : (
                    <div className="scroll-x">
                      <table className="answers">
                        <thead><tr><th>When</th><th>Name</th><th>Role</th><th>Office</th><th>{qText("time")}</th><th>Hrs</th><th>{qText("money")}</th><th>Hrs</th><th>{qText("pain")}</th><th>Hrs</th><th>Tools</th><th>Dream</th></tr></thead>
                        <tbody>
                          {tmpRows.map((r) => (
                            <tr key={r.id}>
                              <td className="mono">{new Date(r.created_at).toLocaleString("en-AU", { timeZone: "Australia/Sydney", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</td>
                              <td>{r.name}</td><td>{r.role === "Other" && r.role_other ? `Other: ${r.role_other}` : r.role}</td><td>{r.office === "Elsewhere" && r.office_other ? `Elsewhere: ${r.office_other}` : r.office}</td>
                              <td>{r.time}</td><td className="mono">{r.time_hours}</td><td>{r.money}</td><td className="mono">{r.money_hours}</td><td>{r.pain}</td><td className="mono">{r.pain_hours}</td><td>{r.tools}</td><td>{r.dream}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            }
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
                <p className="tp-small" style={{ marginTop: 16 }}>Superseded by Time · Money · Pain for now. No longer linked on the team side; the route stays at <Link href="/two-palms/intake">/two-palms/intake</Link>.</p>
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}
