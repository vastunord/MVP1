# Existing Studio tool and interaction inventory

**Important:** Do not fabricate tools from the public URL. Inspect actual designer source and the rendered `/app` to fill this list.

| Existing tool/route | UI state | Input types | Model capability | Output | Credit quote | Current working evidence | Preservation/change recommendation |
|---|---|---|---|---|---|---|---|
| TO BE AUDITED | Unknown | Unknown | Unverified | Unknown | Unknown | No tested source | Preserve until reviewed |

Candidate coverage from old brief to reconcile with actual Studio: interior, exterior, virtual staging, renovation, landscape, prompt helper, sketch to image, style transfer, image enhancement/upscaling, image animation, floor-plan/masterplan AI, references and comparisons.

## Phase 01 observation — 2026-11-21
Status means visual reference only, not verified backend behavior. Source: `/app/library`, `/app/tools/room-reimagination`, and a new Room Reimagination editor opened through the public UI.

| Item | Status | Observed reference |
|---|---|---|
| Sidebar | OBSERVED | Home, Tools, Files, Projects, Shared; New, Search, Notifications, Account |
| Library filters | OBSERVED | All, Interior Design, Exterior & Landscape, Virtual Staging, Image Enhancement; Search tools |
| Library cards | OBSERVED | Room Reimagination; Virtual Home Staging; Outdoor Visualization; Hardscape Design; Furniture Refresh; Seasonal Styling; Visual Cleanup; Resolution Enhancement; Perspective Correction; Decor Re-definition; Material Refinement; Lighting Reimagination; Garden Design; Spa & Pool Redesign; Sky Transformation; Seasonal Transformation; Object Placement |
| Room Reimagination entry | OBSERVED | Start a new file; Back to the tool library; two example file links |
| Room photo | OBSERVED | Upload JPEG, PNG, WEBP up to 20 MB; browse assets; optional style reference image |
| Prompt | OBSERVED | Describe the room, Improve, 1000-character counter, Anything to avoid expandable control |
| Room type | OBSERVED | Auto-detect, Living room, Bedroom, Kitchen, Bathroom, Dining, Office, Hallway |
| Room style | OBSERVED | Scandinavian, Japandi, Modern luxury, Minimalist, Industrial, Biophilic |
| Palette | OBSERVED | Auto, Pale oak, Ink & cream, Ember, Sea glass, Clay, Deep forest |
| Interior settings | OBSERVED | Floor finish, Furnishing, Indoor plants, Accessories, Lighting; each has selectable options |
| Time and output shape | OBSERVED | As photographed, Morning, Midday, Golden hour, Blue hour, Night; Original, 1:1, 4:3, 3:2, 16:9 |
| Optional edits | OBSERVED | Make it child safe switch; Draw, Select, Show disabled before photo |
| Stage and action | OBSERVED | Sample Today/Reimagined slider; Generate room disabled until photo; Add your photo / Describe the room / Generate steps |
| Header | OBSERVED | Rename, disabled Undo/Redo, Version history, 40 credits shown; actual persistence and balance unverified |
| Other tools and submenus | NOT VISIBLE | Card names observed; individual controls not inspected |
| Masks, output resolution, video, result/job states, history details, wallet, dashboard, settings | NOT VISIBLE | No evidence yet; do not infer absence |
| Mobile interactions | NOT VISIBLE | Mobile viewport not yet inspected |

The entry page asserts preserved geometry and daylight; this is unverified marketing copy, not a technical guarantee. Generated/editor file state was not tested with an upload or generation.
## Phase 01A — next four tools (2026-11-21)
The following were selected in the existing 17-card library order after the already documented Room Reimagination. These observations are visual only; no photo was uploaded, no generator action was attempted, and no backend behavior was verified.

### Shared editor shell (documented once)
All four editors show the same shell: Back, Rename, saved timestamp, Undo/Redo disabled at the empty starting state, Version history, “40 credits” display, a central Today/result comparison slider with a sample image, three workflow steps, and a left settings panel. Upload controls say JPEG/PNG/WEBP up to 20 MB with a “browse your assets” option. Optional style reference accepts a photo or asset. Prompt fields have Improve, a 1000-character counter, and an expandable “Anything to avoid?” control unless noted below. Primary action remains disabled until a source photo is added. These displayed credits and samples do not verify a real wallet or generation service.

### 2. Virtual Home Staging — OBSERVED
Category: Virtual Staging. Entry page offers Start a new file, Back to library, and one example file to continue. Editor asks for photos of listing rooms, offers buyer-profile presets Family, Young professional, Downsizer, Luxury, and Neutral, plus optional “Make it child safe”. Prompt label “Anything specific?” with “Describe the staging”. Optional style-reference photo. Stage action: “Stage this room” (disabled before upload). Comparison labels Today/Staged. The entry text describes processing room-by-room and exporting a whole listing, but no batch flow or export control was observed in the editor.

