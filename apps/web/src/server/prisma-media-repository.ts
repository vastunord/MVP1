import "server-only";
import { withdrawDeletedAsset } from "./asset-consent.ts";
import type { PrismaClient } from "@/generated/prisma/client";
import type { Actor, MediaRepository } from "./media";

export function createPrismaMediaRepository(db: PrismaClient): MediaRepository {
  return {
    async canEditProject(actor: Actor, projectId) {
      const project = await db.project.findFirst({
        where: {
          id: projectId,
          workspaceId: actor.workspaceId,
          workspace: {
            memberships: {
              some: { userId: actor.userId, role: { in: ["OWNER", "MEMBER"] } },
            },
          },
        },
        select: { id: true },
      });
      return Boolean(project);
    },
    async findAsset(id) {
      const asset = await db.asset.findUnique({
        where: { id },
        include: { uploadIntent: true },
      });
      if (!asset) return null;
      return {
        id: asset.id,
        workspaceId: asset.workspaceId,
        ownerId: asset.ownerId,
        origin: asset.origin,
        state: asset.state,
        objectKey: asset.privateObjectKey,
        mimeType: asset.mimeType,
        byteSize: Number(asset.byteSize),
        uploadExpiresAt: asset.uploadIntent?.expiresAt,
        retentionUntil: asset.retentionUntil,
      };
    },
    async createPending({
      id,
      actor,
      projectId,
      objectKey,
      contentType,
      byteSize,
      expiresAt,
    }) {
      await db.$transaction(async (tx) => {
        const project = await tx.project.findFirst({
          where: {
            id: projectId,
            workspaceId: actor.workspaceId,
            workspace: {
              memberships: {
                some: {
                  userId: actor.userId,
                  role: { in: ["OWNER", "MEMBER"] },
                },
              },
            },
          },
          select: { id: true },
        });
        if (!project) throw new Error("Project access denied");
        await tx.asset.create({
          data: {
            id,
            workspaceId: actor.workspaceId,
            projectId,
            ownerId: actor.userId,
            origin: "USER",
            state: "PENDING",
            privateObjectKey: objectKey,
            mimeType: contentType,
            byteSize: BigInt(byteSize),
            uploadIntent: { create: { actorId: actor.userId, expiresAt } },
          },
        });
      });
    },
    async markValidated(id, metadata) {
      await db.asset.update({
        where: { id, state: "PENDING" },
        data: {
          state: "VALIDATED",
          mimeType: metadata.contentType,
          byteSize: BigInt(metadata.byteSize),
          uploadIntent: { update: { completedAt: new Date() } },
        },
      });
    },
    async markQuarantined(id) {
      await db.asset.updateMany({
        where: { id, state: { in: ["PENDING", "VALIDATED"] } },
        data: { state: "QUARANTINED" },
      });
    },
    async markDeleted(id) {
      await db.$transaction(async (tx) => {
        await tx.asset.update({
          where: { id, state: "VALIDATED" },
          data: { state: "DELETED" },
        });
        await withdrawDeletedAsset(tx, id);
      });
    },
    async discardPending(id) {
      await db.$transaction(async (tx) => {
        const asset = await tx.asset.findFirst({
          where: { id, state: { in: ["PENDING", "QUARANTINED"] } },
          select: { id: true },
        });
        if (!asset) return;
        await tx.uploadIntent.deleteMany({ where: { assetId: id } });
        await tx.asset.deleteMany({
          where: { id, state: { in: ["PENDING", "QUARANTINED"] } },
        });
      });
    },
  };
}
