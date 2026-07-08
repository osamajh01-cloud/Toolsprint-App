import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

/**
 * app/(tools)/tools/page.tsx
 *
 * TEMPORARY placeholder (Milestone 1).
 *
 * The homepage CTA links to /tools, and Milestone 1 must produce a fully
 * working, publicly deployable site with no dead links — so this route
 * exists now as an honest "launching soon" page.
 *
 * REPLACED IN MILESTONE 3: this file will be rewritten as the real tool
 * directory page, rendering a ToolCard grid from `registry/tools`.
 */

export const metadata: Metadata = {
  title: "Tools",
  description:
    "The ToolSprint tool directory is launching soon — fast, free, browser-based tools with no sign-up required.",
};

export default function ToolsPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Tools are launching soon
      </h1>
      <p className="max-w-md text-muted-foreground">
        We&apos;re building a collection of fast, free, browser-based tools.
        Check back shortly.
      </p>
      <Button href="/" variant="secondary">
        Back to home
      </Button>
    </main>
  );
}
