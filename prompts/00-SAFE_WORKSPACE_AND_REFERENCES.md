# PHASE 00 — Correct previous preflight and bootstrap NEW Vastu Nord Git repository

**Recommended effort: LOW.** No frontend code or production deployment in this phase.

## Known change: do not repeat old blocked checks
Owner has explicitly confirmed **no original developer GitHub/Vercel/source access**. The three URLs are reference-only. The owner already ran a preflight and has `docs/PROJECT_STATE.md` and `docs/CHANGELOG.md` containing verified planning-file/36-page PDF findings. Do NOT overwrite or redo those findings.

Read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md`, `docs/GREENFIELD_OVERRIDE.md`, `docs/PHASE00_STATE_RECONCILIATION.md`, `docs/GITHUB_VERCEL_BOOTSTRAP.md`, `docs/RESOURCE_ISOLATION.md`, `docs/SOURCE_REGISTER.md`; consult the brand PDF visually, and master prompt once.

### A. Safe workspace
- Confirm actual `Get-Location`/pwd is owner’s **VastuNord** folder, not NRide. Verify expected files and lack of Git metadata (NORMAL before bootstrap), existing branch/remote if any, current `.gitignore`, sensitive files. Never read unrelated projects/secrets. Record safe IDs only.
- Confirm business identity to be used for new GitHub/Vercel resources is Vastu Nord (`vastunord@gmail.com`) and Codex developer account is separate; do not change global login.
- Record the old Git/Vercel/source-account checks as **N/A — not owned**, not as perpetual blockers.

### B. New repository setup
- Owner creates an empty PRIVATE GitHub repo from Vastu Nord GitHub account; suggest `vastunord-platform`, but use actual owner-provided remote URL. Ask only for the URL if absent.
- If authorized and no `.git`, create `.gitignore`, `git init -b main`, set local-only Git author when needed, stage only reviewed files with no secrets, commit. Never replace existing Git metadata, use global config, force push or access NRide repo.
- Only after owner confirms the exact remote, set/verify `origin`. Push only with user authorization and correctly scoped Vastu Nord GitHub authentication. Record sanitized remote/branch and result. If repo creation is pending, continue documentation and report precise owner action; don't fake PASS.

### C. References and brand
- Attempt native read-only browser/screenshots for all three public URLs; record success/failure and capture plan in `docs/REFERENCE_EVIDENCE.md`. NO requirement for original source access.
- Inspect brand PDF visually when native tools are available; verify 36 pages, required logo/palette/type guidance; record what was seen and what needs a rendered image. Do not invent design details.
- Record Google media library as owner-supplied later; social account IDs and Vercel/Neon/Payload resources need not exist yet.

### D. Documentation and gate
- UPDATE existing `docs/PROJECT_STATE.md` and `docs/CHANGELOG.md` in place; record source-access correction, active phase, verified Git root/remote/branch, screenshots access, brand review, tests=N/A (planning-only), next owner action. Update `docs/SOURCE_REGISTER.md` and `docs/RESOURCE_ISOLATION.md` where facts are verified.
- **PASS** when Vastu Nord workspace and new repo are unambiguously established, safe commit/remote is verified if authorized, URL access/capture plan and brand review status recorded, and NRide unchanged.
- **BLOCKED** only for truly missing new Vastu Nord repo URL/auth or critical inability to confirm safe workdir; never for lack of former teams' Git/Vercel access.
- Do NOT start Phase 01, create Vercel/Neon services, or deploy. Report: DONE / VERIFIED / OWNER ACTION / BLOCKED / NEXT.
