import Link from "next/link";

// Time-sensitive banner. The real change (confirmed Nov 2026): LinkedIn is NOT
// removing the ability to export connections — from December 2026 the export
// will simply stop including connections' email, current company, and job
// title. So the urgency is to grab the FULL export now, while company + title
// are still in it. Rendered above the gate + the library. Anchor: #linkedin-export.
const DOWNLOAD_URL = "https://www.linkedin.com/mypreferences/d/download-my-data";
const PROMPT_URL = "/library/linkedin-prospect-intelligence";

const STEPS: { n: string; body: React.ReactNode }[] = [
  {
    n: "01",
    body: (
      <>
        Open the{" "}
        <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
          LinkedIn Data Export page
        </a>{" "}
        — or go to <strong>Me</strong> (top right) →{" "}
        <strong>Settings &amp; Privacy</strong> → <strong>Data Privacy</strong> →{" "}
        <strong>Get a copy of your data</strong>.
      </>
    ),
  },
  {
    n: "02",
    body: (
      <>
        Choose <strong>&ldquo;Download larger data archive&rdquo;</strong> — that&rsquo;s
        the one that includes your connections — and hit{" "}
        <strong>Request archive</strong> (it may ask for your password).
      </>
    ),
  },
  {
    n: "03",
    body: (
      <>
        LinkedIn emails you when it&rsquo;s ready. The full archive can take
        anywhere from a few minutes to about 24 hours — so{" "}
        <strong>start it now, don&rsquo;t wait</strong>.
      </>
    ),
  },
  {
    n: "04",
    body: (
      <>
        Click the link in the email →{" "}
        <strong>&ldquo;Download my data.&rdquo;</strong> You&rsquo;ll get a ZIP;
        your list is <strong>Connections.csv</strong> at the top level.
      </>
    ),
  },
  {
    n: "05",
    body: (
      <>
        Save it straight away — the download link is only live for{" "}
        <strong>72 hours</strong>.
      </>
    ),
  },
];

export function LinkedInCallout() {
  return (
    <aside
      id="linkedin-export"
      className="li-callout"
      aria-label="Time-sensitive: download your full LinkedIn connections export before December 2026"
    >
      {/* ── Zone 1 — the alert ───────────────────────────────────────── */}
      <div className="li-alert">
        <div className="inner">
          <div className="eyebrow">
            <span>⚠ Time-sensitive</span>
            <span className="dot">·</span>
            <span>Do this before December 2026</span>
          </div>

          <h2>Grab your LinkedIn connections while they still have the good data.</h2>

          <p className="lead">
            This isn&rsquo;t about losing your connection list — you&rsquo;ll always
            have the names. It&rsquo;s about the columns that make the list
            <em> useful</em>. Right now your export includes each connection&rsquo;s{" "}
            <strong>company and job title</strong>. In LinkedIn&rsquo;s own words:
          </p>

          <blockquote className="li-quote">
            &ldquo;As of December 2026, your data download no longer includes your
            connections&rsquo; email addresses, current companies, or job titles.&rdquo;
          </blockquote>

          <p className="lead">
            After that, you&rsquo;re left with names, profile links and connect
            dates. Export the full version now, while the part worth having is
            still in it. It takes a few minutes to start and it&rsquo;s 100%
            allowed by LinkedIn.
          </p>

          {/* before / after */}
          <div className="li-ba">
            <div className="li-ba-col keep">
              <p className="li-ba-head">Export today</p>
              <p className="li-ba-fields">
                Name · Profile URL · <strong>Company</strong> ·{" "}
                <strong>Job title</strong> · <strong>Email</strong> (opted-in
                only) · Connect date
              </p>
            </div>
            <div className="li-ba-col lose">
              <p className="li-ba-head">From December 2026</p>
              <p className="li-ba-fields">
                Name · Profile URL · Connect date{" "}
                <span className="li-ba-gone">
                  — company, title &amp; email gone
                </span>
              </p>
            </div>
          </div>

          <a
            className="cta"
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open LinkedIn Data Export →
          </a>
        </div>
      </div>

      {/* ── Zone 2 — numbered steps ──────────────────────────────────── */}
      <div className="li-steps">
        <div className="inner">
          <p className="li-steps-head">How to download — 5 steps, ~5 minutes</p>
          <ol className="li-step-list">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="li-step-n">{s.n}</span>
                <span className="li-step-body">{s.body}</span>
              </li>
            ))}
          </ol>

          <div className="li-fyi">
            <p className="li-fyi-head">Good to know</p>
            <ul>
              <li>
                Emails are mostly blank anyway — LinkedIn only includes one for
                connections who opted to share it (usually a tiny fraction).
              </li>
              <li>
                Company &amp; job title can be out of date or missing for some
                people — but those are the exact columns disappearing in
                December, so grab them now.
              </li>
              <li>This is desktop-only. Do it on a laptop, not the app.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Zone 3 — the big payoff CTA ──────────────────────────────── */}
      <div className="li-payoff">
        <div className="inner">
          <div className="li-payoff-text">
            <p className="li-payoff-eyebrow">Got your Connections.csv?</p>
            <h3>Now do something amazing with it.</h3>
            <p className="li-payoff-sub">
              Feed it into the library&rsquo;s first prompt and turn a raw export
              into a ranked, voice-matched outreach dashboard you can actually
              run from — scored prospects, personalised messages, one clickable
              view.
            </p>
          </div>
          <Link className="li-payoff-cta" href={PROMPT_URL}>
            LinkedIn Prospect Intelligence →
          </Link>
        </div>
      </div>
    </aside>
  );
}
