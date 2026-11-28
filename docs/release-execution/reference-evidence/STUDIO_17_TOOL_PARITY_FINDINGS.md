# VastuNord — 17-tool designer parity findings

Observed 28 November 2026, Europe/Oslo. This document records a browser comparison of the designer prototype and the public Maya application. It is evidence for the next implementation task, not a claim of completed remediation.

## Verdict

**The current Maya Studio does not exactly match the designers' Studio.** All 17 tool editor surfaces were reached on both sites. The implementation retains many tool names and some option sets, but several custom controls, defaults, grouping choices, conditional interactions and preview aids differ. Shared editor/route tests cannot establish the required tool-specific parity.

The designers' claim that the tools have custom controls is supported by the inspected reference. Examples include per-surface material and pattern selection in Hardscape, local adjustment controls in Resolution Enhancement, season-dependent palettes, Garden tidy tasks, Pool/Spa configuration branches and Object Placement's per-object size/details.

## Sources and inspection limits

| Evidence | Source | Scope |
| --- | --- | --- |
| R | https://vastu-nord-design-prototype.vercel.app/app | All 17 editor surfaces; selected source-loaded and conditional states described below |
| P | https://vastunord-web.vercel.app/app | All 17 current public Maya editor surfaces; expanded settings, selected Garden and Pool branches |
| J | https://www.figma.com/board/V3sARNNp4q0bw68tpa42q7/Final-Ecosystem-Map--For-Dev-?node-id=5-13185 | All eight pages retrieved separately; see the adjacent FigJam evidence files |

The browser viewport was approximately **1363 × 936 CSS pixels, device pixel ratio 1**. This inspection did not test mobile/tablet widths, real touch devices, screen readers, full Norwegian translations, authenticated Production workflows or live provider accuracy. Reference screens were primarily English/dark; the public application was also viewed in both themes. This is not an exhaustive theme-by-language visual test.

Some reference editors were opened through Start a new file, creating empty prototype file entries. Prototype-provided demo assets were selected for Hardscape and Object Placement, and temporary example marks/objects were added. An existing staging example was opened. No real customer media was uploaded, no paid generation was requested, and no Vastu Nord application source, database configuration or deployment was changed. Prototype persistence was not established.

Screenshots were viewed for inspection, but no durable screenshot baseline is included in this evidence bundle. Therefore, no pixel-difference percentage or exact visual-parity claim is made. The next Codex task must capture comparable reference/candidate evidence where its tools permit.

**Important distinction:** a control absent from an inspected empty state may still exist after upload. Rows explicitly flag that uncertainty. Do not turn a conditional state not exercised into proof that implementation code is missing.

## Shared differences

| ID | Observed reference | Observed implementation / implication |
| --- | --- | --- |
| S-01 | Bespoke per-tool settings inside a common editor shell | Maya's model/workflow choices and generic prompt/settings composition lead the editor. Owner-approved Maya additions need an override record and must not displace custom workflows. |
| S-02 | Room prompt shows a 1,000-character limit; an expanded negative prompt showed 400 | Current room prompt shows 4,000. Reconcile UI/server contracts; preserve previously saved longer text rather than truncating it. |
| S-03 | Source picker advertises JPEG/PNG/WebP up to 20 MB | The application/provider have separately documented limits. Keep actual verified limits truthful; record the necessary deviation rather than copying unsupported upload copy. |
| S-04 | Descriptive cards, chips, switches, sliders, diagrams and context-dependent action copy | Several current controls are plain radios, checkboxes, disabled number inputs or combined placeholder actions. Labels alone do not reproduce interaction behavior. |
| S-05 | Reference States panel explicitly simulates screens without a backend | Its progress, credits, processing and successful results do not prove service functionality. Use simulated paths for UI testing, with separate live evidence. |
| S-06 | Optional independent workspaces appear in FigJam | A forced visible project-creation step would be a journey mismatch. Internal secure ownership can remain without requiring users to name a project. |

## Tool-by-tool summary

