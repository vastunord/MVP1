import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import type { ProjectStore } from "./projects";

export function prismaProjectStore(db: PrismaClient): ProjectStore {
  return {
    workspaceFor(userId) {
      return db.workspace.findUnique({
        where: { personalOwnerId: userId },
        select: { id: true, name: true, personalOwnerId: true },
      });
    },
    async createWorkspace(userId, name) {
      return db.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true, emailVerified: true },
        });
        if (!user?.emailVerified) throw new Error("Verified account required");
        const row = await tx.workspace.create({
          data: {
            name,
            personalOwnerId: userId,
            memberships: { create: { userId, role: "OWNER" } },
          },
        });
        return { id: row.id, name: row.name, personalOwnerId: userId };
      });
    },
    list(workspaceId, archived) {
      return db.project.findMany({
        where: {
          workspaceId,
          deletedAt: null,
          archivedAt: archived ? { not: null } : null,
        },
        orderBy: { updatedAt: "desc" },
        take: 100,
      });
    },
    find(workspaceId, id) {
      return db.project.findUnique({
        where: { id_workspaceId: { id, workspaceId } },
      });
    },
    findByKey(workspaceId, key) {
      return db.project.findUnique({
        where: { workspaceId_creationKey: { workspaceId, creationKey: key } },
      });
    },
    create(workspaceId, name, detail, key) {
      return db.project.create({
        data: { workspaceId, name, description: detail, creationKey: key },
      });
    },
    update(workspaceId, id, values) {
      return db.project.update({
        where: { id_workspaceId: { id, workspaceId } },
        data: values,
      });
    },
  };
}
