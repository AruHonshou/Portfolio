import type { Locale } from "../content/types";

export const STORAGE_KEY = "portfolio-language";

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

export function resolveLocale(stored: string | null, browserLanguage: string): Locale {
  if (isLocale(stored)) return stored;
  return browserLanguage.toLowerCase().startsWith("en") ? "en" : "es";
}

export function localizedPath(locale: Locale, hash = ""): string {
  const safeHash = hash.startsWith("#") || hash === "" ? hash : `#${hash}`;
  return `/${locale}${safeHash}`;
}
