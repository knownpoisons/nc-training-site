/**
 * Shared JSON-LD for NotContent. The two @ids below are fixed for the whole
 * NotContent Visibility program and are also used on notcontent.ai. Never change them.
 * No LocalBusiness, PostalAddress, FAQPage, Course or Service nodes, per the brief.
 */
export const SITE_URL = "https://training.notcontent.ai";
export const ORGANIZATION_ID = "https://notcontent.ai/#organization";
export const PERSON_ID = "https://notcontent.ai/#jeremy-somers";
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * GATE. The entity line names clients, so it stays out of this public repo until
 * each name has a cleared row in the proof register. When cleared, paste the
 * verbatim line from the project's technical-layer.md. Empty means the
 * description property is left out of the Organization node.
 */
export const ENTITY_LINE = "";

/** Only profiles confirmed to exist. Crunchbase, Clutch and LBB are added once built. */
const ORGANIZATION_SAME_AS = [
  "https://www.linkedin.com/company/notcontent-ai",
  "https://training.notcontent.ai",
];
const PERSON_SAME_AS = [
  "https://www.linkedin.com/in/jeremy-somers/",
  "https://mumbrella.com.au/i-dont-even-think-were-at-the-early-898625",
];

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "NotContent",
    url: "https://www.notcontent.ai",
    logo: `${SITE_URL}/images/logos/brand/NCT-Icon-PlatinumonBlue.webp`,
    foundingDate: "2022",
    founder: { "@id": PERSON_ID },
    ...(ENTITY_LINE ? { description: ENTITY_LINE } : {}),
    sameAs: ORGANIZATION_SAME_AS,
    areaServed: "Worldwide",
    knowsAbout: [
      "Creative AI consulting",
      "On-brand AI systems",
      "AI creative training",
      "AI campaign production",
    ],
  };
}

export function personNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Jeremy Somers",
    jobTitle: "Founder and Creative Director",
    worksFor: { "@id": ORGANIZATION_ID },
    url: `${SITE_URL}/about`,
    sameAs: PERSON_SAME_AS,
  };
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "NotContent Training",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function webPageNode(path: string, name: string) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    "@type": "WebPage",
    "@id": `${url}/#webpage`,
    url,
    name,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };
}

export function articleNode(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  coverImage?: string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@type": "Article",
    "@id": `${url}/#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@id": `${url}/#webpage` },
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORGANIZATION_ID },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    ...(post.coverImage ? { image: `${SITE_URL}${post.coverImage}` } : {}),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
