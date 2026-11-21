import { randomUUID } from "node:crypto";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
// Leave room under Vercel Functions' 4.5 MB request-body limit.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export type Actor = { userId: string; workspaceId: string };
export type AssetRecord = {
  id: string;
  workspaceId: string;
  ownerId: string | null;
  origin: "USER" | "COMPANY_DEMO";
  state: "PENDING" | "VALIDATED" | "QUARANTINED" | "DELETED";
  objectKey: string;
  mimeType: string;
  byteSize: number;
  uploadExpiresAt?: Date | null;
  retentionUntil?: Date | null;
};
export type UploadRequest = {
  projectId: string;
  contentType: string;
  byteSize: number;
  filename: string;
};
export type MediaRepository = {
  canEditProject(actor: Actor, projectId: string): Promise<boolean>;
  findAsset(id: string): Promise<AssetRecord | null>;
  createPending(input: {
    id: string;
    actor: Actor;
    projectId: string;
    objectKey: string;
    contentType: string;
    byteSize: number;
    expiresAt: Date;
  }): Promise<void>;
  markValidated(
    id: string,
    metadata: { contentType: string; byteSize: number },
  ): Promise<void>;
  markQuarantined(id: string): Promise<void>;
  markDeleted(id: string): Promise<void>;
  discardPending(id: string): Promise<void>;
};
export type StoredObject = {
  contentType: string;
  byteSize: number;
  firstBytes: Uint8Array;
};
export type PrivateMediaDriver = {
  signPut(
    objectKey: string,
    contentType: string,
    byteSize: number,
    expiresAt: Date,
  ): Promise<string>;
  signGet(objectKey: string, expiresAt: Date): Promise<string>;
  inspect(objectKey: string): Promise<StoredObject>;
  remove(objectKey: string): Promise<void>;
  put(objectKey: string, bytes: Uint8Array, contentType: string): Promise<void>;
};
export function authorizeAsset(actor: Actor, asset: AssetRecord) {
  if (asset.workspaceId !== actor.workspaceId || asset.state !== "VALIDATED")
    return false;
  return asset.origin === "USER" && asset.ownerId === actor.userId;
}
export function validateUpload(input: UploadRequest) {
  if (!IMAGE_TYPES.includes(input.contentType as (typeof IMAGE_TYPES)[number]))
    throw new Error("Unsupported media type");
  if (
    !Number.isSafeInteger(input.byteSize) ||
    input.byteSize < 1 ||
    input.byteSize > MAX_IMAGE_BYTES
  )
    throw new Error("Invalid media size");
  if (
    !input.filename ||
    input.filename.length > 255 ||
    /[\\/\x00-\x1f]/.test(input.filename)
  )
    throw new Error("Invalid filename");
  if (!input.projectId) throw new Error("Project required");
}
export function matchesMagic(type: string, bytes: Uint8Array) {
  const start = (...v: number[]) => v.every((b, i) => bytes[i] === b);
  if (type === "image/jpeg") return start(0xff, 0xd8, 0xff);
  if (type === "image/png")
    return start(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (type === "image/webp")
    return (
      start(0x52, 0x49, 0x46, 0x46) &&
      [0x57, 0x45, 0x42, 0x50].every((b, i) => bytes[i + 8] === b)
    );
  return false;
}
export function createPrivateMedia(
  repo: MediaRepository,
  driver: PrivateMediaDriver,
  now: () => Date = () => new Date(),
) {
  return {
    async upload(actor: Actor, input: UploadRequest, bytes: Uint8Array) {
      validateUpload(input);
      if (
        bytes.byteLength !== input.byteSize ||
        !matchesMagic(input.contentType, bytes)
      )
        throw new Error("Media verification failed");
      if (!(await repo.canEditProject(actor, input.projectId)))
        throw new Error("Project access denied");
      const id = randomUUID();
      const ext =
        input.contentType === "image/jpeg"
          ? "jpg"
          : input.contentType === "image/png"
            ? "png"
            : "webp";
      const objectKey = `private/${actor.workspaceId}/${id}.${ext}`;
      await repo.createPending({
        id,
        actor,
        projectId: input.projectId,
        objectKey,
        contentType: input.contentType,
        byteSize: input.byteSize,
        expiresAt: new Date(now().getTime() + 5 * 60_000),
      });
      try {
        await driver.put(objectKey, bytes, input.contentType);
        await repo.markValidated(id, {
          contentType: input.contentType,
          byteSize: input.byteSize,
        });
        return { assetId: id };
      } catch {
        try {
          await repo.markQuarantined(id);
          await driver.remove(objectKey);
          await repo.discardPending(id);
        } catch {
          // A quarantined record remains for later reconciliation.
        }
        throw new Error("Private upload failed");
      }
    },
    async authorizeUpload(actor: Actor, input: UploadRequest) {
      validateUpload(input);
      if (!(await repo.canEditProject(actor, input.projectId)))
        throw new Error("Project access denied");
      const id = randomUUID();
      const ext =
        input.contentType === "image/jpeg"
          ? "jpg"
          : input.contentType === "image/png"
            ? "png"
            : "webp";
      const objectKey = `private/${actor.workspaceId}/${id}.${ext}`;
      const expiresAt = new Date(now().getTime() + 5 * 60_000);
      const uploadUrl = await driver.signPut(
        objectKey,
        input.contentType,
        input.byteSize,
        expiresAt,
      );
      await repo.createPending({
        id,
        actor,
        projectId: input.projectId,
        objectKey,
        contentType: input.contentType,
        byteSize: input.byteSize,
        expiresAt,
      });
      return { assetId: id, uploadUrl, expiresAt };
    },
    async complete(actor: Actor, id: string) {
      const asset = await repo.findAsset(id);
      if (
        !asset ||
        asset.workspaceId !== actor.workspaceId ||
        asset.ownerId !== actor.userId ||
        asset.state !== "PENDING" ||
        !asset.uploadExpiresAt ||
        asset.uploadExpiresAt <= now()
      )
        throw new Error("Asset access denied");
      const actual = await driver.inspect(asset.objectKey);
      if (
        actual.contentType !== asset.mimeType ||
        actual.byteSize !== asset.byteSize ||
        !matchesMagic(actual.contentType, actual.firstBytes)
      ) {
        await repo.markQuarantined(id);
        throw new Error("Media verification failed");
      }
      await repo.markValidated(id, {
        contentType: actual.contentType,
        byteSize: actual.byteSize,
      });
    },
    async authorizeDownload(actor: Actor, id: string) {
      const asset = await repo.findAsset(id);
      if (!asset || !authorizeAsset(actor, asset))
        throw new Error("Asset access denied");
      return driver.signGet(
        asset.objectKey,
        new Date(now().getTime() + 60_000),
      );
    },
    async deleteOwned(actor: Actor, id: string) {
      const asset = await repo.findAsset(id);
      if (
        !asset ||
        asset.origin !== "USER" ||
        asset.workspaceId !== actor.workspaceId ||
        asset.ownerId !== actor.userId ||
        !["VALIDATED", "DELETED"].includes(asset.state)
      )
        throw new Error("Asset access denied");
      if (asset.state === "VALIDATED") await repo.markDeleted(id); // deny new signed URLs before removing bytes
      await driver.remove(asset.objectKey); // retry via audit/reconciliation if this fails
    },
  };
}
