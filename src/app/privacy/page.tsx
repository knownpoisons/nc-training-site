import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How NotContent (We Are Handsome LLC) collects, uses, and protects the information you share — including the AI Readiness Scorecard.",
};

const UPDATED = "July 11, 2026";

export default function PrivacyPage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative bg-[#1338BE] text-white overflow-hidden pt-32 pb-16">
        <div className="oci-grid-lines-light" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>LEGAL</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm">Privacy Policy</h1>
          <p className="mt-6 text-sm text-white/60">Last updated {UPDATED}</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="relative mx-auto max-w-3xl px-6 lg:px-8 space-y-12 text-sm leading-relaxed text-foreground/70">
          <p>
            This site, <strong>training.notcontent.ai</strong>, is operated by{" "}
            <strong>We Are Handsome LLC</strong>, doing business as NotContent.ai
            (&ldquo;NotContent,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). We
            keep this policy short and plain: here is exactly what we collect,
            why, and what you can do about it.
          </p>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              What we collect
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>AI Readiness Scorecard.</strong> When you take the
                Scorecard, we collect your name, work email, company, and the
                answers you select, so we can generate and send your results.
              </li>
              <li>
                <strong>Contact &amp; booking.</strong> If you book a call or
                email us, we keep what you send (name, email, and your message).
              </li>
              <li>
                <strong>Usage analytics.</strong> We use privacy-friendly,{" "}
                <strong>cookieless</strong> analytics (Vercel) to see aggregate
                traffic — page views, referrers, country, device. It does not
                track you across sites and does not build a profile of you.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              How we use it
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>To send you your Scorecard results.</li>
              <li>
                To follow up with you about NotContent training, and to send the
                occasional note relevant to AI for creative teams.
              </li>
              <li>To respond to your enquiries and improve the site.</li>
            </ul>
            <p className="mt-3">
              We do <strong>not</strong> sell your personal information, and we
              do not share it for anyone else&rsquo;s advertising.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Who processes it for us
            </h2>
            <p className="mb-3">
              We use a small set of trusted service providers to run the site
              and communicate with you. They only process your data on our
              behalf:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>Vercel</strong> — website hosting and cookieless
                analytics.
              </li>
              <li>
                <strong>Supabase</strong> — secure database where Scorecard
                submissions are stored.
              </li>
              <li>
                <strong>Beehiiv</strong> — our email list and newsletter.
              </li>
              <li>
                <strong>Resend</strong> — sends your results and our replies.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Email &amp; unsubscribing
            </h2>
            <p>
              When you take the Scorecard or sign up, we add you to our email
              list so we can send your results and occasional updates. Every
              email includes a one-click unsubscribe, and you can opt out at any
              time — no hard feelings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Your rights
            </h2>
            <p>
              You can ask us to show you what we hold, correct it, or delete it
              entirely — including your Scorecard submission. Depending on where
              you live (for example the EU/UK or California), you may have
              additional rights over your data. To exercise any of these, just
              email us and we&rsquo;ll take care of it.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Retention
            </h2>
            <p>
              We keep Scorecard and contact information for as long as it&rsquo;s
              useful for following up with you, and we delete it on request or
              when it&rsquo;s no longer needed.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Children
            </h2>
            <p>
              This site is intended for professionals. It is not directed at
              children, and we don&rsquo;t knowingly collect information from
              anyone under 16.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">Changes</h2>
            <p>
              If we update this policy, we&rsquo;ll change the date at the top.
              Material changes will be reflected here before they take effect.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">Contact</h2>
            <p>
              Questions, or want your data removed? Email{" "}
              <a
                href="mailto:getcontent@notcontent.ai"
                className="text-[#1338BE] underline underline-offset-2 hover:text-[#1338BE]/70"
              >
                getcontent@notcontent.ai
              </a>
              .
            </p>
            <p className="mt-3 text-foreground/40">
              We Are Handsome LLC, dba NotContent.ai
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
