import { randomUUID } from "node:crypto";

export type ProjectRow = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  creationKey: string | null;
  archivedAt: Date | null;
  deletedAt: Date | null;
};
export type PersonalWorkspace = {
  id: string;
  name: string;
  personalOwnerId: string | null;
};
export type ProjectStore = {
  workspaceFor(userId: string): Promise<PersonalWorkspace | null>;
  createWorkspace(userId: string, name: string): Promise<PersonalWorkspace>;
  list(workspaceId: string, archived: boolean): Promise<ProjectRow[]>;
  find(workspaceId: string, id: string): Promise<ProjectRow | null>;
  findByKey(workspaceId: string, key: string): Promise<ProjectRow | null>;
  create(
    workspaceId: string,
    name: string,
    description: string | null,
    key: string,
  ): Promise<ProjectRow>;
  update(
    workspaceId: string,
    id: string,
    values: Partial<
      Pick<ProjectRow, "name" | "description" | "archivedAt" | "deletedAt">
    >,
  ): Promise<ProjectRow>;
};

export class ProjectError extends Error {
  status: 400 | 403 | 404 | 409;
  constructor(status: 400 | 403 | 404 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

function title(value: unknown, label: string) {
  if (
    typeof value !== "string" ||
    value.trim().length < 2 ||
    value.trim().length > 100
  )
    throw new ProjectError(400, `Invalid ${label}`);
  return value.trim();
}
function description(value: unknown) {
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.length > 1000)
    throw new ProjectError(400, "Invalid description");
  return value.trim();
}
function safe(row: ProjectRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    archivedAt: row.archivedAt,
    deletedAt: row.deletedAt,
  };
}

export function projectService(store: ProjectStore) {
  async function workspace(userId: string) {
    const row = await store.workspaceFor(userId);
    if (!row || row.personalOwnerId !== userId)
      throw new ProjectError(403, "Personal workspace required");
    return row;
  }
  async function owned(userId: string, id: string) {
    const space = await workspace(userId);
    const row = await store.find(space.id, id);
    if (!row || row.deletedAt || row.workspaceId !== space.id)
      throw new ProjectError(404, "Project not found");
    return { space, row };
  }
  return {
    async createWorkspace(userId: string, rawName: unknown) {
      const name = title(rawName, "workspace name");
      const existing = await store.workspaceFor(userId);
      if (existing) return { id: existing.id, name: existing.name };
      try {
        const row = await store.createWorkspace(userId, name);
        return { id: row.id, name: row.name };
      } catch (error) {
        const raced = await store.workspaceFor(userId);
        if (raced) return { id: raced.id, name: raced.name };
        throw error;
      }
    },
    async getWorkspace(userId: string) {
      const row = await workspace(userId);
      return { id: row.id, name: row.name };
    },
    async list(userId: string, archived = false) {
      const space = await workspace(userId);
      return (await store.list(space.id, archived))
        .filter((p) => !p.deletedAt && Boolean(p.archivedAt) === archived)
        .map(safe);
    },
    async get(userId: string, id: string) {
      return safe((await owned(userId, id)).row);
    },
    async create(
      userId: string,
      rawName: unknown,
      rawDescription: unknown,
      key: unknown,
      independent = false,
    ) {
      const name = title(rawName, "project name");
      const detail = description(rawDescription);
      if (
        typeof key !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          key,
        )
      )
        throw new ProjectError(400, "Invalid request key");
      const space = await workspace(userId);
      // Independent work uses the same owned asset/job container. A separate
      // key namespace keeps retries distinct from named project requests.
      const creationKey = independent ? "independent:" + key : key;
      const prior = await store.findByKey(space.id, creationKey);
      if (prior) {
        if (
          (!independent && prior.name !== name) ||
          prior.description !== detail ||
          prior.deletedAt
        )
          throw new ProjectError(409, "Request key already used");
        return safe(prior);
      }
      try {
        return safe(await store.create(space.id, name, detail, creationKey));
      } catch (error) {
        const raced = await store.findByKey(space.id, creationKey);
        if (
          raced &&
          (independent || raced.name === name) &&
          raced.description === detail &&
          !raced.deletedAt
        )
          return safe(raced);
        if (raced) throw new ProjectError(409, "Request key already used");
        throw error;
      }
    },
    async update(
      userId: string,
      id: string,
      input: { name?: unknown; description?: unknown },
    ) {
      const { space } = await owned(userId, id);
      if (input.name === undefined && input.description === undefined)
        throw new ProjectError(400, "No changes supplied");
      const changes = {
        ...(input.name === undefined
          ? {}
          : { name: title(input.name, "project name") }),
        ...(input.description === undefined
          ? {}
          : { description: description(input.description) }),
      };
      return safe(await store.update(space.id, id, changes));
    },
    async archive(userId: string, id: string) {
      const { space, row } = await owned(userId, id);
      return safe(
        row.archivedAt
          ? row
          : await store.update(space.id, id, { archivedAt: new Date() }),
      );
    },
    async restore(userId: string, id: string) {
      const { space, row } = await owned(userId, id);
      return safe(
        row.archivedAt
          ? await store.update(space.id, id, { archivedAt: null })
          : row,
      );
    },
    async remove(userId: string, id: string, confirmation: unknown) {
      const { space, row } = await owned(userId, id);
      if (confirmation !== row.name)
        throw new ProjectError(400, "Project name confirmation required");
      await store.update(space.id, id, { deletedAt: new Date() });
      return { deleted: true };
    },
    newRequestKey: randomUUID,
  };
}
