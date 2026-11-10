import Link from "next/link";
import {
  POLICY_AGENTS, POLICY_ASK, POLICY_CARE, POLICY_CLIENTS, POLICY_FREELY, POLICY_GUIDES, POLICY_HARD_NOS,
  POLICY_LEARNING, POLICY_LEVELS, POLICY_META, POLICY_RULE_ONE, POLICY_TEXT, POLICY_WHY, POLICY_WRONG,
} from "../_data/policy";
import { Bento, IconArrow, IconLock, Lab, PageTitle, PrintTile, Tile } from "../_ui/b";
import { CopyButton } from "../_ui/bits";
import "./policy.css";

export const metadata = { title: "AI policy" };

const n2 = (i: number) => String(i + 1).padStart(2, "0");

export default function Page() {
  const m = POLICY_META;
  return (
    <>
      <PageTitle
        back={{ href: "/two-palms", label: "Home" }}
        title="The Two Palms AI policy"
        lede="Two pages. The few rules that always apply, and where your judgement matters most."
        right={<span className="mono">V{m.version.replace(/\.0$/, "")} · {m.lastReviewed}</span>}
      />

      <Bento>
        {/* the headline rule */}
        <Tile span={3} hue="orange" label="One rule above all" className="pol-hero t--next">
          <Lab l="One rule above all" r="Always" hot />
          <div className="t-body">
            <h2 className="pol-big">{POLICY_RULE_ONE.title}.</h2>
            <p className="pol-lead">{POLICY_RULE_ONE.body}</p>
          </div>
        </Tile>

        <Tile hue="bone" label="Policy status">
          <Lab l={m.number} r={`Version ${m.version}`} />
          <div className="t-body">
            <p className="pol-status"><span className={`dot ${m.signedOff ? "dot--ok" : "dot--live"}`} />{m.signedOff ? "In force" : m.status}</p>
            {m.signedOff && <p className="tp">Signed off by the {m.approvedBy} on {m.signedOn}.</p>}
            <p className="tp">Reviewed {m.review.toLowerCase()}</p>
            <div className="acts">
              <CopyButton text={POLICY_TEXT} label="Copy for Claude" className="btn btn--pri" />
            </div>
            <p className="note">Paste it into Claude and ask: &ldquo;Is what I&rsquo;m about to do OK under this?&rdquo;</p>
          </div>
        </Tile>

        {/* why + use freely */}
        <Tile span={2} hue="bone" label="Why we use AI">
          <Lab l="Why we use AI" />
          <div className="t-body">
            {POLICY_WHY.map((p, i) => <p key={i} className={i === 0 ? "pol-why" : "tp"}>{p}</p>)}
          </div>
        </Tile>

        <Tile span={2} hue="sky" label="Use AI freely">
          <Lab l="Use AI freely" r={`${POLICY_FREELY.length} go-aheads`} />
          <ol className="pol-list">
            {POLICY_FREELY.map((x, i) => <li key={i}><span className="pol-n mono">{n2(i)}</span><span>{x}</span></li>)}
          </ol>
        </Tile>

        {/* where to take care */}
        <Tile span="F" hue="mustard" label="Where to take care">
          <Lab l="Where to take care" r="Your judgement" />
          <ol className="pol-cols">
            {POLICY_CARE.map((c, i) => (
              <li key={c.t}>
                <span className="pol-n mono">{n2(i)}</span>
                <h3 className="tt">{c.t}</h3>
                <p className="tp">{c.d}</p>
              </li>
            ))}
          </ol>
        </Tile>

        {/* hard no's + agents */}
        <Tile span={2} label="Hard no's" className="pol-dark">
          <Lab l="Hard no’s" r="Never" />
          <div className="t-body">
            <p className="pol-dark-k">Never, in any tool, for any reason:</p>
            <ul className="pol-x">
              {POLICY_HARD_NOS.map((x, i) => <li key={i}><span className="pol-xm" aria-hidden="true">✕</span><span>{x}</span></li>)}
            </ul>
          </div>
        </Tile>

        <Tile span={2} hue="sky" label="Agents">
          <Lab l="Agents" r="Every agent" />
          <div className="t-body">
            <p className="tp" style={{ marginTop: 0 }}>{POLICY_AGENTS.intro}</p>
            <ul className="pol-list" style={{ paddingTop: 4 }}>
              {POLICY_AGENTS.items.map((x, i) => <li key={i}><span className="pol-n mono">{n2(i)}</span><span>{x}</span></li>)}
            </ul>
          </div>
        </Tile>

        {/* clients */}
        <Tile span={3} hue="blush" label="Clients and the work we sell">
          <Lab l="Clients and the work we sell" />
          <div className="t-body">
            <p className="lab-x">Client AI levels · set by the account lead at kick-off</p>
            <ol className="pol-levels">
              {POLICY_LEVELS.map((l) => (
                <li key={l.n}><b className="tt">{l.n}</b><span className="tp">{l.d}</span></li>
              ))}
            </ol>
            <dl className="pol-dl">
              {POLICY_CLIENTS.map((c) => <div key={c.t}><dt className="tt">{c.t}</dt><dd className="tp">{c.d}</dd></div>)}
            </dl>
          </div>
        </Tile>

        <Tile hue="bone" label="Learning, monitoring and Germany">
          <Lab l="Learning + Germany" />
          <dl className="pol-dl pol-dl--1">
            {POLICY_LEARNING.map((c) => <div key={c.t}><dt className="tt">{c.t}</dt><dd className="tp">{c.d}</dd></div>)}
          </dl>
        </Tile>

        {/* when it goes wrong, questions, living guides */}
        <Tile span={2} hue="orange" label="When something goes wrong">
          <Lab l="When something goes wrong" r="Same day" hot />
          <div className="t-body">
            <ul className="pol-trig">
              {POLICY_WRONG.triggers.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p className="pol-why" style={{ marginTop: 14 }}>{POLICY_WRONG.body}</p>
          </div>
        </Tile>

        <Tile hue="bone" label="Questions">
          <Lab l="Questions?" />
          <ul className="pol-ask">
            {POLICY_ASK.map((a) => <li key={a.who}><b className="tt">{a.who}</b><span className="tp">{a.what}</span></li>)}
          </ul>
        </Tile>

        <Tile hue="bone" label="Living guides">
          <Lab l="Living guides" r={`${POLICY_GUIDES.filter((g) => g.href).length}/${POLICY_GUIDES.length} live`} />
          <ul className="pol-guides">
            {POLICY_GUIDES.map((g) => (
              <li key={g.t}>
                {g.href ? (
                  <Link href={g.href} className="pol-g"><span><b className="tt">{g.t}</b><span className="tp">{g.d}</span></span><IconArrow /></Link>
                ) : (
                  <span className="pol-g is-wait"><span><b className="tt">{g.t}</b><span className="tp">{g.d}</span></span><span className="pol-soon"><IconLock />Coming</span></span>
                )}
              </li>
            ))}
          </ul>
        </Tile>

        <PrintTile
          href="/two-palms/green-light"
          className="sF t--play"
          hue="blush"
          label="Green Light"
          lab={<Lab l="Play" r="About 10 min" />}
          img="/two-palms/img/h/green-light.jpg"
          w={1600}
          h={1200}
          title="Green Light"
          line="Eight real moments from a Two Palms week. Green, amber or red? The fastest way to learn this page."
        >
          <div className="acts"><span className="btn btn--sec">Play it <IconArrow /></span></div>
        </PrintTile>

        {/* the paperwork */}
        <Tile span="F" hue="bone" label="Policy details">
          <Lab l="Policy details" r={m.number} />
          <dl className="pol-meta">
            <div><dt className="lab-x">Version</dt><dd>{m.version} · replaces {m.replaces}</dd></div>
            <div><dt className="lab-x">Status</dt><dd>{m.signedOff ? `In force · signed off ${m.signedOn}` : m.status}</dd></div>
            <div><dt className="lab-x">Policy owner</dt><dd>{m.owner}</dd></div>
            <div><dt className="lab-x">Approved by</dt><dd>{m.approvedBy}</dd></div>
            <div><dt className="lab-x">Applies to</dt><dd>{m.appliesTo}</dd></div>
            <div><dt className="lab-x">Review</dt><dd>{m.review} Last reviewed <span className="mono">{m.lastReviewed}</span>.</dd></div>
          </dl>
        </Tile>
      </Bento>
    </>
  );
}
