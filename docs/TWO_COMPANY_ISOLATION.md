# Two independent companies: resource ownership and Codex boundary

## Account registry (verified identifiers only)

| Capability | NRide (Project 1) | Vastu Nord (Project 2) | Shared? |
|---|---|---|---|
| Business operator email (user-stated) | `nride@gmail.com` | `vastunord@gmail.com` | NO |
| Codex development login | Different, unspecified third account | Same developer account | LICENSE ONLY |
| Source Git repository | NRide-owned repo (verify remote) | Vastu Nord-owned repo (verify remote) | NO |
| Vercel account/team | NRide-only (verify team ID) | Vastu Nord-only (verify team ID) | NO |
| Vercel web project | NRide site | `vastunord-web` (proposed) | NO |
| Vercel CMS project | NRide Payload (existing status unknown) | `vastunord-cms` (proposed) | NO |
| Neon org/project/DB | NRide-only | Vastu Nord-only app and CMS DBs | NO |
| Payload credentials/content | NRide-only | Vastu Nord-only | NO |
| Object/media storage | NRide-only | Vastu Nord-only | NO |
| AI provider credentials/billing | NRide-only | Vastu Nord-only | NO |
| Social channel identities | NRide Pinterest/YouTube/Facebook/Instagram/X/LinkedIn | Vastu Nord separate six channel accounts | NO |
| Social scheduler | Native platform UIs manually | Native platform UIs manually | NO |
| Postiz | Not in active setup | Not in active setup | DEFERRED |
| Customer data, payment, consent, logs | Company-specific | Company-specific | NO |

**User-stated email labels do not prove the vendor's actual logged-in principal; verify in each provider dashboard.** The developer must never assume existing authorizations or silently invite an account into another company.

## Hard boundaries
- Separate repository roots and remote URLs; separate `.vercel/project.json` project/org IDs; separate environment variables and credentials. `.vercel`, `.env*`, cloud tokens and service account JSON must be ignored by Git.
- Separate Neon project databases and app users with least privilege; user tables, CMS tables, backups and object buckets never cross.
- Each company has distinct OAuth redirect URLs, service accounts, Google/Meta authorization applications and social channels.
- Separate branding and editorial spaces, asset libraries and publication logs. No cross-data insights or shared customer identity.
- Use separate Git repository-scoped credentials, and distinct browser profiles if both Vercel accounts are used on one computer. Verify context before any deployment or migration.
- `AGENTS.md` is instruction only. If 'no data should be accessible across companies' is a strict threat-model requirement, use separate operating-system users, cloud sandboxes or containers with scoped credentials, not merely two folders.

## Preflight before every material operation
1. Print/show *safe IDs only*: workdir, repo root, remote host/repository, branch, local Git author, intended app slug, relevant Vercel account scope/project and Neon project ID. Never print environment values.
2. Compare with this register and `docs/RESOURCE_ISOLATION.md`. If mismatch or unknown, STOP.
3. Before migrations, checkout/webhook activation, domain changes or social publication, seek explicit authorization and show target account.
4. On handoff, record checked account identifiers (no secrets), test results and completion state in Markdown.

## Codex identity is not a cloud credential
One Codex subscription can be used by the same developer in multiple independent local workspaces; usage allowance is shared. Codex Cloud tasks may require that the single GitHub identity connected to Codex has separately authorized access to each repository. Do not attach the NRide owner account to Vastu Nord or vice versa just to make a task work. For strict access separation, favor locally selected repository/workspace or appropriately isolated cloud environments, with explicit repository permissions. A ChatGPT/Codex Plus subscription does not include website inference API credits or hosting.
