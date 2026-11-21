import "server-only";
import {
  authEmailCopy,
  authEmailLocale,
  type AuthEmailKind,
} from "./auth-email-copy";

export async function sendAuthEmail(
  to: string,
  kind: AuthEmailKind,
  link: string,
  request?: Request,
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (process.env.AUTH_EMAIL_PROVIDER !== "resend" || !key || !from)
    throw new Error("Authentication email delivery is unconfigured");
  const { subject, text } = authEmailCopy(kind, authEmailLocale(request), link);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Authentication email delivery failed");
}
