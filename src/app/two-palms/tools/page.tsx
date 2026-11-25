import { FC } from "../_data/foundations";
import { TOOLS } from "../_data/hub";
import { PageCover } from "../_ui/cover";

export const metadata = { title: "TPM Tools & Skills" };

// Three per row. Empty slots show "coming soon" so the shelf reads as growing, not empty.
const SLOTS = 3;

export default function Page() {
  const cfg = FC.pages_to_add.approved_tools;
  const filled = TOOLS.length;
  const empties = Math.max(0, Math.ceil(Math.max(filled, 1) / SLOTS) * SLOTS - filled);
  return (
    <>
      <PageCover
        label={`${cfg.label} · built by the team`}
        title="Built here. Use it anywhere."
        lede="Skills and tools the team has built for real work. Download one, install it in Claude in a minute, and use it on your next job. One version of each, so we all get better together."
        img="/two-palms/img/h/showcase.jpg"
      />
      <div className="sk-wrap">
        <div className="sk-head">
          <span className="lab-x">The shelf</span>
          <span className="lab-x">{String(filled).padStart(2, "0")} live · {String(empties).padStart(2, "0")} coming</span>
        </div>
        <div className="sk-grid">
          {TOOLS.map((t, i) => (
            <article key={t.name} className="sk-card">
              <div className="sk-top">
                <span className="sk-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="sk-tag">{t.kind ?? "Tool"} · {t.forRole}</span>
              </div>
              <h2 className="sk-t">{t.name}</h2>
              {t.builtBy ? <p className="sk-by">Built by <strong>{t.builtBy}</strong></p> : null}
              <p className="sk-what">{t.what}</p>
              <p className="lab-x sk-sub">How to use it</p>
              {t.steps ? (
                <ol className="sk-steps">{t.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              ) : (
                <p className="sk-what">{t.how}</p>
              )}
              <div className="sk-foot">
                {t.file ? <a className="sk-dl" href={t.file} download>Download skill <span aria-hidden="true">↓</span></a> : t.href ? <a className="sk-dl" href={t.href}>Open <span aria-hidden="true">→</span></a> : null}
                <span className="sk-date">Added {t.addedOn}</span>
              </div>
            </article>
          ))}
          {Array.from({ length: empties }, (_, k) => (
            <article key={`soon-${k}`} className="sk-card sk-card--soon" aria-label="Coming soon">
              <div className="sk-top">
                <span className="sk-n">{String(filled + k + 1).padStart(2, "0")}</span>
                <span className="sk-tag">Coming soon</span>
              </div>
              <h2 className="sk-t">Your skill here.</h2>
              <p className="sk-what">Built something that saves you time every week? Turn it into a skill, run it through the Expert Panel, and send the file to the Head of AI. The best one of each job lands on this shelf.</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
