import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Portfolio } from "../../src/components/Portfolio";
import type { Locale } from "../../src/content/types";

const descriptions: Record<Locale, string> = {
  es: "Software Engineer especializado en desarrollo fullstack, IA aplicada y QA Automation.",
  en: "Software Engineer focused on fullstack development, applied AI, and QA automation.",
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  return {
    title: "Kendall Valverde Díaz · Software Engineer",
    description: descriptions[locale],
    openGraph: { title: "Kendall Valverde Díaz", description: descriptions[locale], locale: locale === "es" ? "es_CR" : "en_US", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kendall Valverde Díaz · Software Engineer" }] },
    twitter: { card: "summary_large_image", title: "Kendall Valverde Díaz", description: descriptions[locale], images: ["/og.png"] },
    alternates: { languages: { es: "/es", en: "/en", "x-default": "/" } },
  };
}

export default async function LocalizedPortfolio({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "es" && lang !== "en") notFound();
  return <Portfolio initialLocale={lang} />;
}
