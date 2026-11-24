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
import {
  startJob,
  syncJob,
  projectJobs,
  reconcileStudioOutput,
} from "../src/server/studio-jobs.ts";
import { isStudioMp4 } from "../src/server/studio-video.ts";
import { createPrivateMedia } from "../src/server/media.ts";
import { createPrismaMediaRepository } from "../src/server/prisma-media-repository.ts";

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
    const input = {
      id: randomUUID(),
      toolId: "room-reimagination",
      consent: true,
      engine: "v4.6-ultra",
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
    const failingStorage = { ...io, async writeOutput() { throw new Error("synthetic storage interruption"); } };
    await assert.rejects(syncJob(db, "fixture", actor, "pa", input.id, failingStorage), /storage interruption/);
    assert.equal((await db.renderJob.findUniqueOrThrow({ where: { id: input.id } })).state, "RUNNING");
    assert.equal(submissions, 2, "saving failure must not submit another provider job");
    const done = await syncJob(db, "fixture", actor, "pa", input.id, io);
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
