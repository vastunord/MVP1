import { notFound, redirect } from "next/navigation";
import { indexableSections, publicIndexingEnabled, publicPageUrls } from "@/lib/public-index";
import { sitemapOrigin } from "@/server/discovery";
import { marketingResources } from "@/lib/marketing-resources";
import { visualStudy } from "@/lib/visual-studies";
import { Journal, readJournalEntry } from "@/components/journal";
import { journalOrigin } from "@/server/journal";
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
import { studioAuthQuery } from "@/lib/studio-return";
type Props = { params: Promise<{ path?: string[] }>; searchParams: Promise<{page?:string | string[]; intent?:string | string[]; returnTo?:string | string[]}> };
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
      ? visualStudy(segments[1], locale) ?? marketingResources(locale).articles.find(
          (item) => item.id === segments[1],
        )
      : undefined;
  const journal = page === "resources" && segments[1] === "journal" && Boolean(journalOrigin(process.env));
  const journalArticle = journal && segments.length === 3 ? await readJournalEntry(segments[2],locale) : null;
  const alternateUrls = publicPageUrls("/" + segments.join("/"), sitemapOrigin(process.env));
  const index = publicIndexingEnabled(process.env) &&
    (segments.length <= 1 ? indexableSections.some(section => section === (page || "")) : Boolean(article || journalArticle || (journal && segments.length===2)));
  return {
    title: !page ? { absolute: "Vastu Nord" } :
      journalArticle?.title ?? article?.name ?? (journal ? (locale==="en"?"Journal":"Tidsskrift") : undefined) ??
      (page === "gallery" ? (locale === "en" ? "Gallery" : "Galleri") : page === "privacy" ? privacyTitle(locale) : page && page in t ? t[page as MessageKey] : "Vastu Nord"),
    description: journalArticle?.summary ?? article?.intro ?? (page === "gallery"
      ? (locale === "en" ? "Browse Vastu Nord’s architectural studies by subject and explore a photo in Studio." : "Bla i Vastu Nords arkitekturstudier etter motiv og utforsk et bilde i Studio.")
      : t.intro),
    alternates: {
      canonical: alternateUrls[locale],
      languages: alternateUrls,
    },
    robots: { index, follow: index },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale, segments } = resolve((await params).path);
  if (segments.join("/") === "solutions/living-room-design")
    redirect(publicHref("/features", locale));
  const journal = segments[0]==="resources" && segments[1]==="journal" && segments.length<=3 && Boolean(journalOrigin(process.env));
  const pageNumber = journal ? Number((await searchParams).page ?? 1) : 1;
  if (!Number.isSafeInteger(pageNumber) || pageNumber<1 || pageNumber>10000) notFound();
  const supportedArticle =
    segments.length === 2 &&
    segments[0] === "resources" &&
    (Boolean(visualStudy(segments[1], locale)) ||
      marketingResources(locale).articles.some((item) => item.id === segments[1]));
  if (
    (segments.length > 1 && !supportedArticle && !journal) ||
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
    if (authPage === "onboarding" && !signedIn) {
      const requested = await searchParams;
      const intent = studioAuthQuery(requested.intent === "room-upload", requested.returnTo);
      redirect(publicHref("/login", locale) + (intent ? "?" + intent : ""));
    }
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
      {journal ? <main id="main" className="mk-site"><Journal locale={locale} slug={segments[2]} page={pageNumber}/></main> : authPage ? (
        <AuthScreen
          locale={locale}
          mode={authPage}
          enabled={authState.ready}
          providers={authState.providers}
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
