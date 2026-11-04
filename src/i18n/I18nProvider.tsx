"use client";

import * as React from "react";
import { getDirection, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

type I18nContextValue = { locale: Locale; dir: "ltr" | "rtl"; t: Dictionary };

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = React.useMemo(
    () => ({ locale, dir: getDirection(locale), t: getDictionary(locale) }),
    [locale]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
