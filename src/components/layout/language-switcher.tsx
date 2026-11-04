"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/** Toggles English <-> Arabic. Saves the choice in a cookie for a year, then re-renders the server tree. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const next: Locale = locale === "ar" ? "en" : "ar";

  const switchLanguage = () => {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={t.language.switchToAria}
      lang={next}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700",
        className
      )}
    >
      <Languages size={16} aria-hidden="true" />
      {t.language.switchTo}
    </button>
  );
}
