"use client";

import dynamic from "next/dynamic";

/**
 * components/tools/pdf-split/PdfSplitLazy.tsx
 *
 * Client-boundary lazy wrapper — established pattern. pdf-lib (shared
 * with PDF Merge via a common async chunk) loads only on this tool's
 * page; pdfjs-dist is deferred a step further, imported only when a PDF
 * is actually loaded (see PdfSplit.loadFile).
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

export const PdfSplitLazy = dynamic(
  () =>
    import("@/components/tools/pdf-split/PdfSplit").then(
      (module) => module.PdfSplit,
    ),
  { loading: ToolLoading, ssr: false },
);
