import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { ENTITY_LINE, ORGANIZATION_ID, PERSON_ID, articleNode, graph, organizationNode, personNode, webPageNode, webSiteNode } from "@/lib/schema";

describe("visibility technical layer", () => {
  it("keeps the fixed @ids", () => {
    expect(ORGANIZATION_ID).toBe("https://notcontent.ai/#organization");
    expect(PERSON_ID).toBe("https://notcontent.ai/#jeremy-somers");
    expect(organizationNode().founder).toEqual({ "@id": PERSON_ID });
    expect(personNode().worksFor).toEqual({ "@id": ORGANIZATION_ID });
  });

  it("points Article author at the Person @id", () => {
    const a = articleNode({ slug: "x", title: "T", description: "D", date: "2026-01-01" });
    expect(a.author).toEqual({ "@id": PERSON_ID });
    expect(a.dateModified).toBe("2026-01-01");
  });

  it("uses no banned schema types", () => {
    const out = JSON.stringify(graph(organizationNode(), personNode(), webSiteNode(), webPageNode("/", "Home")));
    for (const t of ["LocalBusiness", "PostalAddress", "FAQPage", "Course", "Service"]) expect(out).not.toContain(`"${t}"`);
  });

  it("holds the entity line until the register clears it", () => {
    expect(ENTITY_LINE).toBe("");
    expect(organizationNode()).not.toHaveProperty("description");
  });

  it("names all eight citation bots", () => {
    const first = robots().rules;
    const agents = (Array.isArray(first) ? first[0] : first).userAgent;
    expect(agents).toHaveLength(8);
  });
});
