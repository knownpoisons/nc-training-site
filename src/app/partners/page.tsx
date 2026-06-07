import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/hub-auth";
import { LoginForm } from "@/components/hub/login-form";
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
  if (!(await isAuthenticated())) {
    return <LoginForm clientDisplayName="Partner Playbook" />;
  }
  return <PartnerPlaybook />;
}
