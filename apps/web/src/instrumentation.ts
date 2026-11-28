export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.VERCEL_ENV === "production" &&
    process.env.VN_VERIFY_RELEASE === "1" &&
    process.env.VERCEL_PROJECT_ID === "prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0"
  ) {
    console.info("VN staged runtime configuration", {
      databasePresent: Boolean(process.env.DATABASE_URL),
      authSecretPresent: Boolean(process.env.BETTER_AUTH_SECRET),
      releaseOrigin: process.env.BETTER_AUTH_URL === "https://vastunord-web.vercel.app",
      senderConfigured: Boolean(process.env.RESEND_API_KEY && process.env.AUTH_EMAIL_FROM),
      mnmlConfigured: Boolean(process.env.MNMLAPI || process.env.MNML_API_KEY),
      blobStoreConfigured: Boolean(process.env.BLOB_STORE_ID),
    });
    await import("../scripts/verify-production-target.mjs");
  }
}
