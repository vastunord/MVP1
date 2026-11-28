# VastuNord designer journey evidence

Retrieved 28 November 2026, Europe/Oslo, through the connected official Figma tools. This is an observed designer-source inventory and acceptance seed, not an implementation completion report. No design nodes were edited.

## Access and scope

Access succeeded for the supplied file `V3sARNNp4q0bw68tpa42q7`, starting at node `5:13185`. That URL selects **Group A — Entry & Access**. A read-only page inventory exposed eight pages; every page was successfully read using `get_figjam`.

The evidence bundle contains eight original XML responses and `FIGJAM_JOURNEY_NODES_AND_EDGES.json`. The JSON preserves page and section hierarchy, node text, IDs, connector endpoints, labels and arrow-cap attributes. It contains 2,131 shape-with-text nodes, seven stickies, 28 table cells, one table and 2,537 connectors. All connector endpoint IDs resolve within the extracted file. Endpoint resolution does not establish a complete or correct product journey.

The extracted board is much larger than the 17 Studio editor forms. It also specifies authentication, home routing, projects/workspaces, delivery, billing, settings and failure recovery. Existing owner decisions still apply: billing stays disabled and live provider spending remains bounded.

## Page map

| Group | Exact designer page | Node | Observed scope |
|---|---|---|---|
| A | Entry & Access | `5:13185` | Trial activation, email verification, forgotten password, login, signup, subscription |
| B | Home / Visualization Hub | `0:1` | Home entry, workflow discovery, continue workspace, start visualization, home search, notifications, first-time experience |
| C | Projects & Workspaces | `2:1902` | Workspace creation/management/organization/assignment; project creation/dashboard/management/organization/duplication/deletion |
| D | Space Visualization | `5:3157` | Sixteen named tool-flow sections, with a Hardscape/Outdoor naming conflict described below |
| E | Delivery & Sharing | `7:23305` | JPG, PNG, high-resolution export, universal validation, recovery, audit and delivery exits |
| F | Billing & Subscription | `7:24070` | Upgrade, downgrade, trial conversion, payment methods, invoices, top-up, renewal, cancellation and recovery |
| G | Account & Settings | `7:24071` | Profile, password, notification preferences, export defaults, tutorials, FAQ and support |
| H | Platform Resilience | `7:24072` | Loading, upload failure, AI failure, export failure, payment failure, session timeout and retry |

Deep links use `https://www.figma.com/board/V3sARNNp4q0bw68tpa42q7/Final-Ecosystem-Map--For-Dev-?node-id=NODE` with the colon in the node ID replaced by a hyphen.

## Tool-specific FigJam mapping

These are exact observed section IDs and named actions. They are not claims that the current implementation or provider supports those actions. Exact option values, defaults, widget appearance and interaction details should come from the designers' rendered Studio and applicable design frames.

| Designer Studio tool | FigJam section | Distinct actions in source |
|---|---|---|
| Room Reimagination | `5:4460` | Room type/style/palette, furnishing/plants/accessories/lighting/floor, time, aspect ratio, annotation, selected-area analysis, VastuNord suggestions, child-safe direction |
| Virtual Home Staging | `5:4020` | Style, child-safe direction, staging; single or batch export is explicitly branched |
| Outdoor Visualization | No separate named section found | The section titled Hardscape Design contains Outdoor Visualization actions; mapping is ambiguous, not absent by inference |
| Hardscape Design | `5:3832` | Section title says Hardscape; internal actions say Open/Configure/Generate Outdoor Visualization, with time/style/lighting density/context/greenery/vehicles/people/weather and AI assistance |
| Furniture Refresh | `5:4363` | Room type/style/time; selected furniture add/remove, cleanup, asset furniture, one-click refresh and child-safe direction |
| Seasonal Styling | `5:4108` | Room type/style/palette/season |
| Visual Cleanup | `5:3238` | Cleanup method, brush markup/delete, AI material/object editing |
| Resolution Enhancement | `5:3316` | Auto/manual enhancement; sharpness, brightness, contrast, saturation, noise reduction, filters, crop/rotate/flip |
| Perspective Correction | `5:3160` | Correction method, camera angle, perspective distortion |
| Decor Re-definition | `5:4274` | Decor style, aspect ratio, selection add/remove, asset decor, child-safe direction |
| Material Refinement | `5:4190` | Palette, material/object editing and child-safe direction |
| Lighting Reimagination | `5:3935` | Room type, lighting settings, fixture style and adding lighting from assets |
| Garden Design | `5:3744` | Outdoor style/area, touch-up, selected-area analysis, VastuNord suggestions |
| Spa & Pool Redesign | `5:3655` | Pool type, construction, shape, material and style |
| Sky Transformation | `5:3573` | Time, weather, cloud intensity, sky saturation |
| Seasonal Transformation | `5:3487` | Time, season, scene elements, vehicles and people |
| Object Placement | `5:3414` | Add an object from assets and prompt the asset |

