"use client";

import type { InputHTMLAttributes } from "react";

/**
 * components/ui/Input.tsx
 *
 * Labeled single-line text input primitive, matching the site's input
 * styling (same border/focus treatment as ToolTextarea and SearchBar).
 * First used by the QR Code Generator's email/phone/WiFi fields; generic
 * enough for auth forms (Milestone 15) and settings later.
 */

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "id"> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Optional secondary line under the field. */
  hint?: string;
}

export function Input({
  id,
  label,
  value,
  onChange,
  hint,
  className = "",
  ...rest
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        {...rest}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
