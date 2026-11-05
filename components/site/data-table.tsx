"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { DataTable as DataTableDefinition } from "@/config/types";

function CopyValueButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className="button-secondary ml-3 inline-flex min-h-9 items-center gap-2 px-3 py-2 text-xs"
      aria-label={`Copy code ${value}`}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function DataTable({ table }: { table: DataTableDefinition }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-theme border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="border-b border-border bg-secondary/60 px-5 py-3 text-left font-bold text-foreground">
          {table.caption}
        </caption>
        <thead className="bg-muted/60 text-foreground">
          <tr>{table.columns.map((column) => <th key={column} scope="col" className="px-5 py-3 font-bold">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border text-muted-foreground">
          {table.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row[0]}`} className="bg-card/45">
              {row.map((cell, cellIndex) => (
                <td key={`${cellIndex}-${cell}`} className="px-5 py-3">
                  {cellIndex === 0 && table.copyFirstColumn ? (
                    <span className="inline-flex items-center whitespace-nowrap">
                      <code className="font-bold text-foreground">{cell}</code>
                      <CopyValueButton value={cell} />
                    </span>
                  ) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
