-- Additive, inert until a campaign and explicit tester are provisioned.
CREATE TABLE "TestRenderCampaign" (
  "id" TEXT PRIMARY KEY,
  "model" TEXT NOT NULL CHECK ("model" = 'v4.5-fast'),
  "active" BOOLEAN NOT NULL DEFAULT FALSE,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "maxAttempts" INTEGER NOT NULL CHECK ("maxAttempts" BETWEEN 1 AND 6),
  "maxMicrousd" INTEGER NOT NULL CHECK ("maxMicrousd" BETWEEN 1 AND 594000),
  "perAttemptMicrousd" INTEGER NOT NULL CHECK ("perAttemptMicrousd" BETWEEN 1 AND 99000),
  CHECK ("expiresAt" > "startsAt")
);
CREATE TABLE "TestRenderTester" (
  "campaignId" TEXT NOT NULL REFERENCES "TestRenderCampaign"("id"),
  "userId" TEXT NOT NULL,
  "maxAttempts" INTEGER NOT NULL CHECK ("maxAttempts" BETWEEN 1 AND 6),
  "maxMicrousd" INTEGER NOT NULL CHECK ("maxMicrousd" BETWEEN 1 AND 594000),
  PRIMARY KEY ("campaignId", "userId")
);
CREATE TABLE "TestRenderAttempt" (
  "id" TEXT PRIMARY KEY,
  "campaignId" TEXT NOT NULL REFERENCES "TestRenderCampaign"("id"),
  "userId" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "reservedMicrousd" INTEGER NOT NULL CHECK ("reservedMicrousd" BETWEEN 1 AND 99000),
  "settledMicrousd" INTEGER CHECK ("settledMicrousd" BETWEEN 0 AND 99000),
  "state" TEXT NOT NULL DEFAULT 'RESERVED' CHECK ("state" IN ('RESERVED', 'SETTLED', 'REFUNDED', 'UNCERTAIN')),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "TestRenderAttempt_campaignId_userId_idx" ON "TestRenderAttempt"("campaignId", "userId");
