/**
 * lib/text-transform.ts
 *
 * Pure text transformations shared by the Slug Generator, Case Converter,
 * Text Reverser, and Remove Duplicate Lines tools. Framework-free, like
 * lib/text-analysis.ts — string in, string out, unit-testable.
 */

/* ----------------------------- Slug ----------------------------- */

/**
 * SEO-friendly slug: accents stripped (NFKD + combining-mark removal),
 * lowercased, non-alphanumerics collapsed to single hyphens, no leading/
 * trailing hyphens. "Crème Brûlée — Chef's Guide!" → "creme-brulee-chefs-guide".
 */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
    .toLowerCase()
    .replace(/['’]/g, "") // don't → dont (not don-t)
    .replace(/[^a-z0-9]+/g, "-") // everything else → hyphen
    .replace(/-{2,}/g, "-") // collapse duplicate hyphens
    .replace(/^-+|-+$/g, ""); // trim edge hyphens
}

/* ------------------------- Case conversion ------------------------- */

export type CaseStyle =
  | "lowercase"
  | "uppercase"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab";

/** Split into word tokens; also breaks existing camel/Pascal boundaries so
 *  "myVariableName" round-trips through any style. */
function words(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/** Sentence case: everything lowered, then the first letter after start /
 *  ./!/?/newline is raised. Preserves original spacing and punctuation. */
function sentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^|[.!?]\s+|\n\s*)(\p{L})/gu, (match) => match.toUpperCase());
}

/** Title case over the original text, preserving spacing/punctuation. */
function titleCase(text: string): string {
  return text.replace(
    /[\p{L}\p{N}]+/gu,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );
}

export function convertCase(text: string, style: CaseStyle): string {
  switch (style) {
    case "lowercase":
      return text.toLowerCase();
    case "uppercase":
      return text.toUpperCase();
    case "title":
      return titleCase(text);
    case "sentence":
      return sentenceCase(text);
    case "camel": {
      const parts = words(text);
      return parts
        .map((word, index) =>
          index === 0 ? word.toLowerCase() : capitalize(word),
        )
        .join("");
    }
    case "pascal":
      return words(text).map(capitalize).join("");
    case "snake":
      return words(text)
        .map((word) => word.toLowerCase())
        .join("_");
    case "kebab":
      return words(text)
        .map((word) => word.toLowerCase())
        .join("-");
  }
}

/* --------------------------- Reversing --------------------------- */

export type ReverseMode = "characters" | "words" | "lines";

/** Reverse by grapheme clusters where the platform supports
 *  Intl.Segmenter (so emoji/accents don't shatter); falls back to code
 *  points via Array.from otherwise. */
function reverseCharacters(text: string): string {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (part) => part.segment)
      .reverse()
      .join("");
  }
  return Array.from(text).reverse().join("");
}

export function reverseText(text: string, mode: ReverseMode): string {
  switch (mode) {
    case "characters":
      return reverseCharacters(text);
    case "words":
      // Reverse word order per line; keeps line structure intact.
      return text
        .split("\n")
        .map((line) => line.split(/[ \t]+/).reverse().join(" "))
        .join("\n");
    case "lines":
      return text.split("\n").reverse().join("\n");
  }
}

/* ---------------------- Duplicate-line removal ---------------------- */

export interface DedupeOptions {
  ignoreCase: boolean;
  trimWhitespace: boolean;
  sortLines: boolean;
}

export interface DedupeResult {
  output: string;
  totalLines: number;
  uniqueLines: number;
  removedLines: number;
}

/** Keep the first occurrence of each line; comparison key honors the
 *  ignoreCase/trimWhitespace options; optional A→Z sort of the result. */
export function removeDuplicateLines(
  text: string,
  options: DedupeOptions,
): DedupeResult {
  const lines = text.split(/\r?\n/);
  const seen = new Set<string>();
  const kept: string[] = [];

  for (const rawLine of lines) {
    const line = options.trimWhitespace ? rawLine.trim() : rawLine;
    const key = options.ignoreCase ? line.toLowerCase() : line;
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(line);
  }

  if (options.sortLines) {
    kept.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  return {
    output: kept.join("\n"),
    totalLines: lines.length,
    uniqueLines: kept.length,
    removedLines: lines.length - kept.length,
  };
}
