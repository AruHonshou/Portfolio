import { describe, expect, it } from "vitest";
import { findSection, markdownBullets, parseMarkdownSections } from "../src/content/parser";
import { isPublicSafe, sanitizePublicText } from "../src/content/sanitizer";
import { portfolioEs } from "../src/generated/portfolio-content.es";
import { portfolioEn } from "../src/content/translations/portfolio.en";

describe("markdown content", () => {
  const markdown = "# Perfil\n\nTexto\n\n## Habilidades tecnicas\n\n- React\n- TypeScript\n\n## Vacio\n";
  it("detects headings and aliases", () => {
    expect(parseMarkdownSections(markdown)).toHaveLength(3);
    expect(findSection(markdown, ["habilidades", "skills"])?.heading).toBe("Habilidades tecnicas");
  });
  it("normalizes bullet content", () => expect(markdownBullets(findSection(markdown, ["habilidades"])?.body ?? "")).toEqual(["React", "TypeScript"]));
  it("excludes sensitive values", () => {
    expect(isPublicSafe("api_key: secret-value")).toBe(false);
    expect(sanitizePublicText("password: hunter2")).toContain("[redacted]");
  });
  it("omits empty sections from generated portfolio data", () => {
    expect(portfolioEs.projects.every((project) => project.name && project.summary)).toBe(true);
  });
  it("keeps stable keys across translations", () => {
    expect(portfolioEn.projects.map(({ id }) => id)).toEqual(portfolioEs.projects.map(({ id }) => id));
    expect(portfolioEn.skills.map(({ id }) => id)).toEqual(portfolioEs.skills.map(({ id }) => id));
  });
  it("publishes the expanded Aru project without duplicating it", () => {
    const aruProjects = portfolioEs.projects.filter(({ id }) => id === "aru");
    expect(aruProjects).toHaveLength(1);
    expect(aruProjects[0].summary).toContain("PNGTuber");
    expect(aruProjects[0].links.map(({ href }) => href)).toContain("https://aruhonshou.github.io/Aru/guia.html");
  });
  it("keeps detailed experience and public contact channels aligned", () => {
    expect(portfolioEs.experience.every((entry) => entry.responsibilities?.length && entry.results?.length && entry.technologies?.length)).toBe(true);
    expect(portfolioEn.experience.map(({ id }) => id)).toEqual(portfolioEs.experience.map(({ id }) => id));
    expect(portfolioEs.contact.find(({ label }) => label === "WhatsApp")?.href).toBe("https://wa.me/50685097920");
    expect(portfolioEn.contact.find(({ label }) => label === "WhatsApp")?.href).toBe("https://wa.me/50685097920");
  });
  it("falls back to factual Spanish structures", () => expect(portfolioEs.locale).toBe("es"));
});
