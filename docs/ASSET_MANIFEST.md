# Studio asset replacement manifest (fill during asset phase)

## Recovered demo asset mapping

The HTML demo README identifies two logo treatments and three brand photographs extracted from the owner-supplied brand guide, plus four illustrative tonal studies. The noncommercial demo uses selected static files in `apps/web/public/reference/`. The source bundle's scripts, demo account state and reference documents are separate from these public assets.

| File under public/reference | Recovered source and intended display | Evidence / limitation |
|---|---|---|
| logo-teal.png, logo-ivory.png | Supplied wordmark treatments for contrasting backgrounds | Brand-guide provenance per recovered README. Use the supplied proportions. |
| soft.webp | Studio and dashboard reference interior, Fjord study | Supplied brand photograph. Precise Figma crop and scene-specific editor sample remain unresolved. |
| warm.webp | Warm palette study and atelier album | Supplied brand photograph used as a concept reference. |
| cover.webp | Cabin project study and gallery cover | Supplied brand photograph. Study names describe fictional project contexts. |
| soft-day.webp, soft-evening.webp, soft-bright.webp, soft-moss.webp | Lighting and tonal examples for example canvases, galleries and guided experiences | Supplied variations of the brand image. No model inference or customer media. |

These nine demo assets have separate provenance from the local 727-item Visuals inventory. Final marketing hero images, approved responsive crops, exact scene-to-tool mappings and a licensed webfont remain outstanding. The [implementation tracker](FIGMA_HTML_IMPLEMENTATION_TRACKER.md) records the affected routes.

## Phase 02C local Visuals inventory

`docs/VISUALS_ASSET_MANIFEST.csv` records metadata for all 727 files under `assets/Visuals/`: 720 PNG by file signature, four ZIP archives and three MP4 videos, totaling 4,450,413,149 bytes (about 4.45 GB). One `.jpg` name contains PNG bytes and needs owner review. Dimensions were read from image headers where possible; video and ZIP dimensions are blank. Categories and suggested captions are filename-based suggestions only, not content or rights verification. Every row is `NOT REVIEWED`, with unknown rights/provenance and `NO` public eligibility. No contents were changed, uploaded or published; ZIP contents were not opened.

Keep this directory outside Git (now ignored) because it is large and may contain private or unlicensed material. After rights and per-asset approval, copy authorized originals to a dedicated private Vastu Nord store and separately publish reviewed derivatives under the consent/editorial policy. Do not assume the local test renders are public-gallery assets. The owner's separate Google library and its rights mapping remain pending.

**Source:** open-access Google image library URL/ID pending user. Determine whether Drive folder, Google Photos shared album or different library. Verify ownership and commercial reuse rights before import.

| Tool ID / location | Current image path | Proposed Google asset link/ID | Permission/license | Usage/crop/alt text | Status |
|---|---|---|---|---|---|
| Tool inventory pending | Unknown | USER LINK REQUIRED | Not yet verified | TBD | Blocked until inventory/source |

Use actual tool IDs from `STUDIO_INVENTORY.md`. Don't reuse an unrelated image merely to fill a slot; request missing subject-specific imagery.

## Phase 01 observed image slots
- Room Reimagination: Today/Reimagined sample comparison and optional user-supplied style-reference image. Source ownership, permissions, replacement mapping, crop and alt text remain unverified. No reference imagery is authorized for reuse. Other 16 tool thumbnails and editor slots need individual inspection; Google library URL and rights remain owner inputs.
