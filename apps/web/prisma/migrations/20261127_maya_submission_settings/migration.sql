-- Additive and nullable: existing jobs retain an explicit legacy state.
ALTER TABLE "RenderJob" ADD COLUMN "submissionSettings" JSONB;
