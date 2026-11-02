// TPM-POL-001 · Two Palms AI Policy, Version 6.
// Source: Fergus's V6 draft (29 Oct 2026) with Jem's 29 Oct edits accepted.
// Team-side rule: no staff names, so people appear as roles.
// To update the hub: change this file only. The page and the copy-to-Claude text both read from it.

export const POLICY_META = {
  number: "TPM-POL-001",
  version: "6.0",
  replaces: "V4",
  status: "Draft until signed off by the Managing Director",
  signedOff: false,
  owner: "Head of AI",
  operations: "Operations Manager",
  approvedBy: "Managing Director",
  appliesTo: "Everyone working for or with Two Palms Group: Two Palms Media, Studio Palms, Two Palms Talent, Only Sports and our German team.",
  review: "Every six months, and whenever the law or our tools change.",
  lastReviewed: "29 Oct 2026",
};

export const POLICY_WHY = [
  "AI is part of how Two Palms works, and a bigger part every month. We use it to research, write, plan, make, analyse and run our processes, and we build AI agents and AI-powered services for our clients. We want everyone using it, experimenting and getting good at it. The ideas, craft, judgement and relationships are still ours. AI gives us more time for them.",
  "This policy is short on purpose: the few rules that always apply, and where your judgement matters most. Anything that changes often lives in our living guides.",
];

export const POLICY_RULE_ONE = {
  title: "You own what you ship",
  body: "If AI helped make it, you are still responsible for it. Read it, check it and stand behind it before it goes anywhere. There is no AI exemption in the law: anything we send or publish is judged exactly as if a person made it.",
};

export const POLICY_FREELY = [
  "Use AI for internal work as much as you like: research, first drafts, analysis, reporting, notes, decks, ideas and admin.",
  "Use approved Two Palms accounts only (see the AI Tool Register), never personal ones, for Two Palms or client work. Business accounts keep our data out of model training. That includes AI features inside tools we already use. Anything you build with AI stays private: no client information behind public links.",
  "Want a new tool? Ask the Head of AI. We would rather say yes quickly than have people work around us.",
  "Share what works. Good prompts, workflows and agents go in the shared library.",
];

export const POLICY_CARE = [
  {
    t: "Client and personal information",
    d: "Put client information into approved tools only, and only what the task needs. Never put in passwords, bank or ID numbers, health information, anything about children, or anything a client has asked us to keep out of AI. AI note-takers: ask outside guests first and tell everyone.",
  },
  {
    t: "Anything that goes to a client, the media or the public",
    d: "A person checks every fact, figure, name, quote and link, and approves it before it goes. AI makes things up convincingly. Never publish claims about real people or companies you have not verified.",
  },
  {
    t: "Creative work",
    d: "Know where you stand with each client: what they have approved and their AI level. If a client says no AI, we follow it. We do create AI cast, scenes and food, and when we do it should look as real as possible, with AI food still showing the product as customers will actually get it. Never create or change a real person's face, body or voice without their written consent for that use, or prompt with living artists' names. Follow the legal and platform disclosure rules, which keep changing; the Creative AI Guide has the current ones. Only use references we have rights to, don't copy existing brands, characters or work, and never promise exclusive ownership of raw AI output (copyright may not cover it).",
  },
];

export const POLICY_HARD_NOS = [
  "Create fake reviews, testimonials, customers or results and present them as real.",
  "Create sexual or intimate images, video or audio of a real person, or anything that sexualises a child. These are crimes.",
  "Mislead people in a way that matters: about what a product is or does, what a real person said or did, or about news, health, safety or elections. Stunts and concept images are fine when the client has approved them, they follow platform labelling rules, and anything sent to media as a concept is labelled as one.",
  "Let AI make decisions about people on its own, such as hiring, performance, pay or which creators we work with. A person decides and can explain why.",
];

export const POLICY_AGENTS = {
  intro: "We build and use AI agents. Every agent:",
  items: [
    "has a named owner who is responsible for what it does, and is listed on the Agent Register;",
    "can research, draft, organise and act inside Two Palms systems, but a person approves anything sent to a client or posted publicly;",
    "gets only the access it needs, with its own credentials (never a person's login) kept in the password manager;",
    "is tested before it goes live and can be paused by its owner at any time. Watch for hidden instructions in emails or web pages that agents read.",
  ],
};

