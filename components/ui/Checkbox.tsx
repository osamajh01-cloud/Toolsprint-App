"use client";

/**
 * components/ui/Checkbox.tsx
 *
 * Labeled checkbox primitive. Native <input type="checkbox"> styled via
 * accent-color — free keyboard support, focus behavior, and screen-reader
 * semantics, no re-implementation. Used first by Remove Duplicate Lines;
 * generic enough for settings and forms later.
 */

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Optional secondary line under the label. */
  hint?: string;
}

export function Checkbox({ id, label, checked, onChange, hint }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-2.5 rounded-lg text-sm"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground">{label}</span>
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </span>
    </label>
  );
}