Across these flows, the board specifies source choice, configuration, AI processing, result, comparison, version history, favourite, undo/redo, iteration and export. Source choices include one/multiple images, existing assets and drag-and-drop. References are explicitly present in many, but not all, tool flows: do not add reference controls to every tool merely because a shared form supports them.

The board repeatedly names HD/4K/8K exports and trial watermarks. These are desired flows, not proof of output resolution, an enabled subscription system or a working upscale provider. Preserve availability truth and record any capability gap.

## Concrete source ambiguities and scope annotations

1. **Hardscape / Outdoor conflict.** Section `5:3832` is named Hardscape Design. Nodes `5:3834`, `5:3841` and `5:3856` say Open, Configure and Generate Outdoor Visualization. No separate named Outdoor Visualization section was found in the extracted Group D tree, and no surface-marking action was found inside this section. Keep both prototype tools. Use their rendered controls as UI evidence and register the journey mapping as unresolved; do not merge them or invent an approved hardscape flow.

2. **Independent workspaces are intentional.** Node `2:1745` creates an independent workspace. Home node `2:87` says Continue Without Projects. Node `3:3770` offers Continue Working Without Projects. Workspace management node `2:2291` includes Existing Project, Create New Project, Remove From Project and Independent Workspace; node `2:3033` makes a workspace independent after removing its project reference. A mandatory user-created-project step before first visualization is therefore a potential journey mismatch. Adapt the UX without weakening asset ownership; an implementation-level container must not automatically become a mandatory visible project step.

3. **Social sharing is explicitly incomplete.** Sticky `7:23535` says “Share to social media flow is missing”. Pinterest/YouTube/public-gallery publishing must follow the owner's separately approved consent and publishing requirements. It cannot be described as an exact implementation of a complete designer social journey.

4. **Some checks are questions, not approved requirements.** Section `5:13224` says Check necessity for MVP; it wraps trial device checks, including a Check Browser History node (`5:13226`). Section `5:14206` asks Is risk assesment necessary? Section `5:13292` says screens not needed. Section `5:13895` is Email Change Verification (Future). Do not silently promote these into mandatory customer friction, browser-history collection, or launch blockers. Record a sensible scoped interpretation and any required owner decision.

5. **Examples are not policy.** Trial allocation nodes `5:13267` and `5:13269` explicitly say Example: 25 Credits and Example: 14 Day Expiry. The deletion flow also labels its retention value as an example. Do not hardcode these as approved commercial rules.

6. **Generic retry cannot authorize duplicate paid submissions.** Group H node `7:30437` says Automatic Retry Max 3. Apply safe retry to reads, polling, confirmed non-submissions and storage recovery as appropriate. Existing idempotency, dispatch uncertainty and spend controls govern paid provider requests. Never turn this diagram label into automatic uncertain MNML resubmission.

7. **One connector lacks a directional arrow.** Material Refinement connector `5:4246` links Next Action (`5:4208`) and Favourite Generation (`5:4211`) with neither endpoint cap indicating an arrow. The XML preserves this. Do not claim its direction was established solely by the connectorStart/connectorEnd field names.

8. **Journey diagrams do not establish provider accuracy.** Brush deletion, exact perspective adjustment, object placement, child-safe styling and upscale choices need their existing capability classifications and independent tests. A named action in FigJam must not be presented as a guaranteed render outcome.

9. **Independent work and export validation use inconsistent project language.** Group E validation node `7:23428` says Project Exists, while Groups B/C allow independent workspaces. Preserve both facts. Map the implementation's secure ownership container explicitly; do not claim the board already resolves the model or use the export label alone to impose a visible named-project requirement.

10. **Multiple-source input is broader than staging export.** Group D repeatedly specifies Upload One / Multiple Images. Record per-tool source cardinality and capability separately from Virtual Home Staging's single/batch export branch. Do not infer that an inspected single-photo editor implements all multi-image branches.

