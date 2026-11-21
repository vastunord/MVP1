# Vastu Nord resources — NEW ACCOUNT provision register

**Vastu Nord operator identity:** `vastunord@gmail.com` (owner statement; verify each vendor login). NRide uses `nride@gmail.com` and MUST NOT be accessed. Codex development subscription belongs to a different account.

| Resource | Current planned state | Verified identifier (never secret) | Gate |
|---|---|---|---|
| New GitHub private repo | Owner to create as PRIVATE; suggested `vastunord-platform` | URL not supplied | Phase 00 bootstrap |
| Git local project root | `C:\Users\VN\Documents\ChatGPT\VastuNord` confirmed; `.git` absent pending bootstrap | No remote/branch yet | Phase 00 |
| Vercel web project | NEW, under Vastu Nord account | UNKNOWN | Phase 03+ after source builds |
| Vercel Payload CMS project | NEW, separate app deployment | UNKNOWN | Phase 09 |
| Vastu Nord Neon application DB | NEW project/database/user | UNKNOWN | Phase 03 |
| Vastu Nord Neon Payload CMS DB | NEW DB/user isolated from app | UNKNOWN | Phase 09 |
| Media storage | NEW private/public namespaces | UNKNOWN | Phase 03/08 |
| Azure/OpenAI runtime services | NEW authorized business-owned API deployment | UNKNOWN | Phase 06 |
| Google/email/Meta OAuth | NEW business-owned apps if enabled | UNKNOWN | Phase 03+ |
| Payment provider | NEW sandbox first | UNKNOWN | Phase 07 |
| Vastu Nord Pinterest/YouTube/Facebook/Instagram/X/LinkedIn | Business-owned channels | UNKNOWN | Phase 10; manual posting |
| Postiz | NOT ACTIVE, NOT REQUIRED | N/A | Future optional adapter only |
| Original teams' GitHub/Vercel | **NO ACCESS / OUT OF SCOPE** | N/A | Not a blocker; never request or modify |

**Important:** The old `vastunord.vercel.app` and `vastu-nord-design-prototype.vercel.app` deployments remain references, NOT new project domains. Do not try to import/claim or redeploy to their accounts. Establish a new domain/project URL under the Vastu Nord-owned Vercel account and authorize domain mapping only with confirmed control.

For any cloud/API change: confirm current account, project ID, target environment and cost/irreversibility first. Secrets remain outside Git; `.vercel/` and `.env*` ignored. Avoid changing shared/global CLI credentials or NRide accounts.

## Phase 00 workspace and repository check (2026-11-21)
- The owner-designated Vastu Nord folder is the current directory; it contains the project planning kit and is separate from NRide.
- `.git` was absent before bootstrap; local Git is now initialized on `main`. `.gitignore` excludes environment files, Vercel config, build output, logs, and credential/key files. A filename-only scan found no likely sensitive/config filenames.
- Verified in the signed-in Vastu Nord GitHub session: `vastunord/MVP1` is owned by Vastu Nord, already Public, and empty before upload. Local `origin` matches `https://github.com/vastunord/MVP1.git`.
- Local root commit `ec5c2a7` contains the reviewed planning kit and brand PDF. Push was denied because Git CLI authentication resolved outside Vastu Nord; no files were transferred. Do not switch accounts implicitly. Retry after Vastu Nord-scoped CLI authentication is available.
- Original development/design teams' GitHub and Vercel projects are reference-only and not required. New Vercel, Neon, media, OAuth, AI, payment, and social resources remain planned for later phases; no IDs or credentials were created or changed.

## GitHub bootstrap result (2026-11-21)
- Verified in the signed-in Vastu Nord GitHub session: `vastunord/MVP1` is owned by Vastu Nord, already Public, and empty before upload. Local `origin` matches `https://github.com/vastunord/MVP1.git`.
- Local branch `main` has root commit `ec5c2a7` containing the reviewed planning kit and `.gitignore`.
- Push was rejected by GitHub because the Git CLI credential resolved to an account outside Vastu Nord. No files were transferred. Do not switch accounts implicitly; retry after Vastu Nord-scoped Git CLI authentication is configured.
