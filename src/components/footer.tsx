import Link from "next/link";

const footerLinks = [
  { name: "Foundations", href: "/programs/foundations" },
  { name: "Accelerator", href: "/programs/accelerator" },
  { name: "Transformation", href: "/programs/transformation" },
  { name: "Imperative", href: "/programs/imperative" },
  { name: "Methodology", href: "/methodology" },
  { name: "Results", href: "/results" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Readiness Scorecard", href: "/assess" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/jeremy-somers/" },
  { name: "X", href: "https://x.com/jeremyjsomers" },
  { name: "Instagram", href: "https://www.instagram.com/jeremy.somers/" },
];

export function Footer() {
  return (
    <footer>
      {/* CTA band */}
      <div className="bg-[#1549CD] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/[0.08]" />
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-white/[0.08]" />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg lg:text-xl font-medium tracking-tight">
              Start with a call
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/50">
              30 minutes. No pitch. Just clarity on fit and next steps.
            </p>
          </div>
          <Link
            href="/book"
            className="px-8 py-3 bg-white text-[#1549CD] text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/90 transition-colors shrink-0"
          >
            Book a Discovery Call
          </Link>
        </div>
      </div>

      {/* Footer content */}
      <div className="border-t border-[#1549CD]/10 relative oci-grid-lines">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          {/* Section label */}
          <div className="oci-section-label mb-12">
            <span>NotContent</span>
            <span>[NC]</span>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                NOTCONTENT{" "}
                <span className="font-light text-foreground/40">
                  / training
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                AI creative training for enterprise teams. From the agency behind
                Adidas, Google, and Tommy Hilfiger campaigns.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1549CD]">
                Navigate
              </p>
              <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-[11px] uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1549CD]">
                Connect
              </p>
              <ul className="mt-4 space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] uppercase tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-foreground/10 pt-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/30">
                &copy; {new Date().getFullYear()} NotContent. All rights reserved.
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/30">
                Los Angeles · Hawaii · Sydney
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
