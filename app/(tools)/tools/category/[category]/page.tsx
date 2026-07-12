import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { categories, getCategory, getToolsByCategory } from "@/registry/tools";
import type { CategorySlug } from "@/types/tool";

/**
 * app/(tools)/tools/category/[category]/page.tsx
 *
 * Category landing pages (/tools/category/text, …/developer, etc.) — the
 * long-tail SEO surface from the roadmap ("PDF Tools"-style queries). One
 * dynamic route serves all six categories:
 * - generateStaticParams() reads the category registry → all six pages are
 *   pre-rendered static HTML; a seventh category appears here automatically
 *   when added to categories.ts.
 * - generateMetadata() derives each page's title/description from the
 *   category's registry entry (plus a live tool count).
 * - The grid reuses ToolCard; "Browse other categories" links every
 *   category page to its siblings for internal linking and crawlability.
 *
 * The `category` folder is a STATIC segment, so Next.js matches it before
 * the dynamic /tools/[slug] sibling — no route ambiguity.
 */

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

/** Unknown category slugs are 404s, not blank pages. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const count = getToolsByCategory(category.slug).length;
  const title = `Free ${category.title} Tools`;
  const description = `${count} free ${category.title.toLowerCase()} tools, all running in your browser. ${category.description}`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const categoryTools = getToolsByCategory(category.slug as CategorySlug);
  const otherCategories = categories.filter(
    (other) => other.slug !== category.slug,
  );

  return (
    <>
      {/* Category hero — static, crawlable, registry-driven */}
      <section className="border-b border-border bg-muted/40">
        <Container className="flex flex-col gap-5 py-12 sm:py-16">
          <Breadcrumbs
            items={[
              { title: "Home", href: "/" },
              { title: "Tools", href: "/tools" },
              { title: category.title },
            ]}
          />
          <div className="flex items-center gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <ToolIcon name={category.icon} className="size-6" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              {category.title} tools
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {category.description}
          </p>
        </Container>
      </section>

      <Container className="flex flex-col gap-12 py-10">
        {/* Tools in this category */}
        <section aria-labelledby="category-tools-heading">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="category-tools-heading" className="text-lg font-semibold">
              All {category.title.toLowerCase()} tools
            </h2>
            <p className="text-sm text-muted-foreground">
              {categoryTools.length}{" "}
              {categoryTools.length === 1 ? "tool" : "tools"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Sibling categories — internal linking between category pages */}
        <section aria-labelledby="other-categories-heading">
          <h2
            id="other-categories-heading"
            className="mb-4 text-lg font-semibold"
          >
            Browse other categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((other) => (
              <Link
                key={other.slug}
                href={`/tools/category/${other.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
