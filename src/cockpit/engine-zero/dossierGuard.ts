// ═══════════════════════════════════════════════════════════════════════════════
// DOSSIER GUARD — hard rule: every claim in a dossier carries its source URL.
// No found fact, no claim. Invented biography in an opener is a killed deal.
//
// A thin-web-presence person must yield a short HONEST dossier ("little public
// info found"), never filler. This function strips any uncited claim and, if
// nothing survives, returns the honest fallback.
// ═══════════════════════════════════════════════════════════════════════════════

export interface DossierClaim {
  text: string;
  sourceUrl: string | null;
}

export interface GuardedDossier {
  line: string; // the two-line dossier, citations inline
  claims: DossierClaim[]; // only cited claims survive
  openerAngle: string | null;
  honest: boolean; // true → nothing verifiable found
}

function isValidUrl(u: string | null): boolean {
  if (!u) return false;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const HONEST_FALLBACK =
  "Little public info found — approach honestly, no assumed detail. Reference only what they've told us.";

export function guardDossier(
  rawClaims: DossierClaim[],
  openerAngle: string | null
): GuardedDossier {
  const cited = rawClaims.filter((c) => c.text.trim().length > 0 && isValidUrl(c.sourceUrl));

  if (cited.length === 0) {
    // No verifiable fact → honest fallback, and an opener angle may not assert
    // any biography either.
    return { line: HONEST_FALLBACK, claims: [], openerAngle: null, honest: true };
  }

  const line = cited.map((c) => `${c.text.trim()} (${c.sourceUrl})`).join(" ");
  return { line, claims: cited, openerAngle, honest: false };
}
