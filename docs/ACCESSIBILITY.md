# Accessibility

The site uses landmarks, one H1, ordered section headings, descriptive links, a skip link, visible focus, sufficient monochrome contrast, and real buttons for all controls. The fixed navigation reports active state visually without relying only on color.

The mobile menu exposes `aria-expanded` and `aria-controls`, closes on Escape and navigation, restores focus to the trigger, and locks background scrolling. The language switch uses `aria-pressed`, persists preference, updates `html.lang`, and announces the localized state.

System reduced motion is honored on first load and can be overridden with the motion control. It removes the WebGL loop, per-word reveal, scroll scrubbing, and horizontal project movement while keeping every fact readable. Automated tests cover keyboard focus, menu Escape, locale state, mobile overflow, and reduced-motion fallback.
