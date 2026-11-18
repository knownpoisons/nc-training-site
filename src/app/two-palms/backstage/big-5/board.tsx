// The Big 5 board: the orange "where we are" box (one line per job) and the five job cards.
// Used as the first tab of Backstage and on /backstage/big-5.
import Link from "next/link";
import { IconArrow } from "../../_ui/b";
import { BIG5, B5_UPDATED } from "../../_data/big5";
import type { Big5Tick } from "../../_lib/big5";
import { Meter, doneCount, stageName } from "./parts";

const two = (n: number) => String(n).padStart(2, "0");

export function Big5Board({ ticks, callout = true, title = true }: { ticks: Record<string, Big5Tick>; callout?: boolean; title?: boolean }) {
  return (
    <div className="b5">
      {title ? (
        <div className="b5-tabhead">
          <h2 className="b5-tabhead-t">The Big 5</h2>
          <p>Five jobs we&rsquo;re taking off people&rsquo;s plates.</p>
          <Link className="lnk" href="/two-palms/backstage/big-5">Open the Big 5 page <IconArrow /></Link>
        </div>
      ) : null}
      {callout ? (
        <section className="b5-quick" aria-labelledby="b5-quick-h">
          <div className="b5-quick-h">
            <h2 id="b5-quick-h">Where we are</h2>
            <span className="b5-quick-d">Updated {B5_UPDATED}</span>
          </div>
          <ol className="b5-quick-l">
            {BIG5.map((j) => (
              <li key={j.id}>
                <Link href={`/two-palms/backstage/big-5/${j.id}`}>
                  <span className="b5-quick-n">{two(j.n)}</span>
                  <span className="b5-quick-name"><b>{j.short}</b><span className={`b5-chip${j.stage < 0 ? " is-wait" : ""}`}>{stageName(j)}</span></span>
                  <span className="b5-quick-t">{j.quick}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <div className="b5-grid">
        {BIG5.map((j) => {
          const d = doneCount(j, ticks);
          return (
            <Link key={j.id} href={`/two-palms/backstage/big-5/${j.id}`} className={`t b5-card${j.stage < 0 ? " is-wait" : ""}`}>
              <span className="b5-card-top"><span className="b5-card-n">{two(j.n)}</span><span className="b5-card-st"><span className="pl-k">{stageName(j)}</span><Meter stage={j.stage} /></span></span>
              <h3 className="b5-card-t">{j.name}</h3>
              <p className="b5-own">{j.owner}</p>
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
