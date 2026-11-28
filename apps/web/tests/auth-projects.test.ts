import { test } from "node:test";
import assert from "node:assert/strict";
import { studioAuthQuery, studioReturn } from "../src/lib/studio-return.ts";

test("only local Studio locations and recognized view parameters survive authentication", () => {
  for (const path of ["/app/tools/garden-design", "/app/projects/project-id", "/app/settings/security", "/app/library", "/app/renders?album=study-a", "/app/tools/room-reimagination#source-image"]) {
    assert.equal(studioReturn(path), path);
    assert.equal(new URLSearchParams(studioAuthQuery(false, path)).get("returnTo"), path);
  }
  for (const path of ["/api/assets/private/download", "//external.example", "https://external.example/app", "/app/%2f%2fexternal.example", "/app/../login", "/app/library?token=hidden", "/app/room\n", "/application"]) {
    assert.equal(studioReturn(path), null);
    assert.equal(studioAuthQuery(false, path), "");
  }
  assert.equal(studioAuthQuery(true, "https://external.example/"), "intent=room-upload");
});
import {
  authEmailCopy,
  authEmailLocale,
} from "../src/server/auth-email-copy.ts";
import {
  authReadiness,
  authBaseUrl,
  isTrustedMutationOrigin,
  verifiedSessionUserId,
} from "../src/server/auth-readiness.ts";
import {
  projectService,
  ProjectError,
  type ProjectRow,
  type ProjectStore,
  type PersonalWorkspace,
} from "../src/server/projects.ts";

const key = "80c7d7c8-7d98-4c44-9bd8-a2dd5bbfba16";

test("preview authentication uses only the platform-provided deployment origin", () => {
  const preview = {
    APP_ENV: "preview",
    VERCEL_ENV: "preview",
    VERCEL_URL: "vastu-test.vercel.app",
  };
  assert.equal(authBaseUrl(preview), "https://vastu-test.vercel.app");
  assert.equal(
    authBaseUrl({ ...preview, VERCEL_URL: "attacker.invalid" }),
    undefined,
  );
  assert.equal(
    authBaseUrl({
      ...preview,
      VERCEL_URL: "vastu-test.vercel.app.attacker.invalid",
    }),
    undefined,
  );
  assert.equal(
    authBaseUrl({ ...preview, VERCEL_ENV: "production" }),
    undefined,
  );
  assert.equal(
    authBaseUrl({
      APP_ENV: "development",
      BETTER_AUTH_URL: "http://127.0.0.1:3100",
    }),
    "http://127.0.0.1:3100",
  );
});

test("mutations require the configured authentication origin", () => {
  assert.equal(
    isTrustedMutationOrigin("http://127.0.0.1:3100", "http://127.0.0.1:3100"),
    true,
  );
  assert.equal(
    isTrustedMutationOrigin("http://localhost:3100", "http://127.0.0.1:3100"),
    false,
  );
  assert.equal(
    isTrustedMutationOrigin(
      "https://attacker.invalid",
      "http://127.0.0.1:3100",
    ),
    false,
  );
  assert.equal(isTrustedMutationOrigin(null, "http://127.0.0.1:3100"), false);
  assert.equal(
    isTrustedMutationOrigin("http://127.0.0.1:3100", undefined),
    false,
  );
  assert.equal(
    isTrustedMutationOrigin("http://127.0.0.1:3100", "invalid"),
    false,
  );
});

test("authentication emails respect selected locale and preserve the supplied link", () => {
  const link = "https://example.invalid/verify?token=synthetic";
  assert.equal(authEmailLocale(), "nb-NO");
  assert.equal(
    authEmailLocale(
      new Request("https://example.invalid", {
        headers: { cookie: "other=1; vn-locale=en" },
      }),
    ),
    "en",
  );
  assert.equal(
    authEmailLocale(
      new Request("https://example.invalid", {
        headers: { cookie: "vn-locale=en", "x-vn-locale": "nb-NO" },
      }),
    ),
    "nb-NO",
  );
  assert.equal(
    authEmailLocale(
      new Request("https://example.invalid", {
        headers: { "x-vn-locale": "en" },
      }),
    ),
    "en",
  );
  for (const kind of ["verification", "password-reset"] as const) {
    const norwegian = authEmailCopy(kind, "nb-NO", link);
    const english = authEmailCopy(kind, "en", link);
    assert.notEqual(norwegian.subject, english.subject);
    assert.ok(norwegian.text.includes(link));
    assert.ok(english.text.includes(link));
  }
});

function fixture() {
  const spaces = new Map<string, PersonalWorkspace>();
  const projects: ProjectRow[] = [];
  const store: ProjectStore = {
    async workspaceFor(userId) {
      return spaces.get(userId) ?? null;
    },
    async createWorkspace(userId, name) {
      const row = { id: `space-${userId}`, name, personalOwnerId: userId };
      spaces.set(userId, row);
      return row;
    },
    async list(workspaceId, archived) {
      return projects.filter(
        (row) =>
          row.workspaceId === workspaceId &&
          Boolean(row.archivedAt) === archived,
      );
    },
    async find(workspaceId, id) {
      return (
        projects.find(
          (row) => row.workspaceId === workspaceId && row.id === id,
        ) ?? null
      );
    },
    async findByKey(workspaceId, requestKey) {
      return (
        projects.find(
          (row) =>
            row.workspaceId === workspaceId && row.creationKey === requestKey,
        ) ?? null
      );
    },
    async create(workspaceId, name, detail, requestKey) {
      const row = {
        id: `project-${projects.length}`,
        workspaceId,
        name,
        description: detail,
        creationKey: requestKey,
        archivedAt: null,
        deletedAt: null,
      };
      projects.push(row);
      return row;
    },
    async update(workspaceId, id, values) {
      const row = projects.find(
        (item) => item.workspaceId === workspaceId && item.id === id,
      );
      if (!row) throw new Error("not found");
      Object.assign(row, values);
      return row;
    },
  };
  return { service: projectService(store), projects };
}

