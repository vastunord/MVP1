# Vastu Nord — current project handoff (living document)

**Status:** Phase 01 reference inventory in progress. Phase 01E-A comparison is documented for inspected routes; six linked design solution routes and mobile evidence remain open. No application implementation verified.
**Last updated:** 2026-11-21
**Active phase:** Phase 01 reference inventory (01E-A partial; await owner direction before resuming the remaining route inspection or starting another batch/phase).
**Working directory:** `C:\\Users\\VN\\Documents\\ChatGPT\\VastuNord` is the owner-designated Vastu Nord workspace. This task is on `phase-01-reference-inventory`; verified starting commit was `ce1498b002e2683a031ab1282b351be62ee922e2`; `origin` is `https://github.com/vastunord/MVP1.git`.
**Next safe task:** Wait for owner approval before starting another Phase 01 batch or Phase 02.

## Verified context
- Hosting preference: separate Vastu Nord project on Vercel.
- Database preference: separate Neon PostgreSQL project and Prisma.
- Editorial preference: Payload CMS with AI-assisted draft and human publication approval.
- Brand PDF supplied with this kit and previously visually reviewed across all 36 pages. Both marketing references were inspected in the Codex in-app browser at desktop; see `docs/MARKETING_REFERENCE_COMPARISON.md` and `docs/REFERENCE_EVIDENCE.md`.
- User photo/video outputs must start private, with per-asset/public/social consents.

## Current implementation status
| Area | Actual status | Evidence/URL | Next test |
|---|---|---|---|
| Marketing site | Desktop marketing routes compared; source unavailable and not required for greenfield; mobile/durable screenshots remain unverified | `docs/MARKETING_REFERENCE_COMPARISON.md` | Owner mobile captures and confirm open marketing/content questions |
| Existing Studio | All 17 tool editors inspected at empty-photo UI state | `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md` | Verify remaining mobile/marketing evidence; implementation belongs to a later approved phase |
| Auth + private projects | Unknown | No verified repo | Check code and auth config |
| Real image/video generation | Unknown | No verified API keys | Capability matrix, contract test |
| Neon, Payload, storage, jobs | Unknown | Owner preference only | Resource isolation and integration test |
| Public gallery and social publishing | Planned | New requirement | Consent and approval workflow tests |
| Billing and wallet | Planned/unknown | Prior prompt only | Transaction test |

## Decisions
- Owner-directed v3.3 greenfield scope has been documented; no new cloud access or integrations provisioned. See `docs/DECISIONS.md`.

## Blockers / owner requests
- The host-wide GitHub credential was initially rejected. Repository-local path-scoped authentication succeeded; GitHub visibly shows the pushed Vastu Nord commits and files on the public `main` branch. No global credentials were changed.
- Current inventory covers all 17 Studio editors at empty-photo state. Marketing comparison is documented in `docs/MARKETING_REFERENCE_COMPARISON.md`; mobile states and durable screenshots remain outstanding; backend behavior is unverified.
- Provide open-access Google image-library URL/ID, asset rights and mapping when phase 04 begins.
- Configure new Vastu Nord cloud resources only during their corresponding phases; former developers' Git/Vercel/Neon access is not required.

## Most recent tests
- No application tests run; this remains a planning/reference phase.
- Required root files confirmed present: `AGENTS.md`, `MASTER_CODEX_PROMPT.md`, `docs/PROJECT_STATE.md`, and `prompts/00-SAFE_WORKSPACE_AND_REFERENCES.md`.
- `.git` and `.gitignore` are absent, as expected before bootstrap; no remote, branch, author, stage, or commit exists. A filename-only scan found no likely credential/config filenames; no file contents or secrets were inspected.
- No `.vercel` project link or Vercel CLI was found. New cloud resource IDs are planned for later phases; no cloud resource was changed.
- The 36-page PDF was visually reviewed as a contact sheet; visible sections confirm VastuNord logo treatments/use examples, six palette swatches, and Zalando Sans Expanded typography. No hex values were sampled or inferred.
- All three public reference URLs loaded in the in-app browser. Marketing content is summarized in `docs/REFERENCE_EVIDENCE.md`; the Studio remained at user-context loading, so no tool inventory is claimed.
- Local isolation documents specify separate company resources and state Postiz is not part of the active stack; live account/resource configuration was not independently checked.

## Completed phases
- Phase 00 — greenfield workspace/reference review and repository bootstrap.

## Phase 00 findings (2026-11-21, greenfield reconciliation)
- Corrected the earlier interpretation: this is a new Vastu Nord project, so former developers' Git/Vercel/Neon resources are not required. The named workspace is unambiguous and separate from NRide.
- Confirmed no likely sensitive/config filenames. Initialized local Git on `main`, configured repo-local author identity, added the verified `origin`, and created root commit `ec5c2a7`. The GitHub page showed `vastunord/MVP1` owned by Vastu Nord and already Public/empty.
- Recorded observations for all three public URLs and visually reviewed all 36 pages of the brand PDF; see `docs/REFERENCE_EVIDENCE.md`.
- The repo-scoped push completed and the public GitHub page shows the commits and files. A subsequent read-only remote check hit temporary DNS resolution failure, but the visible remote page and local push reflog confirm success. Studio screenshot/recording if loading continues; Google library link/rights later in Phase 04.
- No deployment, paid service, cloud mutation, NRide access, or production change occurred.

## Phase 00 exit criterion
- Documentation/reference review, local commit, and push to the verified public Vastu Nord `origin` are complete. Phase 00 is complete. Do not begin Phase 01 until the owner approves.

