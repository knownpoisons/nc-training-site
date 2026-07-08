import Link from "next/link";
import { CopyLine } from "./copy-line";
import { AccordionItem } from "./accordion-item";
import { RevealOnScroll } from "./reveal-on-scroll";

// ─── Section head: small cobalt num + big serif title + hairline rule ─────────
function Hed({ num, title }: { num: string; title: string }) {
  return (
    <div className="hed">
      <span className="num">{num}</span>
      <h2>{title}</h2>
      <span className="rule" />
    </div>
  );
}

export function PartnerPlaybook() {
  return (
    <div className="partners">
      <RevealOnScroll />
      {/* ─── Topbar ──────────────────────────────────────────────────── */}
      <div className="topbar">
        <Link href="/" className="brand">
          NotContent <span className="dot">·</span> Partner Playbook
        </Link>
        <span className="counter">
          <strong>Internal</strong> · partner use
        </span>
      </div>

      {/* ─── 1 — Hero ────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="eyebrow">
          <span>Howdy, partner — this is your weapon, not a brochure</span>
          <span className="rule" />
        </div>
        <h1>
          Don&rsquo;t pitch the training.
          <br />
          Run the <span className="accent">play</span>.
        </h1>

        <div className="hero-quote-block">
          <p className="hero-quote-label">If you say one thing</p>
          <CopyLine
            variant="quote"
            text={`"Your team is already using AI. But not as a team — different tools, different skill levels, no shared standard."`}
          >
            <p className="hero-quote">
              &ldquo;Your team is already using AI. But not as a team — different
              tools, different skill levels, no shared standard.&rdquo;
            </p>
          </CopyLine>
        </div>

        <div className="hero-quote-block">
          <p className="hero-quote-label">And the fix</p>
          <CopyLine
            variant="quote"
            text={`"One simple, shared stack that takes the whole team from zero to a hundred — without the hype, and without chasing a new tool or model every week."`}
          >
            <p className="hero-quote">
              &ldquo;One simple, shared stack that takes the whole team from zero
              to a hundred — without the hype, and without chasing a new tool or
              model every week.&rdquo;
            </p>
          </CopyLine>
        </div>

        <p className="hero-intro">
          You know people who run creative teams. This page turns a coffee into a
          referral. It&rsquo;s built around one reframe: don&rsquo;t sell features,
          change how someone sees their own business. You&rsquo;re not a salesperson
          and you don&rsquo;t need to be. Start with the three moves below — the
          rest is backup for when a conversation goes deep. Lift any line, tap to
          copy, don&rsquo;t freelance the numbers.
        </p>
      </section>

      {/* ─── 2 — Start here (the most important section) ─────────────── */}
      <section className="section section-lead">
        <div className="hed hed-lead">
          <h2>Start here.</h2>
          <span className="rule" />
        </div>
        <p className="section-sub">Read this even if you read nothing else.</p>

        <p className="lead-statement">
          You&rsquo;re not selling. You&rsquo;re connecting two people you rate.
        </p>

        <p className="body">
          Your job ends at the intro — Jem takes it from there. That&rsquo;s the
          whole reason it works: a warm &ldquo;you should talk to my mate
          Jem&rdquo; beats any cold pitch, because the trust is already in the
          room. You never have to be a salesperson. The whole job is three moves.
        </p>

        {/* ─── Three moves ──────────────────────────────────────────── */}
        <div className="moves">
          {/* 01 — Notice */}
          <div className="move">
            <span className="move-num">01</span>
            <div className="move-body">
              <h3 className="move-title">Notice the moment.</h3>
              <p>
                You&rsquo;re not prospecting. You&rsquo;re listening for when a
                friend, ex-boss or colleague moans about the thing — &ldquo;we
                don&rsquo;t know what we&rsquo;re doing with AI&rdquo;, a hire
                that didn&rsquo;t stick, the team falling behind, &ldquo;is this
                going to take our jobs&rdquo;. That&rsquo;s your cue. It always
                comes up now.
              </p>
            </div>
          </div>

          {/* 02 — Drop one line */}
          <div className="move">
            <span className="move-num">02</span>
            <div className="move-body">
              <h3 className="move-title">Drop one line.</h3>
              <p className="move-sub">
                Casual, in your own words. Plant the reframe and stop.
              </p>
              <CopyLine
                variant="quote"
                text={`"Honestly, your team's already using AI — just all doing their own thing. Different tools, no shared level, bit of a mess. I know the guy who sorts exactly that."`}
              >
                <p className="quote">
                  &ldquo;Honestly, your team&rsquo;s already using AI — just all
                  doing their own thing. Different tools, no shared level, bit
                  of a mess. I know the guy who sorts exactly that.&rdquo;
                </p>
              </CopyLine>
            </div>
          </div>

          {/* 03 — Offer the intro */}
          <div className="move">
            <span className="move-num">03</span>
            <div className="move-body">
              <h3 className="move-title">Offer the intro.</h3>
              <p>
                If they lean in —{" "}
                <strong>&ldquo;Want me to connect you to Jem?&rdquo;</strong> Send
                the intro message further down this page. Done. You don&rsquo;t
                quote prices, explain the tools, or handle objections. When in
                doubt, intro.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Permission ───────────────────────────────────────────── */}
        <div className="permissions">
          <div className="permission">
            <p className="permission-title">Say it like you, not like this page.</p>
            <p>
              The reframe is what matters, not the wording. Every line here is
              scaffolding — put it in your own voice. Everything below is backup
              for if a conversation goes deep. You never have to use it.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3 — The Play (accordion) ────────────────────────────────── */}
      <section className="section">
        <Hed num="02" title="The Play." />
        <p className="section-sub">
          Go deeper · only if the conversation runs long.
        </p>
        <p className="body">
          If a chat turns into a proper conversation, this is the arc. Each move
          has a line to say and a question to ask. The questions do the work —
          they make them find the problem themselves. You&rsquo;ll rarely need
          all six.
        </p>

        <div className="acc">
          <AccordionItem
            stage="01 · Warmer"
            title="They&rsquo;re already three years in"
          >
            <PlayBody
              say="You're three years into AI whether you've named it or not. People on your team are using it on client work every week."
              sayDisplay={`"You’re three years into AI whether you’ve named it or not. People on your team are using it on client work every week."`}
              ask="How many of your people used AI on a client deliverable last month — and can you name the tools they used?"
              askDisplay={`"How many of your people used AI on a client deliverable last month — and can you name the tools they used?"`}
            />
          </AccordionItem>

          <AccordionItem
            stage="02 · The Reframe"
            title="You have no idea what they&rsquo;re doing with it"
          >
            <PlayBody
              say="There's no stack, no rules, no oversight. Work has already gone out the door made with AI and presented as hand-built. You suspect it. You can't prove it. You can't name the tools."
              sayDisplay={`"There’s no stack, no rules, no oversight. Work has already gone out the door made with AI and presented as hand-built. You suspect it. You can’t prove it. You can’t name the tools."`}
              ask="If a client asked tomorrow which AI tools touched their campaign, could anyone in the building answer?"
              askDisplay={`"If a client asked tomorrow which AI tools touched their campaign, could anyone in the building answer?"`}
            />
          </AccordionItem>

          <AccordionItem
            stage="03 · Rational drowning"
            title="The free-for-all is costing you now"
          >
            <PlayBody
              say="One person's on Midjourney, one's on ChatGPT, one expensed a tool nobody else can use. You can't hire — candidates list tools you've never heard of. And one or two people got fluent on their own and now quietly do everyone else's AI work for them."
              sayDisplay={`"One person’s on Midjourney, one’s on ChatGPT, one expensed a tool nobody else can use. You can’t hire — candidates list tools you’ve never heard of. And one or two people got fluent on their own and now quietly do everyone else’s AI work for them."`}
              ask="When you last tried to hire, could you actually judge whether someone had AI skills — or did everyone just say yes?"
              askDisplay={`"When you last tried to hire, could you actually judge whether someone had AI skills — or did everyone just say yes?"`}
            />
          </AccordionItem>

          <AccordionItem
            stage="04 · Emotional impact"
            title="It&rsquo;s not replacement. It&rsquo;s a two-speed team"
          >
            <PlayBody
              say="The danger isn't AI taking your people's jobs. It's your best people becoming a single point of failure while a competitor's whole team moves at ten times the pace."
              sayDisplay={`"The danger isn’t AI taking your people’s jobs. It’s your best people becoming a single point of failure while a competitor’s whole team moves at ten times the pace."`}
              ask="If your sharpest creative left tomorrow, how much of your AI capability walks out with them?"
              askDisplay={`"If your sharpest creative left tomorrow, how much of your AI capability walks out with them?"`}
            />
          </AccordionItem>

          <AccordionItem
            stage="05 · A new way"
            title="Mandate. Stack. Brains switched back on"
          >
            <PlayBody
              say="Three things fix it. A mandate that says it's okay. One simple, shared stack — so nobody's stuck asking 'which tool, which model' every week. And training that switches their brains back on. None of this has been anyone's job yet — and it's the biggest technical and creative shift our industry's ever seen. They need structure and guidance, not more hype."
              sayDisplay={`"Three things fix it. A mandate that says it’s okay. One simple, shared stack — so nobody’s stuck asking 'which tool, which model' every week. And training that switches their brains back on. None of this has been anyone’s job yet — and it’s the biggest technical and creative shift our industry’s ever seen. They need structure and guidance, not more hype."`}
              ask="What would change if every person here was at the same standard — not one or two heroes, the whole team?"
              askDisplay={`"What would change if every person here was at the same standard — not one or two heroes, the whole team?"`}
            />
          </AccordionItem>

          <AccordionItem
            stage="06 · The solution"
            title="NotContent. Eight weeks. Real work shipped"
          >
            <PlayBody
              say={`It's techniques over tools — not "how to make an AI video", that's the by-product. By the end the team re-runs one of your real campaigns inside the training, and you compare the hard numbers against when they had no skills. They leave building their own systems.`}
              sayDisplay={`"It’s techniques over tools — not 'how to make an AI video', that’s the by-product. By the end the team re-runs one of your real campaigns inside the training, and you compare the hard numbers against when they had no skills. They leave building their own systems."`}
              ask="What's it worth to have the whole team dangerous with AI in eight weeks instead of eighteen months?"
              askDisplay={`"What’s it worth to have the whole team dangerous with AI in eight weeks instead of eighteen months?"`}
            />
          </AccordionItem>
        </div>
      </section>

      {/* ─── 4 — When they push back (accordion) ─────────────────────── */}
      <section className="section">
        <Hed num="03" title="When they push back." />
        <p className="section-sub">Backup for if they get sceptical.</p>
        <p className="body">
          Don&rsquo;t monologue — one punch, then hand it back with a question.
          You don&rsquo;t need to win the argument; you need to get them curious
          enough for the intro.
        </p>

        <div className="acc">
          <AccordionItem
            stage="Objection"
            title="You&rsquo;re going to replace our people."
          >
            <PunchBody
              punch={`"Nobody gets fired. We strap each person to a rocket so they can drive it — they get from New York to London faster, but they're still flying it. The driver matters more, not less."`}
              redirect="Which of your people would you most want strapped to it first?"
              redirectDisplay={`"Which of your people would you most want strapped to it first?"`}
            />
          </AccordionItem>

          <AccordionItem stage="Objection" title="We already did AI training.">
            <PunchBody
              punch={`"Most AI training is tool demos — everyone leaves saying they didn't really learn anything. This is the operating model: briefing, workflows, the stack, governance, systems they keep. 80% of it isn't what you picture when you hear 'AI training'."`}
              redirect="Ask your team what they actually shipped differently after the last one."
              redirectDisplay={`"Ask your team what they actually shipped differently after the last one."`}
            />
          </AccordionItem>

          <AccordionItem
            stage="Objection"
            title="Isn&rsquo;t this all hype — a silver bullet?"
          >
            <PunchBody
              punch={`"It's the opposite of a silver bullet. Point it the wrong way — try to fully automate — and it falls apart, every time. The sausage is still getting made and it's ugly. But pointed right, by people who know how to drive it, you amplify the work 10x."`}
              redirect="Want to see real client work where you genuinely can't tell what's AI and what was shot?"
              redirectDisplay={`"Want to see real client work where you genuinely can’t tell what’s AI and what was shot?"`}
            />
          </AccordionItem>

          <AccordionItem stage="Objection" title="How do we even hire for this now?">
            <PunchBody
              punch={`"You can't yet — because there's no standard. Since the Mac, every creative used Adobe; you didn't even put it on a CV. Now there are a thousand tools nobody's heard of. Get your whole team to one standard first, and 'AI skills' starts to mean something."`}
              redirect={`What does your job spec say under "AI skills" right now — honestly?`}
              redirectDisplay={`"What does your job spec say under 'AI skills' right now — honestly?"`}
            />
          </AccordionItem>
        </div>
      </section>

      {/* ─── 5 — Who you're sending them to (about Jem) ──────────────── */}
      <section className="section about-jem">
        <Hed num="04" title="Who you’re sending them to." />
        <p className="section-sub">So you can vouch with a straight face.</p>

        <p className="cred-strip">
          First AI creative agency <span className="cred-dot">·</span> before
          ChatGPT <span className="cred-dot">·</span> 90%+ margins
        </p>

        <p className="lead-statement">
          Jem started the first AI creative agency three years ago — before
          ChatGPT existed.
        </p>

        <p className="body">
          He built it to 90%+ margins making work for Adidas, Tommy Hilfiger,
          Google and a lot more. He&rsquo;s not a consultant who read about this
          in a newsletter — he ran the business, shipped the work, took the
          money. Now he trains agencies and in-house brand teams to do the
          same.
        </p>
      </section>

      {/* ─── 6 — Proof (3 cards + kicker) ────────────────────────────── */}
      <section className="section">
        <Hed num="05" title="Proof." />
        <p className="section-sub">
          Use these numbers exactly · don&rsquo;t round, don&rsquo;t reattach.
        </p>

        <div className="proof-grid">
          <article className="proof-card">
            <p className="proof-label">Cash App</p>
            <p className="proof-situation">
              Brand team producing high-fidelity 3D assets ad hoc, at cost, no
              repeatable workflow.
            </p>
            <ul className="proof-stats">
              <li>90% cut in production time</li>
              <li>30% increase in campaign output</li>
              <li>est. $3.5M first-year savings</li>
            </ul>
            <CopyLine
              variant="quote"
              text={`"They run the system in-house now. I see their releases in my feed and know exactly how they made them."`}
            >
              <p className="proof-line">
                &ldquo;They run the system in-house now. I see their releases in
                my feed and know exactly how they made them.&rdquo;
              </p>
            </CopyLine>
          </article>

          <article className="proof-card">
            <p className="proof-label">Maesa</p>
            <p className="proof-situation">
              Every launch needed hero shoots and outside production partners.
            </p>
            <ul className="proof-stats">
              <li>$280K saved on a single brand launch</li>
              <li>Three months instead of nine</li>
            </ul>
            <CopyLine
              variant="quote"
              text={`"Three months instead of nine. $280K saved on one launch."`}
            >
              <p className="proof-line">
                &ldquo;Three months instead of nine. $280K saved on one launch.&rdquo;
              </p>
            </CopyLine>
          </article>

          <article className="proof-card">
            <p className="proof-label">Herman Scheer</p>
            <p className="proof-situation">
              Asset volume tied to expensive real-shoot production.
            </p>
            <ul className="proof-stats">
              <li>$4.5M in estimated year-one savings</li>
              <li>Zero to full AI production</li>
            </ul>
            <CopyLine
              variant="quote"
              text={`"Zero to full AI production — $4.5M in year-one savings."`}
            >
              <p className="proof-line">
                &ldquo;Zero to full AI production — $4.5M in year-one savings.&rdquo;
              </p>
            </CopyLine>
          </article>
        </div>

        <CopyLine
          variant="block"
          text={`"Half a live campaign is now AI, half is shot — and you genuinely can't tell which is which."`}
        >
          <p className="kicker">
            &ldquo;Half a live campaign is now AI, half is shot — and you
            genuinely can&rsquo;t tell which is which.&rdquo;
          </p>
        </CopyLine>
      </section>

      {/* ─── 6 — Who to send our way ─────────────────────────────────── */}
      <section className="section section-tight">
        <Hed num="06" title="Who to send our way." />
        <p className="section-sub">Look for.</p>

        <ul className="criteria-list">
          <li>
            Agencies — creative, media or branding — or in-house creative,
            brand and media teams.
          </li>
          <li>
            The decision-maker with budget, or the AI-forward person right
            beside them.
          </li>
          <li className="hot">
            <span className="hot-flag">Hot signal</span>
            They post about AI, or have publicly named it as a priority.
          </li>
          <li className="hot">
            <span className="hot-flag">Hot signal</span>
            They&rsquo;re hiring for &ldquo;AI skills&rdquo; — and clearly
            can&rsquo;t define it.
          </li>
          <li>
            Strong seam: media agencies. Effectively non-creative, and the
            briefing bottleneck is brutal.
          </li>
          <li>
            Anyone visibly drowning in tool chaos with no stack and no rules.
          </li>
        </ul>
      </section>

      {/* ─── 7 — The facts ───────────────────────────────────────────── */}
      <section className="section section-tight section-facts">
        <Hed num="07" title="The facts." />
        <p className="section-sub">
          Only after the value&rsquo;s built · never lead with price.
        </p>

        <div className="facts-grid">
          <article className="fact">
            <p className="fact-prefix">Starts at</p>
            <p className="fact-num">
              $50k <span className="fact-currency">USD</span>
            </p>
            <p className="fact-label">
              8-week programme. Anything bigger scales from here.
            </p>
          </article>
        </div>

        <p className="framing">
          The comparison isn&rsquo;t other training — it&rsquo;s the cost of
          standing still. Don&rsquo;t defend the number. Clarify what&rsquo;s
          bought.
        </p>
      </section>

      {/* ─── 8 — Three rules ─────────────────────────────────────────── */}
      <section className="section section-close">
        <Hed num="08" title="Three rules." />
        <p className="section-sub">Guardrails.</p>

        <div className="rules">
          <article className="rule-card">
            <p className="rule-title">Use the exact numbers.</p>
            <p>
              No rounding up, no inventing, no number attached to the wrong
              client. One fact-check kills the whole pitch.
            </p>
          </article>
          <article className="rule-card">
            <p className="rule-title">Never promise a silver bullet.</p>
            <p>
              The entire pitch is that it isn&rsquo;t one. Oversell it and you
              set the client up to feel let down — worse than no referral.
            </p>
          </article>
          <article className="rule-card">
            <p className="rule-title">Don&rsquo;t sell outside the stack.</p>
            <p>
              The LLM Chat &amp; Build ecosystem and the AI node-canvas suite.
              If they ask about something else, flag it and pass it back to
              Jem.
            </p>
          </article>
        </div>
      </section>

      {/* ─── 9 — Footer ──────────────────────────────────────────────── */}
      <footer className="foot">
        <p>
          NOTCONTENT.AI — Partner Playbook. Internal use for referral partners.
          Quotes are Jem&rsquo;s own words, lightly tidied; questions and the
          intro message are written for partner use. Numbers verified for
          client-facing use.
        </p>
      </footer>
    </div>
  );
}

