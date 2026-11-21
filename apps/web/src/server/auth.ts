import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createDatabase } from "./db";
import { sendAuthEmail } from "./auth-email";

const google =
  process.env.GOOGLE_OAUTH_ENABLED === "true" &&
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          requireEmailVerification: true,
        },
      }
    : {};

export const auth = betterAuth({
  database: prismaAdapter(createDatabase(), { provider: "postgresql" }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
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
  socialProviders: google,
  user: { modelName: "User" },
  session: { modelName: "Session" },
  account: {
    modelName: "Account",
    encryptOAuthTokens: true,
    accountLinking: { enabled: false },
  },
  verification: { modelName: "Verification" },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "RateLimit",
    window: 60,
    max: 30,
  },
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : [],
});
