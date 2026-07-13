# Internationalization

`sobremi.md` is the factual source. `npm run content:sync` reads it, sanitizes its headings, verifies required public facts, and records a deterministic source hash. The curated Spanish structure lives in `src/generated/portfolio-content.es.ts`; the reviewed English translation uses the same stable IDs in `src/content/translations/portfolio.en.ts`.

Spanish is the safe fallback. `/es` and `/en` are shareable routes. The root route resolves stored preference, then browser language, then Spanish. The switch preserves the current hash, stores the locale in `localStorage`, updates `html.lang`, title, description, Open Graph locale, and canonical URL.

To add a third language, extend `Locale`, add a complete content object and label dictionary, update route validation and SEO locale mapping, then add it to the translation validator and tests.
