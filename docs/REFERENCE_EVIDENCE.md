# Reference evidence log (Phase 00)

| URL | Access result | Screenshot/evidence | Verified visible elements | Open questions |
|---|---|---|---|---|
| https://vastu-nord-design-prototype.vercel.app/ | Loaded in Codex in-app browser | Accessibility snapshot observed; no separate screenshot file saved | Header navigation: Features, About, Pricing, Resources, Contact, Sign In. Hero “See What’s Possible.”; Choose/Create/Explore/Decide story; transform categories for spaces, outdoors, details, and image refinement; sections for possibilities, workflow, audiences, social proof, FAQ, and get started. | Detailed visual measurements and deeper routes belong in Phase 01. Visible numerical social-proof claims and placeholder “Customer Name” testimonials were observed, not independently verified. |
| https://vastunord.vercel.app/ | Loaded in Codex in-app browser | Accessibility snapshot observed; no separate screenshot file saved | Similar marketing structure and copy; hero carousel showed Exterior Transformation during inspection; transformation categories, comparison slider, three variations, four-step workflow, audience cards, displayed metrics/testimonial placeholders, FAQ, footer. | Public deployment is reference-only; its source/account ownership and displayed claims are not verified. Detailed parity review belongs in Phase 01. |
| https://vastu-nord-design-prototype.vercel.app/app | Loaded in Codex in-app browser | Accessibility snapshot observed; no separate screenshot file saved | Sidebar showed Home, Tools, Files, Projects, Shared; header showed New, Search, Notifications, Account. Main view remained “Getting things ready” with profile/subscription/preferences/files/projects context-resolution steps. | Loading did not reach the tool catalog. Do not infer the Studio tool inventory; obtain a later accessible session or owner screenshot/recording if it persists. |

## Brand PDF visual review

Rendered all 36 pages into a contact sheet for visual review. The deck visibly includes approved VastuNord logo treatments and usage examples, six palette swatches, and Zalando Sans Expanded typography. No color values were sampled or inferred. Contact sheet was an inspection aid only and is stored outside the project workspace.

## Scope and limits

These are public rendered references, not source repositories. No source code was recovered. The site content is evidence of what rendered during this session; product claims, rights, and hidden functionality remain unverified.

## Phase 01 desktop inspection — 2026-11-21
The `/app` loading transition completed. The visible Tools link opened `/app/library` with four category filters and 17 tool cards. Room Reimagination opened a tool entry and then a new-file editor. A browser screenshot of the editor was visually inspected but not saved as a durable file. Other 16 workflows, mobile layouts, and marketing desktop/mobile captures remain uninspected in this phase. No uploads or generation were performed. The editor presents a sample comparison and credits; neither demonstrates real generation or wallet functionality. Its geometry-preservation wording is an unverified prototype claim.
## Phase 01A — four additional Studio editors (2026-11-21)
Using the visible 17-card library and its recorded order, inspected Virtual Home Staging, Outdoor Visualization, Hardscape Design and Furniture Refresh after Room Reimagination. The app `/new?tool=...` transition completed for all four. Their entry routes and editors loaded. Details and precise field names are in `docs/STUDIO_INVENTORY.md`. No uploads or generation occurred. No durable screenshots were written; browser accessibility snapshots and the live editor view were inspected. No source code, hidden API or proprietary page source was accessed.
## Phase 01B — four Studio workflows (2026-11-21)
Observed the entry and new-file editor for Seasonal Styling, Visual Cleanup, Resolution Enhancement, and Perspective Correction in the designer prototype. All four routes loaded; editors reached their empty-photo state. Resolution Enhancement’s manual mode and Perspective Correction’s Camera angle mode were selected to reveal their visible options only. No files were uploaded, no generation/pay action was triggered, and no backend functionality was inferred. Exact routes and control observations are recorded in `docs/STUDIO_INVENTORY.md`.

A Perspective Correction editor screenshot was captured and visually inspected in the browser during this pass; browser tooling did not expose a project-local durable screenshot file, so no screenshot artifact is claimed. Evidence retained in the editor accessibility observations and this log. Seasonal Styling and Visual Cleanup were also inspected from the continued batch context; no durable image files were saved. No proprietary page source or hidden API was accessed.