### 3. Outdoor Visualization — OBSERVED
Category: Exterior & Landscape. Entry offers two example files. Upload hint: wide photo in daylight; optional style-reference label “Add a place you like”. Prompt “Describe the outside” / “Describe the outdoor space you want”. Controls: Time of day (As photographed, Morning, Midday, Golden hour, Blue hour, Night); Outdoor style (Naturalistic, Formal, Mediterranean, Nordic, Desert, Tropical); Outdoor lighting density slider at 30%; Content & surroundings (People, Site context, Greenery, Vehicles); Weather (As photographed, Clear, Overcast, Hazy, Rain, Snow). Optional AI assistance: VastuNord suggestions / Show disabled; Analyze an area / Select disabled. Primary action “Visualize outside” disabled before upload. Comparison Today/Reimagined. Entry copy says building stays where it is; this is not a verified guarantee.

### 4. Hardscape Design — OBSERVED
Category: Exterior & Landscape. Upload and optional style-reference controls match Outdoor Visualization. Prompt “Anything else?” / “Anything the surfaces do not say”. Reuses Outdoor Visualization controls for time, outdoor style, lighting density, people, site context, greenery, vehicles, and weather. Adds Surfaces: explanatory “Mark surfaces” panel and Mark button disabled before photo. Primary action “Design the hardscape” disabled before upload. Comparison Today/Hardscaped. Entry copy describes paving, decking and walls; no surface selection behavior was tested. Claims that house/boundaries stay fixed are displayed copy only.

### 5. Furniture Refresh — OBSERVED
Category: Interior Design. Prompt “What should change?” / “Describe the furniture change”. Room type presets match Room Reimagination: Auto-detect, Living room, Bedroom, Kitchen, Bathroom, Dining, Office, Hallway. Furniture style presets match Room Reimagination: Scandinavian, Japandi, Modern luxury, Minimalist, Industrial, Biophilic. Time of day presets also match. Furniture Edits adds One-click refresh / Refresh now (disabled before upload), Change pieces on the photo / Pick (disabled), Add a piece with an asset chooser (disabled), Clean up the room switch, and Make it child safe switch. Primary action “Refresh furniture” disabled before upload. Comparison Today/Refreshed. The sample claims preserved walls/floors/windows are not verified behavior.

### Disabled, unverified and not inspected
All generation/edit buttons were disabled in the no-upload state; this establishes only the visible disabled state. Uploads, asset browsing, masks/selection, resulting output, job progress, errors, export, resolution settings, history contents, wallet actions, and mobile layouts were not exercised or visible. Durable screenshot files were not saved; evidence is the browser accessibility snapshots and observed editor UI. Do not infer these functions are absent.

Remaining tools in library order after this batch: Seasonal Styling; Visual Cleanup; Resolution Enhancement; Perspective Correction; Decor Re-definition; Material Refinement; Lighting Reimagination; Garden Design; Spa & Pool Redesign; Sky Transformation; Seasonal Transformation; Object Placement.
## Phase 01B — four additional Studio editors (2026-11-21)
These observations continue the existing 17-card inventory in library order. All controls below are frontend observations only. No photo was uploaded and no generation or paid action was triggered. The previously documented Phase 01A shared editor shell was present with no observed difference; tool-specific deltas follow. The displayed credit count and sample previews do not verify wallet or backend behavior.

### 6. Seasonal Styling — COMPLETE / OBSERVED
- Entry: `/app/tools/seasonal-styling`; new-file flow `/app/new?tool=seasonal-styling`; editor observed at `/app/editor/file-mwqb1h2b-1` (generated file route).
- Category: Virtual Staging. Entry shows Start a new file, Back to library, and empty prior-files state.
- Inputs: JPEG/PNG/WEBP photo up to 20 MB; any space inside or out; browse assets. Optional style-reference photo/asset. Prompt `Describe the seasonal styling`, 1,000-character limit, Improve, and expandable “Anything to avoid?”.
- Shared room-type options: Auto-detect, Living room, Bedroom, Kitchen, Bathroom, Dining, Office, Hallway. Shared styles: Scandinavian, Japandi, Modern luxury, Minimalist, Industrial, Biophilic. Palette: Spring’s own (default), Pale oak, Ink & cream, Ember, Sea glass, Clay, Deep forest.
- Unique season selector: Spring (fresh flowers, light linens, pastel accents), Summer (airy textiles, greenery, sun-bleached tones), Autumn (wool throws, warm lamps, amber and rust), Winter (layered knits, candlelight, evergreen). Sample comparison Today/Summer, slider initially 46. Steps: Add photo / Choose season / Generate. Primary `Style for spring` is disabled before upload.
- No result, output-resolution, or job state was observed; no inference about their absence.

