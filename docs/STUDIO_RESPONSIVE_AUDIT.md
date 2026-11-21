# Studio responsive audit — Phase 01E-B

**Reference:** `https://vastu-nord-design-prototype.vercel.app/app`
**Observed viewport:** approximately 1280×720 desktop. This was the only available viewport; the in-app browser exposes no width/height override. 1440px, 768px and 390px states were therefore **NOT TESTED**. Do not infer tablet/mobile behavior from the collapsed desktop sidebar.

## Viewport and evidence status

| Width target | Result | Evidence status |
|---|---|---|
| 1440px desktop | Browser remained about 1280px wide; requested width could not be set. | NOT TESTED |
| 768px tablet | No viewport resize control exposed. | NOT TESTED |
| 390px mobile | No viewport resize control or touchscreen input exposed. | NOT TESTED |
| Available desktop | Dashboard, library, file/project/shared/settings views and representative editors observed around 1280×720. | OBSERVED |

Browser screenshots were displayed in-session for the dashboard, tool library, collapsed library sidebar, editor examples, file/project screens, settings and notifications. Browser capture returns an in-session image but no project-local export path; no durable screenshot file is claimed.

## Shared desktop shell

- **Workspace pages:** persistent left navigation with logo, orange New action, Search, Home, Tools, Files, Projects and Shared. Notifications and account occupy the lower rail. Sidebar collapse changes the expanded text navigation to an icon rail; the library remained a four-column grid in the observed collapsed desktop state.
- **Editors:** workspace sidebar is replaced by a full-window editor. A compact top bar contains Back, rename, tool name, save status, Undo/Redo, Version history and credit display. Settings occupy a vertically long left panel; the stage/canvas and comparison area fill the right side. The bottom of the stage shows the three workflow steps.
- **Canvas:** examples show a before/after or version comparison with a labelled slider. Empty-photo editor states display a sample comparison and setup guidance; these examples do not prove generation or persistence.
- **Scrolling:** long lists and settings extend below the captured desktop viewport. No horizontal overflow was visible in the desktop screenshots; smaller breakpoints and panel-specific scroll behavior were NOT TESTED. Touch scrolling was NOT TESTED.

## Representative tool editors

The selection covers the four documented Studio categories. Shared editor details are above; full configuration remains in `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md`.

| Category / tool | Route and file state | Observed layout and differences | Empty-state controls |
|---|---|---|---|
| Interior Design — Room Reimagination | `/app/editor/file-mwqcb7kw-1`; opened from the entry page via Start a new file. | Shared two-panel editor; photo and optional style reference in the left panel; sample Today/Reimagined stage and slider on right; workflow steps at stage bottom. | JPEG/PNG/WEBP up to 20 MB shown; Generate room disabled until photo. Undo/Redo disabled. **A new empty file was created and appeared as saved just now in Files; persistence is UNVERIFIED. It was left in place.** |
| Virtual Staging — Virtual Home Staging | Existing file `/app/editor/file-mwqavnma-1`, “Listing Staging”. | Shared shell; buyer-profile choices (Family default, Young professional, Downsizer, Luxury, Neutral) and child-safe switch; Today/Staged example. | No photo loaded; Stage this room disabled. Existing file save time was displayed, not independently verified. |
| Exterior & Landscape — Outdoor Visualization | Existing file `/app/editor/file-mwqavxv0-1`, “Garden Concept”. | Shared shell; Outdoor style cards, lighting-density slider at 30%, surroundings controls and weather; Today/Reimagined example. | No photo loaded; Visualize outside disabled. Area selection and suggestions disabled in the empty state. |
| Image Enhancement — Resolution Enhancement | Existing file `/app/editor/file-mwqb1wjb-1`, “Upscaled Image”. | Shared shell; Manual controls selected; five adjustment sliders, look, crop, straighten and flips. | No photo loaded; Apply adjustments disabled. Auto enhance displayed a 1-credit option, but generation and credit behavior are UNVERIFIED. |

No file was uploaded, no control was used to generate, and no paid action was taken. Tool labels, credits, saved timestamps and example results are OBSERVED display only; real model, save, job, wallet and export functions are UNVERIFIED.

## Responsive requirements for later implementation

- Preserve the desktop two-panel editor and comparison stage while allowing the left settings panel and stage to reflow at narrower widths.
- At tablet/mobile widths, determine whether navigation becomes a drawer, compact bar or another pattern from new screenshots. The reference mobile menu is currently NOT ACCESSIBLE to this audit.
- Keep the primary action, upload affordance, comparison controls and workflow steps reachable without clipping; plan for long option lists and keyboard focus when panels stack.
- Maintain labelled slider/radio/switch controls and a clear visual association between settings and canvas. The available accessibility tree exposed names for key controls, but keyboard navigation, focus order, contrast and screen-reader behavior were NOT TESTED.

## Observed issues and missing states

- No responsive breakpoint behavior can be confirmed at the requested widths; no touch-specific affordance was tested.
- At desktop the long settings panel and stage require vertical space; lower controls fall below the viewport and depend on scrolling.
- Undo and Redo are DISABLED for empty editors. Generate/Apply/Visualize/Stage actions are DISABLED before an image. Save status labels and pre-rendered examples do not establish real persistence or AI output.
- Results/version comparison exists on an existing example file and is documented in `docs/WORKSPACE_SCREEN_INVENTORY.md`; result generation remains UNVERIFIED.
- No confirmed accessibility defect was established in this visual/reference pass. Keyboard, screen reader, touch target size and contrast audits remain NOT TESTED.

## Manual screenshot checklist

Owner capture should include browser URL and viewport in each filename or note:

1. 1440×900: `/app`, `/app/library` expanded/collapsed, and one editor per major category.
2. 768×1024: dashboard/library navigation, tool grid, editor settings plus canvas, compare state, file/project lists.
3. 390×844: open/closed navigation, library cards, upload panel, prompt/settings, fixed/scrolling primary action, comparison slider, notification/account panels.
4. Result file and share/export tabs at desktop and mobile, without publishing or sending any link.

Keep images private and do not include real private photos or payment details in screenshots.
