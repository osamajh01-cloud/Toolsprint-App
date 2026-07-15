/**
 * lib/download.ts
 *
 * Shared client-side download helpers, extracted in Milestone 10 when the
 * PDF Split tool became the second consumer of the ZIP pattern first
 * written inside the Image Compressor (which now calls these too — the
 * logic exists exactly once).
 *
 * Browser-only (anchors, object URLs). fflate is imported dynamically
 * INSIDE downloadZip, so the ZIP writer keeps loading only at the moment
 * a user actually requests an archive — never in any page bundle.
 */

/** Trigger a local save of a blob under the given filename. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** "report.pdf" + "-part-1" → "report-part-1.pdf" (suffix before the extension). */
export function withSuffix(filename: string, suffix: string): string {
  const dot = filename.lastIndexOf(".");
  return dot > 0
    ? `${filename.slice(0, dot)}${suffix}${filename.slice(dot)}`
    : `${filename}${suffix}`;
}

export interface ZipEntry {
  name: string;
  blob: Blob;
}

/**
 * Bundle entries into a ZIP and download it. Duplicate names are
 * de-duplicated with -2, -3, … suffixes. Stored uncompressed (level 0):
 * the payloads we zip (compressed images, PDFs) don't deflate further,
 * so re-compressing wastes CPU for ~0% gain.
 */
export async function downloadZip(
  entries: ZipEntry[],
  zipName: string,
): Promise<void> {
  if (entries.length === 0) return;
  const { zip } = await import("fflate");

  const files: Record<string, Uint8Array> = {};
  const used = new Set<string>();
  for (const entry of entries) {
    let name = entry.name;
    let counter = 2;
    while (used.has(name)) {
      name = withSuffix(entry.name, `-${counter}`);
      counter += 1;
    }
    used.add(name);
    files[name] = new Uint8Array(await entry.blob.arrayBuffer());
  }

  const data = await new Promise<Uint8Array>((resolve, reject) => {
    zip(files, { level: 0 }, (error, result) =>
      error ? reject(error) : resolve(result),
    );
  });

  downloadBlob(new Blob([data as BlobPart], { type: "application/zip" }), zipName);
}
