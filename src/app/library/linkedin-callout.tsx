import Link from "next/link";

// Urgent, time-sensitive banner: LinkedIn is removing 1st-degree connection
// exports on Dec 1, 2026. Rendered ABOVE the gate and the library so every
// visitor sees it without signing up. Anchor: #linkedin-export.
const DOWNLOAD_URL = "https://www.linkedin.com/mypreferences/d/download-my-data";

export function LinkedInCallout() {
  return (
    <aside
      id="linkedin-export"
      className="li-callout"
      aria-label="Time-sensitive: download your LinkedIn connections before December 1"
    >
      <div className="inner">
        <div className="eyebrow">
          <span>⚠ Time-sensitive</span>
          <span className="dot">·</span>
          <span>Do this before Dec 1</span>
        </div>

        <h2>LinkedIn is closing connection exports. Grab yours now.</h2>

        <p className="lead">
          On <strong>December 1</strong>, LinkedIn removes the ability to export
          your 1st-degree connections. Most people don&rsquo;t know you can
          download this at all — and in an AI world it&rsquo;s one of the most
          valuable assets you own, because LinkedIn is locked down against
          scraping. Get it as a CSV while you still can. It takes about ten
          minutes and it&rsquo;s 100% allowed by LinkedIn.
        </p>

        <a
          className="cta"
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open LinkedIn Data Export →
        </a>

        <div className="grid">
          <div>
            <p className="label">How to download</p>
            <ol>
              <li>
                Open the{" "}
                <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                  LinkedIn data export page
                </a>{" "}
                — or go to the <strong>Me</strong> icon (top right) →{" "}
                <strong>Settings &amp; Privacy</strong> →{" "}
                <strong>Data Privacy</strong>.
              </li>
              <li>
                Choose <strong>&ldquo;Download larger data archive&rdquo;</strong>,
                make sure <strong>Connections</strong> is included, and request
                it.
              </li>
              <li>
                LinkedIn emails you when the file is ready — usually within about
                ten minutes.
              </li>
              <li>
                Click the link in the email →{" "}
                <strong>&ldquo;Download my data.&rdquo;</strong> You&rsquo;ll get
                a ZIP; inside it is <strong>Connections.csv</strong>.
              </li>
              <li>
                <strong>Save it straight away</strong> — the download link
                expires after a few days.
              </li>
            </ol>
          </div>

          <div>
            <p className="label">What&rsquo;s in the file</p>
            <p className="whatsin">
              First name, last name, profile URL, company, position, and the
              date you connected.
            </p>
            <p className="label label-gap">Good to know</p>
            <ul>
              <li>
                Emails are mostly blank — you only get one for connections who
                opted to let their network download it.
              </li>
              <li>Company &amp; title can be out of date or missing for some people.</li>
              <li>
                The link expires after a few days, so save the file the moment
                it lands.
              </li>
            </ul>
          </div>
        </div>

        <p className="tiein">
          Already have your <strong>Connections.csv</strong>? The library&rsquo;s
          first prompt —{" "}
          <Link href="/library/linkedin-prospect-intelligence">
            LinkedIn Prospect Intelligence
          </Link>{" "}
          — turns it into a ranked, voice-matched outreach dashboard.
        </p>
      </div>
    </aside>
  );
}
