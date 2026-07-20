"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/components/layout/ThemeScript";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * components/layout/ThemeToggle.tsx
 *
 * Light/dark theme switch shown in the header (desktop and mobile menu).
 * Client component: it reads/writes localStorage and mutates the <html>
 * class, both browser-only concerns.
 *
 * Hydration note: the server can't know the user's theme, so we render a
 * neutral placeholder until mounted, then show the real state. This keeps
 * server and client markup identical on first render (no hydration
 * mismatch) at the cost of the icon appearing one frame later — invisible
 * in practice.
 *
 * Accessibility: rendered as a switch with `aria-pressed` ("dark mode on/
 * off"), a descriptive label, and inline SVG icons marked aria-hidden so
 * screen readers announce the state, not the pictures.
 */

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ dictionary }: { dictionary: Dictionary }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // On mount, read the real theme from the <html> class that ThemeScript
  // already applied pre-paint — a single source of truth.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* localStorage blocked: theme still toggles for this page view. */
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={mounted ? isDark : undefined}
      aria-label={
        mounted
          ? isDark
            ? dictionary.nav.lightTheme
            : dictionary.nav.darkTheme
          : dictionary.nav.toggleTheme
      }
      className="inline-flex size-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Neutral placeholder pre-mount keeps SSR/client markup identical. */}
      {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <SunIcon />}
    </button>
  );
}
