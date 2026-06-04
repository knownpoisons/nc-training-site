import Link from "next/link";

interface Props {
  /** Optional: shows "Prompt NN of TOTAL" on the right when on a detail page. */
  currentNumber?: number;
  /** Total prompts in the library (for the counter). */
  total: number;
}

export function LibraryTopbar({ currentNumber, total }: Props) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="topbar">
      <Link href="/library" className="brand">
        NotContent <span className="dot">·</span> Library
      </Link>
      <div className="counter">
        {currentNumber != null ? (
          <>
            <strong>Prompt {pad(currentNumber)}</strong> of {pad(total)}
          </>
        ) : (
          <>
            <strong>{pad(total)}</strong> {total === 1 ? "prompt" : "prompts"}
          </>
        )}
      </div>
    </div>
  );
}
