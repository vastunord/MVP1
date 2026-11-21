# Vastu Nord — current project handoff (living document)

**Status:** Phase 01 in progress. Greenfield planning kit and reference review are committed and pushed to the Vastu Nord-owned public repository; no application implementation verified.
**Last updated:** 2026-11-21
**Active phase:** Phase 01 reference inventory (01B complete; awaiting approval before Phase 01C).
**Working directory:** `C:\\Users\\VN\\Documents\\ChatGPT\\VastuNord` is the owner-designated Vastu Nord workspace. Local Git is initialized on `main`; `origin` is `https://github.com/vastunord/MVP1.git`.
**Next safe task:** Wait for owner approval before starting Phase 01.

## Verified context
- Hosting preference: separate Vastu Nord project on Vercel.
- Database preference: separate Neon PostgreSQL project and Prisma.
- Editorial preference: Payload CMS with AI-assisted draft and human publication approval.
- Brand PDF supplied with this kit and visually reviewed across all 36 pages. The three public reference URLs loaded in the Codex in-app browser; see `docs/REFERENCE_EVIDENCE.md`.
- User photo/video outputs must start private, with per-asset/public/social consents.

## Current implementation status
| Area | Actual status | Evidence/URL | Next test |
|---|---|---|---|
| Marketing site | Public reference pages observed; source unavailable and not required for greenfield | `docs/REFERENCE_EVIDENCE.md` | Capture detailed parity evidence in Phase 01 |
| Existing Studio | 17 tool cards observed; 9 tool editors inspected at empty-photo UI state | `docs/STUDIO_INVENTORY.md` | Inspect remaining eight tools and outstanding mobile/marketing evidence |
| Auth + private projects | Unknown | No verified repo | Check code and auth config |
| Real image/video generation | Unknown | No verified API keys | Capability matrix, contract test |
| Neon, Payload, storage, jobs | Unknown | Owner preference only | Resource isolation and integration test |
| Public gallery and social publishing | Planned | New requirement | Consent and approval workflow tests |
| Billing and wallet | Planned/unknown | Prior prompt only | Transaction test |

## Decisions
- Owner-directed v3.3 greenfield scope has been documented; no new cloud access or integrations provisioned. See `docs/DECISIONS.md`.

## Blockers / owner requests
- The host-wide GitHub credential was initially rejected. Repository-local path-scoped authentication succeeded; GitHub visibly shows the pushed Vastu Nord commits and files on the public `main` branch. No global credentials were changed.
- Studio's public `/app` remained on a “Getting things ready” user-context screen; provide a screenshot/recording if it cannot be inspected in a later pass.
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
- None.

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
## Phase 01A progress — 2026-11-21
- Continued from `ccf8b06` on `phase-01-reference-inventory`; inspected the next four library tools in order: Virtual Home Staging, Outdoor Visualization, Hardscape Design, Furniture Refresh. Five of 17 tools now have editor-level observations including prior Room Reimagination.
- Updated the Studio inventory and reference evidence. No durable screenshot files; no upload, generation, destructive action, app source change, or NRide access.
- Remaining Phase 01 work: 12 tools, mobile layouts, marketing desktop/mobile comparison and durable screenshots. UI-parity gate remains blocked; Phase 02 has not started.
## Phase 01B progress — 2026-11-21
- Continued from `b488fb0` on `phase-01-reference-inventory`. Completed empty-photo editor inspections for Seasonal Styling, Visual Cleanup, Resolution Enhancement and Perspective Correction. Nine of 17 tools now have editor-level observations.
- Documented shared shell only once and added unique controls/modes, visible file requirements, empty-state actions and disabled states to `docs/STUDIO_INVENTORY.md`. Resolution Enhancement manual adjustments and Perspective Correction camera-angle choices were observed by switching local UI modes only.
- A browser screenshot of Perspective Correction was visually inspected; no durable screenshot file was available to save. No photo uploads, generation, paid actions, code changes, cloud changes, deployment, or NRide access occurred.
- Remaining Phase 01 work: eight tool editors, mobile layouts, durable screenshot captures and marketing comparison. UI-parity gate remains BLOCKED. No Phase 01C or Phase 02 work has started.
