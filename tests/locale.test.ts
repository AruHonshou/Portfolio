import { describe, expect, it } from "vitest";
import { isLocale, localizedPath, resolveLocale } from "../src/i18n/locale";

describe("locale behavior", () => {
  it("validates locales", () => { expect(isLocale("es")).toBe(true); expect(isLocale("fr")).toBe(false); });
  it("prefers stored language", () => expect(resolveLocale("en", "es-CR")).toBe("en"));
  it("detects browser language and falls back to Spanish", () => {
    expect(resolveLocale(null, "en-US")).toBe("en");
    expect(resolveLocale(null, "fr-FR")).toBe("es");
  });
  it("builds localized routes while preserving a section", () => expect(localizedPath("en", "projects")).toBe("/en#projects"));
});
