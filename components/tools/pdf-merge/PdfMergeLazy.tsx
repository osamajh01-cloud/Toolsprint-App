"use client";

import dynamic from "next/dynamic";

/**
 * components/tools/pdf-merge/PdfMergeLazy.tsx
 *
 * Client-boundary lazy wrapper — same pattern as the QR generator and
 * Image Compressor. pdf-lib is code-split into a chunk fetched only on
 * /tools/pdf-merge; every other page's JS is untouched.
 */

function ToolLoading() {
  return (
    <div
      role="status"
      aria-label="Loading tool"
      className="flex min-h-64 animate-pulse items-center justify-center rounded-xl border border-border bg-surface-sunken text-sm text-foreground-muted"
    >
      Loading tool…
    </div>
  );
}

export const PdfMergeLazy = dynamic(
  () =>
    import("@/components/tools/pdf-merge/PdfMerge").then(
      (module) => module.PdfMerge,
    ),
  { loading: ToolLoading, ssr: false },
);
