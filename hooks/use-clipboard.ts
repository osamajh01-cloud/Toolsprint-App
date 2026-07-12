"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * hooks/use-clipboard.ts
 *
 * Shared clipboard behavior for all tools. Extracted in Milestone 6 (the
 * pattern first appeared inline in WordCounter) so copy/paste logic exists
 * exactly once.
 *
 * - useCopyToClipboard: copy(text) with a transient `copied` flag for
 *   "Copied" button feedback. Returns success so callers can run a
 *   fallback (e.g. select the source text) instead of failing silently.
 * - useClipboardRead: feature-detects readText AFTER MOUNT (browser-only
 *   API; Firefox lacks it) so server and client markup never diverge —
 *   paste buttons render only where they can actually work.
 */

export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Don't flip state after unmount.
  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(
          () => setCopied(false),
          resetAfterMs,
        );
        return true;
      } catch {
        return false;
      }
    },
    [resetAfterMs],
  );

  return { copied, copy };
}

export function useClipboardRead() {
  const [canPaste, setCanPaste] = useState(false);

  useEffect(() => {
    setCanPaste(
      typeof navigator !== "undefined" &&
        typeof navigator.clipboard?.readText === "function",
    );
  }, []);

  const read = useCallback(async (): Promise<string | null> => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return null; // Permission denied — caller decides the fallback.
    }
  }, []);

  return { canPaste, read };
}