test("authentication is closed without database, secret and email delivery", () => {
  assert.equal(authReadiness({}).ready, false);
  assert.equal(
    authReadiness({
      DATABASE_URL: "postgresql://test",
      BETTER_AUTH_SECRET: "x".repeat(32),
      BETTER_AUTH_URL: "http://127.0.0.1:3100",
      AUTH_EMAIL_PROVIDER: "resend",
      RESEND_API_KEY: "test",
      AUTH_EMAIL_FROM: "test@example.test",
    }).ready,
    true,
  );
  assert.equal(verifiedSessionUserId(null), null);
  assert.equal(
    verifiedSessionUserId({ user: { id: "u1", emailVerified: false } }),
    null,
  );
  assert.equal(
    verifiedSessionUserId({ user: { id: "u1", emailVerified: true } }),
    "u1",
  );
});

test("production authentication stays closed until explicitly enabled", () => {
  const production={APP_ENV:'production',VERCEL_ENV:'production',DATABASE_URL:'postgresql://vastunord_prod_runtime:fixture@ep-shiny-block-bhmlplzm-pooler.c-10.eu-central-1.aws.neon.tech/neondb?sslmode=require',BETTER_AUTH_SECRET:'x'.repeat(32),BETTER_AUTH_URL:'https://vastunord-web.vercel.app',AUTH_EMAIL_PROVIDER:'resend',RESEND_API_KEY:'test',AUTH_EMAIL_FROM:'test@example.test'};
  assert.equal(authReadiness(production).ready,false);
  assert.equal(authReadiness({...production,AUTH_ENABLED:'false'}).ready,false);
  assert.equal(authReadiness({...production,AUTH_ENABLED:'true'}).ready,true);
  assert.equal(authReadiness({...production,AUTH_ENABLED:'true',DATABASE_URL:'postgresql://fixture.invalid/dev'}).ready,false);
  assert.equal(authReadiness({...production,AUTH_ENABLED:'true',BETTER_AUTH_URL:'https://unrelated.example.invalid'}).ready,false);
  assert.equal(authReadiness({...production,APP_ENV:undefined}).ready,false);
});

test("personal workspace creation is repeat-safe and cross-user projects are denied", async () => {
  const { service } = fixture();
  const one = await service.createWorkspace("alice", "Alice home");
  assert.deepEqual(await service.createWorkspace("alice", "Other name"), one);
  await service.createWorkspace("bob", "Bob home");
  const project = await service.create("alice", "Living room", null, key);
  assert.equal((await service.list("alice")).length, 1);
  assert.equal((await service.list("bob")).length, 0);
  await assert.rejects(
    service.get("bob", project.id),
    (error: unknown) => error instanceof ProjectError && error.status === 404,
  );
  await assert.rejects(
    service.update("bob", project.id, { name: "Stolen" }),
    /Project not found/,
  );
  await assert.rejects(service.archive("bob", project.id), /Project not found/);
  await assert.rejects(
    service.remove("bob", project.id, project.name),
    /Project not found/,
  );
});

test("duplicate creation returns the same project and rejects changed payload", async () => {
  const { service, projects } = fixture();
  await service.createWorkspace("alice", "Alice home");
  const first = await service.create("alice", "Garden", "Ideas", key);
  const retry = await service.create("alice", "Garden", "Ideas", key);
  assert.deepEqual(retry, first);
  assert.equal(projects.length, 1);
  await assert.rejects(
    service.create("alice", "Different name", "Ideas", key),
    /Request key already used/,
  );
  await assert.rejects(
    service.create("alice", "x", null, key),
    /Invalid project name/,
  );
});

test("independent work remains privately owned and retryable across locale changes", async () => {
  const { service, projects } = fixture();
  await service.createWorkspace("alice", "My workspace");
  await service.createWorkspace("bob", "My workspace");
  const first = await service.create("alice", "Untitled workspace", null, key, true);
  const retried = await service.create("alice", "Arbeidsområde uten navn", null, key, true);
  assert.deepEqual(first, retried);
  const named = await service.create("alice", "My kitchen", null, key);
  assert.notEqual(first.id, named.id);
  assert.equal(projects.length, 2);
  assert.deepEqual(await service.list("bob"), []);
  await assert.rejects(service.get("bob", first.id), /Project not found/);
});

test("archive, restore, metadata and deletion require owner and confirmation", async () => {
  const { service } = fixture();
  await service.createWorkspace("alice", "Alice home");
  const row = await service.create("alice", "Bedroom", null, key);
  assert.equal(
    (await service.update("alice", row.id, { description: "Warm materials" }))
      .description,
    "Warm materials",
  );
  await service.archive("alice", row.id);
  assert.equal((await service.list("alice")).length, 0);
  assert.equal((await service.list("alice", true)).length, 1);
  await service.restore("alice", row.id);
  await assert.rejects(
    service.remove("alice", row.id, "wrong"),
    /confirmation required/,
  );
  await service.remove("alice", row.id, "Bedroom");
  await assert.rejects(service.get("alice", row.id), /Project not found/);
});
