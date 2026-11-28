import { hasBlobIdentity } from "../src/server/config.ts";
import { productionStore } from "../src/server/production-target.ts";
import { approvedSender } from "../src/server/release-service-checks.ts";
import { authReadiness, productionGoogleClientId } from "../src/server/auth-readiness.ts";
import { askPrana, pranaModel } from "../src/server/prana.ts";
import { verifyTestRenderQuote } from "../src/server/mnml-test-quote.ts";

// Read-only catalog lookups. No public route, application database, customer
// data, email send, inference request, wallet change or job submission.
export async function probeReleaseProviders(env, http = fetch) {
  if (env.VERCEL_ENV !== "production" || env.VERCEL_PROJECT_ID !== "prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0")
    throw new Error("Provider readiness requires the linked Vastu Nord Production build.");
  const mnml = (env.MNMLAPI || env.MNML_API_KEY)?.trim();
  const groq = (env.GroqAPI || env.GROQ_API_KEY)?.trim();
  const [priceCheck, groqCheck] = await Promise.allSettled([
    mnml?.startsWith("mk_live_") ? verifyTestRenderQuote(mnml, http) : null,
    (async () => {
      if (!groq?.startsWith("gsk_")) return false;
      const response = await http("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: "Bearer " + groq }, cache: "no-store", redirect: "error",
        signal: AbortSignal.timeout(6000),
      });
      return response.ok && (await response.json()).data?.some(model => model.id === pranaModel && model.active !== false) === true;
    })(),
  ]);
  return {
    authConfigurationReadyForActivation: authReadiness({ ...env, AUTH_ENABLED: "true" }).ready,
    mnmlApprovedCatalogAndBalance: priceCheck.status === "fulfilled" && priceCheck.value === 99000,
    groqAuthorizedModelListed: groqCheck.status === "fulfilled" && groqCheck.value === true,
    googleClientMatches: env.GOOGLE_CLIENT_ID === productionGoogleClientId,
    googleSecretConfigured: Boolean((env.GOOGLE_CLIENT_SECRET || env.GoogleOauth)?.trim()),
    resendSenderMatches: approvedSender(env.AUTH_EMAIL_FROM),
    resendConfigurationPresent: env.AUTH_EMAIL_PROVIDER === "resend" && Boolean(env.RESEND_API_KEY?.trim()),
    blobStoreMatches: env.BLOB_STORE_ID === productionStore,
    blobServerIdentityConfigured: hasBlobIdentity(env) || Boolean(env.BLOB_READ_WRITE_TOKEN),
  };
}

// Explicit operator test. Two fixed, synthetic questions, one attempt per language.
// No visitor data or token is written to the build output.
export async function checkPranaReplies(env, http = fetch) {
  if (env.VERCEL_ENV !== "production" || env.VERCEL_PROJECT_ID !== "prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0")
    throw new Error("Prana acceptance requires the linked Production build.");
  const key = (env.GroqAPI || env.GROQ_API_KEY)?.trim();
  if (!key?.startsWith("gsk_")) return { en: false, nb: false };
  const checks = [
    ["en", "Which lamp would suit a small reading corner? Please mention the lamp."],
    ["nb-NO", "Hva slags lampe passer til en liten lesekrok? Nevn lampen i svaret."],
  ];
  const replies = {};
  for (const [language, question] of checks) {
    const label = language === "en" ? "en" : "nb";
    try {
      const reply = await askPrana({ key, question, language }, http);
      replies[label] = reply.kind === "home" && (label === "en" ? /\b(lamp|light|reading)\b/i : /lampe|lesekrok|leselys/i).test(reply.answer);
    } catch {
      replies[label] = false;
    }
  }
  return replies;
}
