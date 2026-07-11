import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ToolCard } from "@/components/shared/ToolCard";
import { ToolIcon } from "@/components/shared/ToolIcon";
import {
  getCategory,
  getToolBySlug,
  getToolsByCategory,
  tools,
} from "@/registry/tools";

/**
 * app/(tools)/tools/[slug]/page.tsx
 *
 * THE dynamic tool route — the architectural centerpiece. One file serves
 * every tool in the catalog:
 * - generateStaticParams() reads the registry, so all 20 tool pages are
 *   pre-rendered as static HTML at build time (and tool #21 is picked up
 *   automatically on its registry entry alone).
 * - generateMetadata() emits each tool's unique seoTitle/seoDescription.
 * - The body renders entirely from the registry entry: icon, title,
 *   description, category, tags — zero duplicated tool information.
 *
 * MILESTONE 3 SCOPE: tools aren't functional yet, so the page shows a
 * professional, tool-specific launch notice plus "More in category" cards
 * (real internal links — good for visitors and crawlers alike). In
 * Milestone 4/5 the notice panel is replaced by the actual tool UI; the
 * rest of this page stays as-is.
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

  return (
    <Container className="py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M19 12H5m6 6-6-6 6-6" />
        </svg>
        All tools
      </Link>

      {/* Tool header — entirely registry-driven */}
      <header className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <ToolIcon name={tool.icon} className="size-7" />
          </span>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
              {tool.title}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {category && <Badge variant="outline">{category.title}</Badge>}
              <Badge variant="brand">{tool.premium ? "Pro" : "Free"}</Badge>
            </div>
          </div>
        </div>

        <p className="max-w-2xl text-lg text-muted-foreground">
          {tool.shortDescription}
        </p>

        {tool.tags.length > 0 && (
          <ul aria-label="Related keywords" className="flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* Launch notice — replaced by the real tool UI in Milestones 4–5 */}
      <section
        aria-label="Availability"
        className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center"
      >
        <Badge variant="brand">Launching soon</Badge>
        <h2 className="text-xl font-semibold">
          {tool.title} is in the final stretch
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          This tool is being built right now and will run entirely in your
          browser — free, private, and with no sign-up. In the meantime, the
          rest of the catalog is one click away.
        </p>
        <Button href="/tools" variant="secondary" size="sm">
          Browse all tools
        </Button>
      </section>

      {/* Internal linking within the category */}
      {related.length > 0 && category && (
        <section aria-labelledby="related-heading" className="mt-12">
          <h2 id="related-heading" className="mb-4 text-lg font-semibold">
            More {category.title} tools
          </h2>
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
