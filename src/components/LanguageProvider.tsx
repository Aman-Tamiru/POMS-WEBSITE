"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "@/locales/en.json";
import am from "@/locales/am.json";
import so from "@/locales/so.json";
import zhCN from "@/locales/zh-CN.json";
import hi from "@/locales/hi.json";
import es from "@/locales/es.json";

export type SupportedLanguage = "en" | "am" | "so" | "zh-CN" | "hi" | "es";

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string) => string;
}

type Dictionary = {
  [key: string]: string | Dictionary;
};

const dictionaries: Record<SupportedLanguage, Dictionary> = {
  en,
  am,
  so,
  "zh-CN": zhCN,
  hi,
  es,
};

export const LANGUAGE_LABELS: Record<
  SupportedLanguage,
  { label: string; code: string; flag: string }
> = {
  en: { label: "English", code: "GB", flag: "🇬🇧" },
  am: { label: "አማርኛ", code: "ET", flag: "🇪🇹" },
  so: { label: "Soomaali", code: "SO", flag: "🇸🇴" },
  "zh-CN": { label: "中文", code: "CN", flag: "🇨🇳" },
  hi: { label: "हिन्दी", code: "IN", flag: "🇮🇳" },
  es: { label: "Español", code: "ES", flag: "🇪🇸" },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const saved = localStorage.getItem("poms_language") as SupportedLanguage | null;
    if (saved && ["en", "am", "so", "zh-CN", "hi", "es"].includes(saved)) {
      setLanguageState(saved);
      document.documentElement.setAttribute("lang", saved);
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    localStorage.setItem("poms_language", newLang);
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.setAttribute("lang", newLang);
  };

  /**
   * Safe nested key lookup (e.g. "hero.title", "nav.home")
   * Falls back gracefully to English dictionary if key is missing in target language.
   */
  const t = (keyPath: string): string => {
    const keys = keyPath.split(".");
    let current: string | Dictionary | undefined = dictionaries[language];
let fallback: string | Dictionary | undefined = dictionaries.en;

for (const k of keys) {
  current =
    current && typeof current === "object"
      ? current[k]
      : undefined;

  fallback =
    fallback && typeof fallback === "object"
      ? fallback[k]
      : undefined;
}

if (typeof current === "string") return current;
if (typeof fallback === "string") return fallback;

return keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
