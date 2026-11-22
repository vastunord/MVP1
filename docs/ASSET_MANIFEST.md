# Vastu Nord site imagery

## Current demo placements

The owner supplied 11 paired scenes in `assets/BeforeAfter/` and approved use of the local Visuals collection on the noncommercial Vastu Nord site. The [placement register](VISUALS_PLACEMENTS.csv) binds each displayed scene to a specific original, SHA-256, public derivative, maximum width and WebP quality. The [full source inventory](VISUALS_ASSET_MANIFEST.csv) carries the limited site use for the 155 selected Visuals files. New uses, including social publishing, have their own approval process.

| Placement | Unique originals | Selection and display |
|---|---:|---|
| Homepage comparisons | 22 | The owner’s 11 before/after pairs. Visual review identified B as the before and A as the after, including the irregularly named `03-B` source. The first pair shows a Scandinavian living room. Other pairs include a bedroom, bathrooms, garage and villa exterior. Several before frames already contain furniture. |
| Render gallery | 50 | A stable shuffled selection of still renders, reviewed for subject, labels and duplicates. The grid requests 520 px thumbnails. Opening a photo shows the larger version of the same selected scene. Both sizes are static. Captions and subject filters are bilingual. |
| Studio tools | 34 | Each of the 17 tools has an individual 720 px card and a separate editor reference, chosen by subject. Studio compares visual treatments of its selected reference within the same canvas. |
| Other site photography | 71 | Separate images for marketing sections, articles, Studio project and album covers, the room tour, files and guides. Related assets use distinct compositions. A selected photo follows the visitor through its own preview or into Studio. |

The homepage and Studio images are illustrative studies. Original camera files, metadata, video files and the full source folders are excluded from release archives. To validate all derivatives, run `python scripts/verify_display_media.py` with Pillow available. On an authorized checkout containing the originals, add `--sources` to check every original hash. When replacing a photograph, review its subject, source permission and possible duplicates, then update its row, derivative and localized caption together.

## Earlier demo assets and compatibility

The recovered HTML demo identified two logo treatments, three brand photographs from the owner-supplied guide, and four tonal studies. Its initial use of the photographs is recorded below. The current register supersedes those placements. The three original named Studio sample links still resolve to their original source photographs.

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

The initial inspection shortlisted a fjord-facing villa and two alternate architectural scenes for the homepage. The owner subsequently supplied the separate BeforeAfter collection for that placement. The original shortlisted fjord villa now has one gallery placement. Source inventory decisions survive re-inventory only when the path and SHA-256 still match. [Current owner decisions](OWNER_ACTIONS_ONE_LIST.md)

The original Studio prototype supplied tool names, controls and comparison behavior. Each tool’s published reference photograph now comes from a recorded Vastu Nord source. Private uploads and customer-generated results have separate storage and publishing permissions.
