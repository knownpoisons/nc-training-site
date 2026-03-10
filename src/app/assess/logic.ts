import type { Program, Option } from "./questions";

export type Scores = Record<Program, number>;

// ─── Compute raw scores from selected options ─────────────────────────────────
export function computeScores(selectedOptions: Option[]): Scores {
  const totals: Scores = { foundations: 0, accelerator: 0, transformation: 0 };
  for (const opt of selectedOptions) {
    totals.foundations += opt.scores.foundations;
    totals.accelerator += opt.scores.accelerator;
    totals.transformation += opt.scores.transformation;
  }
  return totals;
}

// ─── Get winning program ──────────────────────────────────────────────────────
export function getRecommendation(scores: Scores): Program {
  return (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]) as Program;
}

// ─── Normalise scores to percentages for the fit bars ────────────────────────
export function normalisedScores(scores: Scores): Scores {
  const max = Math.max(...Object.values(scores));
  if (max === 0) return { foundations: 0, accelerator: 0, transformation: 0 };
  return {
    foundations: Math.round((scores.foundations / max) * 100),
    accelerator: Math.round((scores.accelerator / max) * 100),
    transformation: Math.round((scores.transformation / max) * 100),
  };
}

// ─── Personalised reasons based on answer indices ────────────────────────────
// answers[i] = the lowest-index selected option for question i (0-indexed)
// Q1 option indices (updated — "Increase output" is now index 0):
//   0 = Increase creative output
//   1 = Replace/reduce external production
//   2 = Give team AI skills
//   3 = Move faster
//   4 = Create structure around ad-hoc AI
//   5 = Understand what's possible
export function getReasons(answers: number[], program: Program): string[] {
  const reasons: string[] = [];

  const q1 = answers[0]; // what do you want to achieve
  const q2 = answers[1]; // success looks like
  const q3 = answers[2]; // scale of change
  // answers[3] = why whole team (Q4) — not used in reasons
  const q4 = answers[4]; // current AI state (Q5)
  const q5 = answers[5]; // team size (Q6)
  const q6 = answers[6]; // deadline (Q7)
  const q7 = answers[7]; // biggest obstacle (Q8)
  const q8 = answers[8]; // prior training (Q9)

  // ── TRANSFORMATION ──────────────────────────────────────────────────────────
  if (program === "transformation") {
    // Primary reason — based on goal
    if (q1 === 0)
      reasons.push(
        "Increasing output at scale isn't a skills problem — it's a systems problem. The Transformation builds the operating model your team needs: custom workflows, a shared methodology, and the governance to run AI-assisted production independently."
      );
    else if (q1 === 1)
      reasons.push(
        "You want to replace external production costs — that needs your team to be fully operational with AI, not just experimentally using it. The Transformation program builds that."
      );
    else if (q3 === 0)
      reasons.push(
        "You said you want transformational change. The Foundations and Accelerator are excellent programs, but only the Transformation is designed to permanently embed AI into how your team operates."
      );
    else if (q2 === 3)
      reasons.push(
        "You want a shared methodology and governance policy as your outcome — that's the deliverable the Transformation is built around: custom workflows, a documented AI policy, and role-specific training."
      );
    else
      reasons.push(
        "Based on your goals, your team needs more than skills — they need a new operating model. The Transformation program builds that from the ground up."
      );

    // Secondary reason — based on team/context
    if (q5 >= 2)
      reasons.push(
        `With a team of ${q5 === 2 ? "16–30" : "30+"} people, a single-format training won't cut it. The Transformation includes role-specific tracks for Creative Directors, Designers, Strategists, and Production — so every function gets what they actually need.`
      );
    else if (q6 === 3)
      reasons.push(
        "You're already behind. The Transformation's 8-week structure — including a 2-day in-person intensive — is designed to close significant capability gaps fast, not build slowly over months."
      );
    else if (q8 === 2)
      reasons.push(
        "You've tried structured training before and it didn't stick. The Transformation includes ongoing monthly support post-program — so adoption doesn't fade once the training ends."
      );
    else
      reasons.push(
        "The Transformation includes a 2-day in-person intensive, custom workflow buildout for your specific production setup, and ongoing monthly coaching — so what you build stays built."
      );

    // Tertiary reason — based on obstacle or work type
    if (q7 === 2)
      reasons.push(
        "Governance is solved inside the Transformation: we build your AI policy, approved tool list, and client disclosure standard as part of the curriculum, not as an afterthought."
      );
    else if (q7 === 0)
      reasons.push(
        "Fragmented AI use needs more than methodology training — it needs documented workflows, governance, and role-specific skills. All three are core deliverables of the Transformation."
      );
    else
      reasons.push(
        "Clients who complete the Transformation program typically see 96% reduction in campaign production time and produce 400% more creative output — with their full internal team, independently."
      );
  }

  // ── ACCELERATOR ─────────────────────────────────────────────────────────────
  if (program === "accelerator") {
    // Primary reason
    if (q1 === 0)
      reasons.push(
        "You want to increase output. The Accelerator's 4-week structure gets your team producing real AI-assisted work by session two — with a custom prompt library built around your brand so every team member is shipping more, faster."
      );
    else if (q1 === 2)
      reasons.push(
        "You want to supplement your team's skills without disrupting what already works. The Accelerator is designed exactly for this — weekly 2-hour sessions that layer AI capability onto your existing workflow without replacing it."
      );
    else if (q1 === 3)
      reasons.push(
        "You have a timeline to hit. The Accelerator's 4-week structure gets your team producing real AI-assisted work by session two — not at the end of a course, halfway through it."
      );
    else if (q7 === 0)
      reasons.push(
        "Your team is using AI but there's no shared system. The Accelerator's core purpose is building that: a common methodology, a custom prompt library, and a shared quality bar that everyone follows."
      );
    else
      reasons.push(
        "The Accelerator gets your whole team producing real AI-assisted work within 4 weeks — with a custom prompt library built around your brand and async Slack support throughout."
      );

    // Secondary
    if (q6 === 0)
      reasons.push(
        "With something coming in the next 4–8 weeks, the 4-week Accelerator fits your timeline almost exactly. Your team ships real AI work before the deadline."
      );
    else if (q5 === 1)
      reasons.push(
        "For a team of 6–15 people, the Accelerator's flat-fee structure makes it the highest-value-per-person option — everyone gets trained, not just a few."
      );
    else if (q7 === 1)
      reasons.push(
        "Skills gap is precisely what the Accelerator addresses. Weekly hands-on sessions, plus a prompt library built around your brand's specific tools and aesthetic, close the gap fast."
      );
    else
      reasons.push(
        "The Accelerator includes 4 weekly live sessions, a dedicated Slack channel for async Q&A, a custom prompt library, recorded sessions, and a governance policy starter — everything to go from stuck to shipping."
      );

    // Tertiary
    if (q8 === 1)
      reasons.push(
        "You've done basic tool tutorials but no methodology training. That's exactly the gap the Accelerator fills — the tools are relatively easy, the framework for when and how to use them is what changes how your team works."
      );
    else if (q4 === 2)
      reasons.push(
        "You have fragmented AI use across the team. The Accelerator turns individual experiments into a shared system — same methodology, same quality standard, same language for everyone."
      );
    else
      reasons.push(
        "By week two, every team member is shipping real AI-assisted work. That's not a promise — it's how the program is structured. Production starts in session two, not after a 4-week theory phase."
      );
  }

  // ── FOUNDATIONS ─────────────────────────────────────────────────────────────
  if (program === "foundations") {
    // Primary
    if (q1 === 5)
      reasons.push(
        "You want to understand what's possible before committing — that's exactly what the Foundations workshop is for. In half a day, your team goes from zero to a clear picture of what AI can (and can't) do for your specific workflow."
      );
    else if (q3 === 3)
      reasons.push(
        "You're in exploratory mode. The Foundations workshop gives you the full picture — tools, methodology, governance — without the commitment of a multi-week program. Think of it as a high-quality proof of concept."
      );
    else
      reasons.push(
        "The Foundations workshop gets your whole team aligned on methodology, tools, and governance in a single session. Everyone leaves having produced real work using their own brand assets."
      );

    // Secondary
    if (q4 === 0)
      reasons.push(
        "Starting from zero, the most valuable move is giving everyone the same baseline simultaneously. Foundations does that — shared vocabulary, shared methodology, shared starting point for the whole team."
      );
    else if (q7 === 3)
      reasons.push(
        "If leadership hasn't fully committed yet, a half-day workshop is the best way to build the business case. Real demos, real output from your own brand assets, real methodology. It tends to be convincing."
      );
    else if (q5 === 0)
      reasons.push(
        "With a smaller team, a focused half-day gets everyone aligned fast — without the overhead of a multi-week program. It's often the highest-leverage starting point."
      );
    else
      reasons.push(
        "In four hours: the Diverge/Converge methodology, live tool demos with your brand assets, a governance starter kit, and a clear picture of what the right next step is for your team."
      );

    // Tertiary — always the same (conversion insight)
    reasons.push(
      "Most teams who start with Foundations convert to the Accelerator or Transformation within 60 days — because half a day is enough to show what's possible, and what's possible tends to be more compelling than expected."
    );
  }

  return reasons.filter(Boolean).slice(0, 3);
}