### 7. Visual Cleanup — COMPLETE / OBSERVED
- Entry: `/app/tools/visual-cleanup`; new-file flow `/app/new?tool=visual-cleanup`; editor observed at `/app/editor/file-mwqb1pgy-1` (generated file route).
- Category: Image Enhancement. Photo input JPEG/PNG/WEBP up to 20 MB; any indoor/outdoor space; browse assets. Prompt `Describe what to clean up`, 1,000-character limit, expandable “Anything to avoid?”. No Improve control was visible. No style-reference input was visible.
- Unique controls: Method radios `AI object editing` (tap things to remove or change material) and `Brush & delete` (painted region). Common clutter checkboxes: Bins, Cables, Cars, People, Signs, Loose clutter, Power lines, Reflections. “On the photo” panel offers `Pick things on the photo`; `Pick` is disabled before photo input, so actual mask/selection behavior is unverified.
- Sample explanation: `HOW IT WORKS · PAINT WHAT SHOULD GO`; sample depicts backyard AC units painted over for removal. No Today/result comparison slider was observed. Primary `Clean up image` is disabled and says `Add a photo to start`. No visible output/resolution setting; this is not evidence such settings do not exist elsewhere.

### 8. Resolution Enhancement — COMPLETE / OBSERVED
- Entry: `/app/tools/resolution-enhancement`; new-file flow `/app/new?tool=resolution-enhancement`; editor observed at `/app/editor/file-mwqb1wjb-1` (generated file route).
- Category: Image Enhancement. Photo input JPEG/PNG/WEBP up to 20 MB, any indoor/outdoor space, browse assets. Prompt `Describe the enhancement`, 1,000-character limit, expandable “Anything to avoid?”. No Improve control or style-reference input was visible.
- Unique method radios: `Auto enhance` (copy says upscaled and cleaned up in one pass by AI; 1 credit) and `Manual controls` (copy says free/on device). In manual mode, `Apply adjustments` step appears with Reset and sliders Noise reduction, Sharpness, Brightness, Contrast, Saturation (all observed at 0); helper copy says what is shown on photo is what Apply saves. This is visible prototype copy; processing behavior was not tested.
- Upscale radios: Original size (default), 2×, 4×. Look radios: None (default), Natural, Warm, Cool, Matte, Mono. Crop ratios: Original (default), 1:1, 4:3, 3:2, 16:9. Straighten slider at 0°, Flip horizontal and Flip vertical buttons.
- Sample comparison Today/Natural · preview, slider initially 45. Disabled empty state changes from `Enhance image` in Auto mode to `Apply adjustments` in Manual mode. No upload, adjustment, or apply was performed. No separate output settings beyond the visible upscale/crop/look controls were observed.

### 9. Perspective Correction — COMPLETE / OBSERVED
- Entry: `/app/tools/perspective-correction`; new-file flow `/app/new?tool=perspective-correction`; editor observed at `/app/editor/file-mwqb3388-1` (generated file route).
- Category: Image Enhancement. Photo input JPEG/PNG/WEBP up to 20 MB, any indoor/outdoor space, browse assets. Prompt `Describe the correction`, 1,000-character limit, expandable “Anything to avoid?”. No style-reference input was visible.
- Unique method radios: `Fix distortion` (straighten walls/lines the lens leaned) and `Camera angle` (re-frame from another height). Fix distortion exposes Vertical and Horizontal sliders, both `As shot`/0, plus `Suggest a correction` disabled before upload. Camera angle exposes Eye level (default, about 1.6 m), Low (near ground), High (from above), Straight on (square to facade).
- `Show guides` switch is on; accompanying text says guides are screen-only. Sample shows a house facade with perspective grid guides and `HOW IT WORKS · LINE THE WALLS UP WITH THE GUIDES`. Steps Add your photo / Set the correction / Reprocess. Primary `Correct perspective` is disabled before upload. No result/reprocess state was exercised.

### Empty-state controls and remaining tools
Disabled means only disabled in the observed no-photo state; it does not establish post-upload behavior. The radio modes above were changed only to reveal their visible local controls; no photo, generation, or paid action was used. Eight tools remain without editor inspection: Decor Re-definition, Material Refinement, Lighting Reimagination, Garden Design, Spa & Pool Redesign, Sky Transformation, Seasonal Transformation, Object Placement. Mobile interactions and durable screenshot files remain unverified.
