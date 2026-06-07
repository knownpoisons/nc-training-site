import type { Metadata } from "next";
import { isPartnerAuthenticated } from "@/lib/partners-auth";
import { PartnerLogin } from "./partner-login";
import { PartnerPlaybook } from "./partner-playbook";
import "./partners.css";

export const metadata: Metadata = {
  title: "Partner Playbook — NotContent",
  description:
    "Internal playbook for NotContent referral partners. Not for public distribution.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  if (!(await isPartnerAuthenticated())) {
    return <PartnerLogin />;
  }
  return <PartnerPlaybook />;
}
