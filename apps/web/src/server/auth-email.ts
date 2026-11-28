import "server-only";
import { sendTransactionalEmail } from "./resend-delivery";
import { acceptanceEmailAllowed } from "./auth-readiness";
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
  if (!acceptanceEmailAllowed(to)) throw new Error("Invited recipient required");
  const { subject, text } = authEmailCopy(kind, authEmailLocale(request), link);
  await sendTransactionalEmail(to, subject, text);
}
