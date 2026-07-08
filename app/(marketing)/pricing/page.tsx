import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/ComingSoon";

/**
 * app/(marketing)/pricing/page.tsx
 *
 * PLACEHOLDER (Milestone 2): linked from the header nav, so it must exist
 * and be honest about its status. REPLACED IN MILESTONE 14 with the real
 * pricing page (Free/Pro tiers from registry/plans.ts + waitlist capture).
 */

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "ToolSprint pricing is coming soon. Every tool is free while we're in early access — no account, no limits, no catch.",
};

export default function PricingPage() {
  return (
    <ComingSoon
      label="Pricing"
      title="Free while in early access"
      description="Every tool on ToolSprint is free to use right now — no account and no usage limits. Paid plans with pro features will arrive later, and everything that's free today stays free."
      ctaHref="/tools"
      ctaText="Use the free tools"
    />
  );
}
