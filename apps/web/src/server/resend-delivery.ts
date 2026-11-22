import "server-only";

/** Server-side transactional mail. Provider responses may contain recipient information. */
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  text: string,
) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (process.env.AUTH_EMAIL_PROVIDER !== "resend" || !key || !from)
    throw new Error("Transactional email delivery is unconfigured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Transactional email delivery failed");
}
