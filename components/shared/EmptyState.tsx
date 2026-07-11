import type { ReactNode } from "react";

/**
 * components/shared/EmptyState.tsx
 *
 * Generic "nothing here" panel: icon, headline, guidance line, and an
 * optional action. An empty screen should be an invitation to act, so
 * callers must say what happened AND offer a way forward (e.g. the
 * directory passes a "Clear filters" button). Reused later for empty blog
 * categories, empty dashboards, and zero-result searches anywhere.
 */

interface EmptyStateProps {
  title: string;
  description: string;
  /** Optional action, e.g. a reset button. */
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-16 text-center"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-5"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3M8 11h6" />
        </svg>
      </span>

      <p className="text-lg font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
