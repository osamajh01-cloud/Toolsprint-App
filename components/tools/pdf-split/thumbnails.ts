import * as pdfjs from "pdfjs-dist";

/**
 * components/tools/pdf-split/thumbnails.ts
 *
 * Page thumbnail rendering via pdfjs-dist (pdf-lib manipulates PDFs but
 * cannot rasterize them). Lives in the tool folder so the ~1 MB renderer
 * stays inside this tool's lazy chunk. Browser-only by construction: the
 * tool loads with ssr:false, so this module never evaluates on the server.
 *
 * Worker: pdfjs parses in its own Web Worker; the `new URL(...,
 * import.meta.url)` reference lets the bundler emit the worker file as a
 * static asset and resolve its URL at build time.
 *
 * Memory strategy for large documents:
 * - pages render SEQUENTIALLY through one reused canvas (never N canvases),
 * - each thumbnail is stored as a small JPEG data URL (~10–20 kB),
 * - rendering stops after THUMBNAIL_LIMIT pages (placeholders beyond stay
 *   fully selectable — previews are a convenience, not a requirement),
 * - a cancellation callback abandons the loop when the file is replaced
 *   or the tool unmounts, and the document proxy is destroyed either way.
 */

if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
}

export const THUMBNAIL_LIMIT = 300;
const THUMBNAIL_WIDTH = 168; // device px; displayed smaller

/**
 * Render page thumbnails, invoking onThumbnail(pageNumber, dataUrl) as
 * each finishes so the grid fills progressively. `isCancelled` is checked
 * between pages.
 */
export async function renderThumbnails(
  bytes: ArrayBuffer,
  pageCount: number,
  onThumbnail: (pageNumber: number, dataUrl: string) => void,
  isCancelled: () => boolean,
): Promise<void> {
  // In pdfjs v6, destroy() lives on the loading task, not the document.
  const loadingTask = pdfjs.getDocument({ data: bytes.slice(0) });
  const doc = await loadingTask.promise;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    await loadingTask.destroy();
    return;
  }

  try {
    const limit = Math.min(pageCount, THUMBNAIL_LIMIT);
    for (let pageNumber = 1; pageNumber <= limit; pageNumber++) {
      if (isCancelled()) return;

      const page = await doc.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({
        scale: THUMBNAIL_WIDTH / baseViewport.width,
      });

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      page.cleanup();

      if (isCancelled()) return;
      onThumbnail(pageNumber, canvas.toDataURL("image/jpeg", 0.75));
    }
  } finally {
    await loadingTask.destroy();
  }
}