## Phase 01C — four Studio editors (2026-11-21)
From the visible 17-card library order, inspected Decor Re-definition, Material Refinement, Lighting Reimagination and Garden Design. Each tool entry and new-file editor loaded; exact routes, empty-state controls, defaults and visible disabled states are documented in `docs/STUDIO_INVENTORY.md`. The Garden Design `Just tidy it up` switch was toggled to inspect its task list and restored to its default off state. No image was uploaded and no generation action was used.

The supported browser screenshot API displayed the Garden Design editor screenshot for visual inspection but did not provide a durable project-local screenshot artifact; none is claimed saved. No source, hidden API, or backend behavior was accessed or inferred.
## Phase 01D — final Studio tools (2026-11-21)
Inspected Spa & Pool Redesign, Sky Transformation, Seasonal Transformation and Object Placement entry pages and new-file editors from the library. All four loaded in empty-photo state. Spa & Pool’s Spa and Pool + Spa modes and Seasonal Transformation’s Winter mode were selected only to reveal dependent controls, then restored to defaults. No images were uploaded and generation was not triggered.

The supported browser screenshot method displayed the Object Placement editor for inspection; it did not save a durable project-local screenshot. No screenshot artifact is claimed. Visible comparison label/default-selection mismatches in Sky Transformation and Seasonal Transformation are recorded in the inventory. No hidden API, source, or backend behavior was accessed.

## Phase 01E-A — marketing reference comparison (2026-11-21)

The desktop rendered marketing experiences at both public references were compared. Page-by-page findings, route destinations, visual patterns, unresolved conflicts, screenshot limitations and owner questions are recorded in `docs/MARKETING_REFERENCE_COMPARISON.md`.

### Design prototype routes observed

- Primary pages: `/`, `/features`, `/about`, `/pricing`, `/resources`, `/contact`.
- Account pages: `/login`, `/forgot-password`, `/signup` (forms viewed without credentials or submission).
- Linked solution pages opened: `/solutions/living-room-design`, `/solutions/virtual-staging`, `/solutions/living-room-scandinavian-design`, `/solutions/backyard-design`.
- Resource articles opened: `/resources/visualize-a-renovation-before-you-build`, `/resources/virtual-staging-vs-traditional-staging`, `/resources/choosing-the-right-interior-style`, `/resources/ai-for-homeowners`, `/resources/design-trends`.
- Six additional solution routes were visible as related links and later inspected in Phase 01E-A completion; all resolve to a branded custom 404. Exact routes and fallback details are below. Privacy and Terms footer links resolve to `/contact` on both references; separate legal pages were not observed.

### Development reference routes observed

`/`, `/features`, `/about`, `/pricing`, `/resources`, `/contact`. No additional developer-reference routes were opened from its visible marketing navigation. The `/features` mismatch is material: it renders a living-room solution page, whereas design `/features` is a general capabilities overview.

### Visual evidence and limitations

The in-app browser showed both homepage views and both Resources index views at desktop viewport 1280×720. Its supported capture displayed the views in session but did not provide a durable project-local screenshot file; none is claimed. Mobile inspection was not available. Remaining routes were inspected through the rendered page/accessibility view. No source, hidden APIs, form delivery, billing, account behavior, or AI generation was examined.

The supplied 36-page brand PDF had been visually reviewed in an earlier pass. Recorded evidence confirms the logo treatments, six visible palette swatches and Zalando Sans Expanded typography. This comparison did not sample color values or verify exact browser font rendering. The references look directionally consistent with the PDF's dark blue/teal and warm orange identity, but this is a qualitative observation only.

### Interaction evidence

- Design homepage story selector changed the visible scene/label/copy; category tabs and carousel controls were visible.
- Both pricing pages displayed annual/monthly states of €19/month billed yearly and €24/month, with differing switch semantics; no purchase occurred and commercial truth is unverified.
- Design Resources' Renovation filter changed the visible article list. Newsletter and contact forms were not submitted.
- Auth fields and password visibility control were visible; no credentials were entered.
- Four design solution pages showed an empty live-preview area with the primary action disabled before an image. No upload or generation was attempted; backend operation is unverified.

