import Link from "next/link";
import { ShareButton } from "./share-button";

interface Props {
  /** Optional: shows "Prompt NN of TOTAL" on the right when on a detail page. */
  currentNumber?: number;
  /** Total prompts in the library (for the counter). */
  total: number;
  /** Optional: prompt title for the share sheet (detail page only). */
  shareTitle?: string;
  /** What the counter is counting. Defaults to "prompt". */
  noun?: string;
}

export function LibraryTopbar({ currentNumber, total, shareTitle, noun = "prompt" }: Props) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="topbar">
      <Link href="/library" className="brand">
        NotContent <span className="dot">·</span> Library
      </Link>
      <div className="topbar-meta">
        <div className="counter">
          {currentNumber != null ? (
            <>
              <strong>
                {noun.charAt(0).toUpperCase() + noun.slice(1)} {pad(currentNumber)}
              </strong>{" "}
              of {pad(total)}
            </>
          ) : (
            <>
              <strong>{pad(total)}</strong> {total === 1 ? noun : `${noun}s`}
            </>
          )}
        </div>
        {shareTitle && <ShareButton title={shareTitle} />}
      </div>
    </div>
  );
}
