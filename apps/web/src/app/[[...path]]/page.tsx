import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Marketing, Footer, publicPages } from "@/components/marketing";
import { AuthScreen } from "@/components/auth-screens";
import { authReadiness } from "@/server/auth-readiness";
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
  return {
    title: page && page in t ? t[page as MessageKey] : "Vastu Nord",
    description: t.intro,
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
  if (
    segments.length > 1 ||
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
  if (authPage === "onboarding" && authState.ready) {
    const { auth } = await import("@/server/auth");
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.emailVerified) redirect(publicHref("/login", locale));
  }
  return (
    <>
      <Header locale={locale} theme={theme} authReady={authState.ready} />
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
          page={segments[0]}
          authReady={authState.ready}
        />
      )}
      <Footer locale={locale} />
    </>
  );
}
