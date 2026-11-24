# Local responsive capture matrix

Source: `31a7c361d00bb07399763de7e9155953a68ed683`. A local Next.js production build was captured signed out in headless Microsoft Edge, 1 CSS pixel per device pixel, 900px viewport height, reduced motion and blocked HTTPS requests. All 24 captures returned HTTP 200 with no horizontal document overflow. See [checks.json](checks.json).

| Route | Viewport width in CSS pixels |
|---|---|
| /en | [390](home-390.jpg) · [768](home-768.jpg) · [1280](home-1280.jpg) · [1440](home-1440.jpg) · [1920](home-1920.jpg) · [2560](home-2560.jpg) |
| /en/login | [390](login-390.jpg) · [768](login-768.jpg) · [1280](login-1280.jpg) · [1440](login-1440.jpg) · [1920](login-1920.jpg) · [2560](login-2560.jpg) |
| /app/tools/room-reimagination | [390](editor-390.jpg) · [768](editor-768.jpg) · [1280](editor-1280.jpg) · [1440](editor-1440.jpg) · [1920](editor-1920.jpg) · [2560](editor-2560.jpg) |
| /app/renders | [390](gallery-390.jpg) · [768](gallery-768.jpg) · [1280](gallery-1280.jpg) · [1440](gallery-1440.jpg) · [1920](gallery-1920.jpg) · [2560](gallery-2560.jpg) |

These captures do not establish actual device or browser-zoom behavior, authenticated saved-render behavior, screen-reader use or exact Figma parity. Cookie and newsletter overlays were suppressed for stable captures; their sampled behavior is documented separately. Images are local noncommercial demonstration evidence, not approval for commercial publication.

At 390 × 900, the fixed cookie launcher partially covers the left edge of the Studio Design link. Its visible center was tested in a later local source with mouse click and touch-enabled browser tap; scrolling exposes the link. The later pointer-timing fix is not shown in these captures, and this does not establish unobstructed pointer access to the whole link or physical-device behavior.
