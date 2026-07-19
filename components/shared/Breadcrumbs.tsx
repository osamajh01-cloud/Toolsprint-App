import Link from "next/link";
import { Fragment } from "react";

/**
 * components/shared/Breadcrumbs.tsx
 *
 * Accessible breadcrumb trail (Home / Tools / Category / Tool). Server
 * Component — pure markup, no client JS. Lives in shared/ because it will
 * also be used by blog posts (Milestone 10) and dashboard pages later.
 *
 * Conventions:
 * - Wrapped in <nav aria-label="Breadcrumb"> per WAI-ARIA authoring
 *   practices; the current page is a plain <span aria-current="page">,
 *   never a link.
 * - Separators are aria-hidden — they're visual noise to a screen reader.
 * - Callers pass items in order; the last item is treated as current.
 */

export interface BreadcrumbItem {
  title: string;
  /** Omit for the current page (last item). Ignored on the last item. */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-foreground-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.title}-${index}`}>
              {index > 0 && (
                <li aria-hidden="true" className="select-none">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3.5 opacity-60"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </li>
              )}
              <li>
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="font-medium text-foreground"
                  >
                    {item.title}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
