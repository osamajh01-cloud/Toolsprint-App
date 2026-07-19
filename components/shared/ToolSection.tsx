import type { ReactNode } from "react";
import Link from "next/link";
import { ToolCard } from "@/components/shared/ToolCard";
import type { Tool } from "@/types/tool";

/**
 * components/shared/ToolSection.tsx
 *
 * A titled band of ToolCards: emoji/eyebrow, heading, optional
 * description, optional "see all" link, and the responsive grid. The
 * homepage's Most Popular / Recently Added / All Tools sections are all
 * this one component with different tool lists — so card layout and
 * spacing exist once, and nothing is rendered twice.
 *
 * Server Component: pure markup over data the caller already resolved.
 */

interface ToolSectionProps {
  /** Stable id used to associate the heading with the section. */
  id: string;
  title: string;
  /** Decorative emoji shown before the title (aria-hidden). */
  emoji?: string;
  description?: string;
  tools: Tool[];
  /** Optional trailing link, e.g. { href: "/tools", label: "See all" }. */
  action?: { href: string; label: string };
  /** Extra content between the header and the grid. */
  children?: ReactNode;
}

export function ToolSection({
  id,
  title,
  emoji,
  description,
  tools,
  action,
  children,
}: ToolSectionProps) {
  if (tools.length === 0 && !children) return null;

  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id={`${id}-heading`} className="text-xl font-bold tracking-tight">
            {emoji && (
              <span aria-hidden="true" className="mr-2">
                {emoji}
              </span>
            )}
            {title}
          </h2>
          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="rounded-sm text-sm font-medium text-brand transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {action.label}
          </Link>
        )}
      </div>

      {children}

      {tools.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
