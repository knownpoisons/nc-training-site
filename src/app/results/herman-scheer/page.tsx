import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Herman Scheer Case Study | AI Creative Training Results",
  description:
    "How Herman Scheer's agency team went from zero AI capability to offering AI-powered creative services to clients in 4 weeks.",
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
              Accelerator (4 weeks)
            </p>
          </div>
          <h1 className="nc-heading-xl mt-4 max-w-3xl">Herman Scheer</h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            Agency team upskilled to offer AI-powered creative services to
            clients. From zero capability to billable AI services in 4 weeks.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "3x", label: "Client deliverable volume" },
              { n: "4 weeks", label: "From zero to AI-capable" },
              { n: "New revenue", label: "AI services added to client offering" },
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
                Clients asking about AI. Agency not ready.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Herman Scheer is a brand strategy and design agency. Their clients
                were increasingly asking about AI capability — can you use AI for
                concept development? For visual exploration? For content production?
                The agency knew the opportunity was real but didn't have a
                structured approach. Individual team members had dabbled with
                Midjourney and ChatGPT, but there was no shared methodology, no
                quality standard, and no way to offer AI as a reliable service.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Program
              </p>
              <h2 className="nc-heading-lg mt-4">
                4-week Accelerator.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                The agency team went through the Accelerator program — weekly
                sessions plus async support, using their own client briefs and
                brand assets. By week two, the team was producing AI-assisted
                deliverables for actual client projects. The program included
                building a custom prompt library tuned to their clients' visual
                languages, establishing a governance framework for client work,
                and documenting workflows that any team member could follow.
              </p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                The Result
              </p>
              <h2 className="nc-heading-lg mt-4">
                A new service line. A faster team.
              </h2>
            </div>
            <div>
              <p className="nc-body">
                Herman Scheer now offers AI-powered creative services as part of
                their standard client offering. The team produces 3x more
                deliverable variations per project, enabling better client
                presentations and faster iteration cycles. The AI capability has
                become a competitive differentiator — they can answer "yes" when
                clients ask about AI, with a proven methodology behind the answer.
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
