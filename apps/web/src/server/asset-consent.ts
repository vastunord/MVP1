import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  permittedChannels,
  publicationChannels,
  sharingPolicy,
  type PublicationChannel,
  type SharingVersion,
} from "../lib/publication-consent.ts";
import { ProjectError } from "./projects.ts";

type Access = Pick<Prisma.TransactionClient, "asset">;
const unavailable = () => new ProjectError(404, "Asset unavailable");

async function owned(db: Access, userId: string, assetId: string) {
  const result = await db.asset.findFirst({
    where: {
      id: assetId,
      ownerId: userId,
      origin: "USER",
      projectId: { not: null },
      workspace: { memberships: { some: { userId } } },
    },
    select: {
      id: true,
      workspaceId: true,
      state: true,
      mimeType: true,
      privateObjectKey: true,
      byteSize: true,
      sha256: true,
      createdAt: true,
      project: { select: { archivedAt: true, deletedAt: true } },
      versions: {
        orderBy: { version: "desc" },
        select: {
          id: true,
          version: true,
          privateObjectKey: true,
          mimeType: true,
          createdAt: true,
          consents: {
            where: { state: "GRANTED", userId },
            select: { channel: true },
          },
        },
      },
    },
  });
  if (!result) throw unavailable();
  return result;
}
type OwnedAsset = Awaited<ReturnType<typeof owned>>;

function versions(asset: OwnedAsset): SharingVersion[] {
  const eligible =
    asset.state === "VALIDATED" &&
    !!asset.project &&
    !asset.project.deletedAt &&
    !asset.project.archivedAt;
  const entries = asset.versions
    .map((v) => ({
      id: v.id,
      version: v.version,
      current: eligible && v.privateObjectKey === asset.privateObjectKey,
      createdAt: v.createdAt.toISOString(),
      mimeType: v.mimeType,
      grants: [...new Set(v.consents.map((c) => c.channel))],
    }))
    .filter((v) => v.current || v.grants.length);
  // Older uploads have only Asset metadata. A GET never writes a new version.
  if (eligible && !entries.some((v) => v.current)) {
    const version = (asset.versions[0]?.version ?? 0) + 1;
    entries.unshift({
      id: `v${version}-${asset.id}`,
      version,
      current: true,
      mimeType: asset.mimeType,
      createdAt: asset.createdAt.toISOString(),
      grants: [],
    });
  }
  return entries;
}

export async function assetSharing(
  db: Access,
  userId: string,
  assetId: string,
) {
  return versions(await owned(db, userId, assetId));
}

export function consentChange(input: Record<string, unknown>) {
  if (
    typeof input.versionId !== "string" ||
    !input.versionId ||
    input.versionId.length > 200 ||
    !publicationChannels.includes(input.channel as PublicationChannel) ||
    typeof input.grant !== "boolean" ||
    input.policy !== sharingPolicy
  ) {
    throw new ProjectError(400, "Invalid publication permission");
  }
  return {
    versionId: input.versionId,
    channel: input.channel as PublicationChannel,
    grant: input.grant,
  };
}

export async function changeAssetSharing(
  db: PrismaClient,
  userId: string,
  assetId: string,
  change: ReturnType<typeof consentChange>,
) {
  return db.$transaction(async (tx) => {
    // Serialize grants, revocations and deletion on this one owned asset. The key is always a bound parameter.
    const locked = await tx.$queryRaw<
      { id: string }[]
    >`SELECT a."id" FROM "Asset" a INNER JOIN "Membership" m ON m."workspaceId" = a."workspaceId" AND m."userId" = ${userId} WHERE a."id" = ${assetId} AND a."ownerId" = ${userId} AND a."origin" = 'USER' FOR UPDATE OF a`;
    if (!locked.length) throw unavailable();
    const asset = await owned(tx, userId, assetId);
    const visibleVersions = versions(asset);
    const version = visibleVersions.find((v) => v.id === change.versionId);
    if (
      !change.grant &&
      !version &&
      asset.versions.some((v) => v.id === change.versionId)
    )
      return visibleVersions;
    if (
      !version ||
      (change.grant &&
        (!version.current ||
          !permittedChannels(version.mimeType).includes(change.channel)))
    ) {
      throw new ProjectError(409, "This version or destination is unavailable");
    }
    if (version.grants.includes(change.channel) === change.grant)
      return versions(asset);
    if (change.grant && !asset.versions.some((v) => v.id === version.id)) {
      await tx.assetVersion.create({
        data: {
          id: version.id,
          version: version.version,
          workspaceId: asset.workspaceId,
          assetId: asset.id,
          privateObjectKey: asset.privateObjectKey,
          mimeType: asset.mimeType,
          byteSize: asset.byteSize,
          sha256: asset.sha256,
          createdAt: asset.createdAt,
        },
      });
    }
    const where = {
      assetVersionId: version.id,
      workspaceId: asset.workspaceId,
      userId,
      channel: change.channel,
    };
    if (change.grant) {
      await tx.consentGrant.create({
        data: { ...where, policyVersion: sharingPolicy },
      });
    } else {
      await tx.consentGrant.updateMany({
        where: { ...where, state: "GRANTED" },
        data: { state: "REVOKED", revokedAt: new Date() },
      });
      await tx.editorialReview.updateMany({
        where: {
          assetVersionId: version.id,
          workspaceId: asset.workspaceId,
          channel: change.channel,
          state: "APPROVED",
        },
        data: { state: "PENDING", reviewedAt: null },
      });
      if (change.channel === "GALLERY") {
        await tx.galleryItem.updateMany({
          where: { assetVersionId: version.id, workspaceId: asset.workspaceId },
          data: { state: "WITHDRAWN" },
        });
      }
    }
    await tx.auditEvent.create({
      data: {
        workspaceId: asset.workspaceId,
        actorId: userId,
        action: change.grant
          ? "publication.consent.granted"
          : "publication.consent.withdrawn",
        targetType: "assetVersion",
        targetId: version.id,
        metadata: { channel: change.channel, policy: sharingPolicy },
      },
    });
    return assetSharing(tx, userId, assetId);
  });
}

// Called within the existing deletion transaction, after its row lock has been obtained.
export async function withdrawDeletedAsset(
  tx: Prisma.TransactionClient,
  assetId: string,
) {
  const affected = { assetVersion: { assetId } };
  const revoked = await tx.consentGrant.updateMany({
    where: { ...affected, state: "GRANTED" },
    data: { state: "REVOKED", revokedAt: new Date() },
  });
  await tx.galleryItem.updateMany({
    where: affected,
    data: { state: "WITHDRAWN" },
  });
  await tx.editorialReview.updateMany({
    where: { ...affected, state: "APPROVED" },
    data: { state: "PENDING", reviewedAt: null },
  });
  if (revoked.count) {
    const asset = await tx.asset.findUniqueOrThrow({
      where: { id: assetId },
      select: { workspaceId: true, ownerId: true },
    });
    await tx.auditEvent.create({
      data: {
        workspaceId: asset.workspaceId,
        actorId: asset.ownerId,
        action: "publication.consent.asset-deleted",
        targetType: "asset",
        targetId: assetId,
        metadata: { revoked: revoked.count },
      },
    });
  }
}
