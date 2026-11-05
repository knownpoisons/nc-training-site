import Link from "next/link";
import { notFound } from "next/navigation";
import { readBig5Ticks } from "../../../_lib/big5";
import { hubConfigured, isAdminAuthed } from "../../../_lib/auth";
import { Lock } from "../../../_ui/gates";
import { IconArrow } from "../../../_ui/b";
import { BIG5, big5Job } from "../../../_data/big5";
import { Meter, doneCount, stageName } from "../parts";
import { StageTodos } from "../big5";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ job: string }> }) {
  const j = big5Job((await params).job);
  return { title: j ? `${j.short} · The Big 5` : "The Big 5" };
}

export default async function Page({ params }: { params: Promise<{ job: string }> }) {
  const cfg = hubConfigured();
  if (!(await isAdminAuthed())) return <Lock kind="admin" configured={cfg.admin} />;
  const j = big5Job((await params).job);
  if (!j) notFound();
  const { ticks, persisted } = await readBig5Ticks();
  const d = doneCount(j, ticks);
  const i = BIG5.indexOf(j);
  const nextJob = BIG5[(i + 1) % BIG5.length];

  return (
    <section className="tp-section" style={{ paddingTop: 20 }}>
      <div className="tp-wrap b5">
        <div className="pc-back"><Link className="tpb-back" href="/two-palms/backstage/big-5"><IconArrow back />The Big 5</Link></div>

        <header className="b5-head">
          <div className="b5-head-c">
            <span className="pl-k">{stageName(j)} · {d} of {j.todos.length} to-dos done</span>
            <h1 className="b5-h1">{j.name}</h1>
            <Meter stage={j.stage} />
            <p className="b5-now b5-now--lg">{j.now}</p>
          </div>
          <div className="b5-nextbox">
            <span className="pl-k">Next step</span>
            <p className="b5-next-t">{j.next.what}</p>
            <dl className="b5-dl"><div><dt>Who</dt><dd>{j.next.who}</dd></div><div><dt>When</dt><dd className={j.next.when === "to confirm" ? "is-tbc" : "mono"}>{j.next.when}</dd></div></dl>
          </div>
        </header>

        <dl className="b5-facts">
          <div><dt>Owner</dt><dd>{j.owner}</dd></div>
          <div><dt>With</dt><dd>{j.with}</dd></div>
          <div><dt>Runs on</dt><dd>{j.tools}</dd></div>
          <div><dt>Done looks like</dt><dd>{j.done_looks_like}</dd></div>
        </dl>

        <div className="b5-body">
          <div className="t b5-main">
            <h2 className="b5-sec">The plan</h2>
            <StageTodos todos={j.todos} ticks={ticks} stage={j.stage} persisted={persisted} />
          </div>
          <aside className="b5-side">
            <div className="t">
              <h2 className="b5-sec">Notes</h2>
              {j.notes.length ? (
                <ul className="b5-notes">
                  {j.notes.map((n, k) => (
                    <li key={k}>
                      <details>
                        <summary><span className="mono">{n.date}</span><b>{n.title}</b><span className="b5-who">{n.who}</span></summary>
                        {n.heard?.length ? <><h4>What we heard</h4><ul>{n.heard.map((x) => <li key={x}>{x}</li>)}</ul></> : null}
                        {n.decided?.length ? <><h4>Decided</h4><ul>{n.decided.map((x) => <li key={x}>{x}</li>)}</ul></> : null}
                        {n.open?.length ? <><h4>Still open</h4><ul>{n.open.map((x) => <li key={x}>{x}</li>)}</ul></> : null}
                        {n.actions?.length ? <><h4>Actions</h4><ul>{n.actions.map((x) => <li key={x.task}>{x.task} · {x.who} · <span className={x.when === "to confirm" ? "is-tbc" : "mono"}>{x.when}</span></li>)}</ul></> : null}
                      </details>
                    </li>
                  ))}
                </ul>
              ) : <p className="tp-small tp-mute">Nothing yet.</p>}
            </div>
            <div className="t">
              <h2 className="b5-sec">Documents</h2>
              {j.docs.length ? (
                <ul className="b5-docs">
                  {j.docs.map((doc) => (
                    <li key={doc.id}><Link href={`/two-palms/backstage/big-5/${j.id}/doc/${doc.id}`}><b>{doc.title}</b><span>{doc.line}</span><span className="mono">{doc.date}</span></Link></li>
                  ))}
                </ul>
              ) : <p className="tp-small tp-mute">Nothing filed yet. Documents land here after the intake.</p>}
            </div>
          </aside>
        </div>

        <div className="b5-foot"><Link className="btn btn--sec" href={`/two-palms/backstage/big-5/${nextJob.id}`}>Next job: {nextJob.short} <IconArrow /></Link></div>
      </div>
    </section>
  );
}
