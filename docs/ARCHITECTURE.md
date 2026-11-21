# Vastu Nord — target isolated architecture (not yet deployed)

```mermaid
flowchart TB
 U[User] --> WEB[Vastu Nord Next.js web + Studio on Vastu Nord Vercel]
 WEB --> API[Authenticated app API]
 API --> APPDB[(Vastu Nord Neon app DB + Prisma)]
 API --> STORAGE[Private media storage with signed access]
 API --> W[Credit reservations + job queue]
 W --> WORK[Async rendering workers]
 WORK --> A[Approved image/video AI router]
 WORK --> STORAGE
 WORK --> APPDB
 API --> CMS[Payload CMS on Vastu Nord Vercel]
 CMS --> CMSDB[(Vastu Nord Neon CMS DB + Drizzle)]
 CMS --> CMSMEDIA[Cloud CMS media]
 STORAGE --> RIGHTS[Consent + editorial review]
 RIGHTS --> CMS
 CMS --> GAL[Approved Knowledge Hub + Public Gallery]
 GAL --> MANUAL[Manual platform-specific posting]
 MANUAL --> SOCIAL[Pinterest / YouTube / Facebook / Instagram / X / LinkedIn]
 CMS --> PRANA[Prana: Consultation / Quick Tips / Film]
 PRANA --> WEB
```

**Never connect to NRide resources.** Vastu Nord's public gallery consent does not authorize social publishing by itself. Per-channel opt-in, rights checking, human review, and derived watermarked media are required.

**Communication:** browser ↔ HTTPS/SSE via Vastu Nord backend; typed module calls and transactional Neon writes; durable queue for real image/video AI work; Payload's cloud API plus publication hooks for reviewed content; **manual** native-platform uploads and recording of published IDs/links in Payload for now. Payment webhooks must be verified and idempotent.

**Future social integration:** `SocialPublisherAdapter` is only an interface with disabled implementation; Postiz is neither connected nor billed at this stage.

**Data ownership:** app Neon owns users/projects/credits/consent; Payload CMS owns published editorial records in its own database; object storage owns media bytes; cloud providers own payment and social post state. No cross-company sync.
