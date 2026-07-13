"use client";

import dynamic from "next/dynamic";

/**
 * components/tools/image-compressor/ImageCompressorLazy.tsx
 *
 * Client-boundary lazy wrapper — same pattern as QrCodeGeneratorLazy.
 * browser-image-compression (and its embedded worker code) is code-split
 * into a chunk fetched only on /tools/image-compressor; every other tool
 * page's JS is untouched. fflate is deferred even further: imported
 * inside the ZIP handler, so it loads on first "Download all" click.
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

export const ImageCompressorLazy = dynamic(
  () =>
    import("@/components/tools/image-compressor/ImageCompressor").then(
      (module) => module.ImageCompressor,
    ),
  { loading: ToolLoading, ssr: false },
);
