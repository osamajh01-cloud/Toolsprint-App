import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/shared/Logo";
import { siteConfig } from "@/config/site";

/**
 * components/marketing/Hero.tsx
 *
 * Primary above-the-fold section for the homepage. Marketing-section-only
 * component (not reused outside `(marketing)` pages), so it lives under
 * `components/marketing/` rather than `components/shared/`.
 *
 * Intentionally simple in Milestone 1 (logo, tagline, single CTA) — this
 * will be extended in Milestone 8 ("Homepage Rebuild") with featured tools
 * and category showcases once the tool catalog exists.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex flex-col items-center justify-center gap-8 px-6 py-24 text-center sm:py-32"
    >
      <Logo asLink={false} className="text-2xl sm:text-3xl" />

      <h1
        id="hero-heading"
        className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl"
      >
        {siteConfig.tagline}
      </h1>

      <p className="max-w-xl text-balance text-lg text-muted-foreground">
        {siteConfig.description}
      </p>

      <Button href="/tools" size="lg">
        Explore Tools
      </Button>
    </section>
  );
}
