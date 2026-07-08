import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

/**
 * app/(tools)/tools/page.tsx
 *
 * TEMPORARY placeholder (since Milestone 1, refactored in Milestone 2 to
 * use the shared ComingSoon component). REPLACED IN MILESTONE 3 with the
 * real tool directory rendering a ToolCard grid from `registry/tools`.
 */

export const metadata: Metadata = {
  title: "Tools",
  description:
    "The ToolSprint tool directory is launching soon — fast, free, browser-based tools with no sign-up required.",
};

export default function ToolsPage() {
  return (
    <ComingSoon
      label="Tools"
      title="The first tools are almost ready"
      description="We're putting the finishing touches on the first batch: text utilities, converters, and generators — all running entirely in your browser, with nothing to install and no sign-up."
    />
  );
}
