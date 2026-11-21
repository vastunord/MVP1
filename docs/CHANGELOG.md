# Development change log (compact)

## 2026-11-21 — Planning kit prepared
- Added a new Codex master specification, phased prompts, permanent instructions and brand PDF.
- **No website code was changed; no deploy, paid API call or social publication was performed.**

Use one dated entry per meaningful implementation session: phase, relevant files, tests actually run, blockers and commit SHA. Don't copy full diffs or the entire prompt history.

### 2026-11-21 — v3.1 cloud-only publishing amendment
Kept original v3 architecture and phases; added authoritative cloud Payload/Postiz setup guide, updated phases 09 and 10 to use Vercel-hosted Payload and managed Postiz, reinforced separate consent and human approval. **No external account was created or connected by this documentation change.**


## 2026-11-21 — v3.2 two account isolation + manual social
Based on owner's latest direction: separate operator accounts, Vercel/Neon/Payload/media/social/resources for NRide and Vastu Nord, Codex separate development login. Retained cloud Payload; removed Postiz from active phase 10, environment, and setup; replaced with manual native platform workflow and disabled future interface. Revised phase 00/02/09/10, owner setup, consent, architecture, isolation and status. **Documentation/package only: no external account setup, deployment or data migration.**

### 2026-11-21 — Phase 00 workspace and reference preflight
Confirmed the required planning-kit files and reviewed the standing instructions, handoff, Phase 00 prompt, isolation/resource/source registers, and master scope. The workspace has no Git metadata, so remote, branch, and local author could not be verified; no `.vercel` link or Vercel CLI was found. The supplied brand PDF reports 36 pages, but its visuals were not reviewed. All three listed prototype URLs were inaccessible through the available browser lookup. Cloud resource IDs, owner library access, and social account identities remain unverified. Updated `docs/PROJECT_STATE.md` with blockers. **Phase 00 remains incomplete; no Phase 01 work, deployment, paid service, cloud mutation, or NRide access.** Tests: none (preflight only).

### 2026-11-21 — v3.3 greenfield Phase 00 reconciliation
Applied the owner clarification that prior developer repositories and hosting accounts are unavailable and not required. Confirmed the designated Vastu Nord workspace, expected absence of `.git`, no `.gitignore`, and no likely sensitive/config filenames from a filename-only scan. All three public URLs loaded in the in-app browser; accessible content and Studio's user-context loading state are recorded in `docs/REFERENCE_EVIDENCE.md`. Visually reviewed a contact sheet of all 36 brand PDF pages; confirmed logo treatments, six swatches, and Zalando Sans Expanded without sampling hex values. Updated project status, source and resource registers. **Phase 00 documentation/reference review done; full phase remains blocked awaiting the exact URL of the new PRIVATE Vastu Nord GitHub repo and authorization to link/push. No Phase 01 work, Git initialization, push, deployment, paid service, cloud mutation, or NRide access. Tests: none (planning/reference phase).**

### 2026-11-21 — Local repository bootstrap; push blocked by auth scope
Initialized the Vastu Nord workspace on local branch `main`, added a protective `.gitignore`, configured repo-local author identity, and committed the reviewed planning kit as `ec5c2a7` (`chore: initialize Vastu Nord greenfield project`). Verified in the Vastu Nord signed-in GitHub session that `vastunord/MVP1` is the correct owner, already Public, and empty. A push attempt was rejected because Git CLI authentication resolved to an account outside Vastu Nord; **no files were transferred**. No global credentials were changed, and no NRide resource was modified. Phase 00 remains blocked until Vastu Nord-scoped Git CLI auth is available.

### 2026-11-21 — Push retry blocked by network resolution
Enabled repository-local path-scoped Git authentication and retried the requested push. The Git client could not resolve `github.com`; no files were transferred and no upstream branch was created. The earlier host-wide credential attempt was rejected because it resolved outside Vastu Nord. No account switching or global credential changes were made. Phase 00 remains blocked until Vastu Nord-scoped Git CLI authentication and network/DNS access are available.

### 2026-11-21 — Phase 00 push verified and completed
Correction to the earlier push-blocked notes: after enabling repository-local path-scoped Git authentication, the push succeeded. The public GitHub page verifies the Vastu Nord `main` branch, the planning-kit files, and commits `ec5c2a7` and `faabaad`. The host-wide credential attempt was rejected; no global credentials were changed. The later DNS error came from a read-only remote query after the successful push. Phase 00 is complete; Phase 01 has not started and awaits owner approval.
