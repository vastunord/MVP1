# Local responsive capture matrix

Source: `d3cd656e191a5f6f61a140ef61033a148bfc2161`. A local Next.js production build was captured signed out in headless Microsoft Edge, 1 CSS pixel per device pixel, 900px viewport height, reduced motion and blocked HTTPS requests. All 24 captures returned HTTP 200 with no horizontal document overflow. See [checks.json](checks.json).

| Route | Viewport width in CSS pixels |
|---|---|
| /en | [390](home-390.jpg) · [768](home-768.jpg) · [1280](home-1280.jpg) · [1440](home-1440.jpg) · [1920](home-1920.jpg) · [2560](home-2560.jpg) |
| /en/login | [390](login-390.jpg) · [768](login-768.jpg) · [1280](login-1280.jpg) · [1440](login-1440.jpg) · [1920](login-1920.jpg) · [2560](login-2560.jpg) |
| /app/tools/room-reimagination | [390](editor-390.jpg) · [768](editor-768.jpg) · [1280](editor-1280.jpg) · [1440](editor-1440.jpg) · [1920](editor-1920.jpg) · [2560](editor-2560.jpg) |
| /app/renders | [390](gallery-390.jpg) · [768](gallery-768.jpg) · [1280](gallery-1280.jpg) · [1440](gallery-1440.jpg) · [1920](gallery-1920.jpg) · [2560](gallery-2560.jpg) |

These captures do not establish actual device or browser-zoom behavior, authenticated saved-render behavior, screen-reader use or exact Figma parity. Cookie and newsletter overlays were suppressed for stable captures; their sampled behavior is documented separately. Images are local noncommercial demonstration evidence, not approval for commercial publication.

## Local technical issue: mobile editor status

At the initial 390 × 900 viewport in this historical capture, the editor's generation-availability status occupies y=821–880 CSS px while the persistent cookie and Prana launchers occupy approximately y=844–890; both overlap the status horizontally. Center-scrolling the status moves it to y=482–542, clear of the launchers. This was a real first-view obstruction, not merely full-page screenshot stitching. A later local change moves that notice above the workbench; targeted first-view checks passed at 390 × 600, 750 and 900. These screenshots precede that change. Persistent controls can still cover other content while scrolling; that broader behavior and real devices remain unverified.
