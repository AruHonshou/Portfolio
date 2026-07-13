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
  it("falls back to factual Spanish structures", () => expect(portfolioEs.locale).toBe("es"));
});
