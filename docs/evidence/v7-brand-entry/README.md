# Header and homepage browser evidence

The screenshots compare public demonstration releases `c71034b` and `a550e02` on 22 November 2026. Each shows the Norwegian homepage from the top in a 900 CSS pixel-high viewport. Image width measures the first architectural image in the main content, excluding the earlier decorative background. [Public homepage](https://vastunord-web.vercel.app/)

| Viewport | Previous homepage | Released homepage | Previous → released image width |
| --- | --- | --- | --- |
| 390 px | [Mobile, light](before-390-light.webp) | [Mobile, light](after-390-light.webp) · [Mobile, dark](after-390-dark.webp) | 350 → 390 px |
| 768 px | [Tablet, light](before-768-light.webp) | [Tablet, light](after-768-light.webp) · [Tablet, dark](after-768-dark.webp) | 280 → 768 px |
| 1280 px | [Desktop, light](before-1280-light.webp) | [Desktop, light](after-1280-light.webp) · [Desktop, dark](after-1280-dark.webp) | 410 → 1280 px |
| 1440 px | [Wide desktop, light](before-1440-light.webp) | [Wide desktop, light](after-1440-light.webp) · [Wide desktop, dark](after-1440-dark.webp) | 410 → 1440 px |

Previously, the study card appeared below the calls to action on mobile and in a separate column on larger screens. The released image fills each viewport behind the heading. Desktop shows inline navigation. The 390 px header has two rows with visible locale, theme, Prana and Studio controls. The menu opens over the hero and closes with Escape. The released mobile screenshot shows the corrected comparison thumb and darker surface behind the introductory text. [Open mobile menu](after-menu-390.webp) · [Official wordmark comparison](wordmark-comparison.webp)

## Browser checks

- The local production build and public alias both decoded the hero image, displayed one primary heading and fit horizontally at all eight size/theme combinations. Chromium reported that Zalando Sans Expanded drew all 19 glyphs in the Norwegian hero heading. Its Google Fonts requests succeeded with HTTP 200. Font availability in browsers that block the Google CDN remains dependent on the fallback.
- The theme and language selections survived reload. The Prana link opened its workspace screen. The lighting comparison responded to Home and End. The 390 px room-editor CTA opened the source-image panel and explained private upload availability.
- Choosing the Atelier Apartment opened Material Refinement with the selected image. It remained the source on reload and after switching to Lighting Reimagination. [Selected sample in Material Refinement](after-sample-editor-1440.webp)
- All 17 configured editor routes returned HTTP 200, displayed the expected tool heading and kept generation disabled. The public editors contained no file inputs. The browser encountered no uncaught exception during the checked journey. [Studio tool configuration matrix](../../STUDIO_TOOL_CONFIGURATION_MATRIX.md)
- Anonymous GET requests to `/api/projects`, `/api/auth/get-session`, `/api/projects/demo-check/assets`, `/api/assets/demo-check/download` and `/api/health` returned HTTP 503 on the public demonstration.

These browser captures compare application releases. Exact Figma geometry and approved source crops still require frame exports. The screenshots show the current illustrative room studies. [Figma route comparison](../../FIGMA_TO_ROUTE_MATRIX.md)