export const POLICY_LEVELS = [
  { n: "No AI", d: "None." },
  { n: "Assist", d: "AI behind the scenes only." },
  { n: "Create", d: "AI in the final work." },
];

export const POLICY_CLIENTS = [
  { t: "Client terms come first", d: "If a client's contract or instructions limit AI, those limits apply. Every client has an AI level, set by the account lead at kick-off." },
  { t: "We are open about it", d: "We tell clients when AI materially shapes work they receive, and we answer honestly whenever they ask how we use AI." },
  { t: "AI we build for clients", d: "Client data stays with that client. We test before handover, document its limits, and public-facing AI says it is AI. If it helps decide things about people, their privacy policy must say so (from 10 Dec 2026)." },
  { t: "Freelancers and partners", d: "Follow this policy and their contract, use Two Palms accounts or business accounts we have approved for them, and tell us how they used AI." },
];

export const POLICY_LEARNING = [
  { t: "Learning", d: "Everyone completes our AI training when they join and when it is refreshed." },
  { t: "Monitoring", d: "Two Palms AI accounts are company systems, covered by our workplace surveillance notice." },
  { t: "Germany", d: "EU and German law add a few steps (GDPR, AI labelling, note-taker consent, works council); the German team gets a local briefing." },
];

export const POLICY_WRONG = {
  triggers: ["Confidential information goes into the wrong tool", "Something wrong goes out", "An agent misbehaves", "Anyone complains about our use of AI"],
  body: "Tell the Head of AI or the Operations Manager the same day. Reporting a mistake quickly is never a problem; hiding one is. Deliberate or repeated breaches may lead to disciplinary action.",
};

export const POLICY_ASK = [
  { who: "Head of AI", what: "Tools, agents and creative AI" },
  { who: "Operations Manager", what: "Accounts and access" },
];

/** The living guides the policy points to. `href` set = live in the hub. */
export const POLICY_GUIDES: { t: string; owner: string; d: string; href?: string }[] = [
  { t: "AI Tool Register", owner: "Operations Manager", d: "Which tools are approved. In the Kit, under Model board.", href: "/two-palms/kit" },
  { t: "Agent Register", owner: "Head of AI", d: "Every agent, its owner and what it can touch." },
  { t: "Creative AI Guide", owner: "Head of AI", d: "Creative how-tos and the current disclosure rules." },
];

const bullets = (xs: string[]) => xs.map((x) => `- ${x}`).join("\n");

/** Plain text of the whole policy, for pasting into Claude. */
export const POLICY_TEXT = `TWO PALMS AI POLICY (${POLICY_META.number}, Version ${POLICY_META.version})
Status: ${POLICY_META.status}. Owner: ${POLICY_META.owner}. Applies to: ${POLICY_META.appliesTo}

WHY WE USE AI
${POLICY_WHY.join("\n")}

ONE RULE ABOVE ALL: ${POLICY_RULE_ONE.title.toUpperCase()}
${POLICY_RULE_ONE.body}

USE AI FREELY
${bullets(POLICY_FREELY)}

WHERE TO TAKE CARE
${POLICY_CARE.map((c, i) => `${i + 1}. ${c.t}. ${c.d}`).join("\n")}

HARD NO'S (never, in any tool, for any reason)
${bullets(POLICY_HARD_NOS)}

AGENTS
${POLICY_AGENTS.intro}
${bullets(POLICY_AGENTS.items)}

CLIENTS AND THE WORK WE SELL
${bullets(POLICY_CLIENTS.map((c) => `${c.t}. ${c.d}`))}
Client AI levels: ${POLICY_LEVELS.map((l) => `${l.n} = ${l.d}`).join(" ")}

LEARNING, MONITORING AND GERMANY
${bullets(POLICY_LEARNING.map((c) => `${c.t}. ${c.d}`))}

WHEN SOMETHING GOES WRONG
If: ${POLICY_WRONG.triggers.join("; ").toLowerCase()}.
${POLICY_WRONG.body}

QUESTIONS?
${POLICY_ASK.map((a) => `${a.who}: ${a.what.toLowerCase()}`).join(". ")}.

Living guides: ${POLICY_GUIDES.map((g) => `${g.t} (${g.owner})`).join(", ")}. Review: ${POLICY_META.review} Last reviewed ${POLICY_META.lastReviewed}.`;
