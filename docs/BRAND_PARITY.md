# Brand parity · V7 Phase 00

The 36-page [brand guide](../assets/brand/Brand%20Guidelines%20Document.pdf) governs the identity. The primary horizontal lockup includes the architectural symbol and custom lettering. The website uses colored vector paths from the guide itself. Figma marketing composition and image-crop decisions are tracked separately in the [route matrix](FIGMA_TO_ROUTE_MATRIX.md).

| Guide reference | Application asset and surface | Verification |
|---|---|---|
| pp. 14, 22–24 · primary on a light ground | [Deep teal lockup](../apps/web/public/brand/vastunord-primary-teal.svg) in the shared light header on `/`, `/en` and `/app` | Ten filled paths exported from the primary example on p. 24. Comparison against a rendered PDF crop passed. |
| pp. 25, 28 · primary on a dark ground | [Ivory lockup](../apps/web/public/brand/vastunord-primary-ivory.svg) in dark navigation and the marketing footer | P. 28 supplies the paths and ivory fill. Both exports retain the same 10.846:1 ratio. The footer uses the guide’s deep teal ground. |
| p. 17 · standalone symbol | [Browser icon](../apps/web/src/app/icon.svg) for public and Studio routes | The near-black symbol retains the p. 17 silhouette on warm ivory. Only the surrounding square padding changes for the browser icon. |
| p. 19 · six colors | [Shared CSS tokens](../apps/web/src/app/globals.css) for light and dark themes | Source PDF RGB fills checked directly. Teal and ivory supply the wordmark colors. Orange and near-black supply the primary action colors. |
| p. 20 · Zalando Sans Expanded | Headings, body, navigation and form controls share the upright and italic variable faces | Both official Latin WOFF2 responses returned 200. The browser reported custom Zalando Sans Expanded and its italic face for a string containing `æøå ÆØÅ`. Blocking the two requests produced readable Arial and Arial Italic in the verification browser. |

[PDF crops and exported SVGs, side by side](evidence/v7-brand-entry/wordmark-comparison.webp). Each lockup was rasterized at the same 1085 × 100 size. The foreground intersection over union was 99.3% for each pair. The previous 949 × 88 recovered PNGs also contain the symbol and custom lettering, with about 95.5% foreground overlap at the same size. Pages 15–16 and 18 contain stacked and tagline variants for other placements. Pages 32–34 prohibit distortion, gradients, arbitrary colors and outline treatments.

The [responsive screenshot index](evidence/v7-brand-entry/README.md) records the actual Vastu Nord homepage header and photo entry surface at the four release widths.

## Type delivery

The guide lists ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold and Black in upright and italic. The publisher’s variable axis covers 200–900. The browser loads only the faces it needs directly from `fonts.gstatic.com`. `font-display: swap` makes text available through the local fallback during loading. English and Norwegian use the Latin subset. The application bundle and repository contain no font binaries. The CDN receives a normal browser font request. [Google Fonts family metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/zalandosansexpanded/METADATA.pb) · [upstream release source](https://github.com/zalando/sans/tree/4e44d0864c4e37ab67fa549cd188aec8776dc948) · [publisher’s SIL Open Font License](https://github.com/zalando/sans/blob/4e44d0864c4e37ab67fa549cd188aec8776dc948/OFL.txt).

## Color values

The CSS retains the guide's PDF fill operands. The nearest 8-bit sRGB values below are suitable for raster and SVG output.

| Swatch | CSS token | sRGB |
|---|---|---|
| Near-black | `--ink` | `#0D0E0E` |
| Warm ivory | `--paper` | `#F7F2EC` |
| Deep teal | `--navy` | `#013C55` |
| Sage | `--sage` | `#BCCCC9` |
| Sand | `--sand` | `#EAD0B6` |
| Orange | `--orange` | `#FB602B` |
