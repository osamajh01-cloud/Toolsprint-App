"use client";

import dynamic from "next/dynamic";

/**
 * components/tools/qr-code-generator/QrCodeGeneratorLazy.tsx
 *
 * Client-boundary lazy wrapper for the QR tool. The dynamic() call must
 * live INSIDE a client component: called from a server module (as first
 * attempted in implementations.tsx), Next.js resolves the client reference
 * eagerly and ships the qrcode chunk on every /tools/[slug] page. From
 * here, the ~32 kB qrcode chunk is fetched only when this wrapper actually
 * renders — i.e. only on /tools/qr-code-generator — with a loading
 * placeholder while it arrives. Verified against the build manifest.
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

export const QrCodeGeneratorLazy = dynamic(
  () =>
    import("@/components/tools/qr-code-generator/QrCodeGenerator").then(
      (module) => module.QrCodeGenerator,
    ),
  { loading: ToolLoading, ssr: false },
);
