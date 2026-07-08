import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

/**
 * app/(blog)/blog/page.tsx
 *
 * PLACEHOLDER (Milestone 2): linked from the header nav, so it must exist
 * and be honest about its status. REPLACED IN MILESTONE 10 with the real
 * MDX-powered blog listing.
 */

export const metadata: Metadata = {
  title: "Blog",
  description:
    "The ToolSprint blog is launching soon — practical guides, tool walkthroughs, and productivity tips for developers and writers.",
};

export default function BlogPage() {
  return (
    <ComingSoon
      label="Blog"
      title="Guides and walkthroughs, on the way"
      description="We're writing practical, no-fluff articles: how to get the most out of each tool, workflow tips, and comparisons that help you pick the right tool for the job."
      ctaHref="/tools"
      ctaText="Explore the tools"
    />
  );
}
