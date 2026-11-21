# Vastu Nord — Cloud Payload CMS + MANUAL social publishing (v3.2)

**Status:** Setup runbook, not evidence that resources are configured. The owner wants NO locally hosted production components. Payload runs in Vastu Nord's Vercel cloud account. Postiz is NOT an active service or subscription.

## A. Vastu Nord cloud setup (owner actions, verified through provider dashboards)
1. Sign into Vercel using the Vastu Nord operator account. Verify exact account/team in dashboard. Create/link website project (`vastunord-web`) to the correct GitHub repo, preserving current developer and designer work.
2. In the Vastu Nord **separate** Vercel account/team, create a Payload CMS deployment (`vastunord-cms`) using an official compatible Next.js/Payload starter, or the existing repo's `/apps/cms`. Do NOT deploy over `vastunord-web`.
3. In the **Vastu Nord** Neon account create a dedicated CMS Postgres database (prefer isolated Neon project and separate role from operational app). Verify the app's ORM and Payload adapter (Prisma vs Payload's Drizzle) never migrate the same schema.
4. Configure cloud object storage for approved CMS media; app private originals live in an isolated private bucket. Configure CMS `PAYLOAD_SECRET` and database/storage connection strings in **Vastu Nord's Vercel environment settings**; secrets never go into Git.
5. Set up CMS collections: `Articles`, `Categories`, `KnowledgeStories`, `ApprovedGalleryEntries`, `MediaRights`, `EditorialReviews`, `SocialDrafts`, `SocialPublicationLog`. Drafts, revisions, roles, nb-NO/en, editorial human approval and publication/unpublication are required.
6. Test editor → draft → reviewer → publish with a **company-owned** sample; confirm no other company's records are visible.

## B. Manual social publishing — each platform uses a Vastu Nord-owned account
1. Create/verify the company's own Pinterest Business, YouTube channel, Facebook Page, Instagram professional account where appropriate, X and LinkedIn Page. These are separate from NRide's similarly named accounts. Record platform ID and operator role in the resource register (never password/token).
2. In Payload, create a draft per channel with its caption, localized copy, aspect ratio, thumbnail, alt text, rights/consent flags, target board/playlist/page, planned time, reviewer and source asset ID. The social calendar may begin as a filtered CMS list; no scheduling server needed.
3. For customer media, require BOTH public gallery consent and explicit consent for the exact destination platform, with actual image/video preview, attribution choice and user rights statement. For corporate content, require proof of rights and internal approval. Do not treat public-gallery consent as automatic cross-posting permission.
4. Human editor approves. Use only the approved watermarked public derivative (bottom-right user-selected public handle where applicable), with private EXIF/geo metadata removed.
5. Authorized human opens the brand's **native** Pinterest/YouTube/Facebook/Instagram/X/LinkedIn publishing UI and posts/schedules approved content using those platform's own controls. No plugin or Postiz account is used.
6. Copy the resulting post URL/ID into `SocialPublicationLog`; update draft status and metrics manually where needed. Record failures and retries.
7. On withdrawal: remove Vastu Nord gallery item promptly; open a removal task for each social channel and record status. Explain third-party reuse or caching limitations truthfully.

## C. Future integration — DISABLED BY DEFAULT
Define an optional interface only, such as:

```ts
interface SocialPublisherAdapter {
  createDraft(input: ApprovedPost): Promise<DraftReceipt>;
  schedule(input: ApprovedSchedule): Promise<PublishReceipt>;
  getStatus(externalId: string): Promise<PublishStatus>;
  remove(externalId: string): Promise<RemovalResult>;
}
```

No implementation may call live social APIs until the owner chooses direct platform APIs or a provider such as Postiz later, provides account-specific credentials and approves production access. Keep webhooks and adapter secrets out of the current active configuration.

## D. Human-approval check
`Draft AI/Editorial → Fact/rights checks → Human approval → Payload Knowledge Hub/Public Library → channel-specific consent → platform-specific approved derivative → human native upload → log published link → removal workflow.`

No local production hosting. A developer may use the local workspace to write and test code without operating a local CMS server in production.
