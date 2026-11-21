export type Unavailable = { status: "unavailable"; reason: "not-configured" };
export type Result<T> = { status: "ready"; data: T } | Unavailable;
export interface Identity {
  userId: string;
  workspaceId: string;
}
export interface Authentication {
  session(): Promise<Result<Identity>>;
}
export interface ProjectRepository {
  list(
    identity: Identity,
  ): Promise<Result<readonly { id: string; name: string }[]>>;
}
export interface MediaStorage {
  uploadGrant(
    identity: Identity,
    input: { type: string; bytes: number },
  ): Promise<Result<{ url: string; expiresAt: string }>>;
}
export interface Generation {
  submit(
    identity: Identity,
    input: { toolId: string; assetId: string; configVersion: number },
  ): Promise<Result<{ jobId: string }>>;
}
export interface BackgroundJobs {
  status(
    identity: Identity,
    jobId: string,
  ): Promise<Result<{ state: "queued" | "running" | "failed" | "succeeded" }>>;
}
export interface Wallet {
  balance(identity: Identity): Promise<Result<{ credits: number }>>;
}
export interface Billing {
  checkout(
    identity: Identity,
    approvedPriceId: string,
  ): Promise<Result<{ url: string }>>;
}
export interface ContentCMS {
  published(
    locale: string,
  ): Promise<Result<readonly { id: string; title: string }[]>>;
}
// Contracts only: no production-like mocks, SDKs, credentials or network calls.
export const integrationState = Object.freeze({
  auth: "unavailable",
  database: "unavailable",
  media: "unavailable",
  ai: "unavailable",
  jobs: "unavailable",
  wallet: "unavailable",
  billing: "unavailable",
  cms: "unavailable",
} as const);
