-- Executed as the application object owner after verifying the six migration checksums.
-- Campaign administration and migration history are outside the web runtime.
GRANT SELECT, INSERT, UPDATE ON "User", "Account" TO vastunord_prod_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Session", "Verification", "RateLimit" TO vastunord_prod_runtime;
GRANT SELECT, INSERT ON "Workspace", "Membership", "Project" TO vastunord_prod_runtime;
GRANT UPDATE ("name","description","updatedAt","archivedAt","deletedAt") ON "Project" TO vastunord_prod_runtime;
GRANT SELECT, INSERT, DELETE ON "Asset", "UploadIntent" TO vastunord_prod_runtime;
GRANT UPDATE ("state","mimeType","byteSize") ON "Asset" TO vastunord_prod_runtime;
GRANT UPDATE ("completedAt") ON "UploadIntent" TO vastunord_prod_runtime;
GRANT SELECT, INSERT ON "AssetVersion", "ConsentGrant", "AuditEvent", "RenderJob" TO vastunord_prod_runtime;
GRANT UPDATE ("state","revokedAt") ON "ConsentGrant" TO vastunord_prod_runtime;
GRANT SELECT ON "EditorialReview", "GalleryItem" TO vastunord_prod_runtime;
GRANT UPDATE ("state","reviewedAt") ON "EditorialReview" TO vastunord_prod_runtime;
GRANT UPDATE ("state") ON "GalleryItem" TO vastunord_prod_runtime;
GRANT UPDATE ("providerJobId","state","chargedUsd","refundedUsd","updatedAt") ON "RenderJob" TO vastunord_prod_runtime;
GRANT SELECT ON "TestRenderCampaign", "TestRenderTester", "TestRenderAttempt" TO vastunord_prod_runtime;
-- The reservation transaction locks one campaign row with SELECT FOR UPDATE.
GRANT UPDATE ("id") ON "TestRenderCampaign" TO vastunord_prod_runtime;
GRANT INSERT ("id","campaignId","userId","requestHash","reservedMicrousd","createdAt","state"),
      UPDATE ("state","settledMicrousd") ON "TestRenderAttempt" TO vastunord_prod_runtime;
