import { studioPersistenceReady } from "../src/server/studio-readiness.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { parseRender } from "../src/server/mnml.ts";
import { reserveTestRender } from "../src/server/test-render-budget.ts";
import {
  startJob,
  syncJob,
  projectJobs,
  reconcileStudioOutput,
} from "../src/server/studio-jobs.ts";
import { isStudioMp4 } from "../src/server/studio-video.ts";
import { authorizeAsset, createPrivateMedia } from "../src/server/media.ts";
import { createPrismaMediaRepository } from "../src/server/prisma-media-repository.ts";
import { projectService } from "../src/server/projects.ts";
import { prismaProjectStore } from "../src/server/prisma-project-store.ts";

const require = createRequire(import.meta.url);
const dev = createRequire(
  createRequire(require.resolve("prisma/package.json")).resolve("@prisma/dev"),
);
const { PGlite } = dev("@electric-sql/pglite"),
  { PGLiteSocketServer } = dev("@electric-sql/pglite-socket");

test("disposable PostgreSQL verifies owned inputs, replay and private result persistence", async () => {
  const memory = await PGlite.create(),
    socket = new PGLiteSocketServer({ db: memory, host: "127.0.0.1", port: 0 });
  let db;
  try {
    for (const dir of [
      "20261121_phase02c_initial",
      "20261121_phase02d_auth_projects",
    ]) {
      await memory.exec(
        await readFile(
          new URL(
            "../prisma/migrations/" + dir + "/migration.sql",
            import.meta.url,
          ),
          "utf8",
        ),
      );
    }
    await socket.start();
    db = new PrismaClient({
      adapter: new PrismaPg({
        host: "127.0.0.1",
        database: "postgres",
        user: "postgres",
        max: 1,
        ssl: false,
        port: Number(socket.getServerConn().split(":").at(-1)),
      }),
    });
    assert.equal(
      await studioPersistenceReady(db),
      false,
      "unapplied render migration",
    );
    await memory.exec(
      await readFile(
        new URL(
          "../prisma/migrations/20261122_studio_mnml/migration.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    assert.equal(await studioPersistenceReady(db), false, "snapshot migration is required");
    await memory.exec(await readFile(new URL("../prisma/migrations/20261127_maya_submission_settings/migration.sql", import.meta.url), "utf8"));
    await memory.exec(await readFile(new URL("../prisma/migrations/20261128_controlled_render_campaign/migration.sql", import.meta.url), "utf8"));
    assert.equal(
      await studioPersistenceReady(db),
      true,
      "complete schema with permitted writes",
    );
    await memory.exec(
      "CREATE ROLE render_reader; GRANT SELECT ON ALL TABLES IN SCHEMA public TO render_reader",
    );
    await db.$transaction(async (tx) => {
      await tx.$executeRawUnsafe("SET LOCAL ROLE render_reader");
      assert.equal(
        await studioPersistenceReady(tx),
        false,
        "SELECT alone cannot submit a paid job",
      );
    });
    for (const id of ["a", "b"]) {
      await db.user.create({ data: { id, email: id + "@example.invalid" } });
      await db.workspace.create({
        data: { id: "w" + id, name: "Workspace", personalOwnerId: id },
      });
      await db.project.create({
        data: { id: "p" + id, workspaceId: "w" + id, name: "Studio test" },
      });
      await db.asset.create({
        data: {
          id: "asset" + id,
          workspaceId: "w" + id,
          projectId: "p" + id,
          ownerId: id,
          state: "VALIDATED",
          mimeType: "image/png",
          byteSize: 64,
          privateObjectKey: "fixture-" + id,
        },
      });
    }
    await db.testRenderCampaign.create({ data: { id: "campaign", model: "v4.5-fast", active: true, startsAt: new Date(Date.now() - 10000), expiresAt: new Date(Date.now() + 60000), maxAttempts: 6, maxMicrousd: 594000, perAttemptMicrousd: 99000 } });
    await db.testRenderTester.create({ data: { campaignId: "campaign", userId: "a", maxAttempts: 6, maxMicrousd: 594000 } });
    const reservation = { campaignId: "campaign", userId: "a", id: "test-attempt-0", requestHash: "brief-a", endpoint: "renders", model: "v4.5-fast", count: 1, quoteMicrousd: 99000 };
    await assert.rejects(db.$transaction((tx) => reserveTestRender(tx, { ...reservation, quoteMicrousd: 99001 })), /approved/);
    await assert.rejects(db.$transaction((tx) => reserveTestRender(tx, { ...reservation, model: "v4.6-ultra" })), /approved/);
    await assert.rejects(db.$transaction(async (tx) => { await reserveTestRender(tx, { ...reservation, id: "rollback" }); throw Error("synthetic failure"); }), /synthetic failure/);
    assert.equal(await db.testRenderAttempt.count(), 0, "failed transaction rolls back its reservation");
    await db.$transaction((tx) => reserveTestRender(tx, reservation));
    await db.$transaction((tx) => reserveTestRender(tx, reservation));
    await db.testRenderAttempt.update({ where: { id: reservation.id }, data: { state: "REFUNDED", settledMicrousd: 0 } });
    await assert.rejects(db.$transaction((tx) => reserveTestRender(tx, { ...reservation, requestHash: "different" })), /conflicts/);
    await assert.rejects(db.$transaction((tx) => reserveTestRender(tx, { ...reservation, id: "other-user", userId: "b" })), /unavailable/);
    for (let i = 1; i < 6; i++) await db.$transaction((tx) => reserveTestRender(tx, { ...reservation, id: `test-attempt-${i}` }));
    await assert.rejects(db.$transaction((tx) => reserveTestRender(tx, { ...reservation, id: "seventh" })), /exhausted/);
    await db.testRenderCampaign.update({ where: { id: "campaign" }, data: { active: false } });
    await assert.rejects(db.$transaction((tx) => reserveTestRender(tx, { ...reservation, id: "killed" })), /unavailable/);
    // Exercise the actual project service and Prisma store with synthetic users.
    for (const id of ["project-owner", "project-other"]) {
      await db.user.create({ data: { id, email: `${id}@example.invalid`, emailVerified: true } });
    }
    const projects = projectService(prismaProjectStore(db));
    const space = await projects.createWorkspace("project-owner", "Synthetic home");
    assert.deepEqual(await projects.createWorkspace("project-owner", "Synthetic home"), space);
    await projects.createWorkspace("project-other", "Other home");
    const projectKey = randomUUID();
    const createdProject = await projects.create("project-owner", "Synthetic room", null, projectKey);
    assert.deepEqual(await projects.create("project-owner", "Synthetic room", null, projectKey), createdProject);
    assert.equal((await projects.list("project-owner")).length, 1);
    assert.deepEqual(await projects.list("project-other"), []);
    await assert.rejects(projects.get("project-other", createdProject.id), /Project not found/);
    await assert.rejects(projects.update("project-other", createdProject.id, { name: "Unauthorized" }), /Project not found/);
    const input = {
      id: randomUUID(),
      toolId: "room-reimagination",
      consent: true,
      engine: "v4.5-fast",
      sourceAssetId: "asseta",
      referenceIds: [],
      projectId: "pa",
      prompt: "Pale oak",
      values: {},
    };
    const actor = { workspaceId: "wa", userId: "a" },
      other = { workspaceId: "wb", userId: "b" },
      config = { key: "fixture" };
    const photo = await sharp({
      create: { width: 32, height: 24, channels: 3, background: "#013c55" },
    })
      .png()
      .toBuffer();
    const writes = [];
    let submissions = 0,
      interruption = true;
    const io = {
      async readSource(key) {
        assert.equal(key, "fixture-a");
        return "data:image/png;base64," + photo.toString("base64");
      },
      async submit(_key, brief) {
        assert.equal(brief.id, input.id);
        submissions++;
        if (interruption) {
          interruption = false;
          throw Error("simulated connection loss");
        }
        return { id: "12", status: "queued", charged_usd: 0.2475 };
      },
      async check() {
        return {
          id: "12",
          status: "succeeded",
          charged_usd: 0.2475,
          refunded_usd: 0,
          outputs: [
            {
              url: "https://api.mnml.ai/v2/files/12?exp=1&sig=fixture",
              media: "image",
            },
          ],
        };
      },
      async fetchFile() {
        return new Response(photo, {
          headers: { "Content-Type": "image/png" },
        });
      },
      async writeOutput(key, bytes) {
        writes.push(key);
        assert.equal((await sharp(bytes).metadata()).format, "webp");
      },
    };
    await db.asset.update({
      where: { id: "asseta" },
      data: { byteSize: 15_000_001 },
    });
    await assert.rejects(
      startJob(db, config, actor, parseRender(input), io),
      /15 MB/,
    );
    assert.equal(
      await db.renderJob.count(),
      0,
      "oversized image creates no job",
    );
    assert.equal(submissions, 0, "oversized image is never sent to MNML");
    await db.asset.update({ where: { id: "asseta" }, data: { byteSize: 64 } });
    await assert.rejects(
      startJob(
        db,
        config,
        actor,
        parseRender({ ...input, sourceAssetId: "assetb" }),
        io,
      ),
      /unavailable/,
    );
    await assert.rejects(
      startJob(
        db,
        config,
        other,
        parseRender(input),
        io,
      ),
      /unavailable/,
    );
    await assert.rejects(
      startJob(db, config, actor, parseRender(input), io),
      /connection loss/,
    );
    assert.equal(await db.renderJob.count(), 1);
    const savedSnapshot = (await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).submissionSettings;
    assert.deepEqual(savedSnapshot, parseRender(input).snapshot, "job saves the exact validated snapshot before provider acceptance");
    assert.equal(
      (
        await startJob(
          db,
          config,
          actor,
          parseRender({ ...input, id: randomUUID() }),
          io,
        )
      ).id,
      input.id,
    );
    assert.equal(
      (await startJob(db, config, actor, parseRender(input), io)).state,
      "RUNNING",
    );
    assert.equal(submissions, 2);
    assert.deepEqual((await projectJobs(db, actor, "pa", "room-reimagination"))[0].submissionSettings, savedSnapshot, "owned history reopens the immutable snapshot");
    await assert.rejects(
      startJob(
        db,
        config,
        actor,
        parseRender({ ...input, prompt: "Changed" }),
        io,
      ),
      /conflicts/,
    );

    assert.deepEqual(
      await projectJobs(db, other, "pb", "room-reimagination"),
      [],
    );
    const wrongUser = { workspaceId: "wa", userId: "b" };
    assert.deepEqual(
      await projectJobs(db, wrongUser, "pa", "room-reimagination"),
      [],
    );
    assert.deepEqual(await projectJobs(db, wrongUser, "pa"), []);
    assert.deepEqual(await projectJobs(db, actor, "pa"), []);
    assert.equal(
      (await projectJobs(db, actor, "pa", "room-reimagination"))[0].state,
      "RUNNING",
    );
    // Recovery reads a specific owned job without depending on the 12-item
    // recent-history window, and never calls the provider.
    const newerIds = Array.from({ length: 13 }, () => randomUUID());
    await db.renderJob.createMany({ data: newerIds.map((id, index) => ({
      id, workspaceId: "wa", projectId: "pa", toolId: "room-reimagination",
      requestHash: `newer-recovery-fixture-${index}`, state: "FAILED",
      createdAt: new Date(Date.now() + 60_000 + index),
    })) });
    assert.equal((await projectJobs(db, actor, "pa", "room-reimagination")).some((row) => row.id === input.id), false);
    assert.equal((await projectJobs(db, actor, "pa", "room-reimagination", input.id))[0].id, input.id);
    assert.deepEqual(await projectJobs(db, wrongUser, "pa", "room-reimagination", input.id), []);
    assert.deepEqual(await projectJobs(db, actor, "pa", "garden-design", input.id), []);
    assert.deepEqual(await projectJobs(db, other, "pb", "room-reimagination", input.id), []);
    assert.equal(submissions, 2, "targeted recovery read must not submit a provider job");
    await db.renderJob.deleteMany({ where: { id: { in: newerIds } } });
    // Inject at the application database boundary; this is not a network outage.
    const unavailableDb = { renderJob: { async findMany() { throw new Error("synthetic database connection failure"); } } };
    await assert.rejects(projectJobs(unavailableDb, actor, "pa", "room-reimagination"), /synthetic database connection failure/);
    assert.equal((await projectJobs(db, actor, "pa", "room-reimagination"))[0].id, input.id);
    assert.equal(submissions, 2, "history retry must not submit a provider job");
    await assert.rejects(
      syncJob(db, "fixture", wrongUser, "pa", input.id, io),
      /unavailable/,
    );
    await assert.rejects(
      syncJob(db, "fixture", other, "pb", input.id, io),
      /unavailable/,
    );
    const expiredOutput = { ...io, async fetchFile() { return new Response(null, { status: 403 }); } };
    await assert.rejects(syncJob(db, "fixture", actor, "pa", input.id, expiredOutput), /temporarily unavailable/);
    assert.equal((await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).state, "RUNNING");
    assert.equal(await db.asset.count({ where: { id: (await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).outputAssetId } }), 0);
    // Simulate the Blob write succeeding before the database attachment fails.
    let writtenBeforeDbFailure;
    const dbFailureIo = { ...io, async writeOutput(key) { writtenBeforeDbFailure = key; } };
    const failingDatabase = { renderJob: db.renderJob, async $transaction(callback, options) {
      return db.$transaction(tx => callback(new Proxy(tx, { get(target, key) {
        if (key === "asset") return new Proxy(target.asset, { get(asset, operation) {
          if (operation === "create") return async () => { throw new Error("synthetic database attachment failure"); };
          return Reflect.get(asset, operation, asset);
        } });
        return Reflect.get(target, key, target);
      } })), options);
    } };
    await assert.rejects(syncJob(failingDatabase, "fixture", actor, "pa", input.id, dbFailureIo), /database attachment failure/);
    assert.equal(writtenBeforeDbFailure, "private/wa/" + (await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).outputAssetId + ".webp");
    assert.equal((await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).state, "RUNNING");
    assert.equal(await db.asset.count({ where: { id: (await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).outputAssetId } }), 0);
    assert.equal(submissions, 2, "an expired provider URL must not trigger a new submission");
    const failingStorage = { ...io, async writeOutput() { throw new Error("synthetic storage interruption"); } };
    await assert.rejects(syncJob(db, "fixture", actor, "pa", input.id, failingStorage), /storage interruption/);
    assert.equal((await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).state, "RUNNING");
    assert.equal(submissions, 2, "saving failure must not submit another provider job");
    let partiallyWrittenKey;
    const partialStorage = { ...io, async writeOutput(key) {
      partiallyWrittenKey = key;
      throw new Error("synthetic interruption after writing the object");
    } };
    await assert.rejects(syncJob(db, "fixture", actor, "pa", input.id, partialStorage), /after writing/);
    assert.equal((await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).state, "RUNNING");
    assert.equal(await db.asset.count({ where: { id: (await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).outputAssetId } }), 0);
    const resumedStorage = { ...io, async writeOutput(key, bytes, mime) {
      assert.equal(key, partiallyWrittenKey, "retry reuses the deterministic private object key");
      return io.writeOutput(key, bytes, mime);
    } };
    const done = await syncJob(db, "fixture", actor, "pa", input.id, resumedStorage);
    assert.equal(submissions, 2, "saving retry must reuse the provider job");
    assert.equal(done.state, "SUCCEEDED");
    assert.ok(
      (await projectJobs(db, actor, "pa")).some(
        (row) => row.id === input.id && row.toolId === "room-reimagination",
      ),
    );
    assert.equal(
      (await syncJob(db, "fixture", actor, "pa", input.id, io)).outputAssetId,
      done.outputAssetId,
    );
    assert.equal(writes.length, 1);
    const stored = await db.asset.findUniqueOrThrow({
      where: { id: done.outputAssetId },
    });
    assert.equal(stored.ownerId, "a");
    assert.equal(stored.projectId, "pa");
    assert.equal(stored.width, 32);
    assert.equal(stored.state, "VALIDATED");
    assert.equal(await db.asset.count({ where: { id: done.outputAssetId } }), 1, "completion retries produce one asset");
    await db.asset.update({ where: { id: "asseta" }, data: { state: "DELETED" } });
    const deletedSource = await createPrismaMediaRepository(db).findAsset("asseta");
    assert.ok(deletedSource);
    assert.equal(authorizeAsset(actor, deletedSource), false, "deleted source cannot be downloaded");
    assert.equal((await projectJobs(db, actor, "pa"))[0].sourceAssetId, "asseta", "history retains the original source identity");
    await db.asset.update({ where: { id: "asseta" }, data: { state: "VALIDATED" } });
    const raceBrief = parseRender({ ...input, id: randomUUID(), prompt: "Separate race fixture" });
    const raceIo = { ...io, async submit() { return { id: "race-provider", status: "queued" }; } };
    await startJob(db, config, actor, raceBrief, raceIo);
    const lateSuccess = {
      ...raceIo,
      async check() {
        await db.renderJob.update({ where: { id: raceBrief.id }, data: { state: "CANCELLED" } });
        return { id: "race-provider", status: "succeeded", outputs: [{ url: "https://api.mnml.ai/v2/files/race-provider?exp=1&sig=fixture", media: "image" }] };
      },
    };
    const beforeRaceWrites = writes.length;
    assert.equal((await syncJob(db, "fixture", actor, "pa", raceBrief.id, lateSuccess)).state, "CANCELLED");
    assert.equal(writes.length, beforeRaceWrites, "a late success cannot overwrite a terminal job");
    const failedBrief = parseRender({ ...input, id: randomUUID(), prompt: "Late failure fixture" });
    const failedIo = { ...io, async submit() { return { id: "race-provider-2", status: "queued" }; } };
    await startJob(db, config, actor, failedBrief, failedIo);
    const lateFailure = { ...failedIo, async check() {
      await db.renderJob.update({ where: { id: failedBrief.id }, data: { state: "CANCELLED" } });
      return { id: "race-provider-2", status: "failed" };
    } };
    assert.equal((await syncJob(db, "fixture", actor, "pa", failedBrief.id, lateFailure)).state, "CANCELLED");
    // Provider-reported cancellation is terminal; subsequent reads must not
    // query the provider or attach a result. There is no user cancel API.
    const cancelledBrief = parseRender({ ...input, id: randomUUID(), prompt: "Provider cancellation fixture" });
    const cancellationIo = { ...io, async submit() { return { id: "cancel-provider", status: "queued" }; },
      async check() { return { id: "cancel-provider", status: "canceled" }; } };
    await startJob(db, config, actor, cancelledBrief, cancellationIo);
    assert.equal((await syncJob(db, "fixture", actor, "pa", cancelledBrief.id, cancellationIo)).state, "CANCELLED");
    const noRepoll = { ...cancellationIo, async check() { throw new Error("terminal job was polled again"); } };
    assert.equal((await syncJob(db, "fixture", actor, "pa", cancelledBrief.id, noRepoll)).state, "CANCELLED");
    assert.equal(writes.length, beforeRaceWrites, "cancellation does not attach output");
    // A provider-reported failure is terminal and must not fetch or attach an output.
    const providerFailure = parseRender({ ...input, id: randomUUID(), prompt: "Provider failure fixture" });
    let failedSubmissions = 0, failedChecks = 0;
    const providerFailureIo = { ...io,
      async submit() { failedSubmissions++; return { id: "failed-provider", status: "queued" }; },
      async check() { failedChecks++; return { id: "failed-provider", status: "failed", charged_usd: 0.2, refunded_usd: 0.2 }; },
      async fetchFile() { throw new Error("failed job fetched output"); },
      async writeOutput() { throw new Error("failed job stored output"); },
    };
    await startJob(db, config, actor, providerFailure, providerFailureIo);
    const failedResult = await syncJob(db, "fixture", actor, "pa", providerFailure.id, providerFailureIo);
    assert.equal(failedResult.state, "FAILED");
    assert.equal((await syncJob(db, "fixture", actor, "pa", providerFailure.id, providerFailureIo)).state, "FAILED");
    assert.equal((await startJob(db, config, actor, providerFailure, providerFailureIo)).state, "FAILED");
    assert.equal(failedChecks, 1, "terminal failure is not polled again");
    assert.equal(failedSubmissions, 1, "terminal failure is not resubmitted");
    assert.equal(await db.asset.count({ where: { id: (await db.renderJob.findUniqueOrThrow({ where: { id: providerFailure.id } })).outputAssetId } }), 0);

    // An ambiguous provider timeout is not a confirmed rejection. Only an explicit
    // replay uses the same persisted job ID and byte-identical request payload.
    const timeoutBrief = parseRender({ ...input, id: randomUUID(), prompt: "Submission timeout fixture" });
    const timeoutPayloads = [];
    const timeoutIo = { ...io, async submit(_key, brief, source, references) {
      timeoutPayloads.push(JSON.stringify({ brief, source, references }));
      if (timeoutPayloads.length === 1) throw new DOMException("Synthetic timeout", "TimeoutError");
      return { id: "timeout-provider", status: "queued" };
    } };
    await assert.rejects(startJob(db, config, actor, timeoutBrief, timeoutIo), { name: "TimeoutError" });
    const timedOut = await db.renderJob.findUniqueOrThrow({ where: { id: timeoutBrief.id } });
    assert.equal(timedOut.state, "QUEUED");
    assert.equal(timedOut.providerJobId, null);
    assert.equal(timeoutPayloads.length, 1, "timeout is not automatically resubmitted");
    const resumed = await startJob(db, config, actor, timeoutBrief, timeoutIo);
    assert.equal(resumed.id, timeoutBrief.id);
    assert.equal(resumed.state, "RUNNING");
    assert.equal(timeoutPayloads.length, 2);
    assert.equal(timeoutPayloads[0], timeoutPayloads[1], "explicit replay keeps provider idempotency payload stable");
    await syncJob(db, "fixture", actor, "pa", timeoutBrief.id, {
      ...timeoutIo, async check() { return { id: "timeout-provider", status: "canceled" }; },
    });
    // Structural fixture for trusted provider file intake. Actual codec playback requires a live job.
    function box(type, bytes) {
      const header = Buffer.alloc(8);
      header.writeUInt32BE(bytes.length + 8);
      header.write(type, 4);
      return Buffer.concat([header, bytes]);
    }
    function clip(track) {
      return Buffer.concat([
        box("ftyp", Buffer.from("isom0000")),
        box(
          "moov",
          box(
            "trak",
            box(
              "mdia",
              box("hdlr", Buffer.concat([Buffer.alloc(8), Buffer.from(track)])),
            ),
          ),
        ),
        box("mdat", Buffer.from([1])),
      ]);
    }
    assert.equal(isStudioMp4(clip("soun")), false);
    const mp4 = clip("vide");
    assert.equal(isStudioMp4(mp4.subarray(0, -1)), false);
    // Exercise the lower-level video ingestion contract without enabling the
    // currently unavailable public video workflow.
    const video = { ...parseRender(input), id: randomUUID(), endpoint: "videos" };

    let mime = "text/html",
      storedKey;
    const videoIo = {
      ...io,
      async submit() {
        return { id: "13", status: "queued" };
      },
      async check() {
        return {
          id: "13",
          status: "succeeded",
          outputs: [
            {
              url: "https://api.mnml.ai/v2/files/13?exp=2&sig=f",
              media: "video",
            },
          ],
        };
      },
      async fetchFile() {
        return new Response(mp4, { headers: { "Content-Type": mime } });
      },
      async writeOutput(key, bytes, format) {
        storedKey = key;
        assert.equal(format, "video/mp4");
        assert.deepEqual(bytes, mp4);
      },
    };
    assert.equal(
      (await startJob(db, config, actor, video, videoIo)).media,
      "video",
    );

    await assert.rejects(
      syncJob(db, "fixture", actor, "pa", video.id, videoIo),
      /Invalid video file/,
    );
    assert.equal(storedKey, undefined);
    mime = "video/mp4";
    assert.deepEqual(await reconcileStudioOutput(db, "fixture", videoIo), {
      checked: 1,
      completed: 1,
    });
    assert.deepEqual(await reconcileStudioOutput(db, "fixture", videoIo), {
      checked: 0,
      completed: 0,
    });
    const videoDone = await syncJob(
      db,
      "fixture",
      actor,
      "pa",
      video.id,
      videoIo,
    );
    assert.equal(videoDone.state, "SUCCEEDED");
    assert.equal(storedKey, "private/wa/" + videoDone.outputAssetId + ".mp4");
    const privateMedia = createPrivateMedia(createPrismaMediaRepository(db), {
      async signGet(key) {
        assert.equal(key, storedKey);
        return "fixture-private";
      },
      async remove(key) {
        assert.equal(key, storedKey);
      },
    });
    await assert.rejects(
      privateMedia.authorizeDownload(other, videoDone.outputAssetId),
      /access denied/,
    );
    await assert.rejects(
      privateMedia.deleteOwned(other, videoDone.outputAssetId),
      /access denied/,
    );
    assert.equal(
      await privateMedia.authorizeDownload(actor, videoDone.outputAssetId),
      "fixture-private",
    );
    await privateMedia.deleteOwned(actor, videoDone.outputAssetId);
    await assert.rejects(
      privateMedia.authorizeDownload(actor, videoDone.outputAssetId),
      /access denied/,
    );
    assert.equal(await db.galleryItem.count(), 0);
  } finally {
    await db?.$disconnect();
    await socket.stop();
    await memory.close();
  }
});
