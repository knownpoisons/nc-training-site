import type { Program } from "./questions";

export interface ProgramData {
  label: string;
  tagline: string;
  detail: string;
  href: string;
  pricing: string;
  duration: string;
}

export const programs: Record<Program, ProgramData> = {
  foundations: {
    label: "AI Creative Foundations",
    tagline: "Half-day workshop. One session that aligns your whole team.",
    detail:
      "Hands-on methodology session for teams starting out or needing alignment. Everyone leaves having produced real work with your brand assets — and a clear view of what AI can do for your workflow.",
    href: "/programs/foundations",
    pricing: "From $5,000",
    duration: "Half-day · Up to 25 people",
  },
  accelerator: {
    label: "AI Creative Accelerator",
    tagline: "4-week sprint. Your team ships real AI work by week two.",
    detail:
      "Weekly live sessions plus async Slack support. Custom prompt library built around your brand. Governance policy starter. By week four, the whole team has a working system — not just individual skills.",
    href: "/programs/accelerator",
    pricing: "From $15,000",
    duration: "4 weeks · Up to 15 people",
  },
  transformation: {
    label: "AI Creative Transformation",
    tagline: "8-week program. Operational change that sticks.",
    detail:
      "In-person 2-day intensive plus weekly sessions. Role-specific tracks for CDs, designers, strategists, and production. Custom workflow buildout, governance policy, and ongoing monthly support. This is what we delivered to Cash App, Maesa, and Herman Scheer.",
    href: "/programs/transformation",
    pricing: "Custom · from $50,000",
    duration: "8 weeks + ongoing",
  },
};

// The alternative program to surface alongside the recommendation
export const alternativeProgram: Record<Program, Program> = {
  foundations: "accelerator",
  accelerator: "transformation",
  transformation: "accelerator",
};
