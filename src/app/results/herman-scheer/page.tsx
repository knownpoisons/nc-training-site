import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Herman Scheer Case Study | AI Creative Training Results",
  description:
    "How Herman Scheer went from zero AI capability to $4.5M in estimated year-one production savings after NotContent training.",
};

export default function HermanScheerCaseStudy() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <Link
            href="/results"
            className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to Results
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Brand Agency
            </p>
            <span className="text-xs text-muted-foreground">·</span>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Full Training Program
            </p>
          </div>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">Herman Scheer</h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Big Los Angeles branding and design agency. Trained their entire
            team from zero to full AI production. Now producing client-ready
            campaigns visible in supermarkets across America.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "$4.5M", label: "Estimated year-one production savings" },
              { n: "Zero to full", label: "AI production capability" },
              { n: "New services", label: "Profitable AI offerings to clients" },
            ].map((stat) => (
              <div key={stat.n} className="border-l-2 border-background/30 pl-6">
                <p className="text-3xl font-light tracking-tight text-[#1549CD]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-background/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge / Solution / Result */}
      <section className="nc-divider nc-section">
        <div className="nc-container space-y-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Challenge
              </p>
              <h2 className="nc-heading-lg mt-4">
                Clients asking about AI. Agency at zero.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Herman Scheer is a major Los Angeles branding and design agency
                working with CPG brands on campaigns that end up in every
                supermarket across America. Their clients were asking about AI
                capability. The agency had zero structured AI processes — no
                shared methodology, no quality standard, no way to offer AI as
                a reliable production service.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Program
              </p>
              <h2 className="nc-heading-lg mt-4">
                Full team. Zero to production.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                We trained their entire team from zero. Before the training was
                even finished, they were producing client-ready and
                production-ready assets — image, copy, video, and full campaigns
                ready to go out into the world for major CPG launches. Work that
                can now be seen in every supermarket across America.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Result
              </p>
              <h2 className="nc-heading-lg mt-4">
                $4.5M in estimated year-one savings. New revenue streams.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Herman Scheer now offers new and very profitable AI-powered
                services to existing clients, and uses their new skills to
                package new offerings to new clients. Estimated production cost
                savings for year one: $4.5 million. The team went from zero
                AI capability to full production in a matter of weeks.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-8">
            <div className="border-l-2 border-[#1549CD] pl-8">
              <p className="text-lg font-light leading-relaxed italic">
                &ldquo;We&apos;ve been able to offer new and very profitable
                services to existing clients and use our skills to package new
                offerings to new clients as well. We feel comfortable moving
                into this new AI-powered world — that we are not falling
                behind, nor will get eaten up by another agency or any AI
                creative agencies that are out there.&rdquo;
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — Herman Scheer
              </p>
            </div>
            <div className="border-l-2 border-[#1549CD] pl-8">
              <p className="text-lg font-light leading-relaxed italic">
                &ldquo;Jeremy&apos;s training very quickly showed us what was
                possible and very soon after that taught us how to do it.
                It&apos;s insane what we are able to do now compared to what we
                were able to do just three months ago.&rdquo;
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — Herman Scheer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-xl">
            Want results like these?
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/assess">Take the Scorecard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer text-sm uppercase tracking-widest"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
