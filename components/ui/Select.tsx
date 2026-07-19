"use client";

import type { SelectHTMLAttributes } from "react";

/**
 * components/ui/Select.tsx
 *
 * Labeled dropdown built on a native <select> — full keyboard support,
 * platform-correct mobile pickers, and screen-reader semantics for free.
 * Styled to match Input/Textarea (same height, radius, focus ring) with a
 * custom chevron, since native arrows differ across platforms.
 */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "id"> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  hint?: string;
}

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  hint,
  className = "",
  ...rest
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-foreground-muted">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-border bg-surface px-4 pr-10 text-sm text-foreground transition-colors hover:border-border-strong focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {hint && <p className="text-xs text-foreground-subtle">{hint}</p>}
    </div>
  );
}
