import { graph, webPageNode } from "@/lib/schema";

/** Renders JSON-LD in the server HTML. Escapes "<" so content can't close the tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function PageSchema({ path, name }: { path: string; name: string }) {
  return <JsonLd data={graph(webPageNode(path, name))} />;
}
