# Owner cloud setup walkthrough — brand-specific accounts only

The operator for this repository is `vastunord@gmail.com` (user-provided label; check each actual account). Do NOT sign into NRide or reuse its Vercel/Neon/Payload/social IDs. Use `docs/TWO_COMPANY_ISOLATION.md` and `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md`. Never put secrets in Git.

## 1. Git and Vercel
1. Choose the correct Vastu Nord GitHub remote and ensure a separate Codex project with only this repository open. If the Codex developer GitHub user lacks access, invite that identity to only the correct Vastu Nord repository with least privilege.
2. Sign in to Vastu Nord Vercel; create/link `vastunord-web` and `vastunord-cms` projects separately and record their IDs. Confirm there is no NRide project linked here.
3. Use distinct Vercel preview/production environment variables. Do not deploy or assign domains until source, authentication and access are tested.

## 2. Neon, private storage, Payload
1. Sign into Vastu Nord Neon, create independent app and CMS DBs with separate roles, isolated from NRide; do not point at NRide DATABASE_URL.
2. Configure private object storage and secure signed access for all source and generated media; public derivatives go to an explicitly separate public namespace.
3. Deploy Payload to Vastu Nord's Vercel account using its compatible official starter or an app in the same repo. Set CMS secret and CMS DB only in that Vercel project. Verify its own admin, drafts, roles, Norwegian/English language, and human publish approval.

## 3. Authentication and AI
1. Choose and configure password/verification/reset and actual email sender for Vastu Nord. Register Google OAuth callback URLs in Vastu Nord's Google Cloud app. Facebook sign-in is optional and requires its own Meta app and approved capabilities; Instagram isn't a generic consumer SSO solution.
2. Configure Vastu Nord-specific Azure AI Foundry/OpenAI credentials and allowed image/video deployments, queue, billing/rate limits and secret storage; API usage is separate from the Codex subscription.
3. Configure payment sandbox and explicit credit ledger before any live charges.

## 4. Image assets and manual social
1. Provide approved Google image library links/assets, licensing, ownership and Studio tool-to-image mapping. No unauthorized scraping/hotlinking.
2. Approve public-gallery, Pinterest, YouTube and additional social channel consent text separately; approve public display-name and watermarks.
3. Prepare company-owned Pinterest, YouTube, Facebook, Instagram, X and LinkedIn accounts with brand-specific authorizations. Publish manually via the native UIs; record approvals, links and statuses in Payload. Postiz is NOT used.
4. Do not claim social automation is integrated until a future authorized phase and provider adapter is tested.

## 5. Release verification
Verify production author/operator, Git repository, Vercel project, Neon DB, Payload deployment, OAuth callback hostname, storage bucket and social identity. Test registration, private asset isolation, AI generation, credits, published content, consent withdrawal and responsive/accessible UX. No production release without authorized approval.
