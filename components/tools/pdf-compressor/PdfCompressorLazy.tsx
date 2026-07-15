"use client";

import dynamic from "next/dynamic";

/**
 * components/tools/pdf-compressor/PdfCompressorLazy.tsx
 *
 * Client-boundary lazy wrapper — established pattern. pdf-lib is shared
 * with the merge/split tools via a common async chunk and loads only on
 * PDF tool pages; nothing changes for any other route.
 */

function ToolLoading() {
  return (
    <div
      role="status"
      aria-label="Loading tool"
      className="flex min-h-64 animate-pulse items-center justify-center rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground"
    >
      Loading tool…
    </div>
  );
}

export const PdfCompressorLazy = dynamic(
  () =>
    import("@/components/tools/pdf-compressor/PdfCompressor").then(
      (module) => module.PdfCompressor,
    ),
  { loading: ToolLoading, ssr: false },
);
