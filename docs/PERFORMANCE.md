# Performance

The page is useful before graphics load. The Three.js layer is lazy-loaded behind a CSS fallback, uses a single fullscreen plane and original fragment shader, caps device pixel ratio at 1.5 on desktop and 1 on mobile, and never writes React state per frame.

Animation pauses on hidden tabs. Resize, pointer, scroll, visibility, and context listeners are removed during cleanup; geometry, material, and renderer resources are disposed. A lost or unavailable WebGL context reveals the CSS fallback without affecting content.

Mobile and reduced-motion modes remove the sticky horizontal project transform and use a normal vertical document flow. Explicit dimensions and aspect ratios minimize layout shifts.
