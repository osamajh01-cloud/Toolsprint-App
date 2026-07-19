"use client";

/**
 * components/ui/Radio.tsx
 *
 * Labeled radio group built on native <input type="radio"> — arrow-key
 * navigation, roving focus, and group semantics come from the platform.
 * Options are wrapped in a <fieldset>/<legend> so the group has an
 * accessible name; `accent-primary` tints the control from the tokens.
 */

interface RadioOption {
  value: string;
  label: string;
  hint?: string;
}

interface RadioGroupProps {
  /** Shared name for the underlying inputs; also prefixes option ids. */
  name: string;
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
}

export function RadioGroup({
  name,
  legend,
  value,
  onChange,
  options,
  className = "",
}: RadioGroupProps) {
  return (
    <fieldset className={`flex flex-col gap-2 ${className}`}>
      <legend className="mb-1 text-sm font-medium text-foreground-muted">
        {legend}
      </legend>
      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={`${name}-${option.value}`}
          className="flex cursor-pointer items-start gap-2.5 text-sm"
        >
          <input
            id={`${name}-${option.value}`}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <span className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{option.label}</span>
            {option.hint && (
              <span className="text-foreground-subtle">{option.hint}</span>
            )}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
