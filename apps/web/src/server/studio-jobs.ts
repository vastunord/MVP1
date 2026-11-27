import "server-only";
import { randomUUID } from "node:crypto";
import { get, put } from "@vercel/blob";
import sharp from "sharp";
import type { PrismaClient, RenderJob } from "@/generated/prisma/client";
import type { RenderStatus } from "@/lib/studio-render";
import { MAX_IMAGE_BYTES } from "../lib/image-upload-policy.ts";
import {
  RenderError,
  checkRender,
  signedOutput,
  submitRender,
  type RenderBrief,
} from "./mnml.ts";
import { isStudioMp4 } from "./studio-video.ts";

type Config = { key: string };
type Actor = { userId: string; workspaceId: string };
function status(row: RenderJob): RenderStatus {
  return {
    id: row.id,
    toolId: row.toolId,
    state: row.state,
    sourceAssetId: row.sourceAssetId,
    outputAssetId: row.state === "SUCCEEDED" ? row.outputAssetId : null,
    media: row.outputMedia === "video" ? "video" : "image",
    waitingForSubmission: row.state === "QUEUED" && !row.providerJobId,
  };
}
async function readBytes(
  stream: ReadableStream<Uint8Array> | null,
  limit: number,
) {
  if (!stream) throw new RenderError(502, "Image unavailable");
  const reader = stream.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > limit)
        throw new RenderError(413, "Image exceeds the processing limit");
      parts.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(parts);
}