| ID | Tool | Distinct reference requirement | Main observed difference or pending comparison |
| --- | --- | --- | --- |
| T01 | Room Reimagination | Room/style/palette plus furnishing, plants, accessories, lighting, floor and time controls | Defaults, several option sets, prompt length, grouping and advanced-action presentation differ. |
| T02 | Virtual Home Staging | Descriptive buyer cards; listing/room context; comparison and single/batch delivery | Current buyer options use basic radios. Listing/batch behavior needs equivalent source-loaded comparison. |
| T03 | Outdoor Visualization | Exterior style cards, time, light density, surroundings and weather | Five settings appear under an unavailable section; custom presentation and defaults need alignment. |
| T04 | Hardscape Design | Mark each surface, then select its type, material and laying pattern | A disabled Mark action in the current empty state does not establish the complete per-surface interaction. |
| T05 | Furniture Refresh | Refresh, pick, place, asset choice, cleanup switch and child-safe direction | Different style/time options; cleanup is a disabled button rather than the reference switch. |
| T06 | Seasonal Styling | Season cards and season-dependent palette | Palette absent from the inspected expanded current settings. |
| T07 | Visual Cleanup | Method selection and eight multi-select clutter chips | Clutter is represented as separate On/Off radio groups; brush remains unavailable. |
| T08 | Resolution Enhancement | Auto/manual branches; bounded adjustments, look, crop, straighten and flip | Manual mode is unavailable; current visible workflow does not expose the reference manual controls. |
| T09 | Perspective Correction | Distortion sliders, camera-angle cards and screen-only guides | Current distortion inputs and guides are disabled; camera branch needs equivalent-state comparison. |
| T10 | Decor Re-definition | Descriptive style cards and distinct pick/place/asset actions | Values mostly retained, but card content and separate actions are simplified. |
| T11 | Material Refinement | Material palette and selected-surface workflow | Palette absent from inspected current settings; Pick remains disabled. |
| T12 | Lighting Reimagination | Temperature/brightness sliders, preview, layers and fixtures | Temperature is a disabled number input; preview is disabled; asset action is combined. |
| T13 | Garden Design | Tidy switch reveals task chips and changes the primary action | Current tidy state shows checkboxes but still says Design the garden. |
| T14 | Spa & Pool Redesign | Pool/Spa/Both branches and explanatory plan diagram | Many fields retained; diagram not observed, option order and feature context differ. |
| T15 | Sky Transformation | Sky illustration, local preview, time/weather/cloud/saturation | Core options retained; preview disabled and reference sky illustration not observed. |
| T16 | Seasonal Transformation | Season cards, Winter-only snow controls, preview and scene elements | Preview disabled; Winter dependency still needs equivalent-state comparison. |
| T17 | Object Placement | Source/object distinction, position, size/details, required-object validation | Empty-state actions exist but the full source-selected placement interaction remains unverified. |

## T01 — Room Reimagination

Reference route: `/app/tools/room-reimagination`. FigJam section: `5:4460`.

Observed reference controls:

- Room: Auto-detect (default), Living room, Bedroom, Kitchen, Bathroom, Dining, Office, Hallway.
- Style: Scandinavian (default), Japandi, Modern luxury, Minimalist, Industrial, Biophilic.
- Palette: Auto, Pale oak, Ink & cream, Ember, Sea glass, Clay, Deep forest.
- Floor: Keep existing (default), Pale oak, Walnut, Concrete, Stone, Terrazzo.
- Furnishing: Keep existing, Light, Balanced, Full.
- Plants: Auto, None, A few, Generous.
- Accessories: Auto, Minimal, Considered, Layered.
- Lighting: Auto, Natural only, Warm lamps, Bright, Moody.
- Time: As photographed, Morning, Midday, Golden hour, Blue hour, Night.
- Output shape: Original, 1:1, 4:3, 3:2, 16:9.
- Child-safe switch; Draw, Select and Show actions disabled before a source photo; a disclaimer makes child-safe direction distinct from a safety inspection.

The public editor adds Auto as the room-style default and separate owner-requested render-style choices. Its expanded settings include different furnishing, floor, plant, accessory, lighting and daylight values. Examples: furnishing Auto/Empty/Minimal/Balanced/Full; plants Auto/None/A few/Lush; floor Keep existing/Pale timber/Natural stone/Polished. Palette is under Output rather than the reference relationship. Current advanced settings also include camera framing, people and annotations; the reference's Draw/Select/Show interaction was not observed in the current state.

**Acceptance:** create a field-by-field mapping, correct unapproved defaults/options/order, and retain approved additions as extensions. Restore each meaningful action or mark its genuine capability gap. Test saved values across reload and tool switching.

## T02 — Virtual Home Staging

Reference route: `/app/tools/virtual-home-staging`. FigJam: `5:4020`.

An existing designer demo result was inspected, so its selected Family buyer profile is an observed saved value, **not proof of a new-file default**. Buyer cards are Family, Young professional, Downsizer, Luxury and Neutral, with explanatory copy. The editor includes a listing/room context, a room count and a child-safe switch. The saved result has re-stage, favourite, compare, modify, download and share actions.

