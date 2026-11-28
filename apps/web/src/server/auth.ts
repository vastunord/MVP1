import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createDatabase } from "./db";
import { sendAuthEmail } from "./auth-email";
import { authBaseUrl, oauthConfiguration } from "./auth-readiness";
import { acceptanceIdentityPolicy } from "./auth-acceptance";

const baseURL = authBaseUrl();

export const auth = betterAuth({
  database: prismaAdapter(createDatabase(), { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }, request) =>
      sendAuthEmail(user.email, "password-reset", url, request),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }, request) =>
      sendAuthEmail(user.email, "verification", url, request),
  },
  ...oauthConfiguration(process.env),
  ...acceptanceIdentityPolicy(process.env),
  session: { modelName: "Session" },
  verification: { modelName: "Verification" },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "RateLimit",
    window: 60,
    max: 30,
  },
});
