import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kendall Valverde Díaz · Software Engineer",
  description: "Portfolio bilingüe de Kendall Valverde Díaz: desarrollo fullstack, IA aplicada, QA Automation y DevOps.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kendall Valverde Díaz · Software Engineer" }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
