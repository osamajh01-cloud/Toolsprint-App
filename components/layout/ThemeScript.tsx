/**
 * components/layout/ThemeScript.tsx
 *
 * Tiny inline script injected into <head> by the root layout. It runs
 * synchronously BEFORE first paint and applies the `.dark` class to <html>
 * based on (1) the user's saved choice in localStorage, falling back to
 * (2) the OS `prefers-color-scheme`. Without this, a dark-mode user would
 * see a white flash on every page load ("FOUC") because React hydrates
 * after paint.
 *
 * This is the standard zero-dependency pattern for class-based dark mode;
 * it removes the need for a theming library. The script is static (no
 * user input is interpolated), so dangerouslySetInnerHTML is safe here.
 */

// Persistence key — deliberately keeps its original value across the
// TOOLAK rebrand. Renaming it would orphan every existing visitor's
// saved theme (they'd get a one-time flash of the wrong mode), which is
// a functional regression for zero user-visible benefit — the string
// never appears in the UI.
const THEME_STORAGE_KEY = "toolsprint-theme";

const script = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : systemDark;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    /* localStorage unavailable (e.g. blocked): fall back to light. */
  }
})();
`;

export { THEME_STORAGE_KEY };

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
