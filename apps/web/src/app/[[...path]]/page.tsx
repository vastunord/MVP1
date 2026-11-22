import { notFound, redirect } from "next/navigation";
import { marketingResources } from "@/lib/marketing-resources";
import { cookies, headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { CookieNotice } from "@/components/visitor-overlays";
import { Marketing, Footer, publicPages } from "@/components/marketing";
import { AuthScreen } from "@/components/auth-screens";
import { privacyTitle } from "@/components/privacy-notice";
import { authReadiness, verifiedSessionUserId } from "@/server/auth-readiness";
import { messages, publicHref, type Locale, type MessageKey } from "@/lib/i18n";
type Props = { params: Promise<{ path?: string[] }> };
function resolve(path: string[] = []) {
  const locale: Locale = path[0] === "en" ? "en" : "nb-NO";
  return { locale, segments: locale === "en" ? path.slice(1) : path };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments } = resolve((await params).path);
  const page = segments[0];
  const t = messages(locale);
  const article =
    page === "resources" && segments.length === 2
      ? marketingResources(locale).articles.find(
          (item) => item.id === segments[1],
        )
      : undefined;
  return {
    title:
      article?.name ??
      (page === "privacy" ? privacyTitle(locale) : page && page in t ? t[page as MessageKey] : "Vastu Nord"),
    description: article?.intro ?? t.intro,
    alternates: {
      languages: {
        "nb-NO": publicHref("/" + segments.join("/"), "nb-NO"),
        en: publicHref("/" + segments.join("/"), "en"),
      },
    },
  };
}
export default async function Page({ params }: Props) {
  const { locale, segments } = resolve((await params).path);
  if (segments.join("/") === "solutions/living-room-design")
    redirect(publicHref("/features", locale));
  const supportedArticle =
    segments.length === 2 &&
    segments[0] === "resources" &&
    marketingResources(locale).articles.some((item) => item.id === segments[1]);
  if (
    (segments.length > 1 && !supportedArticle) ||
    (segments[0] &&
      !publicPages.includes(segments[0] as (typeof publicPages)[number]))
  )
    notFound();
  const pref = (await cookies()).get("vn-theme")?.value;
  const theme = pref === "light" || pref === "dark" ? pref : "system";
  const authState = authReadiness();
  const authPages = [
    "login",
    "signup",
    "forgot-password",
    "reset-password",
    "verify-email",
    "onboarding",
  ] as const;
  const authPage =
    segments[0] && authPages.includes(segments[0] as (typeof authPages)[number])
      ? (segments[0] as (typeof authPages)[number])
      : null;
  let signedIn = false;
  if (authState.ready) {
    const requestHeaders = await headers();
    if (getSessionCookie(requestHeaders)) {
      const { auth } = await import("@/server/auth");
      const session = await auth.api.getSession({ headers: requestHeaders });
      signedIn = Boolean(verifiedSessionUserId(session));
    }
    if (authPage === "onboarding" && !signedIn)
      redirect(publicHref("/login", locale));
  }
  return (
    <>
      <Header
        locale={locale}
        theme={theme}
        authReady={authState.ready}
        signedIn={signedIn}
      />
      <CookieNotice locale={locale} />
      {authPage ? (
        <AuthScreen
          locale={locale}
          mode={authPage}
          enabled={authState.ready}
          googleReady={authState.googleReady}
        />
      ) : (
        <Marketing
          locale={locale}
          page={segments.join("/")}
          authReady={authState.ready}
        />
      )}
      <Footer locale={locale} />
    </>
  );
}
