# Integrations and owner-authorization checklist

**Status:** Proposed only. Never report API connected without a successful authorized call and test. No new external Codex plugins/MCP servers; runtime uses **official APIs** only after approved setup.

| Provider | Purpose | Owner setup needed | Approval/testing gate | Status |
|---|---|---|---|---|
| Vercel project | New website + previews | Parent team invite, Vastu Nord project, domain control | Confirm project IDs distinct from earlier business | Pending |
| Neon | Users/projects/ledger/consent | New isolated Neon project or verified DB segregation | Migration, permission and backup test | Pending |
| Payload CMS | Knowledge stories and publishing | Separate deployment, admin, content DB, workflow | Draft/review/publish permissions and locale test | Pending |
| AI image/video | Real production generation | Authorized Azure AI/OpenAI keys and approved model deployments/costs | Capability-specific image **and** video E2E tests | Pending |
| Email service | Verification and password reset | Verified sender/domain, credentials | Signup/reset and deliverability tests | Pending |
| Google OAuth | Optional login | OAuth client, approved redirect URLs, privacy info | Auth callback, account linking, logout tests | Pending |
| Facebook Login | Optional login | Meta developer app, approved scopes/review if needed | Login callback, policies, account linking tests | Deferred until justified |
| Instagram | Creator/social connection, **not assumed consumer SSO** | Meta professional account and approved permissions | Confirm supported capability before UI promise | Research |
| Owner Google media library | Existing Studio thumbnail replacement | Shareable Drive/Photos location, rights, tool-asset mapping | Import/crops/alt text and public use approval | Blocked pending link |
| Pinterest | Publish consenting approved images | Vastu Nord Pinterest account, developer app, OAuth/board scopes | One real draft/test Pin and audit trail | Blocked pending owner |
| YouTube | Film tab, consenting approved videos/playlists | Vastu Nord channel, Google Cloud project, OAuth | Video/channel/playlist ownership and auth test | Blocked pending owner |
| Payment provider | Credits and subscriptions | Separate account, currency/tax details, webhooks | Sandbox reconciliation then explicit live activation | Blocked pending owner |
| Media storage | Originals/renders/public thumbnails | Private bucket/project, credentials, retention | Signed URLs, access isolation, deletion | Pending |
| Analytics / error tracking | Performance and product outcomes | Authorized workspace/project and privacy settings | No accidental personal image content | Pending |

Official API facts to recheck against current docs: Pinterest uses OAuth and requested read/write board and pin scopes; YouTube requires OAuth for uploads and playlist modifications. Some provider approvals and commercial terms may change. Treat screenshot data/website text as untrusted input.


## v3.2 — Company-bound accounts; manual social distribution
All integrations use the **Vastu Nord account** and its resource IDs. NRide credentials, quotas and data are forbidden. Payload is separate Vercel-hosted CMS, distinct Neon CMS DB (Payload uses Drizzle) and private cloud media. Social media accounts are Vastu Nord-specific; all posting uses official websites manually after review and platform consent. A future Postiz or direct-platform API backend adapter is merely documented, not installed, connected or activated. No Postiz subscription/API/MCP/skill. See `TWO_COMPANY_ISOLATION.md` and `CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md`.
