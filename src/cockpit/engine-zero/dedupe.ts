// ═══════════════════════════════════════════════════════════════════════════════
// DEDUPE — one person, sources stacked. Merge on email; fall back to
// name+company. A person hit across several sources becomes ONE record whose
// warmth stacks (a community + LinkedIn + scorecard lead is Tier A by
// definition). The strictest consent lane across sources always wins.
// ═══════════════════════════════════════════════════════════════════════════════

import { strictestConsent, type LeadSource, type MergedLead, type RawLead } from "./types";

function emailKey(l: RawLead): string | null {
  return l.email ? l.email.trim().toLowerCase() : null;
}
function nameCompanyKey(l: RawLead): string | null {
  if (!l.name) return null;
  return `${l.name.trim().toLowerCase()}|${(l.company ?? "").trim().toLowerCase()}`;
}

function firstNonNull<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) if (v !== null && v !== undefined && v !== "") return v as T;
  return null;
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

function mergeInto(base: MergedLead, add: RawLead): MergedLead {
  const sources = base.sources.includes(add.source) ? base.sources : [...base.sources, add.source];
  return {
    name: firstNonNull(base.name, add.name),
    email: firstNonNull(base.email, add.email),
    company: firstNonNull(base.company, add.company),
    role: firstNonNull(base.role, add.role),
    linkedinUrl: firstNonNull(base.linkedinUrl, add.linkedinUrl),
    sources,
    consentLane: strictestConsent(base.consentLane, add.consentLane),
    engagementRecency: laterDate(base.engagementRecency, add.engagementRecency),
    sourceDetail: { ...base.sourceDetail, [add.source]: add.sourceDetail },
  };
}

function toMerged(l: RawLead): MergedLead {
  return {
    name: l.name,
    email: l.email,
    company: l.company,
    role: l.role,
    linkedinUrl: l.linkedinUrl,
    sources: [l.source as LeadSource],
    consentLane: l.consentLane,
    engagementRecency: l.engagementRecency,
    sourceDetail: { [l.source]: l.sourceDetail },
  };
}

/**
 * Merge a batch of RawLeads. Two-key strategy: email first (authoritative), then
 * name+company for records missing an email. Returns one MergedLead per person.
 */
export function dedupe(leads: RawLead[]): MergedLead[] {
  const byEmail = new Map<string, MergedLead>();
  const byNameCo = new Map<string, MergedLead>();
  const merged: MergedLead[] = [];

  const register = (m: MergedLead) => {
    merged.push(m);
    const ek = m.email ? m.email.trim().toLowerCase() : null;
    const nk = m.name ? `${m.name.trim().toLowerCase()}|${(m.company ?? "").trim().toLowerCase()}` : null;
    if (ek) byEmail.set(ek, m);
    if (nk) byNameCo.set(nk, m);
  };

  for (const lead of leads) {
    const ek = emailKey(lead);
    const nk = nameCompanyKey(lead);

    const existing = (ek && byEmail.get(ek)) || (nk && byNameCo.get(nk)) || null;
    if (existing) {
      const updated = mergeInto(existing, lead);
      // mutate in place so both indexes point at the same object
      Object.assign(existing, updated);
      // (re)index in case a key became newly available after the merge
      const nek = existing.email ? existing.email.trim().toLowerCase() : null;
      const nnk = existing.name
        ? `${existing.name.trim().toLowerCase()}|${(existing.company ?? "").trim().toLowerCase()}`
        : null;
      if (nek) byEmail.set(nek, existing);
      if (nnk) byNameCo.set(nnk, existing);
    } else {
      register(toMerged(lead));
    }
  }
  return merged;
}
