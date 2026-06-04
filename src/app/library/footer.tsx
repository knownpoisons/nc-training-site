import Link from "next/link";

export function LibraryFooter() {
  return (
    <footer className="foot">
      <span>
        NotContent · The Prompt Library
      </span>
      <span>
        <Link href="/">notcontent.ai ↗</Link>
      </span>
    </footer>
  );
}
