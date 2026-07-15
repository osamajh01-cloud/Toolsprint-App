import type { ComponentType } from "react";
import { WordCounter } from "@/components/tools/word-counter/WordCounter";
import { JsonFormatter } from "@/components/tools/json-formatter/JsonFormatter";
import { SlugGenerator } from "@/components/tools/slug-generator/SlugGenerator";
import { CaseConverter } from "@/components/tools/case-converter/CaseConverter";
import { Base64Tool } from "@/components/tools/base64-encoder/Base64Tool";
import { TextReverser } from "@/components/tools/text-reverser/TextReverser";
import { RemoveDuplicateLines } from "@/components/tools/remove-duplicate-lines/RemoveDuplicateLines";
import { QrCodeGeneratorLazy } from "@/components/tools/qr-code-generator/QrCodeGeneratorLazy";
import { ImageCompressorLazy } from "@/components/tools/image-compressor/ImageCompressorLazy";
import { PdfMergeLazy } from "@/components/tools/pdf-merge/PdfMergeLazy";

/**
 * components/tools/implementations.tsx
 *
 * Maps registry slugs to their interactive tool components — the single
 * join point between "a tool exists" (registry) and "a tool works"
 * (component). Slug present → /tools/[slug] renders the component in
 * ToolShell's body slot; absent → the launch-notice fallback.
 *
 * BUNDLE POLICY: dependency-free text tools are imported statically (they
 * share the route chunk; all seven together are a few kB). Tools that
 * carry a third-party library — starting with the QR generator and its
 * `qrcode` dependency — register a client-side lazy wrapper (see
 * QrCodeGeneratorLazy) so the library chunk is fetched ONLY on that
 * tool's page. The dynamic() call must sit inside a client component;
 * from a server module Next.js would ship the chunk on every tool page.
 *
 * SHIPPING A NEW TOOL: build the component under components/tools/<slug>/,
 * add one line here (dynamic() if it has heavy dependencies).
 */

export const toolImplementations: Partial<Record<string, ComponentType>> = {
  "word-counter": WordCounter,
  "json-formatter": JsonFormatter,
  "slug-generator": SlugGenerator,
  "case-converter": CaseConverter,
  "base64-encoder": Base64Tool,
  "text-reverser": TextReverser,
  "remove-duplicate-lines": RemoveDuplicateLines,
  "qr-code-generator": QrCodeGeneratorLazy,
  "image-compressor": ImageCompressorLazy,
  "pdf-merge": PdfMergeLazy,
};

export function getToolImplementation(
  slug: string,
): ComponentType | undefined {
  return toolImplementations[slug];
}
