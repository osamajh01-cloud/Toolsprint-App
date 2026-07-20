import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { categories, getCategory, getToolsByCategory } from "@/registry/tools";
import { localizeCategories, localizeCategory, localizeTools } from "@/i18n/content";
import { getDictionary, t } from "@/i18n/dictionary";
import { localeAlternates, openGraphLocale } from "@/i18n/seo";
import { localePath } from "@/i18n/paths";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";
import type { CategorySlug } from "@/types/tool";

/**
 * app/[locale]/(tools)/tools/category/[category]/page.tsx
 *
 * Category landing pages, per language. generateStaticParams crosses the
 * locale list with the category registry, so all six categories are
 * pre-rendered in both languages with translated names, descriptions, and
 * metadata — plus canonical + hreflang pairing.
 */

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, category: category.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const raw = getCategory(slug);
  if (!raw) return {};

  const category = localizeCategory(raw, active);
  const dictionary = await getDictionary(active);
  const count = getToolsByCategory(raw.slug).length;

  const title = t(dictionary.tools.allCategoryTools, {
    category: category.title,
  });
  const description = `${t(dictionary.tools.toolCountPlural, { count })} — ${category.description}`;

  return {
    title,
    description,
    alternates: localeAlternates(active, `/tools/category/${raw.slug}`),
    openGraph: { title, description, ...openGraphLocale(active) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: slug } = await params;
  const active: Locale = isLocale(locale) ? locale : defaultLocale;
  const raw = getCategory(slug);
  if (!raw) notFound();

  const dictionary = await getDictionary(active);
  const category = localizeCategory(raw, active);
  const categoryTools = localizeTools(
    getToolsByCategory(raw.slug as CategorySlug),
    active,
  );
  const otherCategories = localizeCategories(
    categories.filter((other) => other.slug !== raw.slug),
    active,
  );

  return (
    <>
      <section className="border-b border-border bg-surface-sunken">
        <Container className="flex flex-col gap-5 py-14 sm:py-20">
          <Breadcrumbs
            label={dictionary.nav.breadcrumb}
            items={[
              { title: dictionary.nav.home, href: localePath(active, "/") },
              { title: dictionary.nav.tools, href: localePath(active, "/tools") },
              { title: category.title },
            ]}
          />
          <div className="flex items-center gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
              <ToolIcon name={category.icon} className="size-6" />
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {category.title}
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground-muted">
            {category.description}
          </p>
        </Container>
      </section>

      <Container className="flex flex-col gap-14 py-12">
        <section aria-labelledby="category-tools-heading">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="category-tools-heading" className="text-lg font-semibold">
              {t(dictionary.tools.allCategoryTools, { category: category.title })}
            </h2>
            <p className="text-sm text-foreground-muted">
              {t(
                categoryTools.length === 1
                  ? dictionary.tools.toolCount
                  : dictionary.tools.toolCountPlural,
                { count: categoryTools.length },
              )}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                locale={active}
                dictionary={dictionary}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="other-categories-heading">
          <h2 id="other-categories-heading" className="mb-4 text-lg font-semibold">
            {dictionary.tools.browseOtherCategories}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={localePath(active, `/tools/category/${other.slug}`)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ToolIcon name={other.icon} className="size-4" />
                {other.title}
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
