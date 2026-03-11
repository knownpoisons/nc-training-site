import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CaseStudyImage } from "@/components/case-study-image";

export const metadata: Metadata = {
  title: "Case Studies | Real Results from AI Creative Training",
  description:
    "Real results from enterprise creative teams trained by NotContent. $8M+ in combined savings. Case studies from Cash App, Maesa, and Herman Scheer.",
};

const caseStudies = [
  {
    client: "Cash App",
    slug: "/results/cash-app",
    industry: "Fintech / Enterprise",
    program: "Full Training Program",
    logo: "/images/logos/cash-app.svg",
    image: "/images/case-studies/cash-app.jpg",
    headline:
      "Production time cut to 10%. $3.5M in estimated year-one savings.",
    summary:
      "Part of Square and Block. Trained a small internal creative team \u2014 producers, designers, 3D artists. Production ready by halfway through. Process reduced to 10% of the usual time.",
    stats: [
      { n: "90%", label: "Reduction in production time" },
      { n: "$3.5M", label: "Estimated year-one savings" },
      { n: "30%", label: "Increase in campaign output" },
    ],
    challenge:
      "Cash App had a small but mighty internal creative team \u2014 producers, designers, 3D artists. They needed to produce more campaigns, faster, while securing budgets for big hybrid productions across TVC, out-of-home, and digital. The existing process was too slow for the pace the business demanded.",
    result:
      "Process refined to 10% of the usual time. Estimated increase in campaign capacity: at least 30%. Estimated cost savings over year one: $3.5 million. The team now moves faster, pitches stronger, and produces more \u2014 without adding headcount.",
    quote:
      "Jeremy\u2019s training was fun and really gave us the strategies, frameworks, and tools that we needed to completely revolutionize how we produce creative \u2014 both internally for pitching and externally for production.",
    quoteName: "Jose Diaz",
    quoteTitle: "Head of Production, Cash App",
  },
  {
    client: "Maesa",
    slug: "/results/maesa",
    industry: "Beauty / CPG",
    program: "Full Training Program",
    logo: "/images/logos/maesa.svg",
    image: "/images/case-studies/maesa.jpg",
    headline:
      "New brand launched into every Target store. 3 months instead of 9. $280K saved.",
    summary:
      "Trained two internal teams across a dozen beauty, hair, and fragrance brands. Launched a new brand into every Target store entirely with AI. 3 months instead of 9. $280,000 saved on a single launch.",
    stats: [
      { n: "$280K", label: "Saved on a single brand launch" },
      { n: "3 months", label: "Instead of the usual 9 months" },
      { n: "12+", label: "Brands rolling out AI processes" },
    ],
    challenge:
      "Maesa is one of the largest indie beauty incubators in the world, producing in-house brands for Target. Two internal creative teams covering over a dozen brands. A typical brand launch took nine months and cost $280,000. They needed to move faster without sacrificing quality.",
    result:
      "Launched a new hair care brand into every Target store using AI \u2014 in 3 months instead of 9, at close to zero cost. Now rolling out AI-powered creative processes across every brand in their portfolio.",
    quote:
      "Jeremy and NotContent will save us tens of millions of dollars in the next year alone.",
    quoteName: "Oshyia Savur",
    quoteTitle:
      "VP Marketing, Maesa \u2014 on stage at a national beauty conference",
  },
  {
    client: "Herman Scheer",
    slug: "/results/herman-scheer",
    industry: "Brand Agency / LA",
    program: "Full Training Program",
    logo: "/images/logos/herman-scheer.svg",
    image: "/images/case-studies/herman-scheer.jpg",
    headline:
      "$4.5M in estimated year-one production savings. Zero to full AI production.",
    summary:
      "Big Los Angeles branding and design agency. Trained their entire team from zero to full AI production. Now producing client-ready campaigns visible in supermarkets across America.",
    stats: [
      { n: "$4.5M", label: "Estimated year-one savings" },
      { n: "Zero \u2192 full", label: "AI production capability" },
      { n: "New services", label: "Profitable AI offerings to clients" },
    ],
    challenge:
      "Herman Scheer is a major LA branding and design agency working with CPG brands on campaigns that end up in every supermarket across America. Their clients were asking about AI capability. The agency had zero structured AI processes \u2014 no shared methodology, no quality standard.",
    result:
      "Now offers new and very profitable AI-powered services to existing clients, and uses their new skills to package new offerings to new clients. Estimated production cost savings for year one: $4.5 million.",
    quotes: [
      {
        text: "We\u2019ve been able to offer new and very profitable services to existing clients and use our skills to package new offerings to new clients as well. We feel comfortable moving into this new AI-powered world \u2014 that we are not falling behind, nor will get eaten up by another agency.",
        name: "Adam",
        title: "Creative Director, Herman Scheer",
      },
      {
        text: "Jeremy\u2019s training very quickly showed us what was possible and very soon after that taught us how to do it. It\u2019s insane what we are able to do now compared to what we were able to do just three months ago.",
        name: "Ludovic Bertron",
        title: "Executive Creative Director, Herman Scheer",
      },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="nc-section pt-32 lg:pt-40">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Case Studies
          </p>
          <h1 className="nc-heading-xl mt-4 max-w-4xl">
            What happens after training.
          </h1>
          <p className="nc-body-lg mt-6 max-w-2xl">
            These aren&apos;t hypothetical projections. These are real outcomes
            from enterprise creative teams that completed NotContent training
            programs.
          </p>
        </div>
      </section>

      {/* Aggregate stats */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container">
          <div className="grid gap-8 sm:grid-cols-4">
            {[
              { n: "$8M+", label: "Combined estimated client savings" },
              { n: "90%", label: "Average reduction in production time" },
              { n: "3", label: "Enterprise teams transformed" },
              {
                n: "Tens of millions",
                label: "Projected savings (Maesa, on stage)",
              },
            ].map((stat) => (
              <div
                key={stat.n}
                className="border-l-2 border-background/30 pl-6"
              >
                <p className="text-3xl font-light tracking-tight text-[#1549CD]">
                  {stat.n}
                </p>
                <p className="mt-1 text-sm text-background/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {caseStudies.map((study, i) => (
        <section
          key={study.client}
          className={`nc-divider nc-section ${i % 2 === 1 ? "bg-foreground/[0.02]" : ""}`}
        >
          <div className="nc-container">
            {/* Header */}
            <div className="flex items-center gap-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {study.industry}
              </p>
              <span className="text-xs text-muted-foreground">&middot;</span>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {study.program}
              </p>
            </div>

            {/* Client logo */}
            <div className="mt-6 h-12 w-48">
              <CaseStudyImage
                src={study.logo}
                alt={`${study.client} logo`}
                className="h-full w-auto object-contain object-left"
              />
            </div>

            <h2 className="nc-heading-xl mt-4">{study.client}</h2>
            <p className="nc-body-lg mt-4 max-w-3xl">{study.headline}</p>

            {/* Image + Stats row */}
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {/* Image placeholder */}
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-foreground/10 bg-foreground/[0.03]">
                <CaseStudyImage
                  src={study.image}
                  alt={`${study.client} case study`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/40">
                    {study.client}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/30">
                    Add image &rarr; public{study.image}
                  </p>
                </div>
              </div>

              {/* Stats + Summary */}
              <div>
                <div className="grid gap-6 sm:grid-cols-3">
                  {study.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="border-l-2 border-[#1549CD] pl-5"
                    >
                      <p className="text-2xl font-light tracking-tight text-[#1549CD]">
                        {stat.n}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="nc-body mt-8">{study.summary}</p>
              </div>
            </div>

            {/* Challenge / Result */}
            <div className="mt-16 grid gap-12 lg:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  The Challenge
                </p>
                <p className="nc-body mt-4">{study.challenge}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  The Result
                </p>
                <p className="nc-body mt-4">{study.result}</p>
              </div>
            </div>

            {/* Testimonial(s) */}
            <div className="mt-16 space-y-8">
              {"quote" in study && study.quote && (
                <div className="border-l-2 border-[#1549CD] pl-8">
                  <p className="text-lg font-light leading-relaxed italic">
                    &ldquo;{study.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    &mdash; {study.quoteName}, {study.quoteTitle}
                  </p>
                </div>
              )}
              {"quotes" in study &&
                study.quotes?.map((q) => (
                  <div
                    key={q.name}
                    className="border-l-2 border-[#1549CD] pl-8"
                  >
                    <p className="text-lg font-light leading-relaxed italic">
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      &mdash; {q.name}, {q.title}
                    </p>
                  </div>
                ))}
            </div>

            {/* Read full case study link */}
            <div className="mt-12">
              <Link
                href={study.slug}
                className="text-sm font-medium uppercase tracking-widest text-[#1549CD] transition-colors hover:text-[#1549CD]/80"
              >
                Read full case study &rarr;
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Logos */}
      <section className="nc-divider nc-section">
        <div className="nc-container">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Teams We&apos;ve Trained
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-8">
            {[
              { name: "Cash App", logo: "/images/logos/cash-app.svg" },
              { name: "Maesa", logo: "/images/logos/maesa.svg" },
              { name: "Herman Scheer", logo: "/images/logos/herman-scheer.svg" },
              { name: "Nike", logo: "/images/logos/nike.svg" },
              { name: "Apple", logo: "/images/logos/apple.svg" },
              { name: "Adidas", logo: "/images/logos/adidas.svg" },
              { name: "Google", logo: "/images/logos/google.svg" },
            ].map((brand) => (
              <div key={brand.name} className="h-8 w-28">
                <CaseStudyImage
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-full object-contain opacity-50 grayscale"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nc-divider nc-section bg-foreground text-background">
        <div className="nc-container text-center">
          <h2 className="nc-heading-lg mx-auto max-w-xl">
            Your team could be next.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-background/60">
            Take the 2-minute Scorecard to find out where your team stands
            &mdash; or skip straight to a conversation.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="cursor-pointer bg-background text-foreground text-sm uppercase tracking-widest hover:bg-background/90"
            >
              <Link href="/assess">Take the Scorecard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="cursor-pointer border-background/30 text-background text-sm uppercase tracking-widest hover:bg-background/10"
            >
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
