import Link from "next/link";

const footerLinks = [
  { name: "Foundations", href: "/programs/foundations" },
  { name: "Transformation", href: "/programs/transformation" },
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
              <div className="flex items-center gap-3">
                <img
                  src="/images/logos/brand/NCT-Icon-PlatinumonBlue.png"
                  alt=""
                  className="h-10 w-10 rounded-[2px] shadow-sm ring-1 ring-black/5"
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em]">
                  NOTCONTENT{" "}
                  <span className="font-light text-foreground/40">
                    / training
                  </span>
                </p>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
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
              <div className="flex items-center gap-3">
                <img
                  src="/images/logos/brand/NCT-Icon-blueonplatinum.png"
                  alt=""
                  className="h-5 w-5 rounded-[2px] opacity-50"
                />
                <p className="text-[11px] uppercase tracking-[0.15em] text-foreground/30">
                  &copy; {new Date().getFullYear()} NotContent. All rights reserved.
                </p>
              </div>
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