The comparison interaction was opened: left/right version targets, swap, thumbnails and a draggable comparison slider were present. FigJam explicitly branches single versus batch export.

The current empty editor preserves buyer labels as basic radios. Its listing/room/batch behavior was not established because an equivalent authenticated source-loaded state was unavailable.

**Acceptance:** match descriptive selection cards and the selected-room context; verify multi-room navigation, comparison/version selection and supported export scope with owned fixtures and separately with the live journey. Do not claim missing batch code solely from the empty screenshot.

## T03 — Outdoor Visualization

Reference route: `/app/tools/outdoor-visualization`. Journey mapping is ambiguous with section `5:3832`.

Reference controls: time choices from As photographed through Night; six outdoor-style cards (Naturalistic default, Formal, Mediterranean, Nordic, Desert, Tropical); outdoor lighting density at 30%; People Keep existing/None/A few/Many; Site context Auto/Urban/Suburban/Nature; Greenery Keep existing/Sparse/Balanced/Lush; Vehicles Keep existing/None/A few/Many; Weather As photographed/Clear/Overcast/Hazy/Rain/Snow. Show suggestions and Select an area are disabled before source upload.

The public editor exposes style, weather and light density, while five other settings are grouped as unavailable. The initial selected state was not consistently exposed for every radio group, requiring a targeted default-state check rather than a guessed default.

**Acceptance:** preserve every designer field's visibility, grouping and truthful availability; verify native/provider guidance separately. Do not flatten Outdoor and Hardscape into the same composition.

## T04 — Hardscape Design

Reference route: `/app/tools/hardscape-design`. FigJam section `5:3832` has inconsistent Outdoor-labelled internal actions.

The reference initially shares several exterior controls with Outdoor, then adds **Surfaces**. With its own Back garden demo source selected, Mark opens a surface editor. An example terrace mark exposes:

- Type: Terrace (default), Path, Driveway, Decking, Steps, Retaining wall, Edging.
- Terrace material: Natural stone (default), Porcelain, Concrete slab, Clay brick.
- Laying pattern: Running bond (default), Herringbone, Random, Stack bond.
- Numbered image marker, Forget surface, Clear and Done.

Only the Terrace material choices were exercised; other surface-specific material sets require inspection. The current no-source editor includes Mark, but disabled. That does not prove the source-selected per-surface workflow exists or is absent.

**Acceptance:** reproduce and test per-surface state, material/pattern dependencies, selection, deletion and reset. Keep precise rendering support separate from an interactive marking UI. Resolve the source naming conflict by preserving both tools and documenting the ambiguous journey mapping.

## T05 — Furniture Refresh

Reference route: `/app/tools/furniture-refresh`. FigJam: `5:4363`.

Reference includes room type, Scandinavian-default furniture style, the six time choices, One-click refresh, Pick pieces, Place, a separate furniture-asset entry, Clean up the room switch and child-safe switch.

Current style starts with Auto and daylight choices differ. The furniture actions remain disabled in the empty state, with a combined place/asset action. Clean up the room appears as a disabled button rather than the reference switch.

**Acceptance:** restore distinct setting versus action semantics. Test refresh/pick/add paths with source fixtures; keep unavailable provider operations explicit instead of silently converting them to generic prompt text.

## T06 — Seasonal Styling

Reference route: `/app/tools/seasonal-styling`. FigJam: `5:4108`.

Reference includes room type, Scandinavian-default room style, season cards with short descriptions, and a palette whose first option is **Spring's own** in the initial Spring state, followed by Pale oak, Ink & cream, Ember, Sea glass, Clay and Deep forest. The action reads Style for spring.

The expanded current settings retain room, style and season choices but no palette was observed. They use basic season radios. A reference sample caption says Summer while Spring is selected; distinguish a static example caption from the selected configuration rather than copying contradictory output text.

**Acceptance:** inspect palette changes for all seasons, restore palette/default behavior, descriptive cards and dynamic action wording, and verify restoration from saved settings.

## T07 — Visual Cleanup

Reference route: `/app/tools/visual-cleanup`. FigJam: `5:3238`.

Reference has AI object editing versus Brush & delete methods. Eight multi-select clutter chips: Bins, Cables, Cars, People, Signs, Loose clutter, Power lines and Reflections. Pick things is disabled until a source is present. Its instructional stage differs from a generic before/after sample. No reference-image input or Improve action was shown in this reference editor.