## v3.2 authorized boundary — not provisioned
Two independent business resource stacks: NRide under `nride@gmail.com` and Vastu Nord under `vastunord@gmail.com`, subject to verification in each vendor dashboard. A third Codex account is used for software development only. Payload CMS retained on Vastu Nord's own Vercel cloud project; Postiz removed from current stack. Social publication is manual through separate Vastu Nord platform accounts, with distinct gallery/channel consents, editorial review and logged URLs. No new cloud resources or services have been created by this document. `docs/TWO_COMPANY_ISOLATION.md` and `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md` are authoritative.

## Phase 01 partial progress — 2026-11-21
- Active branch: phase-01-reference-inventory. UI-parity gate BLOCKED: 17 Studio library cards and one Room Reimagination desktop editor inspected; remaining tools, mobile views, saved screenshots and marketing comparison still required. See STUDIO_INVENTORY.md and REFERENCE_EVIDENCE.md.
- Owner input if access becomes unavailable: screenshots/recording of each Studio tool, its controls and results, plus desktop/mobile marketing and Studio views. Google asset library link and reuse rights remain pending.
- No application tests, production changes, uploads or generation. Phase 02 has not started.

## Phase 01E-A — marketing reference comparison — 2026-11-21
- Inspected the design prototype's public marketing, auth, four linked solution, and five article routes, and the development reference's six primary marketing routes at desktop. The design `/features` is a feature overview while developer `/features` is a living-room solution page; important CTA/footer destinations also conflict. Detailed route/page comparison, shared components, recommendations and owner questions are in `docs/MARKETING_REFERENCE_COMPARISON.md`.
- The brand PDF remains the visual identity authority. Existing 36-page review confirms logo treatments, six palette swatches and Zalando Sans Expanded; exact values were not sampled in this task. Marketing visual direction appears aligned at a qualitative level only.
- The in-app browser showed both home pages and Resources indexes, but exposed no durable project-local screenshot export; mobile was not inspectable with available browser controls. Six additional solution routes are linked but not inspected. No application code, NRide resources, external service, deployment or push was touched.
- The requested exhaustive marketing-route inspection remains PARTIAL because the six linked design solution routes listed in the comparison were not opened. Mobile evidence and durable screenshots are also unavailable. No application code, NRide resources, external service, deployment or push was touched.
- No application tests were run. `git diff --check`, trailing-whitespace and final-newline checks passed. Await owner direction before resuming the remaining route inspection or starting another batch/phase.
## Phase 01A progress — 2026-11-21
- Continued from `ccf8b06` on `phase-01-reference-inventory`; inspected the next four library tools in order: Virtual Home Staging, Outdoor Visualization, Hardscape Design, Furniture Refresh. Five of 17 tools now have editor-level observations including prior Room Reimagination.
- Updated the Studio inventory and reference evidence. No durable screenshot files; no upload, generation, destructive action, app source change, or NRide access.
- Remaining Phase 01 work: 12 tools, mobile layouts, marketing desktop/mobile comparison and durable screenshots. UI-parity gate remains blocked; Phase 02 has not started.
## Phase 01B progress — 2026-11-21
- Continued from `b488fb0` on `phase-01-reference-inventory`. Completed empty-photo editor inspections for Seasonal Styling, Visual Cleanup, Resolution Enhancement and Perspective Correction. Nine of 17 tools now have editor-level observations.
- Documented shared shell only once and added unique controls/modes, visible file requirements, empty-state actions and disabled states to `docs/STUDIO_INVENTORY.md`. Resolution Enhancement manual adjustments and Perspective Correction camera-angle choices were observed by switching local UI modes only.
- A browser screenshot of Perspective Correction was visually inspected; no durable screenshot file was available to save. No photo uploads, generation, paid actions, code changes, cloud changes, deployment, or NRide access occurred.
- Remaining Phase 01 work: eight tool editors, mobile layouts, durable screenshot captures and marketing comparison. UI-parity gate remains BLOCKED. No Phase 01C or Phase 02 work has started.


## Phase 01C progress — 2026-11-21
- Continued on `phase-01-reference-inventory` from `c317b99`. Inspected Decor Re-definition, Material Refinement, Lighting Reimagination and Garden Design entry pages and empty-photo editors. Thirteen of 17 Studio tools now have editor-level observations.
- Recorded tool-specific defaults, options, upload/reference inputs and disabled states. Garden Design’s touch-up mode was inspected by toggling the switch on, then restored to default off. No upload, generation, paid action, source-code change, deployment or NRide access occurred.
- A Garden Design browser screenshot was viewed but could not be saved as a durable project file. Four editors, mobile layouts, durable screenshot evidence and marketing comparison remain. Parity gate BLOCKED; Phase 01D and Phase 02 have not started.
## Phase 01D progress — 2026-11-21
- Continued on `phase-01-reference-inventory` from `830b014`. Inspected Spa & Pool Redesign, Sky Transformation, Seasonal Transformation and Object Placement entry pages/editors; all 17 of 17 Studio tools now have empty-photo editor observations.
- Added the final tool observations and created `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md` for all 17 tools. Dependent option states were revealed in Spa & Pool, Sky and Seasonal Transformation without uploads or generation. Two comparison/default mismatches are recorded for review.
- Screenshot views were captured in the browser but no durable screenshot file could be saved. No media upload, generation, paid action, source-code change, deployment, push or NRide access. Mobile and marketing parity evidence remain. UI-parity gate BLOCKED; Phase 01E and Phase 02 have not started.
