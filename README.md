# Kendall Monochrome Portfolio

A bilingual editorial portfolio for Kendall Valverde Diaz, built around verified content, monochrome motion, responsive project storytelling, and progressive WebGL enhancement.

## Stack

React 19, TypeScript, vinext/Vite, Three.js, Anime.js, CSS, Vitest, Testing Library, and Playwright. The deployment output is Cloudflare Worker-compatible ESM through the Sites starter.

## Run

```bash
npm install
npm run content:sync
npm run translations:validate
npm run dev
```

Open `/es` or `/en`. `/` chooses the stored language, browser language, or Spanish fallback.

## Content And Translation

`sobremi.md` is the factual source. Keep its headings and facts explicit, then run `npm run content:sync`. Review `src/generated/portfolio-content.es.ts` when portfolio facts change. English lives in `src/content/translations/portfolio.en.ts`; stable IDs connect both locales and `npm run translations:validate` catches structural gaps.

Add projects only with a documented name, purpose, state, technologies, and real links. Place authentic optimized imagery in `public/projects/` and add explicit dimensions. Without an authentic image, use the existing monochrome typographic cover system.

## Quality

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

The WebGL fluid is a lazy-loaded Three.js shader on a single plane. It responds to pointer and scroll, adapts resolution, pauses in hidden tabs, handles context loss, and disposes all resources. A CSS monochrome fallback is visible immediately.

Reduced motion follows the system preference and the manual control. It removes the fluid loop, character motion, and project scroll transformation while preserving all content. Palette tokens live in `app/globals.css`; do not introduce non-neutral colors without an approved design decision.

Deployment uses the generated production build. Set a final public site URL only when one exists; do not hard-code an invented domain.
