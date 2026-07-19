import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * components/shared/ComingSoon.tsx
 *
 * Reusable "this section is launching soon" page body. Used by every
 * placeholder route in the roadmap (Tools until Milestone 3, Pricing until
 * Milestone 14, Blog until Milestone 10) so unlaunched pages look
 * consistent, honest, and on-brand instead of each one being hand-rolled.
 *
 * Each caller supplies its own realistic copy; this component only owns
 * the structure: badge, heading, description, optional extra content
 * (e.g. a feature preview list), and a CTA back into the live product.
 */

interface ComingSoonProps {
  /** Small eyebrow label above the heading, e.g. "Pricing". */
  label: string;
  /** Page headline. */
  title: string;
  /** One or two sentences of realistic copy about what's coming. */
  description: string;
  /** Optional extra block rendered between description and CTA. */
  children?: ReactNode;
  /** CTA target; defaults to the homepage. */
  ctaHref?: string;
  ctaText?: string;
}

export function ComingSoon({
  label,
  title,
  description,
  children,
  ctaHref = "/",
  ctaText = "Back to home",
}: ComingSoonProps) {
  return (
    <Container
      as="section"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center"
    >
      <Badge variant="primary">
        {label} · Coming soon
      </Badge>

      <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>

      <p className="max-w-xl text-balance text-lg text-foreground-muted">
        {description}
      </p>

      {children}

      <Button href={ctaHref} variant="secondary">
        {ctaText}
      </Button>
    </Container>
  );
}
