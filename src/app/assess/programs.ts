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
    label: "Audit Workshop",
    tagline: "Half-day audit. Names what's working, what's blocking, and where the next 8 weeks should focus.",
    detail:
      "A half-day audit of your team's current AI state. Honest about where you are. Your whole team in the room. The audit becomes the brief for an Operating Model engagement when the gaps are bigger than a workshop can close.",
    href: "/programs/foundations",
    pricing: "$5,000",
    duration: "Half-day · Up to 25 people",
  },
  transformation: {
    label: "The Operating Model",
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
