import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { tools } from "@/registry/tools";
import { t } from "@/i18n/dictionary";
import { localePath } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/marketing/Hero.tsx
 *
 * The homepage thesis: TOOLAK's real differentiator isn't the tool
 * count, it's that the work happens on your own machine. So the hero
 * leads with that promise rather than a generic value proposition, and
 * sits on the "workshop grid" — a faint engineering-graph wash (see
 * .workshop-grid in globals.css) that reads as a work surface. That grid
 * is the design's signature element; everything around it stays quiet.
 *
 * Server Component. The tool count comes from the registry, so the copy
 * can never drift from the catalog.
 */
export function Hero({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 workshop-grid opacity-60"
      />

      <Container className="relative flex flex-col items-center gap-7 py-24 text-center sm:py-32">
        <Badge variant="primary" className="motion-safe:animate-fade-in">
          {t(dictionary.home.heroBadge, { count: tools.length })}
        </Badge>

        <h1
          id="hero-heading"
          className="max-w-3xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl motion-safe:animate-rise-in"
        >
          {dictionary.home.heroTitle}
        </h1>

        <p className="max-w-xl text-balance text-lg leading-relaxed text-foreground-muted sm:text-xl motion-safe:animate-rise-in">
          {dictionary.home.heroSubtitle}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-rise-in">
          <Button href={localePath(locale, "/tools")} size="lg">
            {dictionary.home.heroCtaPrimary}
          </Button>
          <Button
            href={localePath(locale, "/tools/pdf-merge")}
            variant="outline"
            size="lg"
          >
            {dictionary.home.heroCtaSecondary}
          </Button>
        </div>
      </Container>
    </section>
  );
}
