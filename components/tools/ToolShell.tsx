import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { getCategory } from "@/registry/tools/categories";
import { localizeCategory } from "@/i18n/content";
import { t } from "@/i18n/dictionary";
import { localePath } from "@/i18n/paths";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Tool } from "@/types/tool";

/**
 * components/tools/ToolShell.tsx
 *
 * The standard frame around EVERY tool page: breadcrumbs, header (icon,
 * title, badges, description, tags), and a body slot for the tool's actual
 * UI. Server Component.
 *
 * The contract with /tools/[slug]/page.tsx:
 * - `children` provided  → the tool's interactive UI renders in the body.
 *   (Milestone 5 wires the first real tool through this slot.)
 * - `children` omitted   → a professional, tool-specific launch notice
 *   renders instead, so unimplemented tools always have a complete page.
 *
 * This split means shipping a new tool's UI never touches page structure,
 * breadcrumbs, or SEO surface — a tool component drops into the slot and
 * everything else is already in place. Header content is entirely
 * registry-driven (zero duplicated tool information).
 */

interface ToolShellProps {
  tool: Tool;
  locale?: Locale;
  dictionary: Dictionary;
  children?: ReactNode;
}

export function ToolShell({
  tool,
  locale = defaultLocale,
  dictionary,
  children,
}: ToolShellProps) {
  const rawCategory = getCategory(tool.category);
  const category = rawCategory
    ? localizeCategory(rawCategory, locale)
    : undefined;

  return (
    <article className="flex flex-col gap-8">
      <Breadcrumbs
        label={dictionary.nav.breadcrumb}
        items={[
          { title: dictionary.nav.home, href: localePath(locale, "/") },
          { title: dictionary.nav.tools, href: localePath(locale, "/tools") },
          ...(category
            ? [
                {
                  title: category.title,
                  href: localePath(locale, `/tools/category/${category.slug}`),
                },
              ]
            : []),
          { title: tool.title },
        ]}
      />

      {/* Tool header — entirely registry-driven */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <ToolIcon name={tool.icon} className="size-7" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
              {tool.title}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {category && <Badge variant="outline">{category.title}</Badge>}
              <Badge variant="primary">{tool.premium ? dictionary.tools.pro : dictionary.tools.free}</Badge>
            </div>
          </div>
        </div>

        <p className="max-w-2xl text-lg text-foreground-muted">
          {tool.shortDescription}
        </p>

        {tool.tags.length > 0 && (
          <ul aria-label={dictionary.tools.relatedKeywords} className="flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Tool body: real UI when provided, launch notice otherwise */}
      {children ?? (
        <section
          aria-label={dictionary.tools.launchingSoon}
          className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-surface-sunken px-6 py-14 text-center"
        >
          <Badge variant="primary">{dictionary.tools.launchingSoon}</Badge>
          <h2 className="text-xl font-semibold">
            {t(dictionary.tools.comingSoonTitle, { tool: tool.title })}
          </h2>
          <p className="max-w-md text-sm text-foreground-muted">
            {dictionary.tools.comingSoonBody}
          </p>
          <Button
            href={localePath(locale, "/tools")}
            variant="secondary"
            size="sm"
          >
            {dictionary.tools.browseAll}
          </Button>
        </section>
      )}
    </article>
  );
}
