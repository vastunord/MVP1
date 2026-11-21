# Private media storage — Phase 02E resource status

The owner chose Vercel Blob and explicitly withdrew Google Drive. A Vastu Nord-owned development Blob store `vastunord-development-media` (`store_ejuJXLFGtH1tuh5b`) was created in `fra1` with **private** access. Vercel reports it available, empty (0 objects/0 bytes) and connected to zero projects. No token was printed, stored in Git or configured in the app; no file was uploaded. The Vastu Nord web project now exists and is Git-linked, but the store is not connected to it; dedicated app credential, signed-access and cross-user tests remain **BLOCKED**. Keep `MEDIA_UPLOADS_ENABLED=false`.

## Boundary

`apps/web/src/server/media.ts` is the server-side policy layer. It permits JPEG, PNG and WebP uploads up to 20 MiB; requires project edit access; allocates an unpredictable `private/{workspace}/{uuid}` key; creates a pending database record; and asks a private driver for a five-minute, path/type/size-scoped PUT URL. Completion checks owner, workspace, pending state, intent expiry, object MIME/size and file signature, then marks validated or quarantined. A one-minute GET URL and deletion require the same owner/workspace and validated state. Deletion revokes new signed URLs before removing bytes. Retention is modeled but no expiry worker exists; deletion failures need reconciliation before production use. Existing signed URLs can remain usable until expiry.

`apps/web/src/server/vercel-private-media.ts` implements the driver with Vercel private Blob signed tokens, object metadata/read and deletion. Its token stays server-side. `apps/web/src/server/prisma-media-repository.ts` implements project membership and metadata persistence. Neither is wired to a public upload route or used with live credentials in this phase. A real authentication session, rate limiting, file scanning/moderation, key cleanup, retry/idempotency handling, object-store account verification, audit writes and private-store tests are required before enabling uploads. Never accept actor IDs or object keys directly from a browser request.

Store private user originals and company demos separately in records; gallery delivery requires an approved public derivative and the checks in `docs/CONTENT_AND_CONSENT.md`. Pinterest and YouTube remain manual, distinct decisions. The disabled publisher interface performs no calls.

## Environment and owner action

Choose and verify a dedicated Vastu Nord private Blob store and Neon app project for each environment. Provide pooled runtime and direct migration URLs with separate roles, store ID and scoped server token to the correct Vercel environment. Confirm region, retention, backup and operating budget before enabling. No local Visuals files were uploaded. Tests use memory fixtures only; actual Blob signed operations and Neon queries are UNVERIFIED.
