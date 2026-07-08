"use client";

import { useState } from "react";

/**
 * components/layout/LanguageSwitcher.tsx
 *
 * PLACEHOLDER (Milestone 2): a visual EN | AR switch that stores the
 * selection locally but does not yet change the page language — real i18n
 * (routing, translated content, RTL layout for Arabic) is a deferred
 * post-roadmap milestone. Shipping the control now reserves its place in
 * the header design and lets us measure interest in Arabic via analytics
 * later.
 *
 * Accessibility: a radiogroup of two options; the active language is
 * announced via aria-checked. Selecting Arabic shows a brief "coming soon"
 * note instead of silently doing nothing — controls should never appear
 * broken.
 */

type Language = "en" | "ar";

const languages: { code: Language; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "Arabic" },
];

export function LanguageSwitcher() {
  const [active, setActive] = useState<Language>("en");
  const [showNote, setShowNote] = useState(false);

  function select(code: Language) {
    setActive(code);
    // Arabic isn't available yet — tell the user instead of failing silently.
    setShowNote(code === "ar");
    if (code === "ar") {
      window.setTimeout(() => {
        setShowNote(false);
        setActive("en");
      }, 2000);
    }
  }

  return (
    <div className="relative">
      <div
        role="radiogroup"
        aria-label="Language"
        className="inline-flex items-center rounded-full border border-border p-0.5 text-xs font-medium"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={active === lang.code}
            aria-label={lang.name}
            onClick={() => select(lang.code)}
            className={`rounded-full px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active === lang.code
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {showNote && (
        <p
          role="status"
          className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-sm"
        >
          العربية قريباً — Arabic is coming soon
        </p>
      )}
    </div>
  );
}
