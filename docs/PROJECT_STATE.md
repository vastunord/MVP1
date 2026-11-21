# Vastu Nord — current project handoff (living document)

**Status:** Phase 00 documentation/reference review done; BLOCKED pending the new private GitHub URL and authorization to link/push. Greenfield planning kit only; no application implementation verified.
**Last updated:** 2026-11-21
**Active phase:** 00 — Greenfield workspace and repository bootstrap (incomplete).
**Working directory:** `C:\\Users\\VN\\Documents\\ChatGPT\\VastuNord` is the owner-designated Vastu Nord workspace. `.git` and `.gitignore` are absent, as expected before bootstrap.
**Next safe task:** Owner creates a new PRIVATE Vastu Nord GitHub repository (suggested `vastunord-platform`), provides its exact URL, and authorizes linking/push; verify the destination is not NRide.

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
| Existing Studio | Opens to user-context loading screen; tool inventory not yet visible | `docs/REFERENCE_EVIDENCE.md` | Revisit; request screenshots/recording if loading persists |
| Auth + private projects | Unknown | No verified repo | Check code and auth config |
| Real image/video generation | Unknown | No verified API keys | Capability matrix, contract test |
| Neon, Payload, storage, jobs | Unknown | Owner preference only | Resource isolation and integration test |
| Public gallery and social publishing | Planned | New requirement | Consent and approval workflow tests |
| Billing and wallet | Planned/unknown | Prior prompt only | Transaction test |

## Decisions
- Owner-directed v3.3 greenfield scope has been documented; no new cloud access or integrations provisioned. See `docs/DECISIONS.md`.

## Blockers / owner requests
- Create a new PRIVATE repository under the Vastu Nord-owned GitHub account and provide its exact remote URL; authorize connecting/pushing only after confirming the destination.
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
- Confirmed `.git` and `.gitignore` are absent and no likely sensitive/config filenames are present. Bootstrap and remote verification remain pending because the owner has not supplied the new private repository URL or authorized linking/push.
- Recorded observations for all three public URLs and visually reviewed all 36 pages of the brand PDF; see `docs/REFERENCE_EVIDENCE.md`.
- Owner inputs: exact URL of a new Vastu Nord PRIVATE GitHub repo and authorization to connect/push; Studio screenshot/recording if its loading state continues; Google library link/rights later in Phase 04.
- No deployment, paid service, cloud mutation, NRide access, or production change occurred.

## Phase 00 exit criterion
- Documentation/reference review is complete. Overall Phase 00 remains blocked until the owner supplies the exact new PRIVATE GitHub remote and authorizes connecting/pushing; verify it is not NRide and record safe bootstrap. Do not begin Phase 01 until Phase 00 is complete and the owner approves.

## v3.2 authorized boundary — not provisioned
Two independent business resource stacks: NRide under `nride@gmail.com` and Vastu Nord under `vastunord@gmail.com`, subject to verification in each vendor dashboard. A third Codex account is used for software development only. Payload CMS retained on Vastu Nord's own Vercel cloud project; Postiz removed from current stack. Social publication is manual through separate Vastu Nord platform accounts, with distinct gallery/channel consents, editorial review and logged URLs. No new cloud resources or services have been created by this document. `docs/TWO_COMPANY_ISOLATION.md` and `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md` are authoritative.
