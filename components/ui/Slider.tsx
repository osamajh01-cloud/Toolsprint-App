"use client";

/**
 * components/ui/Slider.tsx
 *
 * Labeled range-input primitive. Native <input type="range"> styled via
 * accent-color — full keyboard support (arrows/Home/End), native SR
 * semantics with aria-valuenow for free. Shows the current value inline
 * so the label row doubles as the output. First used by the Image
 * Compressor's quality control.
 */

interface SliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Render the value, e.g. (v) => `${v}%`. Defaults to the raw number. */
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export function Slider({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue = (v) => String(v),
  disabled = false,
}: SliderProps) {
  return (
    <div className={`flex flex-col gap-2 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        <output
          htmlFor={id}
          className="text-sm font-semibold tabular-nums text-foreground"
        >
          {formatValue(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-auto accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed"
      />
    </div>
  );
}
