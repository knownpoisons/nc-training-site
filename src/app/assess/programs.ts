// Program metadata for the 2 creative training programs.
// Tier-to-program mapping lives in logic.ts.

export type Program = "foundations" | "transformation";

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
    pricing: "$5,000",
    duration: "Half-day · Up to 25 people",
  },
  transformation: {
    label: "AI Creative Transformation",
    tagline: "8-week program. Operational change that sticks.",
    detail:
      "In-person 2-day intensive plus weekly sessions. Role-specific tracks for CDs, designers, strategists, and production. Custom workflow buildout, governance policy, and ongoing monthly support. This is what we delivered to Cash App, Maesa, and Herman Scheer.",
    href: "/programs/transformation",
    pricing: "From $50,000",
    duration: "8 weeks + ongoing",
  },
};

// The alternative program to surface alongside the recommendation.
export const alternativeProgram: Record<Program, Program> = {
  foundations: "transformation",
  transformation: "foundations",
};
