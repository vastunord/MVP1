import { createHmac, timingSafeEqual } from "node:crypto";

type Environment = Record<string, string | undefined>;
export type NewsletterLocale = "nb-NO" | "en";
export type NewsletterAction = "confirm" | "unsubscribe";
export type ConsentRequest = { email: string; locale: NewsletterLocale };
export const consentVersion = "newsletter-v1";
export const requestSource = "marketing-newsletter";
export const hour = 60 * 60 * 1000;

export function newsletterSettings(env: Environment, unsubscribe = false) {
  const production = env.APP_ENV === "production" && env.VERCEL_ENV === "production";
  if ((env.APP_ENV !== "development" && !production) ||
    ((env.VERCEL === "1" || env.VERCEL_ENV) && env.VERCEL_ENV !== env.APP_ENV) ||
    (production && !unsubscribe && env.COMMERCIAL_LAUNCH_APPROVED !== "true"))
    return null;
  if (
    !env.DATABASE_URL ||
    !env.NEWSLETTER_TOKEN_SECRET ||
    env.NEWSLETTER_TOKEN_SECRET.length < 32
  )
    return null;
  if (
    !unsubscribe &&
    (env.NEWSLETTER_ENABLED !== "true" ||
      env.AUTH_EMAIL_PROVIDER !== "resend" ||
      !env.RESEND_API_KEY ||
      !env.AUTH_EMAIL_FROM)
  )
    return null;
  try {
    const url = new URL(env.BETTER_AUTH_URL ?? "");
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (
      url.href !== url.origin + "/" ||
      (production && url.protocol !== "https:") ||
      (url.protocol !== "https:" && !(loopback && url.protocol === "http:"))
    )
      return null;
    return { origin: url.origin, secret: env.NEWSLETTER_TOKEN_SECRET };
  } catch {
    return null;
  }
}

export function consentRequest(
  body: Record<string, unknown>,
): ConsentRequest | null {
  if (
    body.consent !== true ||
    (body.locale !== "en" && body.locale !== "nb-NO") ||
    typeof body.email !== "string"
  )
    return null;
  const email = body.email.trim().toLowerCase();
  const parts = email.split("@");
  if (email.length > 254 || parts.length !== 2) return null;
  const [local, domain] = parts;
  const labels = domain.split(".");
  if (
    local.length > 64 ||
    !local
      .split(".")
      .every((part) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+$/.test(part)) ||
    labels.length < 2 ||
    !labels.every((label) =>
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
    )
  )
    return null;
  return { email, locale: body.locale };
}

function signature(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function linkSignature(action: NewsletterAction, body: string, secret: string) {
  // Material consent changes invalidate unconfirmed requests; withdrawal links stay valid.
  const scope =
    action === "confirm" ? "confirm:" + consentVersion : "unsubscribe";
  return signature(secret, scope + "." + body);
}

export function newsletterToken(
  action: NewsletterAction,
  id: string,
  now: Date,
  secret: string,
) {
  const expires = action === "confirm" ? now.getTime() + 24 * hour : 0;
  const body = `${id}.${expires}`;
  return `${body}.${linkSignature(action, body, secret)}`;
}

export function subscriberFromToken(
  action: NewsletterAction,
  token: unknown,
  now: Date,
  secret: string,
) {
  if (typeof token !== "string") return null;
  const match =
    /^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\.(0|\d{13})\.([A-Za-z0-9_-]{43})$/.exec(
      token,
    );
  if (!match) return null;
  const [, id, expires, mac] = match;
  if (action === "confirm" ? Number(expires) <= now.getTime() : expires !== "0")
    return null;
  return timingSafeEqual(
    Buffer.from(mac),
    Buffer.from(linkSignature(action, id + "." + expires, secret)),
  )
    ? id
    : null;
}

export function rateWindow(now: Date, client: string, secret: string) {
  const bucket = Math.floor(now.getTime() / hour);
  return {
    clientKey: signature(secret, "request-limit:" + bucket + ":" + client),
    globalKey: "site:" + bucket,
    expiresAt: new Date((bucket + 1) * hour),
  };
}

export interface NewsletterStore {
  reserve(
    input: ConsentRequest,
    now: Date,
    window: ReturnType<typeof rateWindow>,
  ): Promise<
    { status: "limited" | "duplicate" } | { status: "reserved"; id: string }
  >;
  releaseFailedAttempt(id: string, now: Date): Promise<void>;
  apply(action: NewsletterAction, id: string, now: Date): Promise<boolean>;
}

export type SendNewsletterMail = (
  email: string,
  subject: string,
  text: string,
) => Promise<void>;

export async function requestConfirmation(
  store: NewsletterStore,
  send: SendNewsletterMail,
  input: ConsentRequest,
  settings: { origin: string; secret: string },
  client: string,
  now = new Date(),
) {
  const reservation = await store.reserve(
    input,
    now,
    rateWindow(now, client, settings.secret),
  );
  if (reservation.status !== "reserved") return reservation.status;
  const { id } = reservation;
  const base =
    settings.origin + (input.locale === "en" ? "/en" : "") + "/newsletter/";
  const link = (action: NewsletterAction) =>
    base + action + "#" + newsletterToken(action, id, now, settings.secret);
  const english = input.locale === "en";
  const subject = english
    ? "Confirm your Vastu Nord newsletter request"
    : "Bekreft påmeldingen til Vastu Nords nyhetsbrev";
  const text = english
    ? `Confirm your email within 24 hours to receive our newsletter.\n\n${link("confirm")}\n\nIf you did not request this, you can ignore it. To stop invitations or unsubscribe:\n${link("unsubscribe")}`
    : `Bekreft e-postadressen innen 24 timer for å motta nyhetsbrevet.\n\n${link("confirm")}\n\nHvis du ikke ba om dette, kan du se bort fra meldingen. Stopp invitasjoner eller meld deg av:\n${link("unsubscribe")}`;
  try {
    await send(input.email, subject, text);
  } catch {
    await store.releaseFailedAttempt(id, now);
    throw new Error("Newsletter delivery unavailable");
  }
  return "requested" as const;
}