## Journey acceptance seed

The following test obligations are recommendations derived from observed nodes and edges. Use the full node/connector JSON to trace the exact branch; do not treat this compact table as the entire board.

| Area | Observed journey evidence | Codex acceptance work |
|---|---|---|
| Signup and verification | Signup `5:14315`; email verification `5:13685`; separate pending, dispatch failure, resend, expired, already-used, invalid and revoked-token sections | Preserve entry destination, show truthful pending state, exercise invalid/expired/resend/retry branches, then complete authenticated return. Do not report fixtures as real email delivery. |
| Login and recovery | Login `5:14205`; forgotten password `5:14012`; session timeout `7:30399` | Verify recovery and return to the intended workspace without losing recoverable work; preserve account isolation. |
| Home routing | B-01 `8:32234` | Validate session and resolve user context; distinguish first-time/returning and empty/loading/failure states. |
| First visualization | B-07 `8:32240`; B-04 `8:32237`; C-01 `8:32241` | Welcome has Skip; selected workflow leads to an independent workspace and upload. Recover from welcome/category/workspace initialization failures. Mark onboarding complete only at its defined completion. |
| Discovery | B-02 `8:32235`; B-05 `8:32238` | Categories, workflow cards, search, empty/no-match, details and selected-workflow routing are separate states. Home search also distinguishes workspace and project results. |
| Continue work | B-03 `8:32236` | Active/recent/draft/unsaved states are distinct. Restore or open the last saved version according to the relevant branch; retain the correct owned tool/project context. |
| Projects and files | C-01 through C-10 `8:32241` to `8:32250` | Test independent workspaces, assignment/removal, organization, metadata, duplication and deletion consequences. The project deletion flow recommends retaining independent workspaces, then separately handles move or permanent deletion. |
| Every Studio tool | Group D `5:3157` | Map individual configuration nodes to actual custom widgets; exercise success and iteration. Use Group H for global failure behavior; record gaps in per-tool source coverage. |
| Exports | Group E `7:23305` | Check ownership, version/asset existence, permission, storage and health before export. JPG and PNG have separate configuration/format behavior; high resolution has eligibility/upscale steps. |
| Notifications | B-06 `8:32239` | Empty state, list grouping, detail, related destination, mark-read and clear actions; failed deep-link and update recovery. |
| Settings and support | Group G `7:24071` | Save/profile validation, password change, preference rollback, export defaults, tutorials, FAQ and support submission/recovery. |
| Resilience | Group H `7:24072` | Loading/delay/timeout, upload causes, AI causes, export causes, session preservation and bounded safe retries must have visible recovery paths. |
| Deferred billing | Group A subscription `5:14473`; Group F `7:24070` | Inventory the designed journeys, mark owner-deferred and leave commercial checkout/subscription/top-up behavior disabled. Do not count deferred billing as verified parity or silently enable it. |

## How to consume the evidence efficiently

1. Read this summary and the existing project state first.
2. Query the JSON by page/section/node ID for the specific work item, rather than pasting the entire board into every prompt.
3. Use `parentId`/`ancestorIds` to identify a tool or flow. Resolve each connector to its node text, condition label and cap direction.
4. Build a journey-to-route/test matrix with source node/edge IDs, observed implementation, discrepancies, accepted owner override and verification state.
5. The raw XML is the extraction source; do not delete it when fixing code. Refresh only when the designer file changes or a source conflict requires a targeted re-read.
6. The board extraction establishes design intent only. Keep observed source, implemented behavior, fixture testing and live verification in separate columns.

## Tool provenance

Successful read path: `mcp__codex_apps__figma_create_session`, `mcp__codex_apps__figma_get_figjam`, and a read-only `mcp__codex_apps__figma_use_figma` call returning page IDs/names. Session: `e2fa688b-88ec-4e76-a3d8-6f9a71ef21fd`.

Loaded skills: Figma design-to-code and Figma use. Their canonical packages are `skill://plugin_connector_68df038e0ba48191908c8434991bbac2/figma-design-to-code` and `skill://plugin_connector_68df038e0ba48191908c8434991bbac2/figma-use`.

The get_metadata tool is documented for Design files, not FigJam, so it was not used on this board. The supplied node was read directly; remaining page IDs came from the actual read-only file inventory. No nodes or journeys were guessed from URLs.
