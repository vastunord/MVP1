import { isIP } from "node:net";
import { isPreviewDatabase } from "./preview-target.ts";

export type OAuthProvider = "google" | "github" | "apple";
type Environment = Record<string, string | undefined>;
export type AuthReadiness = {
  ready: boolean;
  missing: string[];
  providers: OAuthProvider[];
};

export function authBaseUrl(
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  if (env.APP_ENV === "preview") {
    if (
      env.VERCEL_ENV !== "preview" ||
      !env.VERCEL_URL ||
      !/^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.vercel\.app$/i.test(env.VERCEL_URL)
    )
      return undefined;
    return `https://${env.VERCEL_URL}`;
  }
  try {
    const url = new URL(env.BETTER_AUTH_URL ?? "");
    const localHttp =
      env.APP_ENV !== "production" &&
      env.VERCEL_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      url.href === url.origin + "/" &&
      (url.protocol === "https:" || localHttp)
    )
      return url.origin;
  } catch {
    // The email/password and OAuth routes stay closed without a canonical origin.
  }
  return undefined;
}

export function isTrustedMutationOrigin(
  origin: string | null,
  authUrl: string | undefined,
): boolean {
  if (!origin || !authUrl) return false;
  try {
    const expected = new URL(authUrl);
    return (
      ["http:", "https:"].includes(expected.protocol) &&
      origin === expected.origin
    );
  } catch {
    return false;
  }
}

const appleOrigin = "https://appleid.apple.com";

function usableAppleSecret(token: string, clientId: string, now: number) {
  // Apple authenticates this signed client credential at exchange. Check its
  // configuration and expiry locally before presenting the sign-in option.
  if (token.length > 8192) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts.every((part) => /^[\w-]+$/.test(part)))
      return false;
    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return (
      header.alg === "ES256" &&
      Boolean(header.kid) &&
      Buffer.from(parts[2], "base64url").length === 64 &&
      Boolean(claims.iss) &&
      claims.sub === clientId &&
      claims.aud === appleOrigin &&
      Number.isSafeInteger(claims.iat) &&
      Number.isSafeInteger(claims.exp) &&
      claims.iat <= now &&
      claims.exp > now &&
      claims.exp - claims.iat <= 15_777_000
    );
  } catch {
    return false;
  }
}

export function oauthConfiguration(
  env: Environment,
  now = Math.floor(Date.now() / 1000),
) {
  const baseURL = authBaseUrl(env);
  const providers: Partial<
    Record<
      OAuthProvider,
      { clientId: string; clientSecret: string; requireEmailVerification: true }
    >
  > = {};
  for (const provider of ["google", "github", "apple"] as const) {
    const prefix = provider.toUpperCase();
    const clientId = env[prefix + "_CLIENT_ID"]?.trim();
    const clientSecret = env[prefix + "_CLIENT_SECRET"]?.trim();
    if (
      env[prefix + "_OAUTH_ENABLED"] !== "true" ||
      !clientId ||
      !clientSecret ||
      !baseURL
    )
      continue;
    if (provider === "apple") {
      if (!URL.canParse(baseURL)) continue;
      const url = new URL(baseURL);
      if (
        url.protocol !== "https:" ||
        !url.hostname.includes(".") ||
        url.hostname.endsWith(".localhost") ||
        isIP(url.hostname) ||
        !usableAppleSecret(clientSecret, clientId, now)
      )
        continue;
    }
    providers[provider] = {
      clientId,
      clientSecret,
      requireEmailVerification: true,
    };
  }
  return {
    socialProviders: providers,
    // Apple's form_post callback crosses sites. Keep the ordinary session cookie Lax.
    advanced: providers.apple
      ? {
          cookies: {
            state: {
              attributes: {
                httpOnly: true,
                secure: true,
                sameSite: "none" as const,
              },
            },
          },
        }
      : undefined,
    trustedOrigins: async (request?: Request) => {
      const origins = baseURL ? [baseURL] : [];
      if (
        providers.apple &&
        request?.method === "POST" &&
        new URL(request.url).origin === baseURL &&
        new URL(request.url).pathname === "/api/auth/callback/apple"
      )
        origins.push(appleOrigin);
      return origins;
    },
  };
}

export function authReadiness(
  env: Record<string, string | undefined> = process.env,
): AuthReadiness {
  const missing: string[] = [];
  if (env.VERCEL_ENV && env.APP_ENV !== env.VERCEL_ENV) missing.push("APP_ENV");
  if (
    (env.APP_ENV === "production" || env.VERCEL_ENV === "production") &&
    env.AUTH_ENABLED !== "true"
  )
    missing.push("AUTH_ENABLED");
  if (!env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32)
    missing.push("BETTER_AUTH_SECRET");
  if (env.AUTH_EMAIL_PROVIDER !== "resend") missing.push("AUTH_EMAIL_PROVIDER");
  if (!env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!env.AUTH_EMAIL_FROM) missing.push("AUTH_EMAIL_FROM");
  if (!authBaseUrl(env))
    missing.push(env.APP_ENV === "preview" ? "VERCEL_URL" : "BETTER_AUTH_URL");
  if (env.APP_ENV === "preview" && !isPreviewDatabase(env.DATABASE_URL))
    missing.push("Preview DATABASE_URL");
  const providers = Object.keys(
    oauthConfiguration(env).socialProviders,
  ) as OAuthProvider[];
  return { ready: missing.length === 0, missing, providers };
}

export function verifiedSessionUserId(session: unknown): string | null {
  if (!session || typeof session !== "object" || !("user" in session))
    return null;
  const user = session.user;
  if (
    !user ||
    typeof user !== "object" ||
    !("id" in user) ||
    !("emailVerified" in user)
  )
    return null;
  return typeof user.id === "string" &&
    user.id.length > 0 &&
    user.emailVerified === true
    ? user.id
    : null;
}
