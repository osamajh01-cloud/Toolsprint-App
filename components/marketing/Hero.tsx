import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { tools } from "@/registry/tools";

/**
 * components/marketing/Hero.tsx
 *
 * The homepage thesis: ToolSprint's real differentiator isn't the tool
 * count, it's that the work happens on your own machine. So the hero
 * leads with that promise rather than a generic value proposition, and
 * sits on the "workshop grid" — a faint engineering-graph wash (see
 * .workshop-grid in globals.css) that reads as a work surface. That grid
 * is the design's signature element; everything around it stays quiet.
 *
 * Server Component. The tool count comes from the registry, so the copy
 * can never drift from the catalog.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 workshop-grid opacity-60"
      />

      <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-28">
        <Badge variant="primary" className="motion-safe:animate-fade-in">
          {tools.length} tools · nothing leaves your device
        </Badge>

        <h1
          id="hero-heading"
          className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl motion-safe:animate-rise-in"
        >
          Save hours with powerful online tools.
        </h1>

        <p className="max-w-xl text-balance text-lg leading-relaxed text-foreground-muted motion-safe:animate-rise-in">
          Compress a PDF, shrink a photo, clean up text — every tool runs
          entirely in your browser. No uploads, no accounts, no waiting.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 motion-safe:animate-rise-in">
          <Button href="/tools" size="lg">
            Explore tools
          </Button>
          <Button href="/tools/pdf-merge" variant="outline" size="lg">
            Merge a PDF
          </Button>
        </div>
      </Container>
    </section>
  );
}
