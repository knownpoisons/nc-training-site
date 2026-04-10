import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Imperative Operations Training | AI for the Rest of the Business",
  description:
    "Claude and AI training for operations, leadership, and non-creative teams. Context engineering, workflow automation, and agent management — from the team that trained Adidas, Google, and Cash App.",
};

const tiers = [
  {
    name: "Foundations",
    duration: "Half-day workshop",
    price: "$5,000",
    people: "Up to 25",
    description:
      "Get your team set up properly on Claude. System prompts, projects, memory, styles — the configuration layer that turns a chatbot into a business tool.",
    items: [
      "Claude setup: system prompts, projects, memory, styles",
      "The RICE prompt framework for business use cases",
      "When to use AI vs when not to (the judgment layer)",
      "Hands-on: Build a Claude project for your actual workflow",
    ],
  },
  {
    name: "Accelerator",
    duration: "4-week sprint",
    price: "$15,000",
    people: "Up to 15",
    description:
      "Map your workflows, connect your tools, and systematically automate anything your team does more than twice.",
    items: [
      "Workflow mapping and systematic automation",
      "MCP connectors: Slack, Notion, CRM, Google Workspace",
      "Meeting intelligence: AI note-taking + structured extraction",
      "Cowork for non-technical leaders",
      "Hands-on: Automate 3 real workflows by end of program",
    ],
  },
  {
    name: "Transformation",
    duration: "8-week program",
    price: "Custom",
    people: "Org-wide",
    description:
      "Full Claude deployment across the organization. Internal tool building, agent management training, and an internal champion program that scales without you.",
    items: [
      "Full Claude deployment and configuration across the org",
      "Claude Code for internal tool building",
      "Agent management training: context switching, evaluation, systematic delegation",
      "CLAUDE.md, skills, hooks, subagents (the advanced stack)",
      "Internal champion program design and launch",
      "Hands-on: Build and deploy an internal AI system",
    ],
  },
];

const concepts = [
  {
    label: "Context Engineering",
    description:
      "The most important skill in AI isn't prompting. It's knowing what context to give the model — and what to leave out. This is the difference between generic output and output that actually moves your business forward.",
  },
  {
    label: "Workflow Mapping",
    description:
      "Before you automate anything, you map everything. Daily tasks, tools, pain points. Then you systematically eliminate anything your team does more than twice. The goal: nobody on your team ever does the same task thrice.",
  },
  {
    label: "Agent Management",
    description:
      "Your team now manages AI tools — but nobody taught them management skills. Context switching, output evaluation, systematic delegation. These are management skills applied to a new kind of direct report.",
  },
];

const whoItsFor = [
  {
    title: "Operations Leaders",
    description: "Running teams that process, produce, and ship. You need systems that scale without headcount.",
  },
  {
    title: "Founders & Executives",
    description: "You know AI matters. You don't know where to start that isn't a PowerPoint deck.",
  },
  {
    title: "Department Heads",
    description: "Finance, sales, HR, legal. Every function has repetitive workflows that AI can systematize.",
  },
  {
    title: "Non-Technical Teams",
    description: "You don't code. You don't need to. The people getting the most out of Claude are not programmers.",
  },
];