const services = {
  submit: submitRender,
  check: checkRender,
  fetchFile: (url: URL) =>
    fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    }),
  async readSource(key: string, mime: string) {
    const result = await get(key, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result || !result.stream)
      throw new RenderError(404, "Source file unavailable");
    const bytes = await readBytes(result.stream, MAX_IMAGE_BYTES);
    return "data:" + mime + ";base64," + bytes.toString("base64");
  },
  async writeOutput(key: string, data: Buffer, mime: string) {
    await put(key, data, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: mime,
    });
  },
};
export async function startJob(
  db: PrismaClient,
  config: Config,
  actor: Actor,
  brief: RenderBrief,
  io = services,
) {
  const scope = { workspaceId: actor.workspaceId, projectId: brief.projectId };
  const video = brief.endpoint === "videos";
  const assetIds = brief.sourceAssetId
    ? [brief.sourceAssetId, ...brief.referenceIds]
    : [];
  const assets = await db.asset.findMany({
    where: {
      id: { in: assetIds },
      ...scope,
      ownerId: actor.userId,
      origin: "USER",
      state: "VALIDATED",
      mimeType: { in: ["image/webp", "image/jpeg", "image/png"] },
    },
  });
  if (assets.length !== assetIds.length)
    throw new RenderError(404, "Image unavailable in this project");
  // MNML accepts at most 15 MB per image; reject before creating a job or
  // sending any provider request, including for style reference images.
  if (
    (brief.endpoint === "renders" || brief.endpoint === "videos") &&
    assets.some((asset) => asset.byteSize > 15_000_000)
  )
    throw new RenderError(413, "MNML accepts images up to 15 MB");
  const job = await db.$transaction(async (tx) => {
    // Serialize identical submissions across tabs, reloads and server instances.
    await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${brief.projectId})::bigint)`;
    const project = await tx.project.findFirst({
      select: { id: true },
      where: {
        id: brief.projectId,
        workspaceId: actor.workspaceId,
        archivedAt: null,
        deletedAt: null,
        workspace: { personalOwnerId: actor.userId },
      },
    });
    if (!project) throw new RenderError(404, "Project unavailable");
    const prior =
      (await tx.renderJob.findUnique({ where: { id: brief.id } })) ??
      (await tx.renderJob.findFirst({
        where: {
          ...scope,
          requestHash: brief.hash,
          state: "QUEUED",
          providerJobId: null,
        },
        orderBy: { createdAt: "asc" },
      }));
    if (prior) {
      if (
        prior.workspaceId !== scope.workspaceId ||
        prior.projectId !== scope.projectId ||
        prior.requestHash !== brief.hash
      )
        throw new RenderError(
          409,
          "Render request conflicts with an existing request",
        );
      return prior;
    }
    return tx.renderJob.create({
      data: {
        id: brief.id,
        ...scope,
        toolId: brief.toolId,
        sourceAssetId: brief.sourceAssetId,
        outputAssetId: randomUUID(),
        outputMedia: video ? "video" : "image",
        requestHash: brief.hash,
      },
    });
  });
  if (job.state !== "QUEUED" || job.providerJobId) return status(job);
  if (Date.now() - job.createdAt.getTime() > 23 * 3600000)
    throw new RenderError(
      409,
      "Submission window expired; reconcile before retrying",
    );
  const images = await Promise.all(
    assetIds.map(async (id) => {
      const asset = assets.find((row) => row.id === id)!;
      return io.readSource(asset.privateObjectKey, asset.mimeType);
    }),
  );
  // Byte-identical payload and persisted UUID preserve provider idempotency on ambiguous timeouts.
  let accepted;
  try {
    accepted = await io.submit(
      config.key,
      { ...brief, id: job.id },
      images[0],
      images.slice(1),
    );
  } catch (error) {
    if (error instanceof RenderError && error.confirmedRejection) {
      await db.renderJob.updateMany({
        where: { id: job.id, state: "QUEUED", providerJobId: null },
        data: { state: "FAILED" },
      });
    }
    throw error;
  }
  await db.renderJob.updateMany({
    where: { id: job.id, providerJobId: null, state: "QUEUED" },
    data: {
      providerJobId: accepted.id,
      state: "RUNNING",
      chargedUsd: accepted.charged_usd,
    },
  });
  return status(
    await db.renderJob.findUniqueOrThrow({ where: { id: job.id } }),
  );
}

export async function projectJobs(
  db: PrismaClient,
  actor: Actor,
  projectId: string,
  toolId?: string,
  jobId?: string,
) {
  const rows = await db.renderJob.findMany({
    where: {
      workspaceId: actor.workspaceId,
      projectId,
      ...(jobId ? { id: jobId } : {}),
      ...(toolId ? { toolId } : { state: "SUCCEEDED" }),
      requestHash: { not: null },
      project: {
        archivedAt: null,
        deletedAt: null,
        workspace: { personalOwnerId: actor.userId },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return rows.map(status);
}

// Finish an accepted job after its editor closes, without initiating a paid submission.
export async function reconcileStudioOutput(
  db: PrismaClient,
  key: string,
  io = services,
) {
  const candidate = await db.renderJob.findFirst({
    where: {
      state: "RUNNING",
      providerJobId: { not: null },
      requestHash: { not: null },
      project: { archivedAt: null, deletedAt: null },
      workspace: { personalOwnerId: { not: null } },
    },
    orderBy: { updatedAt: "asc" },
    select: {
      id: true,
      projectId: true,
      workspaceId: true,
      updatedAt: true,
      workspace: { select: { personalOwnerId: true } },
    },
  });
  if (!candidate?.workspace.personalOwnerId)
    return { checked: 0, completed: 0 };
  const claimed = await db.renderJob.updateMany({
    where: {
      id: candidate.id,
      state: "RUNNING",
      updatedAt: candidate.updatedAt,
    },
    data: { updatedAt: new Date() },
  });
  if (!claimed.count) return { checked: 0, completed: 0 };
  const result = await syncJob(
    db,
    key,
    {
      workspaceId: candidate.workspaceId,
      userId: candidate.workspace.personalOwnerId,
    },
    candidate.projectId,
    candidate.id,
    io,
  );
  return { checked: 1, completed: result.state === "SUCCEEDED" ? 1 : 0 };
}

export async function syncJob(
  db: PrismaClient,
  key: string,
  actor: Actor,
  projectId: string,
  id: string,
  io = services,
) {
  const row = await db.renderJob.findFirst({
    where: {
      id,
      projectId,
      workspaceId: actor.workspaceId,
      requestHash: { not: null },
      project: {
        archivedAt: null,
        deletedAt: null,
        workspace: { personalOwnerId: actor.userId },
      },
    },
  });
  if (!row) throw new RenderError(404, "Render unavailable");
  if (
    !row.providerJobId ||
    !row.outputAssetId ||
    ["SUCCEEDED", "CANCELLED", "FAILED"].includes(row.state)
  )
    return status(row);
  const job = await io.check(key, row.providerJobId);
  if (job.status === "failed" || job.status === "canceled") {
    await db.renderJob.updateMany({
        where: { id, state: "RUNNING", providerJobId: row.providerJobId },
        data: {
          state: job.status === "failed" ? "FAILED" : "CANCELLED",
          refundedUsd: job.refunded_usd,
          chargedUsd: job.charged_usd,
        },
      });
    return status(await db.renderJob.findUniqueOrThrow({ where: { id } }));
  }
  if (job.status !== "succeeded") return status(row);
  const video = row.outputMedia === "video";
  const file = await io.fetchFile(signedOutput(job, video ? "video" : "image"));
  if (!file.ok)
    throw new RenderError(502, "Rendered image temporarily unavailable");
  const source = await readBytes(file.body, (video ? 40 : 24) * 1024 * 1024);
  if (
    video &&
    (file.headers.get("content-type")?.split(";")[0] !== "video/mp4" ||
      !isStudioMp4(source))
  )
    throw new RenderError(502, "Invalid video file");
  const { data, info } = video
    ? { data: source, info: { width: null, height: null } }
    : await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" })
        .rotate()
        .webp({ quality: 90 })
        .toBuffer({ resolveWithObject: true });
  const assetId = row.outputAssetId;
  const mime = video ? "video/mp4" : "image/webp";
  const objectKey =
    "private/" + actor.workspaceId + "/" + assetId + (video ? ".mp4" : ".webp");
  return db.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${id})::bigint)`;
      const current = await tx.renderJob.findUniqueOrThrow({ where: { id } });
      if (current.state !== "RUNNING") return status(current);
      const project = await tx.project.findFirst({
        select: { id: true },
        where: {
          id: projectId,
          workspaceId: actor.workspaceId,
          archivedAt: null,
          deletedAt: null,
          workspace: { personalOwnerId: actor.userId },
        },
      });
      if (!project) throw new RenderError(404, "Project unavailable");
      await io.writeOutput(objectKey, data, mime);
      await tx.asset.create({
        data: {
          id: assetId,
          workspaceId: actor.workspaceId,
          projectId,
          ownerId: actor.userId,
          origin: "USER",
          state: "VALIDATED",
          privateObjectKey: objectKey,
          mimeType: mime,
          byteSize: data.length,
          width: info.width,
          height: info.height,
        },
      });
      return status(
        await tx.renderJob.update({
          where: { id },
          data: {
            state: "SUCCEEDED",
            chargedUsd: job.charged_usd,
            refundedUsd: job.refunded_usd,
          },
        }),
      );
    },
    { timeout: 25000 },
  );
}
