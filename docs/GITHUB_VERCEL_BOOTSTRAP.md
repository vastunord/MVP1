# Step-by-step: new GitHub → Codex → Vercel (Vastu Nord only)

This is the **new-account procedure**, not a request to regain access to the designers' or developers' original hosting. It leaves NRide completely unchanged.

## A. Manual owner action: GitHub first
1. Use a dedicated browser profile if necessary to avoid mixing `nride@gmail.com` and `vastunord@gmail.com` accounts.
2. Visit https://github.com/new while signed into the **Vastu Nord-owned** GitHub user or organization.
3. Repo name: `vastunord-platform` (suggestion). Visibility **Private**. Do not initialize a README/license/.gitignore: local planning files exist.
4. Record the newly created *real* remote URL in `docs/RESOURCE_ISOLATION.md` (URL only, never credentials).
5. Make the Codex developer identity a properly authorized collaborator **only if needed**; use least privilege and repository-specific permissions. The Codex subscription does not itself grant access to the business GitHub account.

## B. Codex local workspace safety
1. Open `C:\Users\VN\Documents\ChatGPT\VastuNord` as its **own** Codex project.
2. Inspect the directory, `Get-Location`, `Test-Path .git`, `git status`, `.gitignore`, and `git remote -v` where applicable. Missing `.git` is *normal* before first initialization.
3. Inspect for `.env*`, credentials, private account data, and `.vercel/` before Git staging. Use a safe `.gitignore` including `.env*` (with a deliberate exception for `.env.example`), `.vercel/`, `node_modules/`, `.next/`, `dist/`, logs and temporary output. Do not include secrets or private user photos in commits.
4. Never run `git config --global` or change the global GitHub/Vercel login. If needed, set author identity **inside this repository only** after verifying it is authorized.
5. Commands below are a template, not instructions to blindly paste without inspecting state. Work in PowerShell from the verified VastuNord folder:

```powershell
Get-Location
git status
# If no .git exists, and the owner explicitly authorizes bootstrapping:
git init -b main
# Ensure .gitignore excludes credentials and generated files before adding.
git add AGENTS.md MASTER_CODEX_PROMPT.md START_HERE.md docs prompts references assets/brand .gitignore
# Inspect staged file names and secret scan before committing:
git diff --cached --name-only
git diff --cached --check
git commit -m "chore: initialize Vastu Nord greenfield project"
# Add only the exact new Vastu Nord PRIVATE repository URL supplied by the owner:
git remote add origin https://github.com/ACTUAL_VASTUNORD_OWNER/vastunord-platform.git
git remote -v
# After owner confirms correct remote and authorized GitHub authentication:
git push -u origin main
```

If repo or remote already exists, stop and reconcile it instead of re-initializing/replacing. If GitHub authentication fails, ask the owner to sign in to the correct account; don't access NRide credentials or put tokens in a prompt.

## C. Scaffold application — later Phase 03, NOT Phase 00
After UI references and architecture, create fresh Next.js/TypeScript code in the chosen repo. Suggested single repo structure:

```text
vastunord-platform/
  AGENTS.md
  MASTER_CODEX_PROMPT.md
  docs/
  prompts/
  assets/brand/
  apps/
    web/       # Next.js marketing + authenticated Studio
    cms/       # Payload admin/API, cloud deployed separately
  packages/
    ui/        # reusable brand components, when justified
```

This is a recommendation, not a mandatory heavy monorepo. Codex should choose simplest tested arrangement and record architecture decision.

## D. Manual owner action: NEW Vercel project (when web builds)
1. Sign into the **Vastu Nord-owned** Vercel account, not the old `vastunord.vercel.app` project. That original URL remains owned by the former team unless transferred.
2. Choose **Add New → Project → Import Git Repository**. Authorize only Vastu Nord's GitHub repo.
3. Name new project `vastunord-web` (if available), root `apps/web` if monorepo chosen, Next.js preset. Configure cloud secrets only in the Vercel project dashboard; don't commit them.
4. Deploy to a *new* Vercel-assigned preview/production URL. Never assert that the new deployment owns `vastunord.vercel.app` or the original design-prototype URLs.
5. When Payload code is ready, create a **separate Vercel project** from the same repository, root `apps/cms`, with its own secret/environment scope and a dedicated Vastu Nord Neon CMS DB. Do not put Payload CMS secrets in frontend `NEXT_PUBLIC_` variables.
6. Map a Vastu Nord-owned custom domain only after owner control of DNS is verified and written authorization is given. Ensure preview/staging pass access and quality gates first.

Vercel official instructions: https://vercel.com/docs/git and https://vercel.com/docs/projects/managing-projects. Vercel automatically builds on connected branch pushes, so pay attention to environment scope.

## E. Neon/Payload (later phase)
- Under Vastu Nord account, create app database for accounts/projects/credits/consent and distinct CMS database for Payload. Dedicated credentials, migrations, roles, backup and restore.
- Cloud persistent object storage for private originals and generated media; separate access/public derivatives.
- Deploy Payload to Vercel; admin users, review roles, drafts, publishing workflows and `nb-NO`/`en` content. Do not assume Payload is a hosted SaaS account merely because it is cloud deployed.

## F. Verification gate
Before any deployment or migration, record sanitized GitHub repo URL, Vercel account/team and project IDs, and Neon project ID. If identity is uncertain, STOP, ask, and continue only independent coding work.