export default function ImperativePage() {
  return (
    <>
      {/* Hero — cobalt */}
      <section className="relative min-h-[60vh] bg-[#1549CD] text-white overflow-hidden flex items-end">
        <div className="oci-grid-lines-light" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-16 w-full">
          <div className="oci-section-label mb-8 border-white/20 text-white/40">
            <span>IMPERATIVE OPERATIONS TRAINING</span>
            <span>[NC]</span>
          </div>
          <h1 className="oci-display-sm max-w-4xl">
            AI training for the rest
            <br />
            of the business.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60">
            Not every team makes ads. But every team has workflows that AI can
            transform. Claude training for operations, leadership, and
            non-creative teams — from context engineering to agent management.
          </p>
          <div className="mt-8">
            <Link
              href="/book"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="oci-section-label mb-8">
                <span>THE PROBLEM</span>
                <span>[NC.1]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                Your team uses AI the way they use Google.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                Someone types a question. Gets an answer. Copies it into a
                document. That&apos;s not AI adoption — that&apos;s a search
                engine with extra steps. Your team has access to the most
                powerful reasoning tool ever built, and they&apos;re using it to
                rewrite emails.
              </p>
            </div>
            <div>
              <div className="oci-section-label mb-8">
                <span>THE SHIFT</span>
                <span>[NC.2]</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-light tracking-tight">
                From chatbot to operating system.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                Claude isn&apos;t a chat window. It&apos;s a platform you
                configure, connect to your tools, and build on. When your team
                learns to treat it that way — with system prompts, projects,
                connectors, and automation — the gap between &quot;using
                AI&quot; and &quot;running AI&quot; closes fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key concepts — dark */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12 border-white/20 text-white/40">
            <span>WHAT WE TEACH</span>
            <span>[NC.3]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-3xl">
            Three capabilities that compound.
          </h2>

          <div className="mt-12 grid gap-px bg-white/10 lg:grid-cols-3">
            {concepts.map((concept) => (
              <div key={concept.label} className="bg-foreground p-8">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
                  {concept.label}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-white/50">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three tiers */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>PROGRAMS</span>
            <span>[NC.4]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-3xl">
            Three levels. Same methodology.
          </h2>
          <p className="mt-4 max-w-xl text-sm text-foreground/60">
            Start where you are. Each tier builds on the last.
          </p>

          <div className="mt-12 grid gap-px bg-foreground/10 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <div key={tier.name} className="bg-background p-8 lg:p-10">
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                  0{i + 1}
                </p>
                <h3 className="mt-4 text-2xl font-light tracking-tight">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-foreground/40">
                  {tier.duration}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-foreground/60">
                  {tier.description}
                </p>
                <ul className="mt-8 space-y-3">
                  {tier.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-foreground/50"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#1549CD]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-foreground/10">
                  <p className="text-2xl font-light tracking-tight text-[#1549CD]">
                    {tier.price}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-foreground/40">
                    {tier.people}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The stack — progressive capability */}
      <section className="py-16 lg:py-24 bg-foreground text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12 border-white/20 text-white/40">
            <span>THE STACK</span>
            <span>[NC.5]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-3xl">
            Progressive capability. Each layer compounds the last.
          </h2>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                level: "Chat",
                title: "Claude AI",
                description:
                  "System prompts, projects, styles, memory. The foundation layer. Where most teams should start — and where most never go deep enough.",
              },
              {
                level: "Agentic",
                title: "Claude Cowork",
                description:
                  "File access, browser control, plugins, connectors. Claude stops being a conversation partner and starts being an autonomous agent.",
              },
              {
                level: "Builder",
                title: "Claude Code",
                description:
                  "Internal tools, automation systems, production-grade software. For teams ready to build things that didn't exist before.",
              },
            ].map((item) => (
              <div key={item.level} className="border-l border-white/10 pl-6">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#1549CD]">
                  {item.level}
                </p>
                <h3 className="mt-3 text-lg font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-16 lg:py-24 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="oci-section-label mb-12">
            <span>WHO THIS IS FOR</span>
            <span>[NC.6]</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight max-w-3xl">
            Built for teams that don&apos;t make ads.
          </h2>

          <div className="mt-12 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {whoItsFor.map((item) => (
              <div key={item.title} className="bg-background p-8">
                <h3 className="text-sm font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/50">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scorecard callout */}
      <section className="py-10 lg:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 border border-foreground/10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div>
              <p className="text-lg font-light tracking-tight">
                Not sure which level fits?
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                The scorecard gives you a clear recommendation based on your
                team&apos;s current AI maturity.
              </p>
            </div>
            <Link
              href="/assess"
              className="shrink-0 border border-foreground/20 px-8 py-3 text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-white"
            >
              Take the Readiness Scorecard →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA — cobalt band */}
      <section className="py-16 lg:py-24 bg-[#1549CD] text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="oci-display-sm mx-auto max-w-2xl">
            The teams that move first
            <br />
            don&apos;t move last.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm text-white/60">
            Your team already has access to AI. What they don&apos;t have is a
            system. Let&apos;s build one.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="border border-white/30 px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-[#1549CD]"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/assess"
              className="px-10 py-4 text-[11px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-white"
            >
              Take the Readiness Scorecard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
