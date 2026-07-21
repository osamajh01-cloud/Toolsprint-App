import { PDFDocument } from "pdf-lib";

/**
 * components/tools/pdf-merge/merge.ts
 *
 * The PDF logic, separated from the UI. Lives in the tool folder (not
 * lib/) deliberately: it imports pdf-lib, so placing it here keeps the
 * heavy dependency inside the tool's lazy chunk — lib/ modules are
 * imported by statically-bundled code. Still framework-free and
 * unit-testable (pdf-lib runs in Node).
 *
 * Quality/fidelity: pdf-lib's copyPages transplants page objects verbatim
 * — text, images, fonts, and page rotation are preserved exactly, never
 * re-rendered. Document metadata is carried over from the first source
 * that has it (title/author/subject "where possible", per the spec).
 */

/** Parse just enough to count pages; the document is discarded after, so
 *  adding files doesn't hold decoded PDFs in memory. */
export async function readPageCount(bytes: ArrayBuffer): Promise<number> {
  const doc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  return doc.getPageCount();
}

export interface MergeResult {
  bytes: Uint8Array;
  pageCount: number;
}

/**
 * Merge sources in the given order into one PDF.
 * onProgress is called before each source is processed (1-based).
 */
export async function mergePdfBytes(
  sources: ArrayBuffer[],
  onProgress?: (fileIndex: number, totalFiles: number) => void,
): Promise<MergeResult> {
  const output = await PDFDocument.create();

  let titleSet = false;
  let authorSet = false;
  let subjectSet = false;

  for (let index = 0; index < sources.length; index++) {
    onProgress?.(index + 1, sources.length);
    // Yield to the event loop between documents so progress paints and
    // the page stays responsive during large merges.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const source = await PDFDocument.load(sources[index], {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    const pages = await output.copyPages(source, source.getPageIndices());
    for (const page of pages) output.addPage(page);

    // Metadata "where possible": first source to define a field wins.
    if (!titleSet) {
      const title = source.getTitle();
      if (title) {
        output.setTitle(title);
        titleSet = true;
      }
    }
    if (!authorSet) {
      const author = source.getAuthor();
      if (author) {
        output.setAuthor(author);
        authorSet = true;
      }
    }
    if (!subjectSet) {
      const subject = source.getSubject();
      if (subject) {
        output.setSubject(subject);
        subjectSet = true;
      }
    }
  }

  output.setProducer("TOOLAK PDF Merge");
  output.setModificationDate(new Date());

  const bytes = await output.save();
  return { bytes, pageCount: output.getPageCount() };
}
