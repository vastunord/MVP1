# Header and homepage browser evidence

The baseline captures show the public Norwegian homepage at the start of v7, on demonstration release `c71034b`. Each image is an initial, unscrolled viewport 900 CSS pixels high. The image width is the rendered width of the first main-content architectural image, excluding the decorative background. [Public homepage](https://vastunord-web.vercel.app/)

| Viewport width | Baseline, light theme | Baseline image width |
| --- | --- | --- |
| 390 px | [Mobile homepage](before-390-light.webp) | 350 px |
| 768 px | [Tablet homepage](before-768-light.webp) | 280 px |
| 1280 px | [Desktop homepage](before-1280-light.webp) | 410 px |
| 1440 px | [Wide desktop homepage](before-1440-light.webp) | 410 px |

Each baseline image decoded successfully. All four homepage layouts fit the viewport horizontally. At 390 px, the study card followed the headline and calls to action. At the wider sizes it occupied a separate column alongside the headline.

## Local production build

The architectural image filled 390, 768, 1280 and 1440 CSS pixels at the corresponding viewport widths, in both themes. The browser decoded the image at all eight size/theme combinations and found one primary heading and no horizontal document overflow. Chromium identified Zalando Sans Expanded as the custom font rendering all 19 glyphs of the Norwegian hero heading. The browser received the font from Google Fonts with HTTP 200.

The keyboard-operated lighting control reached both endpoints. The English sample action opened Material Refinement with the Atelier Apartment as its source. The source persisted on reload and after switching to Lighting Reimagination. Language and theme survived reload, the permanent Prana link opened its screen, and the Norwegian room-editor CTA opened the closed private upload panel. All 17 registered tool routes loaded with the expected heading, disabled generation and no file input. No uncaught browser exception occurred during this journey.

Mobile visual review identified a clipped comparison thumb and low contrast on the small introductory label. The thumb mask and text scrim were revised following review.
