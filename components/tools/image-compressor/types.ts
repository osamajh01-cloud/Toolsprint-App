/**
 * components/tools/image-compressor/types.ts
 *
 * The item model shared by ImageCompressor (state owner) and
 * ImageItemCard (presentation). Local to the tool folder — it describes
 * this tool's UI state, not a domain object, so it doesn't belong in
 * the global types/.
 */

export interface CompressorItem {
  /** Stable identity across recompressions (crypto.randomUUID). */
  id: string;
  file: File;
  /** Object URL of the original — revoked on remove/clear/unmount. */
  originalUrl: string;
  width: number | null;
  height: number | null;
  originalSize: number;
  status: "compressing" | "done" | "error";
  /** 0–100 while compressing. */
  progress: number;
  compressedBlob: Blob | null;
  /** Object URL of the result — revoked on recompress/remove/clear. */
  compressedUrl: string | null;
  compressedSize: number | null;
  /** Result dimensions — equal to width/height unless Auto downscaled. */
  compressedWidth: number | null;
  compressedHeight: number | null;
  error: string | null;
}
