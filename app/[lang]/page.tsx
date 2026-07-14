import type { Metadata } from "next";
import { Portfolio } from "../../src/components/Portfolio";
import type { Locale } from "../../src/content/types";

const descriptions: Record<Locale, string> = {
  es: "Software Engineer especializado en desarrollo fullstack, IA aplicada y QA Automation.",
  en: "Software Engineer focused on fullstack development, applied AI, and QA automation.",
};

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return {
    title: "Kendall Valverde Díaz · Software Engineer",
    description: descriptions[locale],
    openGraph: { title: "Kendall Valverde Díaz", description: descriptions[locale], locale: locale === "es" ? "es_CR" : "en_US", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kendall Valverde Díaz · Software Engineer" }] },
    twitter: { card: "summary_large_image", title: "Kendall Valverde Díaz", description: descriptions[locale], images: ["/og.png"] },
    alternates: { languages: { es: "/es", en: "/en", "x-default": "/" } },
  };
}

export default function LocalizedPortfolio({ params }: { params: { lang: string } }) {
  const { lang } = params;
  return <Portfolio initialLocale={lang === "en" ? "en" : "es"} />;
}
