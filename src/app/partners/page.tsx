import type { Metadata } from "next";
import { isPartnerAuthenticated } from "@/lib/partners-auth";
import { PartnerLogin } from "./partner-login";
import { PartnerHub } from "./partner-hub";
import "./partners.css";

export const metadata: Metadata = {
  title: "Partner Hub — NotContent",
  description:
    "Everything a NotContent referral partner needs, in one place. Not for public distribution.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  if (!(await isPartnerAuthenticated())) {
    return <PartnerLogin />;
  }
  return <PartnerHub />;
}
