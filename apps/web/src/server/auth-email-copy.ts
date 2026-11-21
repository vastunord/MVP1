export type AuthEmailKind = "verification" | "password-reset";
export type AuthEmailLocale = "nb-NO" | "en";

export function authEmailLocale(request?: Request): AuthEmailLocale {
  const selected = request?.headers.get("x-vn-locale");
  if (selected === "en") return "en";
  if (selected === "nb-NO") return "nb-NO";
  const cookie = request?.headers.get("cookie") ?? "";
  return /(?:^|;\s*)vn-locale=en(?:;|$)/.test(cookie) ? "en" : "nb-NO";
}

export function authEmailCopy(
  kind: AuthEmailKind,
  locale: AuthEmailLocale,
  link: string,
) {
  if (locale === "en") {
    const subject =
      kind === "verification"
        ? "Vastu Nord — verify your email"
        : "Vastu Nord — reset your password";
    return {
      subject,
      text: `${subject}\n\nOpen this link to continue:\n${link}\n\nIf you did not request this, you can ignore this email.`,
    };
  }
  const subject =
    kind === "verification"
      ? "Vastu Nord — bekreft e-postadressen din"
      : "Vastu Nord — tilbakestill passordet ditt";
  return {
    subject,
    text: `${subject}\n\nÅpne denne lenken for å fortsette:\n${link}\n\nHvis du ikke ba om dette, kan du se bort fra e-posten.`,
  };
}
