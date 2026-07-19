"use client";

import { CopyButton } from "@/components/tools/CopyButton";

/**
 * components/tools/ToolOutput.tsx
 *
 * The standard result panel for tools: label row with a built-in copy
 * button, and the output in a read-only, selectable, scrollable box.
 * Rendered as a <div> rather than a disabled textarea so the browser's
 * native selection, search (Ctrl+F), and screen-reader reading all work
 * on the result.
 */

interface ToolOutputProps {
  label: string;
  value: string;
  /** Shown dimmed when there's no output yet. */
  placeholder?: string;
  mono?: boolean;
}

export function ToolOutput({
  label,
  value,
  placeholder = "The result will appear here.",
  mono = false,
}: ToolOutputProps) {
  const hasValue = value.length > 0;

  return (
    <section aria-label={label} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground-muted">{label}</p>
        <CopyButton text={value} disabled={!hasValue} />
      </div>

      <div
        className={`min-h-32 w-full whitespace-pre-wrap break-words rounded-xl border border-border bg-surface-sunken p-4 text-base leading-relaxed ${
          mono ? "font-mono text-sm" : ""
        } ${hasValue ? "text-foreground" : "text-foreground-muted"}`}
      >
        {hasValue ? value : placeholder}
      </div>
    </section>
  );
}