Current clutter items are individual On/Off radio groups, increasing form density and changing interaction. Brush is unavailable. An Improve with Prana control is present as an additional disabled action.

**Acceptance:** restore multi-selection chips and method-specific UI. Determine brush implementation/capability independently; do not present a text prompt as a mask edit. Keep owner extensions explicitly recorded.

## T08 — Resolution Enhancement

Reference route: `/app/tools/resolution-enhancement`. FigJam: `5:3316`.

Reference modes are Auto enhance (sample credit-labelled) and Manual controls (described as free/on-device). Auto offers Original size, 2× and 4×. Selecting Manual reveals:

- Noise reduction and sharpness: 0–100, step 5, initially 0.
- Brightness, contrast and saturation: −100–100, step 5, initially 0.
- Reset adjustments.
- Look: None, Natural, Warm, Cool, Matte, Mono.
- Crop: Original, 1:1, 4:3, 3:2, 16:9.
- Straighten: −15° to 15°, step 0.5°, initially 0.
- Horizontal and vertical flip.
- Primary action and workflow step change from Enhance to Apply adjustments / Apply.

Current Maya 7.2 offers Automatic enhancement/Upscale image workflow selection and an unavailable Manual mode. The inspected Automatic state did not expose the reference local controls. The separate current Upscale workflow was not selected during this comparison.

**Acceptance:** implement meaningful local transformations and reversible preview/reset where feasible, preserving originals and export behavior. Keep auto-enhance/upscale provider limits and costs separate. Reference credits are not approved pricing policy.

## T09 — Perspective Correction

Reference route: `/app/tools/perspective-correction`. FigJam: `5:3160`.

Reference modes: Fix distortion and Camera angle. Distortion has vertical/horizontal sliders and Suggest. Screen-only guides are an enabled switch and must never be baked into the exported image. Camera angle reveals descriptive cards: Eye level (1.6 m), Low, High and Straight on.

Current vertical/horizontal controls are disabled number inputs, and guides are disabled. The current Camera angle branch was not exercised; do not infer its complete absence.

**Acceptance:** verify both branches, bounded controls, guide overlays, keyboard support and export exclusion. Separate a deterministic local perspective transform from a provider-generated camera interpretation.

## T10 — Decor Re-definition

Reference route: `/app/tools/decor-redefinition`. FigJam: `5:4274`.

Reference descriptive style cards: Warm minimal (default), Gallery, Layered textile, Mid-century, Coastal, Monochrome. Aspect ratios: Original, 1:1, 4:3, 3:2, 16:9. Separate Pick a spot, Place and choose-from-decor-assets actions; child-safe switch.

Current values are largely retained but represented as generic radios. Pick and combined Place/assets are disabled in the empty state; descriptive card content and action separation are simplified.

**Acceptance:** restore card content and distinct action paths; test spot selection versus adding an asset and resulting state persistence.

## T11 — Material Refinement

Reference route: `/app/tools/material-refinement`. FigJam: `5:4190`.

Reference has Auto plus the six named palette choices, Pick surfaces, a material-specific prompt and child-safe switch. Current expanded settings show Pick and child-safe direction but no palette was observed.

**Acceptance:** restore the palette and map selections to effective settings. Inspect source-loaded surface editing rather than treating a disabled Pick button as completion. The FigJam Favourite connector has no arrow direction; do not invent one.

## T12 — Lighting Reimagination

Reference route: `/app/tools/lighting-reimagination`. FigJam: `5:3935`.

Reference: room type; temperature slider initially 2700 K; brightness at 60%; layers Ambient only/Ambient + task/Fully layered; fixture choices Keep existing/Pendant/Recessed/Track/Sconce/Floor lamp/Statement; separate Place and lighting-asset choice. Preview on my photo is enabled, with copy explaining a quick tint preview rather than a generated render.

Current temperature is a disabled number input; brightness/layer/fixture choices remain. Preview is a disabled checkbox, and Place/assets are combined. The full reference temperature range was not captured; inspect it rather than guessing bounds.

**Acceptance:** use the actual bounded slider and preview semantics. A local tint must be clearly labelled and must not overwrite the original or be mistaken for a completed AI render.

## T13 — Garden Design

Reference route: `/app/tools/garden-design`. FigJam: `5:3744`.

Reference outdoor-style cards and area choices: Whole garden, Borders, Lawn, Terrace, Front. Enabling Tidy reveals task chips: Mow & edge, Weed and Fresh mulch selected initially; Prune & shape, Clean paving and Fill gaps unselected. The main action changes to **Tidy the garden**.

