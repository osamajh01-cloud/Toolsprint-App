"use client";

import type { ReactNode } from "react";

/**
 * components/tools/ToolTextarea.tsx
 *
 * The standard labeled input textarea for tools: label row with an
 * `actions` slot (Paste/Copy/Clear buttons live there), and the textarea
 * itself in the site's input styling. Extracted in Milestone 6 — this
 * exact pattern appeared in WordCounter and would otherwise be repeated
 * in all six new tools.
 */

interface ToolTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** Monospace text — for code-like input (JSON, Base64). */
  mono?: boolean;
  /** Buttons rendered at the right end of the label row. */
  actions?: ReactNode;
}

export function ToolTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 8,
  mono = false,
  actions,
}: ToolTextareaProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        className={`w-full resize-y rounded-xl border border-border bg-background p-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${
          mono ? "font-mono text-sm" : ""
        }`}
      />
    </div>
  );
}
