import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFRawStream,
} from "pdf-lib";

/**
 * components/tools/pdf-compressor/compress.ts
 *
 * In-browser PDF compression with an honest scope, built entirely on the
 * existing pdf-lib infrastructure (no new dependencies):
 *
 * STRUCTURAL PASS (lossless):
 * - strip document Info metadata + the XMP metadata stream (optional),
 * - remove per-page embedded thumbnails (/Thumb) (optional),
 * - re-save with object streams, which compresses the document structure
 *   including font dictionaries where the format supports it (optional).
 *
 * IMAGE PASS (lossy, quality-controlled):
 * - walks the indirect-object table for image XObjects whose filter is
 *   DCTDecode (JPEG) — the dominant weight in photo/scan PDFs,
 * - decodes each via the browser, optionally downscales to a pixel budget
 *   derived from the target DPI (long side ≈ DPI × 11in letter height),
 *   re-encodes as JPEG at the chosen quality, and swaps the stream
 *   in place (context.assign) with corrected Width/Height/ColorSpace.
 *
 * Fail-safe rules keep output validity above savings:
 * - a re-encoded image only replaces the original if it's SMALLER,
 * - images carrying an /SMask (transparency) are re-encoded at original
 *   dimensions only — resizing would desync the mask,
 * - multi-filter or non-JPEG images are left untouched,
 * - any decode/encode failure skips that image silently.
 *
 * TEXT IS NEVER RASTERIZED: pages are not redrawn, so text, vectors, and
 * layout survive byte-for-byte.
 *
 * The browser encoder (canvas) is injectable so the engine's plumbing is
 * unit-testable in Node.
 */

export { readPageCount } from "@/components/tools/pdf-merge/merge";

export interface CompressSettings {
  /** JPEG re-encode quality, 10–100. */
  imageQuality: number;
  /** Target DPI used to derive the downscale pixel budget. */
  imageDpi: number;
  downscaleImages: boolean;
  removeThumbnails: boolean;
  removeMetadata: boolean;
  /** Object-stream re-save (structure & font dictionaries). */
  optimizeStructure: boolean;
}

export type ProgressStage = "scan" | "images" | "save";

export interface CompressOutcome {
  bytes: Uint8Array;
  pageCount: number;
  imagesFound: number;
  imagesRecompressed: number;
}

export interface ReencodedImage {
  bytes: Uint8Array;
  width: number;
  height: number;
}

/** (jpegBytes, quality 10–100, maxLongSide|null, hasSmask) → smaller JPEG
 *  or null to skip. Injectable for tests. */
export type Reencoder = (
  jpeg: Uint8Array,
  quality: number,
  maxLongSide: number | null,
) => Promise<ReencodedImage | null>;

/** Default encoder: browser canvas. Returns null wherever the platform
 *  can't do it (SSR, Node, decode failure) — the image is then skipped. */
export const browserReencoder: Reencoder = async (
  jpeg,
  quality,
  maxLongSide,
) => {
  if (
    typeof createImageBitmap !== "function" ||
    typeof document === "undefined"
  ) {
    return null;
  }
  try {
    const copy = new Uint8Array(jpeg); // detach from the PDF buffer
    const bitmap = await createImageBitmap(
      new Blob([copy], { type: "image/jpeg" }),
    );
    let { width, height } = bitmap;
    if (maxLongSide && Math.max(width, height) > maxLongSide) {
      const scale = maxLongSide / Math.max(width, height);
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return null;
    }
    // JPEG has no alpha: paint white first so any decoder edge renders sanely.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality / 100),
    );
    if (!blob) return null;
    return {
      bytes: new Uint8Array(await blob.arrayBuffer()),
      width,
      height,
    };
  } catch {
    return null;
  }
};

const NAME = {
  subtype: PDFName.of("Subtype"),
  image: PDFName.of("Image"),
  filter: PDFName.of("Filter"),
  dct: PDFName.of("DCTDecode"),
  smask: PDFName.of("SMask"),
  width: PDFName.of("Width"),
  height: PDFName.of("Height"),
  length: PDFName.of("Length"),
  colorSpace: PDFName.of("ColorSpace"),
  bitsPerComponent: PDFName.of("BitsPerComponent"),
  deviceRgb: PDFName.of("DeviceRGB"),
  decode: PDFName.of("Decode"),
  decodeParms: PDFName.of("DecodeParms"),
  thumb: PDFName.of("Thumb"),
  metadata: PDFName.of("Metadata"),
} as const;

