/**
 * components/ui/StatCard.tsx
 *
 * Label/value statistic tile, rendered as a <dt>/<dd> pair — callers wrap
 * a set of these in a <dl>. Born inside WordCounter (Milestone 5) and
 * promoted here in Milestone 8.1 when the Image Compressor became its
 * second consumer, per the layering rule documented at its origin.
 */

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  /** Compact variant for dense grids (smaller value type). */
  dense?: boolean;
}

export function StatCard({ label, value, hint, dense = false }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        {label}
      </dt>
      <dd
        className={`font-bold tabular-nums tracking-tight ${
          dense ? "text-lg" : "text-2xl"
        }`}
      >
        {value}
      </dd>
      {hint && <p className="text-xs text-foreground-muted">{hint}</p>}
    </div>
  );
}
