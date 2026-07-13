# Kendall Monochrome Portfolio

## Objective

Build and maintain Kendall Valverde Diaz's bilingual professional portfolio. The site is an editorial, monochrome experience with accessible motion, a progressive WebGL background, and factual content sourced from `sobremi.md`.

## Architecture

- `app/`: route entry points, metadata, and global styles.
- `src/content/`: typed contracts, parser, sanitizer, and translations.
- `src/generated/`: generated Spanish content and its English counterpart.
- `src/components/` and `src/sections/`: user interface and portfolio sections.
- `src/graphics/`: WebGL background and CSS fallback.
- `src/hooks/`, `src/i18n/`, `src/motion/`: behavior separated from presentation.
- `scripts/`: source synchronization and translation validation.
- `tests/` and `e2e/`: unit, integration, and browser tests.

## Conventions

- Strict TypeScript. Avoid `any`, dead code, and unexplained magic values.
- Prefer small semantic components and native browser behavior.
- Use Anime.js for orchestrated motion and Three.js for WebGL.
- Every listener, animation, frame, and graphics resource must be cleaned up.
- Document complex decisions, not obvious statements.

## Content Rules

`sobremi.md` is the factual source of truth. Never invent employers, dates, projects, technologies, achievements, certifications, links, or metrics. Omit empty information. Never expose private or sensitive data. Record missing public content in `docs/PENDIENTES_CONTENIDO.md`.

Run `npm run content:sync` after changing `sobremi.md`. English translations live in `src/content/translations/portfolio.en.ts`; run `npm run translations:validate` to detect gaps. Spanish is the safe fallback.

> Toda nueva interfaz debe funcionar tanto en espanol como en ingles.

## Visual Rules

The palette is limited to black, white, and neutral gray tokens in `app/globals.css`. Visual variety comes from scale, type, density, opacity, composition, and motion.

> Ningun componente nuevo puede introducir colores fuera de la paleta monocromatica sin una decision de diseno documentada y aprobada.

## Accessibility And Performance

- Preserve semantic HTML, keyboard access, visible focus, sufficient contrast, and a skip link.
- Respect system reduced motion and the manual motion preference.
- Content must remain available when JavaScript motion or WebGL fails.
- Cap rendering resolution, pause hidden tabs, and avoid React state in frame loops.

## Commands

`npm run dev`, `npm run content:sync`, `npm run translations:validate`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npm run build`.

## Definition Of Done

Both `/es` and `/en` work, language selection persists, metadata and `html.lang` follow the active locale, all sections use factual content, desktop projects are horizontal and mobile projects are vertical, reduced motion and WebGL fallback work, tests and build pass, and documentation is current.
