-- Preserve existing jobs. New columns describe a single idempotent MNML request.
ALTER TABLE "RenderJob"
    ADD COLUMN "sourceAssetId" TEXT,
    ADD COLUMN "outputAssetId" TEXT,
    ADD COLUMN "outputMedia" TEXT NOT NULL DEFAULT 'image',
    ADD COLUMN "requestHash" TEXT,
    ADD COLUMN "providerJobId" TEXT,
    ADD COLUMN "chargedUsd" DECIMAL(10,6),
    ADD COLUMN "refundedUsd" DECIMAL(10,6);

CREATE UNIQUE INDEX "RenderJob_providerJobId_key" ON "RenderJob"("providerJobId");
