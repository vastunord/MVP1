# PHASE 03 — Scaffold NEW Next.js app, cloud accounts and private foundation

**Effort: MEDIUM.** This repo starts with **planning Markdown, not inherited website code**.

Read AGENTS, PROJECT_STATE, architectural ADRs, GITHUB_VERCEL_BOOTSTRAP, RESOURCE_ISOLATION and this prompt. Verify remote and workdir belong to Vastu Nord; NRide remains untouched.

1. Create fresh runnable Next.js + TypeScript source in the approved folder (`apps/web` if monorepo). Preserve current docs/prompts/brand PDF, never overwrite them. Install only necessary app dependencies; do not install external Codex plugins.
2. Add project scripts, lint/typecheck/unit tests, `.gitignore`, `.env.example` with NAMES ONLY, CI on the Vastu Nord GitHub repo, error and loading templates. Achieve a clean development build.
3. Guide the owner step-by-step to import this NEW repo into a NEW Vastu Nord Vercel project (`vastunord-web`) after the build works; use preview deployments first, with explicit owner authorization. Do NOT link original `vastunord.vercel.app` or designer's prototype deployment; do not alter NRide Vercel scope.
4. Guide the owner to create Vastu Nord Neon app DB + separate app role; apply minimal migrations for users, projects, permissions and assets; add private media bucket and signed access, upload validation/EXIF treatment, access controls. Later Phase 09 deploys distinct Payload CMS Vercel/Neon resources.
5. Implement email/password signup, verification/reset, Google OAuth adapter where owner supplies authorized OAuth settings; document missing credentials and test fixtures. Server-enforced project ownership, signed URLs, safe deletes/retention and authorization tests.
6. Demonstrate the first **real persistent vertical slice** after resources are available: signup → create project → upload private image → reopen project; do not claim it works if Neon/storage/OAuth not configured.

Update PROJECT_STATE, CHANGELOG, DATA_AND_API_CONTRACTS, INTEGRATIONS_AND_ACCESS, SETUP_WALKTHROUGH and QUALITY_GATES. Commit to a safe branch; deploy only after owner approval.

**Exit:** fresh source repo builds, tests pass; cloud links and private user persistence verified or precisely BLOCKED with safe independent pieces completed.
