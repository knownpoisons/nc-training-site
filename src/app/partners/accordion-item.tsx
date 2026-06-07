interface Props {
  /** Stage / number label shown to the left of the title. */
  stage?: string;
  /** Bold accordion title. */
  title: string;
  /** Plain content inside the disclosure. Can include JSX. */
  children: React.ReactNode;
  /** Whether to default-open. */
  defaultOpen?: boolean;
}

// Accessible native disclosure: <details>/<summary> handles keyboard,
// screen reader, multiple-open by default. Custom-styled to match JD aesthetic.
export function AccordionItem({ stage, title, children, defaultOpen = false }: Props) {
  return (
    <details className="acc-item" {...(defaultOpen ? { open: true } : {})}>
      <summary className="acc-summary">
        <span className="acc-summary-inner">
          {stage && <span className="acc-stage">{stage}</span>}
          <span className="acc-title">{title}</span>
        </span>
        <span className="acc-toggle" aria-hidden>
          +
        </span>
      </summary>
      <div className="acc-body">{children}</div>
    </details>
  );
}