/** True for image XObjects whose (single) filter is DCTDecode. */
function isJpegImage(dict: PDFDict): boolean {
  if (dict.get(NAME.subtype) !== NAME.image) return false;
  const filter = dict.get(NAME.filter);
  if (filter === NAME.dct) return true;
  // A one-element filter array is fine; longer means chained filters we
  // don't handle — skip those.
  if (filter instanceof PDFArray) {
    return filter.size() === 1 && filter.get(0) === NAME.dct;
  }
  return false;
}

const INFO_KEYS = [
  "Title",
  "Author",
  "Subject",
  "Keywords",
  "Creator",
  "Producer",
  "CreationDate",
  "ModDate",
] as const;

export async function compressPdf(
  source: ArrayBuffer,
  settings: CompressSettings,
  onProgress?: (stage: ProgressStage, current: number, total: number) => void,
  reencoder: Reencoder = browserReencoder,
): Promise<CompressOutcome> {
  const doc = await PDFDocument.load(source, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  /* ------------------------------ scan ------------------------------ */
  onProgress?.("scan", 0, 0);
  const candidates: { ref: Parameters<typeof doc.context.assign>[0]; stream: PDFRawStream }[] = [];
  for (const [ref, object] of doc.context.enumerateIndirectObjects()) {
    if (object instanceof PDFRawStream && isJpegImage(object.dict)) {
      candidates.push({ ref, stream: object });
    }
  }

  /* --------------------------- image pass --------------------------- */
  const maxLongSide = settings.downscaleImages
    ? Math.round(settings.imageDpi * 11)
    : null;
  let recompressed = 0;

  for (let index = 0; index < candidates.length; index++) {
    onProgress?.("images", index + 1, candidates.length);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const { ref, stream } = candidates[index];
    const dict = stream.dict;
    const hasSmask = dict.has(NAME.smask);
    const original = stream.getContents();

    const result = await reencoder(
      original,
      settings.imageQuality,
      hasSmask ? null : maxLongSide, // never resize masked images
    );
    if (!result || result.bytes.length >= original.length) continue;

    // Mutate the existing dict for the replacement stream: the canvas
    // output is always 8-bit RGB JPEG, so normalize the color entries
    // and drop decode arrays that no longer apply.
    dict.set(NAME.width, doc.context.obj(result.width));
    dict.set(NAME.height, doc.context.obj(result.height));
    dict.set(NAME.length, doc.context.obj(result.bytes.length));
    dict.set(NAME.filter, NAME.dct);
    dict.set(NAME.colorSpace, NAME.deviceRgb);
    dict.set(NAME.bitsPerComponent, doc.context.obj(8));
    dict.delete(NAME.decode);
    dict.delete(NAME.decodeParms);

    doc.context.assign(ref, PDFRawStream.of(dict, result.bytes));
    recompressed += 1;
  }

  /* ------------------------- structural pass ------------------------ */
  if (settings.removeThumbnails) {
    for (const page of doc.getPages()) {
      page.node.delete(NAME.thumb);
    }
  }

  if (settings.removeMetadata) {
    const infoRef = doc.context.trailerInfo.Info;
    const info = infoRef ? doc.context.lookup(infoRef) : undefined;
    if (info instanceof PDFDict) {
      for (const key of INFO_KEYS) info.delete(PDFName.of(key));
    }
    // XMP metadata stream on the catalog.
    doc.catalog.delete(NAME.metadata);
  }

  /* ------------------------------ save ------------------------------ */
  onProgress?.("save", 0, 0);
  const bytes = await doc.save({
    useObjectStreams: settings.optimizeStructure,
  });

  return {
    bytes,
    pageCount: doc.getPageCount(),
    imagesFound: candidates.length,
    imagesRecompressed: recompressed,
  };
}
