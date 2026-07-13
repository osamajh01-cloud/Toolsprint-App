/**
 * lib/image-utils.ts
 *
 * Helpers for the Image Compressor: accepted-type validation, dimension
 * reading, and human-readable size formatting. Browser-only where noted
 * (createImageBitmap); the formatters are pure and reusable anywhere.
 */

/** The three formats the compressor accepts, per the milestone spec. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export function isSupportedImage(file: File): boolean {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
}

/** "image/jpeg" → "JPEG" for display. */
export function formatLabel(mimeType: string): string {
  const subtype = mimeType.split("/")[1] ?? mimeType;
  return subtype === "jpeg" ? "JPEG" : subtype.toUpperCase();
}

/**
 * Read intrinsic pixel dimensions without keeping the decode in memory.
 * Browser-only. createImageBitmap is the cheap path; the <img> fallback
 * covers older Safari.
 */
export async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close(); // release decoded pixels immediately
    return size;
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions."));
    };
    image.src = url;
  });
}

/** 1536 → "1.5 KB"; 0 decimals under 10, 1 decimal otherwise. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes;
  let unit = "B";
  for (const next of units) {
    if (value < 1024) break;
    value /= 1024;
    unit = next;
  }
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)} ${unit}`;
}

/** Positive = smaller. 100_000 → 60_000 gives 40. */
export function savingsPercent(original: number, compressed: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}
