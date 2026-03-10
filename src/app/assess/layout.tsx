import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Creative Readiness Assessment | NotContent Training",
  description:
    "10 questions. 5 minutes. Find out exactly where your creative team stands on AI — and what program will get you to the next level.",
};

export default function AssessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
