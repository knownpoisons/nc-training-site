"use client";

// The prospect table: sortable, expandable rows (dossier), stage chips at 4px —
// hard edges inside soft cards, per the spec.

import { Fragment, useMemo, useState } from "react";

export interface Row {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  stage: string;
  tier: string | null;
  score: number | null;
  value: number;
  sources: string[];
  added: string;
  dossier: string | null;
  callAt: string | null;
}

type SortKey = "score" | "stage" | "value" | "added" | "name";
const STAGE_ORDER = ["PROPOSAL", "CALL", "REPLIED", "IN_SEQUENCE", "NEW", "DORMANT", "WON", "LOST"];

export function ProspectTable({ rows }: { rows: Row[] }) {
  const [key, setKey] = useState<SortKey>("score");
  const [asc, setAsc] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const s = [...rows].sort((a, b) => {
      let v = 0;
      if (key === "score") v = (a.score ?? -1) - (b.score ?? -1);
      else if (key === "value") v = a.value - b.value;
      else if (key === "added") v = a.added.localeCompare(b.added);
      else if (key === "name") v = a.name.localeCompare(b.name);
      else v = STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage);
      return asc ? v : -v;
    });
    return s;
  }, [rows, key, asc]);

  const th = (label: string, k: SortKey) => (
    <th onClick={() => (k === key ? setAsc(!asc) : (setKey(k), setAsc(false)))} aria-sort={k === key ? (asc ? "ascending" : "descending") : "none"}>
      {label}{k === key ? (asc ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div className="dk-tablewrap">
      <table className="dk-table">
        <thead>
          <tr>
            {th("Prospect", "name")}
            {th("Stage", "stage")}
            {th("Score", "score")}
            {th("Value", "value")}
            <th>Sources</th>
            {th("Added", "added")}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <Fragment key={r.id}>
              <tr
                className={open === r.id ? "sel" : ""}
                onClick={() => setOpen(open === r.id ? null : r.id)}
                style={{ cursor: "pointer" }}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setOpen(open === r.id ? null : r.id)}
              >
                <td>
                  <b>{r.name}</b>
                  <span style={{ color: "var(--text-2)" }}>{r.company ? ` · ${r.company}` : ""}</span>
                  {r.callAt && <span className="dk-chip glow" style={{ marginLeft: 8 }}>📞 {r.callAt}</span>}
                </td>
                <td><span className={r.stage === "WON" ? "dk-chip blue" : ["REPLIED", "CALL", "PROPOSAL"].includes(r.stage) ? "dk-chip glow" : "dk-chip line"}>{r.stage.replace("_", " ")}</span></td>
                <td className="dk-num">{r.score ?? "—"}{r.tier ? <span style={{ color: "var(--text-2)" }}> · {r.tier}</span> : null}</td>
                <td className="dk-num">${Math.round(r.value / 1000)}k</td>
                <td style={{ color: "var(--text-2)", fontSize: 12 }}>{r.sources.join(" + ") || "hand-added"}</td>
                <td className="dk-num" style={{ color: "var(--text-2)" }}>{r.added}</td>
              </tr>
              {open === r.id && (
                <tr className="sel">
                  <td colSpan={6} style={{ whiteSpace: "normal", fontSize: 13, color: "#2a2a28" }}>
                    {r.role && <span className="dk-label" style={{ marginRight: 10 }}>{r.role}</span>}
                    {r.dossier ?? "No dossier yet — enrichment covers Tier-A queue daily."}
                    <span style={{ color: "var(--text-2)" }}> · full history: <code>show {r.name}</code> in #cockpit</span>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
