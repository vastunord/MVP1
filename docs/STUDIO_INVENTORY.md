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