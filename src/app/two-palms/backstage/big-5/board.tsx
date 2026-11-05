// The Big 5 board: the orange call-out (what's coming up) and the five job cards.
// Used as the first tab of Backstage and on /backstage/big-5.
import Link from "next/link";
import { IconArrow } from "../../_ui/b";
import { BIG5 } from "../../_data/big5";
import type { Big5Tick } from "../../_lib/big5";
import { Meter, doneCount, stageName } from "./parts";

export function Big5Board({ ticks, callout = true, title = true }: { ticks: Record<string, Big5Tick>; callout?: boolean; title?: boolean }) {
  const dated = BIG5.filter((j) => j.next.when !== "to confirm");
  return (
    <div className="b5">
      {callout ? (
        <div className="b5-week b5-week--lead">
          {title ? <div className="b5-week-h">
            <h2 className="b5-week-t">The Big 5</h2>
            <p>Five jobs we&rsquo;re taking off people&rsquo;s plates. Where each one is, what&rsquo;s next and whose it is. Updated after every call.</p>
          </div> : null}
          {dated.length ? (
            <div className="b5-week-up">
              <span className="pl-k">Coming up</span>
              <ul>
                {dated.map((j) => (
                  <li key={j.id}><Link href={`/two-palms/backstage/big-5/${j.id}`}><span className="mono">{j.next.when}</span><b>{j.short}</b><span>{j.next.what}</span></Link></li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="b5-grid">
        {BIG5.map((j) => {
          const d = doneCount(j, ticks);
          return (
            <Link key={j.id} href={`/two-palms/backstage/big-5/${j.id}`} className={`t b5-card${j.stage < 0 ? " is-wait" : ""}`}>
              <span className="b5-card-top"><span className="pl-k">{stageName(j)}</span><Meter stage={j.stage} /></span>
              <h2 className="b5-card-t">{j.name}</h2>
              <p className="b5-own">{j.owner}</p>
              <p className="b5-now">{j.now}</p>
              <span className="b5-next">
                <span className="pl-k">Next</span>
                <span className="b5-next-t">{j.next.what}</span>
                <span className="b5-next-m">{j.next.who} · <span className={j.next.when === "to confirm" ? "is-tbc" : "mono"}>{j.next.when}</span></span>
              </span>
              <span className="b5-card-foot"><span>{d} of {j.todos.length} to-dos done</span><span className="lnk">Open <IconArrow /></span></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
