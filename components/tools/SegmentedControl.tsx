"use client";

/**
 * components/tools/SegmentedControl.tsx
 *
 * Single-choice chip row for tool modes (Format/Minify, Encode/Decode,
 * the eight case styles, …). Same accessible radiogroup pattern as the
 * directory's CategoryFilter — aria-checked announces the active option —
 * generalized over any string-union type.
 */

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border text-muted-foreground hover:border-brand/40 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
