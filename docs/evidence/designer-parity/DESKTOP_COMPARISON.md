# Studio desktop comparisons

The designer captures use the public Studio prototype at 1363 × 936 CSS pixels in English. Each route has a PNG under `reference/`. The comparison script pairs that file with the same tool identifier under `candidate/`, checks both source dimensions and builds contact sheets in library order. Run `node --experimental-strip-types apps/web/tests/designer-screenshot-sheets.mjs` from the repository root. Each sheet has a designer image, a candidate image and an absolute per-channel RGB difference. The dark areas of a difference image correspond to similar pixels. Reflowed text and different photographs can produce large differences even when controls behave identically.

## Desktop visual review

The 17 English, dark-theme candidate PNGs are from the locally served candidate at `672577a`. The candidate shows a signed-out demonstration with private uploads gated. The prototype displays an interactive example. T13’s reference shows the tidy controls; T17’s reference is already in placement mode. Those two comparisons do not establish default-to-default parity.

All 17 retain the broad inspector-left/canvas-right structure. The prototype uses almost the full viewport for a dark editor, compact project toolbar, short instructions, a visible primary operation and a bottom step indicator. The candidate’s global navigation, demonstration ribbon and Studio navigation occupy roughly the top 175 px. Its additional workflow switcher and gate message move the photograph farther down. The first capture at `2f96da2` exposed a light canvas in dark mode. The recapture shows a dark blue canvas with white headings and the orange category label. Controls below the initial viewport require scrolling. The approved global navigation and distinct Vastu Nord imagery are retained; the resulting layout, image treatment and action positions visibly differ.

| Tool | What the designer and candidate screenshots show |
|---|---|
| T01 Room Reimagination | Both show an interior source intake and a 1000-character brief. The designer opens on a furnished living-room comparison with a central handle. The candidate opens on a single timber-lined room and adds Design / Image & brief navigation. |
| T02 Virtual Home Staging | The prototype demonstrates the transition from an empty room to a staged listing. The candidate starts on a furnished living room. The initial image does not explain the empty-to-staged result. |
| T03 Outdoor Visualization | The prototype shows two conditions of a front elevation. The candidate uses a wide lakeside house, with more landscape in view. Its one-line subtitle introduces planting, weather and light. |
| T04 Hardscape Design | The prototype’s example demonstrates a gravel-to-paved path. The candidate shows timber decking. Its independent surface markers require a chosen source and are outside the initial frame. |
| T05 Furniture Refresh | The prototype’s side-by-side bedroom highlights differences in furniture. The candidate uses a furnished sitting room with a fireplace. Neither screenshot shows piece-level editing in progress. |
| T06 Seasonal Styling | The reference uses an interior comparison labeled Summer despite its Spring action. The candidate starts on a bedroom looking over snow, labels the category Virtual Staging and shows a Spring action. Neither image alone establishes the selected season’s rendered result. |
| T07 Visual Cleanup | The prototype illustrates exactly where to paint with colored marks over exterior equipment. The candidate shows toys and blocks on a floor. Its brief has no Improve button, but the example gives no visual mask instruction. |
| T08 Resolution Enhancement | The prototype fits a portrait bathroom comparison and method selector into the viewport. The candidate starts with an architectural interior, a wider crop and the Maya workflow controls. Manual pixel adjustments require selecting the manual mode. |
| T09 Perspective Correction | Both display guides. The designer places the grid over a front elevation, with correction methods visible on the left. The candidate overlays its timber corridor and presents the method controls farther down. |
| T10 Decor Re-definition | The designer’s room comparison shows a change of decor across the divider. The candidate displays a single furnished room with wall art. Its brief reads “Describe the decor you want”. |
| T11 Material Refinement | The designer juxtaposes kitchen cabinetry and countertop finishes. The candidate shows wood, glass and stone in a bathroom. The photographed materials are visible; their before/after change is absent from this view. |
| T12 Lighting Reimagination | The prototype demonstrates daylight and evening in the same room. The candidate uses a single warm timber interior overlooking a blue-lit snowy scene. Its initial photo illustrates contrasting light without a split control. |
| T13 Garden Design | The reference capture shows the tidy task chips and the active tidy action next to a split garden. The candidate opens on a planted cottage garden in design mode. Use the separate tidy interaction tests for the state change. |
| T14 Spa & Pool Redesign | The prototype shows an outdoor property comparison labeled Natural pool. The candidate uses an indoor circular pool and a single canvas. The plan diagram and combined-mode options require separate interaction checks. |
| T15 Sky Transformation | The designer shows a house and simulated sky preview with a divider. The candidate opens on the sun seen through a glazed interior. The candidate’s photograph contains less exposed sky for judging weather changes. |
| T16 Seasonal Transformation | The prototype shows a split lawn and house labeled Autumn while offering the Spring action. The candidate starts with a snowy setting and a red house, and also offers the Spring action. Both examples require distinguishing the image from selected settings. |
| T17 Object Placement | The prototype capture shows a selected outdoor photo and placement instructions. The candidate’s signed-out start shows a room with desk, chairs and plants and a disabled upload intake. Use the separate selected-state evidence for numbered pins. |

