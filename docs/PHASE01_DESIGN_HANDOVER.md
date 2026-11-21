# Phase 01 design handover and closure

**Phase 02F:** A clearly labeled noncommercial demonstration of the existing scaffold is live at https://vastunord-web.vercel.app. This is not a Figma-parity claim: detailed finalized Figma frames, assets, route mapping and responsive comparison remain unverified. Obtain inspectable approved frames and exports before final marketing implementation.

**Founder update — final marketing design authority:** The approved [Finalised Marketing Website Screens (Dev)](https://www.figma.com/design/yLScUtnuv6HLK0NDL8I9WE/Finalised-Marketing-Website-Screens--Dev-?node-id=0-1) is now the primary visual reference for the marketing pages it contains, with the official brand PDF applied throughout. Both older marketing websites are secondary historical references; their observations below are evidence, not instructions to override Figma. Preserve the approved page structures, components, section order, imagery, navigation, heroes and hierarchy. Do not invent alternatives; record any proposed deviation for founder approval. For Studio screens not superseded by approved Figma designs, retain the existing Studio prototype as the reference. When marketing implementation begins, create a Figma-to-route visual parity matrix and compare the actual implementation against approved frames. If Figma access is unavailable, request exported frames and assets.

The initial handover could see only a canvas overview. During the subsequent interface rebuild, the guest canvas exposed six desktop/mobile board pairs at readable zoom. The [implementation tracker](FIGMA_HTML_IMPLEMENTATION_TRACKER.md) maps those boards to working routes and records outstanding artwork, typography and measurement evidence. The overall visual-parity gate still awaits an original-scale comparison and founder review.

**Status:** Phase 01 reference/design handover is complete **with documented limitations**. This is not a claim of implemented or pixel-perfect UI parity. The overall visual-parity gate remains **BLOCKED** pending mobile/tablet evidence, durable screenshots, and resolution of the listed owner decisions.

**Evidence basis:** rendered public references and the supplied 36-page brand PDF review. These are not source code. UI behavior is classified as observed only where it was visible; visible controls, example results, account data and credit displays do not verify backend operation. See `docs/REFERENCE_EVIDENCE.md`, `docs/MARKETING_REFERENCE_COMPARISON.md`, `docs/STUDIO_INVENTORY.md`, and `docs/WORKSPACE_SCREEN_INVENTORY.md`.

## 1. Marketing site handover

### Verified page inventory

The design reference was inspected at desktop for `/`, `/features`, `/about`, `/pricing`, `/resources`, `/contact`, `/login`, `/forgot-password`, `/signup`, four accessible solution pages, five resource articles, and six linked solution routes returning branded 404s. The development reference was inspected at `/`, `/features`, `/about`, `/pricing`, `/resources`, and `/contact`. Exact route inventory and page details are in `docs/MARKETING_REFERENCE_COMPARISON.md`.

The four accessible solution pages are `/solutions/living-room-design`, `/solutions/virtual-staging`, `/solutions/living-room-scandinavian-design`, and `/solutions/backyard-design`. The six unavailable routes and proposed handling are tracked in `docs/BROKEN_ROUTES_AND_RECONSTRUCTION.md`.

The older design homepage sequence is: transformation/story hero with a scene selector; transformation categories; possibility examples/comparison; workflow; audience sections; displayed social proof; FAQ; CTA; grouped footer. The development homepage follows a similar narrative. The two `/features` pages materially differ: the older design reference is a general capabilities overview; the development reference is a living-room solution landing page. Treat these as historical observations; use the finalized Figma structure where it contains the relevant page and reuse copy only when corroborated and approved.

### Target requirements (build requirements, not observed implementation)

- Follow the finalized Figma for marketing page structure, header, footer, visual hierarchy, components and imagery; the older reference patterns below are secondary evidence only.
- Define and validate every CTA destination. Observed destinations conflict: design Sign In goes to `/login` and its primary action to signup; the development reference routes Sign In to `/contact` and its prominent visualization actions to `/pricing`.
- Default customer UX to Norwegian Bokmål, with an English switch at top right, as required by standing project instructions. The audited references do not establish the required localization behavior; implementation and translated content remain outstanding.
- Provide light/dark/system preferences as required by project instructions. The audited marketing references primarily show a light page with dark photographic/background sections; no preference control or preference persistence was verified.
- Preserve responsive composition, readable content and usable navigation at 390, 768, 1280 and 1440 pixel widths. Only desktop rendering near 1280×720 was available for the marketing audit. Responsive behavior at the other widths is **NOT TESTED**.
- Treat pricing, entitlements, metrics, testimonials, product claims, forms, newsletter delivery, legal destinations and auth as unverified until approved and wired to real services. Observed Privacy and Terms links point to Contact, which is not evidence of legal pages.
- Use only authorized replacement imagery. The owner Google library URL, asset rights and mapping remain pending; no unlicensed font files may be distributed.

### Brand and design system evidence

The 36-page brand PDF is authoritative. Its visual review confirms approved logo treatments/examples, six visible palette swatches, and Zalando Sans Expanded typography. The audit did not sample hex values, font sizes, spacing values, breakpoint thresholds, contrast ratios, or precise logo clear-space measurements. Therefore this handover specifies no invented numeric tokens. During implementation, source exact values from the PDF/design assets and verify font licensing. Qualitative reference direction: white and deep navy/teal surfaces, warm orange CTA accents, spacious image-led layout, geometric expanded display headings, and small uppercase labels. This is not a measured token system.

Observed reusable components include transformation, audience, feature/process, solution, pricing, resource and FAQ cards; orange primary and text/link actions; form fields and selectors; horizontal desktop navigation; category tabs; comparison sliders; accordions; and grouped footer links. The brand/reference evidence does not establish a spacing scale, grid measurements, button/input dimensions, icon family, or responsive breakpoint values. Source and validate these during build rather than estimating them from memory.


## 2. Studio and workspace handover

### Workspace sitemap observed

The desktop reference exposes `/app` (Home), `/app/library` (Tools), `/app/files` plus archived/deleted query states, `/app/projects`, `/app/projects/pr-sodermalm`, `/app/shared` plus downloads tab, `/app/search`, `/app/settings` and profile/security/notifications/exports/billing subroutes. Account and notification overlays are visible. An existing result is `/app/editor/ws-kitchen-north`; Version History and Share & Export (Download, Review link, Social) are overlays/tabs. Full observed components and empty states are in `docs/WORKSPACE_SCREEN_INVENTORY.md`.

Displayed records, identities, counts, balances, prices, statuses and timestamps are prototype content only. The search example stayed in a processing skeleton. A new empty Room Reimagination file appeared as saved during the prior inspection and was left untouched; remote persistence was not established. No upload, generation, purchase, download, sharing, restore, delete, profile/security mutation or logout was performed.

### Shared editor pattern

At the available desktop view, the editor replaces the workspace sidebar with a compact top bar (back, name/tool, save label, undo/redo, history and credit display), a long settings/input panel on the left and a large stage/comparison canvas on the right. Sample “Today” and generated-style examples/comparison sliders are presentation states only. Empty editors show guidance and disabled actions until a photo is present. Workflow steps appear at the stage bottom. Preserve this as the starting desktop shell, but treat mobile stacking, fixed action placement, panel switching and touch comparison behavior as requirements to design and verify, not as observed behavior.

### All 17 tool configurations

Routes and names below are observed. Exact controls/defaults and uncertainty remain in `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md`; all primary generate/apply actions were disabled in the empty-photo states. Every tool’s actual model, job lifecycle, output persistence and wallet effects are **UNVERIFIED**.

| # | Tool / route | Category | Configuration summary and distinctive controls |
|---|---|---|---|
| 1 | Room Reimagination `/app/tools/room-reimagination` | Interior Design | Room type, style, palette, floor/furnishing/plants/accessories/lighting, time, child-safe and aspect ratio. |
| 2 | Virtual Home Staging `/app/tools/virtual-home-staging` | Virtual Staging | Buyer profile and optional child-safe setting. |
| 3 | Outdoor Visualization `/app/tools/outdoor-visualization` | Exterior & Landscape | Outdoor style, lighting density, site/people/greenery/vehicles, weather, area-selection and suggestion controls. |
| 4 | Hardscape Design `/app/tools/hardscape-design` | Exterior & Landscape | Outdoor controls plus a Surfaces/Mark interaction disabled before photo. |
| 5 | Furniture Refresh `/app/tools/furniture-refresh` | Interior Design | Room/furniture style and Refresh now, Pick, Place asset, Clean up room, child-safe actions. |
| 6 | Seasonal Styling `/app/tools/seasonal-styling` | Virtual Staging | Season and room styling; Spring palette default; Today/Summer example. |
| 7 | Visual Cleanup `/app/tools/visual-cleanup` | Image Enhancement | AI object-editing vs Brush & delete; named object-removal classes and photo picking. |
| 8 | Resolution Enhancement `/app/tools/resolution-enhancement` | Image Enhancement | Auto vs Manual; five adjustment sliders; upscale, look, crop, straighten and flips. |
| 9 | Perspective Correction `/app/tools/perspective-correction` | Image Enhancement | Distortion vs Camera angle; vertical/horizontal sliders; camera-height presets and guides. |
| 10 | Decor Re-definition `/app/tools/decor-redefinition` | Interior Design | Decor style, aspect ratio, spot-pick and decor placement/assets. |
| 11 | Material Refinement `/app/tools/material-refinement` | Interior Design | Palette and optional surface picking. |
| 12 | Lighting Reimagination `/app/tools/lighting-reimagination` | Interior Design | Room type, 2700K/60% observed defaults, ambient layering, fixture type and placement. |
| 13 | Garden Design `/app/tools/garden-design` | Exterior & Landscape | Garden style, scope, tidy-up task checklist and area suggestions. |
| 14 | Spa & Pool Redesign `/app/tools/pool-redesign` | Exterior & Landscape | Pool/spa/combined modes; pool and spa type/shape/material/feature options and placement; non-scale plan note. |
| 15 | Sky Transformation `/app/tools/sky-transformation` | Exterior & Landscape | Preview switch, time/weather and cloud/saturation controls; observed example/default mismatch. |
| 16 | Seasonal Transformation `/app/tools/seasonal-transformation` | Exterior & Landscape | Season/time, winter snow amount, people/vehicle density; observed example/default mismatch. |
| 17 | Object Placement `/app/tools/object-placement` | Exterior & Landscape | Required objects, choose-from-objects disabled empty state, numbered location-pin example; no result comparison observed. |

Most photo inputs visibly accept JPEG/PNG/WEBP up to 20 MB; some ask for straight-on room or wide daylight exterior framing. Reference-image entry varies by tool; Object Placement copy refers to an asset/object photo although the editor’s chooser was disabled. These are visible UI requirements, not validated upload processing. Matrix rows capture prompt labels, defaults, examples, primary actions and unverified capabilities for each tool.

**Asset library:** tool editors expose asset browsing/reference-image controls in some workflows, and the workspace shows file/project lists. No owner Google library was linked or inspected; internal asset availability, ownership, rights, storage, retrieval and permissions are **UNVERIFIED**. Preserve the approved replacement workflow in `docs/ASSET_MANIFEST.md` and wait for owner-authorized library access.

**Results, credits, sharing and export:** an existing Kitchen result showed version selectors/history and comparison; Download, Review link and Social tabs, a credit display and billing/credit-purchase screens were visible. Version records, output files, costs, credit ledger, payment, recipient permissions, consent enforcement and delivery are all **UNVERIFIED**. No such action was performed.

### Responsive requirements

The tool grid showed four columns at desktop and remained four columns with the desktop sidebar collapsed. The editor showed long vertically scrolling settings beside a comparison stage. Widths 1440, 768 and 390, touch input, mobile menus, overflow, clipped controls and mobile action positioning were **NOT TESTED**. No durable project-local screenshots were saved; browser screenshots were visible only in-session. Do not make unsupported breakpoint claims. The manual capture checklist in `docs/STUDIO_RESPONSIVE_AUDIT.md` is the owner evidence path.

## 3. User journey handover

Status labels separate reference evidence from product requirements. “Observed UI” does not assert service functionality.

| Journey | Reference evidence | Build requirement / status |
|---|---|---|
| Visitor → Signup → Dashboard | Marketing `/signup` form and Studio `/app` dashboard visible. | Implement approved Bokmål/English signup, real auth and protected dashboard. Submission/session behavior **UNVERIFIED**. |
| Dashboard → Create Project → Studio | Dashboard, project list/detail, create-project and new-visualization controls displayed. | Create a project and open a configured tool with server-authorized project context. Persistence and creation flow **UNVERIFIED**. |
| Studio → Upload → Configure → Generate | All 17 empty-state editors and controls visible; primary actions disabled without input. | Validate private uploads and tool-specific inputs/options; only show truthful progress for durable jobs. Upload and generation are **UNVERIFIED**. |
| Generation → Result → Compare → Save | Existing result, version list and compare slider displayed; empty file showed no versions. | Persist immutable output versions, comparison metadata, save state and failure states. Real generation, history and persistence **UNVERIFIED**. |
| Result → Private Gallery → Public Consent | Private-by-default is an authoritative project policy; reference shows result/download/social surfaces. | Keep outputs private; require explicit per-asset public-gallery consent. A product “Private Gallery” screen and consent UI were **NOT OBSERVED**. |
| Public Consent → Editorial Review → Public Gallery | Marketing proof/ gallery-like examples do not verify publishing workflow. | Require separate channel consent, human editorial approval, audit trail and revocation. Workflow **NOT OBSERVED**; manual social publishing only per project policy. |
| Credit Purchase → Wallet → Generation Usage | Editor/billing showed credit balances, prices, packs and actions. | Implement a transactional ledger, idempotent reservation/settlement/refund and verified checkout only after provider/owner approval. Wallet and billing **UNVERIFIED**. |
| Knowledge Hub → Studio | Marketing Resources/articles and dashboard Learn links displayed. | Link editorial knowledge to relevant tools without implying an AI recommendation service. Cross-navigation observed in part; personalization **NOT TESTED**. |
| Prana → AI Consultation / Quick Tips / Film | No Prana-specific route or these three interaction types were verified in the inspected evidence. | Scope and approve these surfaces separately before design/build; requirements, safety, content and AI behavior **NOT OBSERVED**. |

## 4. Explicitly unverified capabilities

The following are **UNVERIFIED** or **NOT TESTED**, regardless of visible controls or demo values:

- AI/image/video generation, provider/model choice, result quality, moderation, queue/job delivery and failed-job recovery.
- Credit wallet, price/plan entitlements, checkout/payment, ledger correctness and charges/refunds.
- Database persistence for users, projects, files, prompts, outputs, preferences, comments or versions.
- Upload validation beyond displayed labels, image processing, private object storage, access controls, retention/deletion and recovery.
- Download/export file generation, format/resolution/credit effects and browser delivery.
- Review link creation/delivery, invite enforcement, expiry/revocation, permissions and sharing consent.
- Mobile/tablet responsive behavior and touch interactions; requested widths could not be set.
- Authentication, account/session security, notifications delivery and search result correctness.
- Keyboard accessibility, screen readers, focus, contrast, reduced motion and touch-target compliance.
- Public gallery consent, editorial approval, publication or analytics.
- Knowledge Hub content ownership/accuracy and any Prana AI Consultation, Quick Tips or Film features.

### Later-phase responsive and capture requirement

Test marketing, workspace and representative editors at **390px mobile, 768px tablet, 1280px desktop and 1440px desktop**. Cover navigation open/closed, library grid, long editor panels, canvas/compare interaction, upload and prompt controls, action visibility, overflow, keyboard and touch access. Capture URL and viewport in durable project-local screenshots when supported or via the owner’s manual screenshot checklist in `docs/STUDIO_RESPONSIVE_AUDIT.md`. No repeated attempts at the unsupported export path are required.

## 5. Phase 02 architecture blueprint (recommendation only)

No application code or service has been created by this handover. The following is a proposed sequence and boundary map, subject to an owner-approved Phase 02 prompt and resource isolation checks.

1. **Web app and routes:** Next.js App Router with separate route groups for marketing, authentication and protected workspace; public routes for approved marketing/content and `/app` routes for dashboard/library/files/projects/settings/editors/results. Keep client interactions separate from server authorization/data functions. Avoid coupling marketing delivery to Studio job processing.
2. **Shared UI:** tokenized brand components, localization boundary (Norwegian Bokmål default; English switch), theme preference, accessible forms, shared workspace shell and editor shell. Source exact tokens from approved brand materials; no guessed values.
3. **Studio configuration:** typed `StudioToolDefinition` records for all 17 observed tool identifiers, routes, input requirements, prompt schema, option groups/defaults, actions and output/comparison metadata. Render through one `EditorShell` and typed input/config panels. Validate the matrix against tool pages before implementation; never assume common options apply uniformly.
4. **Identity and data:** auth provider is not selected/verified in this evidence set. Use the owner-approved provider and server-side authorization. Neon PostgreSQL plus Prisma is the recorded preference, not a provisioned resource. Model users/workspaces, projects, files/assets, tool runs/jobs, immutable versions, credit ledger/reservations, consent records and editorial records with tenant ownership and audit history.
5. **Media and privacy:** use a separate Vastu Nord-owned storage/resource stack only after authorization. Store private assets by default; issue scoped, short-lived access; enforce per-asset consent and deletion/retention policy. Replace prototype art only with the owner-authorized library and recorded rights in `docs/ASSET_MANIFEST.md`.
6. **AI job lifecycle:** authorize tool/input → validate private asset references → reserve credits in a DB transaction with an idempotency key → create durable queued job → invoke the approved provider asynchronously → persist output/version and truthful status → settle credits on success or release/refund on failure → notify. Show no simulated completion or charge. Provider, model, spend limits and content-safety rules require separate approval.
7. **Editorial content:** Payload CMS is the recorded preference for Vastu Nord-owned cloud hosting with its own Neon CMS database. Treat this as a future separately authorized resource. Drafting assistance must not publish automatically; require human approval.
8. **Sharing and publication:** private sharing/download permissions and consent checks must be explicit and tested. Manual native social publishing is the current project policy. A future `SocialPublisherAdapter` may remain disabled behind an interface; Postiz is absent and must not be installed/configured by this handover.
9. **Suggested order:** approved requirements/route decisions → brand/localization/accessibility shell → auth and protected workspace → project/file schema and private media → configuration-driven Studio UI → durable job and credit contracts with chosen providers → results/version/export → Payload Knowledge Hub/editorial approval → consented gallery/manual publishing boundaries → Prana requirements and implementation only after scope approval → responsive, security, accessibility and end-to-end verification.

### Architecture risks and dependencies

- Auth, AI provider, billing provider, storage and exact Vercel/Neon projects are not selected or verified here. No cloud service was provisioned.
- Credits, retries, output privacy and async jobs require transactional and idempotent contracts before any real generation.
- Tool configuration is extensive and some prototype examples mismatch selected defaults. Preserve such evidence and ask for decisions rather than hard-coding visual contradictions.
- Six solution routes are broken; claims/prices/testimonials are not verified; assets and fonts require rights review.
- Screenshots cannot currently be exported durably by available browser tooling, and responsive requirements lack viewport evidence.
- Gallery consent, human editorial review and manual channel publication have high privacy/reputational impact and must be explicit before release.

## 6. Phase 01 exit and remaining limitations

**Documentation handover exit:** PASS WITH DOCUMENTED LIMITATIONS. The marketing comparison, all 17 tool configuration summaries, desktop workspace inventory, broken-route decisions, evidence classifications, unverified-functionality register and actionable architecture outline are recorded and cross-linked.

**UI-parity gate:** BLOCKED, not passed. Specific gaps: responsive viewport evidence at 1440/768/390 and touch behavior; durable screenshot files; owner decisions/content for six broken routes and conflicting CTAs; approved pricing/claims/assets/legal/auth choices; and all real backend behavior. No product source implementation was attempted.

**Owner inputs before implementation:** decide the six route/link outcomes and CTA destinations; approve claims/prices/entitlements/legal and contact handling; provide authorized asset library and rights; select/authorize auth, AI, billing and storage providers; confirm localization/theme acceptance and Prana scope; provide mobile/tablet screenshots if exact responsive parity is required. New cloud resources remain a later separately authorized task.

Phase 01 is closed as a reference/design handover only. Wait for owner approval and a scoped Phase 02 prompt before implementation. No push, deploy, payment, upload, cloud mutation or NRide access occurred in this closure task.
