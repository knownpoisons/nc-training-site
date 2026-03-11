import Link from "next/link";
import { Button } from "@/components/ui/button";

const footerLinks = [
  { name: "Foundations", href: "/programs/foundations" },
  { name: "Accelerator", href: "/programs/accelerator" },
  { name: "Transformation", href: "/programs/transformation" },
  { name: "Methodology", href: "/methodology" },
  { name: "Results", href: "/results" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Take the Scorecard", href: "/assess" },
];

const socialLinks = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/jeremy-somers/" },
  { name: "X", href: "https://x.com/jeremyjsomers" },
  { name: "Instagram", href: "https://www.instagram.com/jeremy.somers/" },
];

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="nc-container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold tracking-tight">
              NOTCONTENT{" "}
              <span className="font-light text-muted-foreground">
                / training
              </span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              AI creative training for enterprise teams. From the agency behind
              Adidas, Google, and Tommy Hilfiger campaigns.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Navigate
            </p>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Connect
            </p>
            <ul className="mt-4 space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="nc-divider mt-12 border-t border-foreground/10 pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Start with a call</p>
              <p className="mt-1 text-xs text-muted-foreground">30 minutes. No pitch. Just clarity on fit and next steps.</p>
            </div>
            <Button asChild size="sm" className="shrink-0 cursor-pointer text-xs uppercase tracking-widest">
              <Link href="/book">Book a Call</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 border-t border-foreground/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} NotContent. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Los Angeles · Hawaii · Sydney
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
