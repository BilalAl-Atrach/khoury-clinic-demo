"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/types";
import { dictionaries, localeMeta, type Dictionary } from "@/locales";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "khoury-clinic-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Reading localStorage only after mount (rather than as a lazy initial state)
    // keeps server and first-client render identical, avoiding a hydration mismatch.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === "en" || stored === "ar" || stored === "fr")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from browser-only storage post-hydration by design
      setLocaleState(stored as Locale);
    }
  }, []);

  useEffect(() => {
    const dir = localeMeta[locale].dir;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors in restricted environments
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: localeMeta[locale].dir,
      t: dictionaries[locale],
      setLocale,
    }),
    [locale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
