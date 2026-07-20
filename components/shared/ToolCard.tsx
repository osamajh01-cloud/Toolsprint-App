import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { getCategory } from "@/registry/tools/categories";
import { isNew, isPopular } from "@/registry/tools";
import { localizeCategory } from "@/i18n/content";
import { localePath } from "@/i18n/paths";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Tool } from "@/types/tool";

/**
 * components/shared/ToolCard.tsx
 *
 * The catalog card for one tool: icon, title, short description, category
 * badge, pricing badge, and the "Open tool" action. Lives in shared/ (not
 * tools/) because it renders in many places: the directory grid, the
 * featured section, "More in category" on tool pages, and later the
 * homepage (Milestone 8) and blog posts.
 *
 * The entire card is one <Link> (larger touch target, one tab stop) with
 * "Open tool" styled as the visual affordance inside it. All content comes
 * from the registry entry — nothing is duplicated.
 */

interface ToolCardProps {
  tool: Tool;
  locale?: Locale;
  dictionary: Dictionary;
}

export function ToolCard({
  tool,
  locale = defaultLocale,
  dictionary,
}: ToolCardProps) {
  const rawCategory = getCategory(tool.category);
  const category = rawCategory ? localizeCategory(rawCategory, locale) : undefined;

  // Status badges, all derived from registry metadata — a tool can carry
  // several at once (e.g. Popular + New).
  const statusBadges: string[] = [];
  if (isPopular(tool)) statusBadges.push(dictionary.tools.popular);
  if (isNew(tool)) statusBadges.push(dictionary.tools.new);
  if (tool.featured) statusBadges.push(dictionary.tools.featuredBadge);

  return (
    <Link
      href={localePath(locale, `/tools/${tool.slug}`)}
      className="group flex h-full flex-col gap-3 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
          <ToolIcon name={tool.icon} />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {category && <Badge variant="outline">{category.title}</Badge>}
          <Badge variant="primary">{tool.premium ? dictionary.tools.pro : dictionary.tools.free}</Badge>
        </div>
      </div>

      {statusBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {statusBadges.map((label) => (
            <Badge key={label}>{label}</Badge>
          ))}
        </div>
      )}

      <div className="flex-1">
        <h3 className="font-semibold leading-snug">{tool.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
          {tool.shortDescription}
        </p>
      </div>

      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        {dictionary.tools.openTool}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        >
          <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
