# Private media storage — Phase 02E-3

Vastu Nord's existing private `vastunord-development-media` store (`store_ejuJXLFGtH1tuh5b`) is in Frankfurt and connected to `vastunord-web` Development using short-lived Vercel OIDC. The isolated CLI confirmed the connection. Google Drive is excluded. Uploads remain disabled unless `MEDIA_UPLOADS_ENABLED=true` is explicitly supplied in the relevant server environment; the live test enabled it only in the local Development process.

## Upload and access boundary

The shared Studio upload component associates an image with an owned project, previews local images, lists saved images and allows selection and deletion. The authenticated project-assets route validates the request origin, verified session, project access, MIME type, actual size and decoded image contents before accepting JPEG, PNG or WebP. The maximum is 4 MiB and the decoder rejects images over 16 million pixels or multiple pages. Server-side upload is used to fit the Vercel Functions request limit; larger direct uploads require a later reviewed design. `sharp` checks image structure but is not malware scanning or moderation.

The server stores a randomly named object with private access and creates workspace/owner/project metadata in Neon. No store credential goes to the browser. The download route verifies the owner and workspace before issuing a one-minute signed private URL; any existing signed URL may remain usable until expiry. Deletion first retires the record and then removes the object. A deletion failure can be retried by the owner. Public gallery and channel-specific consents remain separate; no automatic publication occurs.

If a normal upload operation fails, the service quarantines the record, removes the object and discards the pending record when cleanup succeeds. If cleanup fails, a quarantined record remains hidden for reconciliation. Process termination or a database/provider outage can interrupt compensation; no scheduled reconciliation worker or malware scanner exists yet, so orphan-free cleanup under every failure is **not verified**. Production enablement requires a reviewed reconciliation/retention process, scanning policy, usage limits and the restricted database role.

## Verified Development test

With uploads enabled only in a local Vastu Nord Development process, synthetic PNG tests passed private upload, metadata listing, signed owner retrieval, direct unauthenticated Blob denial, persistence after sign-out/sign-in, other-user listing/read/update/delete denial, invalid-image rejection, owner deletion and object unavailability afterward. Browser tests exercised device selection, private image rendering, reopening, deletion and drag-and-drop selection. Failure compensation and quarantine were tested with isolated fixtures, not by deliberately breaking the live provider. The generated blobs were deleted; retired synthetic metadata remains. The 727 demonstration renders were not uploaded.

Preview and Production database mappings remain unverified; deployment is blocked. They need independently verified database and private-store configuration before any approved deployment. The temporary development owner role must be replaced with a restricted runtime role before public launch.
