import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolShell } from "@/components/tools/ToolShell";
import { getToolImplementation } from "@/components/tools/implementations";
import { jsonLdString, toolJsonLd } from "@/lib/seo";
import {
  getCategory,
  getToolBySlug,
  getToolsByCategory,
  tools,
} from "@/registry/tools";

/**
 * app/(tools)/tools/[slug]/page.tsx
 *
 * THE dynamic tool route — one file serves every tool in the catalog:
 * - generateStaticParams() reads the registry, so every tool page is
 *   pre-rendered as static HTML at build time.
 * - generateMetadata() emits each tool's unique seoTitle/seoDescription.
 * - The page body delegates its frame (breadcrumbs, header, launch-notice
 *   fallback) to ToolShell and adds the "More in category" section.
 *
 * MILESTONE 4: structure only — ToolShell renders its launch-notice
 * fallback because no tool passes children yet. MILESTONE 5 wires the
 * first real tool UI into the shell's slot; this file barely changes.
 */

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

/** Unknown slugs 404 at build/request time instead of rendering blanks. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    openGraph: {
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategory(tool.category);
  const related = getToolsByCategory(tool.category)
    .filter((other) => other.slug !== tool.slug)
    .slice(0, 3);

  // Interactive UI for this tool, if implemented (see implementations.ts).
  // Undefined → ToolShell renders its launch-notice fallback.
  const ToolUi = getToolImplementation(tool.slug);

  return (
    <Container className="py-10 sm:py-14">
      {/* schema.org SoftwareApplication — registry-driven, on every tool page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(toolJsonLd(tool)) }}
      />

      <ToolShell tool={tool}>{ToolUi ? <ToolUi /> : undefined}</ToolShell>

      {/* Internal linking within the category */}
      {related.length > 0 && category && (
        <section aria-labelledby="related-heading" className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="related-heading" className="text-lg font-semibold">
              More {category.title} tools
            </h2>
            <Link
              href={`/tools/category/${category.slug}`}
              className="rounded-sm text-sm font-medium text-brand transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              View all {category.title.toLowerCase()} tools
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((other) => (
              <ToolCard key={other.id} tool={other} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
