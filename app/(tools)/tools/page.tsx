import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { tools } from "@/registry/tools";

/**
 * app/(tools)/tools/page.tsx
 *
 * The tool directory (real version, replacing the Milestone 1–2
 * placeholder). Server Component: renders the SEO-relevant hero as static
 * HTML and mounts the interactive ToolsDirectory client island below it.
 * The tool count in the copy is derived from the registry, so it can
 * never drift from reality.
 */

export const metadata: Metadata = {
  title: "Free Online Tools",
  description: `Browse ${tools.length} free, browser-based tools for text, development, SEO, social media, images, and productivity. Instant, private, no sign-up.`,
};

export default function ToolsPage() {
  return (
    <>
      {/* Hero — static, crawlable */}
      <section className="border-b border-border bg-surface-sunken">
        <Container className="flex flex-col gap-3 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Free online tools
          </h1>
          <p className="max-w-2xl text-lg text-foreground-muted">
            {tools.length} fast, browser-based utilities for text, code, SEO,
            social media, images, and productivity. Everything runs locally —
            no uploads, no accounts, no waiting.
          </p>
        </Container>
      </section>

      {/* Interactive directory */}
      <Container className="py-10">
        <ToolsDirectory />
      </Container>
    </>
  );
}
