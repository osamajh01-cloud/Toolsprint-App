/**
 * lib/base64.ts
 *
 * Unicode-safe Base64 encode/decode for the Base64 tool. The naive
 * btoa(text) throws on any non-Latin-1 character, so we go through
 * TextEncoder/TextDecoder byte arrays — "こんにちは" and emoji round-trip
 * correctly.
 *
 * Browser-only (btoa/atob/TextEncoder): these functions are called from
 * client components. Node ≥ 16 also provides all four globals, which is
 * what makes the unit tests possible.
 */

export type Base64Result =
  | { ok: true; output: string }
  | { ok: false; error: string };

export function encodeBase64(text: string): Base64Result {
  try {
    const bytes = new TextEncoder().encode(text);
    // Build the binary string in chunks — String.fromCharCode(...bytes)
    // overflows the argument limit on large inputs.
    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return { ok: true, output: btoa(binary) };
  } catch {
    return { ok: false, error: "This text could not be encoded." };
  }
}

export function decodeBase64(input: string): Base64Result {
  // Be forgiving about whitespace/newlines (common when pasting), strict
  // about everything else so garbage input gets a clear error, not mojibake.
  const cleaned = input.replace(/\s/g, "");

  if (cleaned.length === 0) return { ok: true, output: "" };

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
    return {
      ok: false,
      error:
        "Not valid Base64: only letters, digits, +, /, and trailing = padding are allowed.",
    };
  }
  if (cleaned.length % 4 === 1) {
    return {
      ok: false,
      error: "Not valid Base64: the input length is impossible for Base64 data.",
    };
  }

  try {
    const binary = atob(cleaned);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return {
      ok: true,
      output: new TextDecoder("utf-8", { fatal: false }).decode(bytes),
    };
  } catch {
    return { ok: false, error: "Not valid Base64: the data could not be decoded." };
  }
}
