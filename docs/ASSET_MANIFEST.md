# Studio asset replacement manifest (fill during asset phase)

## Recovered demo asset mapping

The HTML demo README identifies two logo treatments and three brand photographs extracted from the owner-supplied brand guide, plus four illustrative tonal studies. The noncommercial demo uses selected static files in `apps/web/public/reference/`. The source bundle's scripts, demo account state and reference documents are separate from these public assets.

| File under public/reference | Recovered source and intended display | Evidence / limitation |
|---|---|---|
| logo-teal.png, logo-ivory.png | Historical brand PNGs from the recovered demo | Shared header and footer now use direct vector exports from the official guide. [Brand artwork and comparison](BRAND_PARITY.md) |
| soft.webp | Studio and dashboard reference interior, Fjord study | Supplied brand photograph. Precise Figma crop and scene-specific editor sample remain unresolved. |
| warm.webp | Warm palette study and atelier album | Supplied brand photograph used as a concept reference. |
| cover.webp | Cabin project study and gallery cover | Supplied brand photograph. Study names describe fictional project contexts. |
| soft-day.webp, soft-evening.webp, soft-bright.webp, soft-moss.webp | Lighting and tonal examples for example canvases, galleries and guided experiences | Supplied variations of the brand image. No model inference or customer media. |

The approved demo images have separate provenance from the local Visuals collection. The current header, footer and favicon use exact guide vectors. The official externally hosted typeface and its rendering evidence are documented in [brand parity](BRAND_PARITY.md).

## Current local Visuals inventory · 22 November 2026

The [metadata manifest](VISUALS_ASSET_MANIFEST.csv) covers 723 files totaling 2,151,639,434 bytes, with 721 distinct SHA-256 digests and two duplicate pairs. Inspection identified 720 PNG files, including one with a JPG extension, and three MP4s. The four ZIP files counted in Phase 02C are absent from the reorganized directory. Manifest rows carry the current relative path, dimensions, orientation, duplicate count, proposed category and rights status. File names supply provisional captions on uninspected rows.

The landscape fjord-facing villa and two alternate architectural scenes were reviewed for composition. A matched before/after pair and public-use rights are unverified for these candidates. The homepage uses the existing brand photos pending scoped approval. Originals stay outside Git and deployment. A manifest row or duplicate file does not confer publication rights. Editorial decisions survive re-inventory only when the path and SHA-256 still match. [Current owner decisions](OWNER_ACTIONS_ONE_LIST.md)

## Phase 01 observed image slots
- Room Reimagination: Today/Reimagined sample comparison and optional user-supplied style-reference image. Source ownership, permissions, replacement mapping, crop and alt text remain unverified. No reference imagery is authorized for reuse. Other 16 tool thumbnails and editor slots need individual inspection; Google library URL and rights remain owner inputs.
