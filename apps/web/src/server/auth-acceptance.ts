import type { BetterAuthOptions } from "better-auth";
import { APIError, createAuthMiddleware, getAuthoritativeSessionFromCtx } from "better-auth/api";
import { acceptanceEmailAllowed, controlledAcceptance, verifiedSessionUserId } from "./auth-readiness.ts";

type Environment = Record<string, string | undefined>;
const emailEntryPaths = new Set(["/sign-up/email", "/sign-in/email", "/send-verification-email", "/request-password-reset"]);

export function acceptanceIdentityPolicy(env: Environment) {
  const validateUserInfo: NonNullable<NonNullable<BetterAuthOptions["user"]>["validateUserInfo"]> =
    ({ user, source }) => {
      if (!controlledAcceptance(env)) return;
      if (!acceptanceEmailAllowed(user.email, env)) return { error: "acceptance_invitation_required" };
      if (source.method !== "oauth") return;
      if (source.oauth?.providerId !== "google" || user.emailVerified !== true)
        return { error: "verified_google_identity_required" };
      // On an externally hosted address, Google email_verified alone does not
      // prove current mailbox control. Require email signup then explicit linking.
      if (source.action === "create-user" && source.oauth.profile?.hd !== "vastu.no")
        return { error: "verify_email_then_link_google" };
    };
  return {
    user: { modelName: "User", validateUserInfo },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (emailEntryPaths.has(ctx.path) && !acceptanceEmailAllowed(ctx.body?.email, env))
          throw new APIError("FORBIDDEN", {code: "ACCEPTANCE_INVITATION_REQUIRED", message: "This test is available to invited participants."});
        if (controlledAcceptance(env) && ctx.path === "/link-social" &&
            !verifiedSessionUserId(await getAuthoritativeSessionFromCtx(ctx), env))
          throw new APIError("UNAUTHORIZED", {code: "VERIFIED_SESSION_REQUIRED", message: "Sign in with your verified email before connecting Google."});
      }),
    },
    account: {
      modelName: "Account", encryptOAuthTokens: true,
      accountLinking: { enabled: controlledAcceptance(env), disableImplicitLinking: true, requireLocalEmailVerified: true, allowDifferentEmails: false },
      storeStateStrategy: "database" as const, skipStateCookieCheck: false,
    },
  };
}
