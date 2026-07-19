"use client";

import { useEffect, useState } from "react";

/**
 * components/layout/useScrolled.ts
 *
 * True once the page has scrolled past `threshold`. Used by the header to
 * add a hairline border and shadow only when content is underneath it —
 * flat at rest, elevated on scroll.
 *
 * The listener is passive (never blocks scrolling) and reads a single
 * boolean, so state changes at most twice per scroll direction.
 */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