Inspect the paired views at [T01–T04](comparison/tools-1-4.webp), [T05–T08](comparison/tools-5-8.webp), [T09–T12](comparison/tools-9-12.webp), [T13–T16](comparison/tools-13-16.webp) and [T17](comparison/tools-17-17.webp). These are screenshot-level comparisons. They do not establish precision mask editing, an authenticated save/reopen journey or a successful provider submission.

## Source-dependent controls

| Designer example | Directly inspected behavior | Candidate boundary |
|---|---|---|
| [Virtual Home Staging with a source](reference/virtual-home-staging-with-source.png) | The fresh Family card is selected. The listing changes to one room in use, zero staged. The panel offers more source angles, a style reference and a disclosure about virtual staging. | The private project and selected source identify the working room. A complete listing-level room count and batch export remain open. |
| [Marked Hardscape terrace](reference/hardscape-marked-terrace.png) | A click on the designer's Back garden photo opened a numbered mark. Switching between all seven surface types changed materials and laying patterns. | Session-local planning marks support selection, separate finishes, removal, clear and done. Precise provider placement and saved mark restoration remain open. |
| [Furniture Refresh with a source](reference/furniture-refresh-with-source.png) | One-click refresh, pick, place and furniture-asset selection appear separately. Cleanup and child-safe direction are switches. | Cleanup and child-safe settings are selectable. Piece-level swap, removal and placement require a supported selection and rendering path. |
| [Seasonal Styling in Winter](reference/seasonal-styling-winter.png) | Clicking each of Spring, Summer, Autumn and Winter changed both the first palette choice and the action. For example, Winter showed “Winter’s own” and “Style for winter”. The six named palettes stayed available. | The selected season controls both labels; the stored seasonal palette identifier survives a season change. |
| [Visual Cleanup with a source](reference/visual-cleanup-with-source.png) | The example requires a removal selection after adding the photo. The editor offers prompted object edits or painted deletion. | Clutter chips are multi-select. Selected categories enter the provider brief. Exact masking and object picking remain unavailable. |

## Hardscape material dependencies

| Surface | Material choices | Pattern choices |
|---|---|---|
| Terrace | Natural stone, Porcelain, Concrete slab, Clay brick | Running bond, Herringbone, Random, Stack bond |
| Path | Natural stone, Gravel, Clay brick, Stepping stones | Running bond, Herringbone, Random |
| Driveway | Block paving, Resin-bound gravel, Concrete, Gravel | Herringbone, Running bond, Plain |
| Decking | Timber, Composite | Straight, Diagonal, Picture frame |
| Steps | Natural stone, Timber, Concrete, Clay brick | Solid treads, Floating |
| Retaining wall | Natural stone, Gabion, Rendered block, Timber sleepers | Coursed, Dry-stacked, Smooth |
| Edging | Steel, Stone setts, Timber, Clay brick | Flush, Raised |
