import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, score, tier } = await req.json();

    const apiKey = process.env.BEEHIIV_API_KEY;
    const pubId = process.env.BEEHIIV_PUBLICATION_ID;

    // If Beehiiv isn't configured yet, just acknowledge
    if (!apiKey || !pubId) {
      console.log("[assess] Beehiiv not configured — lead captured locally:", {
        name,
        email,
        score,
        tier,
      });
      return NextResponse.json({ ok: true });
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: false,
          utm_source: "ai-readiness-assessment",
          utm_medium: "organic",
          custom_fields: [
            { name: "first_name", value: name ?? "" },
            { name: "ai_score", value: String(score) },
            { name: "ai_tier", value: tier },
          ],
          tags: ["ai-assessment", `tier-${tier}`],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[assess] Beehiiv error:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[assess] Error:", err);
    return NextResponse.json({ ok: true }); // Never error to the user
  }
}
