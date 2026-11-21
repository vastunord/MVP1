export type AuthReadiness = {
  ready: boolean;
  missing: string[];
  googleReady: boolean;
};

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

export function authReadiness(
  env: Record<string, string | undefined> = process.env,
): AuthReadiness {
  const missing: string[] = [];
  if (!env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32)
    missing.push("BETTER_AUTH_SECRET");
  if (env.AUTH_EMAIL_PROVIDER !== "resend") missing.push("AUTH_EMAIL_PROVIDER");
  if (!env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!env.AUTH_EMAIL_FROM) missing.push("AUTH_EMAIL_FROM");
  if (
    env.APP_ENV === "production" &&
    !env.BETTER_AUTH_URL?.startsWith("https://")
  )
    missing.push("BETTER_AUTH_URL");
  const googleReady =
    env.GOOGLE_OAUTH_ENABLED === "true" &&
    Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  if (
    env.GOOGLE_OAUTH_ENABLED &&
    !["true", "false"].includes(env.GOOGLE_OAUTH_ENABLED)
  )
    missing.push("GOOGLE_OAUTH_ENABLED");
  if (env.GOOGLE_OAUTH_ENABLED === "true" && !googleReady)
    missing.push("Google OAuth credentials");
  if (Boolean(env.GOOGLE_CLIENT_ID) !== Boolean(env.GOOGLE_CLIENT_SECRET))
    missing.push("GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET pair");
  return { ready: missing.length === 0, missing, googleReady };
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
