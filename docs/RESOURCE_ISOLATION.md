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

## Phase 00 GitHub bootstrap result (2026-11-21)
- Verified in the signed-in Vastu Nord GitHub session: `vastunord/MVP1` is owned by Vastu Nord and Public. It was empty before upload; local `origin` matches `https://github.com/vastunord/MVP1.git`.
- Local branch `main` has the reviewed planning-kit commits. The first push attempt using the host-wide credential was rejected; repository-local path-scoped authentication then pushed the commits successfully. The public GitHub page now shows commit `faabaad` and the repository files. A later read-only remote query encountered DNS failure after the push was already visible.
- Global credentials were not changed; no NRide resource was modified.