import "server-only";
import { sendTransactionalEmail } from "./resend-delivery";
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
  const { subject, text } = authEmailCopy(kind, authEmailLocale(request), link);
  await sendTransactionalEmail(to, subject, text);
}