Earlier Phase 00 notes above describe the initial homepage-only/Studio-loading snapshot. They are historical; this Phase 01E-A section and comparison document are the later marketing-route evidence. No original source was recovered.

### Phase 01E-A route completion — six linked solution URLs (2026-11-21)

The six exact links recorded in the comparison were opened in the design reference:

| Route | Result | Evidence classification |
|---|---|---|
| `/solutions/kitchen-remodel-visualizer` | Branded 404, heading “This space doesn't exist — yet.”; “Back to home” link. Reopened once in a fresh browser tab with same result. | 404 and shared fallback shell OBSERVED; intended solution page NOT ACCESSIBLE. |
| `/solutions/office-redesign` | Same branded 404 and fallback shell. | 404 OBSERVED; page content NOT ACCESSIBLE. |
| `/solutions/retail-space-visualization` | Same branded 404 and fallback shell. | 404 OBSERVED; page content NOT ACCESSIBLE. |
| `/solutions/property-visualization` | Same branded 404 and fallback shell. | 404 OBSERVED; page content NOT ACCESSIBLE. |
| `/solutions/living-room-renovation` | Same branded 404 and fallback shell. | 404 OBSERVED; page content NOT ACCESSIBLE. |
| `/solutions/garden-renovation` | Same branded 404 and fallback shell. | 404 OBSERVED; page content NOT ACCESSIBLE. |

The fallback reused the known design header and footer, with a single Back to home CTA. No page-specific content, image/video, solution interaction, testimonial, price, or product claim was visible. CTA destinations in the common header/footer match the previously logged shell. No matching developer-site routes were present in previously inspected navigation; no routes were guessed. The rendered/accessibility state was observed, but no screenshot file could be saved as a project-local artifact. Desktop marketing route inspection for the identified set is complete with the six custom-404 limitations recorded; mobile is reserved for Phase 01E-B. Overall Phase 01 UI-parity remains BLOCKED by mobile and durable screenshot gaps, not passed.

## Phase 01E-B — responsive Studio and workspace (2026-11-21)

The in-app browser was limited to about 1280×720 and exposed no viewport resize override. The requested 1440px, 768px and 390px widths and touchscreen behavior were **NOT TESTED**. Desktop observations are in `docs/STUDIO_RESPONSIVE_AUDIT.md` and `docs/WORKSPACE_SCREEN_INVENTORY.md`.

### Screens/paths observed

- `/app` dashboard; `/app/library` with collapsed and expanded desktop sidebar.
- Representative editors: Interior Design `Room Reimagination` (opened from the visible new-file flow), Virtual Staging `Virtual Home Staging`, Exterior & Landscape `Outdoor Visualization`, Image Enhancement `Resolution Enhancement`.
- `/app/files`, `/app/files?view=archived`, `/app/files?view=deleted`; `/app/projects` and `/app/projects/pr-sodermalm`.
- `/app/shared` and `/app/shared?tab=downloads`; `/app/search` (pre-listed `kitchen` query remained on a skeleton loading state).
- Settings `/app/settings`, `/app/settings/profile`, `/app/settings/security`, `/app/settings/notifications`, `/app/settings/exports`, `/app/settings/billing`.
- Account and Notifications overlays; editor Version history; existing result `/app/editor/ws-kitchen-north`; Share & export Download, Review link and Social tabs.

### Evidence limits and side effects

Displayed account, notification, credit, plan, invoice, version/run, output and file data are prototype presentation only; services and persistence are **UNVERIFIED**. The new Room Reimagination flow created a file titled “Living Room Redesign” with “Saved just now” and it appeared in Active Files. This observed UI side effect is documented in the workspace inventory; no image/prompt was added and the file was left in place. No payment, generation, share, download, profile/security change, mark-read, deletion or restore action occurred.

Browser screenshots were visible during inspection but could not be exported to project-local files; none is claimed saved. Manual capture requirements are recorded in `docs/STUDIO_RESPONSIVE_AUDIT.md`. Overall Phase 01 UI-parity remains **BLOCKED** by missing tablet/mobile and durable screenshot evidence, among other unverified behavior. No Phase 01E-C or Phase 02 work was started.