Current tidy mode reveals six checkboxes, disables style/area, but keeps the main action **Design the garden**. Label shortening also appears for Mow and Prune. This action mismatch was observed after toggling the mode, not inferred from an empty screen.

**Acceptance:** match task selection and mode-specific copy, inspect the reference's dependencies, and restore prior design-mode values when leaving Tidy.

## T14 — Spa & Pool Redesign

Reference route: `/app/tools/pool-redesign`. FigJam: `5:3655`.

Reference mode cards: Pool, Spa, Pool + Spa. Pool type: Infinity/Lap/Plunge/Natural/Courtyard; style Contemporary/Natural/Resort/Classic; construction In-ground/Raised/Partially raised; shape Rectangular/L-shape/Freeform/Circular; lining Tile/Plaster/Pebble/Stone. A not-to-scale plan figure changes with selections.

Pool + Spa was selected. Spa choices: Hot tub, In-ground spa, Spillover, Plunge cold plunge. Placement: Attached spillover, Next to pool, Separate. Shape: Round/Square/Rectangular/Freeform. Material: Tile/Stone/Concrete plaster/Acrylic/Wood. Feature chips: Built-in seating/Jets/Waterfall/Underwater light/Deck. The action changes to Design pool and spa.

Current combined mode correctly reveals many corresponding controls and changes its action. However, no equivalent plan preview was observed; generic radio presentation replaces cards; Spa option order differs; feature choices are already shown in Pool-only mode rather than the inspected reference context.

**Acceptance:** retain the working branch, align option order/context and explanatory plan behavior, and test transitions between all three modes without hidden settings leaking into requests.

## T15 — Sky Transformation

Reference route: `/app/tools/sky-transformation`. FigJam: `5:3573`.

Reference has a sky illustration, enabled preview switch, time Morning (default)/Midday/Golden hour/Blue hour/Night, weather Clear (default)/Overcast/Hazy/Rain/Snow, cloud intensity 45% and saturation 50%. The illustration reflects these values. The sample comparison caption says Golden hour despite the Morning setting, an example/configuration ambiguity to record.

Current core values are present, but preview is disabled and no equivalent sky illustration was observed.

**Acceptance:** distinguish an inexpensive local sky/appearance preview from a completed render, and ensure selected settings and example captions do not misrepresent output.

## T16 — Seasonal Transformation

Reference route: `/app/tools/seasonal-transformation`. FigJam: `5:3487`.

Reference includes time choices, descriptive season cards, preview switch, people/vehicle scene choices and a dynamic action. Selecting Winter reveals Snow cover: None/Frost/Light/Heavy, and the action changes to Show it in winter. People: Keep existing/None/A few/Busy. Vehicles: Keep existing/None/Parked/Passing.

Current core choices are present as basic radios and preview is disabled. The current Winter branch was not exercised; inspect before claiming missing snow controls. The reference's initial sample caption says Autumn while Spring is selected.

**Acceptance:** verify the Winter dependency, save/reopen behavior and selected-season action, while distinguishing static sample labels from the current configuration.

## T17 — Object Placement

Reference route: `/app/tools/object-placement`. FigJam: `5:3414`.

Reference uses a required-object flow rather than an optional style-reference input. Before a source, Place and asset choice are disabled. Selecting the prototype Back garden image enables Upload object photo, Place and asset choice, but generation still requires an object.

Place offers tap-on-image or Add in centre. The resulting numbered object editor includes Size Small/Life-size (default)/Large; a details field; Use asset; Forget object; Clear and Done. The primary action becomes enabled after an object is added. These are prototype interactions, not evidence of exact spatial MNML output.

Current required-object actions are disabled in the inspected empty state, with an unavailable-capability item. Full placement and object configuration remain unverified.

**Acceptance:** test distinct source and object inputs, required-object validation, selection, positioning, sizes, details, reset/removal and state persistence. Explain provider precision limits; never silently discard positioning while claiming exact placement.

## Next execution and evidence policy

1. Read `../08_DESIGNER_PARITY.md` and the FigJam findings.
2. Reconcile current source against these observations; current implementation may have advanced after this inspection.
3. Fill only missing reference states, then implement and verify all actionable mismatches.
4. Label evidence as source observation, local fixture, live integration, approved override, source conflict or unavailable capability.
5. Track designer UI, journey parity and Production activation separately. No aggregate score or 17-route smoke test replaces control-by-control acceptance.

This report should reduce rediscovery, not freeze an old candidate or silently authorize a different product concept.
