"use client";

// Green Light: the AI policy game. One photo (the '84 traffic light), eight moments.
// Solo: pick a light, see the rule, get a licence. Room: Jem shares his screen, the room
// votes G / A / R in the Meet chat, he reveals. The signature move is the lamp landing.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CopyButton } from "../_ui/bits";
import { LIGHTS, MOMENTS, licence, type Light } from "../_data/green-light";
import { POLICY_TEXT } from "../_data/policy";

type Mode = "solo" | "room";
type Phase = "intro" | "ask" | "reveal" | "end";

const WORD: Record<Light, string> = { green: "Green", amber: "Amber", red: "Red" };

function Lamps({ lit, cycling, onPick, pickable }: { lit: Light | null; cycling: boolean; onPick?: (l: Light) => void; pickable: boolean }) {
  return (
    <div className={`gl-photo${cycling ? " is-cycling" : ""}${lit ? " has-lit" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/two-palms/img/h/green-light.jpg" alt="A cream traffic light with the Two Palms logo, on a pink shag carpet." width={1600} height={1200} />
      {(["red", "amber", "green"] as Light[]).map((l) =>
        pickable ? (
          <button key={l} type="button" className={`gl-lamp gl-lamp--${l}${lit === l ? " is-on" : ""}`} aria-label={`${WORD[l]} light`} onClick={() => onPick?.(l)} />
        ) : (
          <span key={l} className={`gl-lamp gl-lamp--${l}${lit === l ? " is-on" : ""}`} aria-hidden="true" />
        ),
      )}
    </div>
  );
}

export function GreenLight({ startMode = "solo" }: { startMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(startMode);
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<(Light | null)[]>(() => MOMENTS.map(() => null));

  const m = MOMENTS[i];
  const score = picks.reduce((n, p, k) => n + (p === MOMENTS[k].answer ? 1 : 0), 0);

  const start = useCallback((md: Mode) => { setMode(md); setPicks(MOMENTS.map(() => null)); setI(0); setPhase("ask"); }, []);
  const pick = useCallback((l: Light) => {
    if (phase !== "ask" || mode !== "solo") return;
    setPicks((p) => p.map((x, k) => (k === i ? l : x)));
    setPhase("reveal");
  }, [phase, mode, i]);
  const reveal = useCallback(() => { if (phase === "ask") setPhase("reveal"); }, [phase]);
  const next = useCallback(() => {
    if (i < MOMENTS.length - 1) { setI(i + 1); setPhase("ask"); } else setPhase("end");
  }, [i]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      const k = e.key.toLowerCase();
      if (phase === "ask" && mode === "solo") {
        const map: Record<string, Light> = { g: "green", a: "amber", r: "red", "1": "green", "2": "amber", "3": "red" };
        if (map[k]) { e.preventDefault(); pick(map[k]); return; }
      }
      if (k === " " || k === "enter" || k === "arrowright") {
        if (t && t.tagName === "BUTTON" && k !== "arrowright") return; // let the focused button handle it
        if (phase === "ask" && mode === "room") { e.preventDefault(); reveal(); }
        else if (phase === "reveal") { e.preventDefault(); next(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, mode, pick, reveal, next]);

  const lit: Light | null = phase === "reveal" ? m.answer : null;
  const mine = picks[i];

  return (
    <section className={`gl gl--${phase} gl--${mode}`} aria-label="Green Light, the AI policy game">
      <div className="gl-stage">
        <Lamps lit={phase === "end" ? (mode === "solo" && score < MOMENTS.length - 2 ? "red" : mode === "solo" && score < MOMENTS.length ? "amber" : "green") : lit} cycling={phase === "intro" || (phase === "ask" && mode === "room")} onPick={pick} pickable={phase === "ask" && mode === "solo"} />

        <div className="gl-card" aria-live="polite">
          {phase === "intro" ? (
            <div className="gl-in">
              <p className="lab-x">The AI policy, as a game</p>
              <h2 className="gl-title">Green Light</h2>
              <p className="gl-lede">Eight real moments from a Two Palms week. Is it green, amber or red?</p>
              <ul className="gl-key">
                {LIGHTS.map((l) => <li key={l.key}><span className={`gl-dot gl-dot--${l.key}`} /><b>{l.word}</b><span>{l.meaning}</span></li>)}
              </ul>
              <div className="acts">
                <button type="button" className="btn btn--pri" onClick={() => start("solo")}>Play solo</button>
                <button type="button" className="btn btn--sec" onClick={() => start("room")}>Run it with the room</button>
              </div>
              <p className="note">Room mode is for sharing your screen: everyone votes G, A or R in the chat, then you reveal.</p>
            </div>
          ) : null}

          {phase === "ask" || phase === "reveal" ? (
            <div className="gl-in" key={m.id}>
              <div className="gl-top">
                <ol className="gl-dots" aria-label={`Moment ${i + 1} of ${MOMENTS.length}`}>
                  {MOMENTS.map((x, k) => (
                    <li key={x.id} className={k < i ? `is-done${mode === "solo" ? (picks[k] === x.answer ? " is-right" : " is-wrong") : ""}` : k === i ? "is-now" : ""} />
                  ))}
                </ol>
                <span className="lab-x">{mode === "room" ? "With the room" : "Solo"}</span>
              </div>

              <p className="gl-moment">{m.text}</p>

              {phase === "ask" && mode === "solo" ? (
                <div className="gl-picks" role="group" aria-label="Your call">
                  {LIGHTS.map((l) => (
                    <button key={l.key} type="button" className={`gl-pick gl-pick--${l.key}`} onClick={() => pick(l.key)}>
                      <span className={`gl-dot gl-dot--${l.key}`} /><b>{l.word}</b><kbd>{l.kbd}</kbd>
                    </button>
                  ))}
                </div>
              ) : null}

              {phase === "ask" && mode === "room" ? (
                <div className="gl-vote">
                  <p className="gl-vote-l">Vote in the chat: <b>G</b>, <b>A</b> or <b>R</b>.</p>
                  <button type="button" className="btn btn--hot" onClick={reveal}>Reveal <kbd>Space</kbd></button>
                </div>
              ) : null}

              {phase === "reveal" ? (
                <div className="gl-ans">
                  <p className={`gl-verdict gl-verdict--${m.answer}`}><span className="gl-verdict-w">{WORD[m.answer]}.</span> {m.verdict}</p>
                  {mode === "solo" && mine ? (
                    <p className={`gl-you ${mine === m.answer ? "is-right" : "is-wrong"}`}>{mine === m.answer ? "You called it." : `You said ${WORD[mine].toLowerCase()}.`}</p>
                  ) : null}
                  <p className="gl-why">{m.why}</p>
                  <p className="gl-rule"><span className="lab-x">From the policy</span> {m.rule}</p>
                  <div className="acts">
                    <button type="button" className="btn btn--pri" onClick={next} autoFocus>{i < MOMENTS.length - 1 ? "Next moment" : "See how you went"}</button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {phase === "end" ? (
            <div className="gl-in">
              {mode === "solo" ? (
                <>
                  <p className="lab-x">Your result</p>
                  <h2 className="gl-title">{licence(score).title}</h2>
                  <p className="gl-score mono">{score} / {MOMENTS.length}</p>
                  <p className="gl-lede">{licence(score).line}</p>
                </>
              ) : (
                <>
                  <p className="lab-x">That&rsquo;s the policy</p>
                  <h2 className="gl-title">One rule above all.</h2>
                  <p className="gl-lede">You own what you ship. Everything else is in two pages, and your Claude already knows them.</p>
                </>
              )}
              <div className="gl-ask">
                <p className="lab-x">Ask your Claude</p>
                <p className="gl-ask-q">Is anything I&rsquo;m doing this week a problem under our AI policy?</p>
                <CopyButton text="Is anything I'm doing this week a problem under our AI policy? Ask me what I'm working on first, then go through it with me." label="Copy the prompt" className="btn btn--sec" />
              </div>
              <div className="acts">
                <Link className="btn btn--pri" href="/two-palms/policy">Read the policy</Link>
                <CopyButton text={POLICY_TEXT} label="Copy the policy for Claude" className="btn btn--sec" />
                <button type="button" className="btn btn--sec" onClick={() => setPhase("intro")}>Play again</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
