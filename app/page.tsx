"use client";

import { useEffect } from "react";

export default function LocaleResolver() {
  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-language");
    const browserLocale = window.navigator.language.toLowerCase().startsWith("en") ? "en" : "es";
    const locale = stored === "en" || stored === "es" ? stored : browserLocale;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.location.replace(`${basePath}/${locale}${window.location.hash}`);
  }, []);

  return <main className="locale-loader" aria-live="polite"><span>KENDALL</span></main>;
}
