"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * i18n/LocaleProvider.tsx
 *
 * Makes the active locale and its dictionary available to client islands
 * (search, nav, theme toggle) without prop-drilling through every server
 * component in between.
 *
 * The dictionary crosses the server/client boundary once, as serialized
 * props — the client never imports a dictionary module, so no language's
 * strings are bundled into the client JavaScript.
 */

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: LocaleContextValue & { children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, dictionary }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used inside a LocaleProvider");
  }
  return context;
}