// ─── Small inner components for the accordion bodies ─────────────────────────

interface PlayBodyProps {
  say: string;
  sayDisplay: string;
  ask: string;
  askDisplay: string;
}

function PlayBody({ say, sayDisplay, ask, askDisplay }: PlayBodyProps) {
  return (
    <div className="play-body">
      <div className="play-row">
        <span className="play-label">Say this</span>
        <CopyLine variant="quote" text={say}>
          <p className="play-quote">{sayDisplay}</p>
        </CopyLine>
      </div>
      <div className="play-row">
        <span className="play-label">Ask this</span>
        <CopyLine variant="quote" text={ask}>
          <p className="play-quote">{askDisplay}</p>
        </CopyLine>
      </div>
    </div>
  );
}

interface PunchBodyProps {
  punch: string;
  redirect: string;
  redirectDisplay: string;
}

function PunchBody({ punch, redirect, redirectDisplay }: PunchBodyProps) {
  return (
    <div className="play-body">
      <div className="play-row">
        <span className="play-label">Punch</span>
        <CopyLine variant="quote" text={punch}>
          <p className="play-quote">{punch}</p>
        </CopyLine>
      </div>
      <div className="play-row">
        <span className="play-label">Redirect</span>
        <CopyLine variant="quote" text={redirect}>
          <p className="play-quote">{redirectDisplay}</p>
        </CopyLine>
      </div>
    </div>
  );
}
