import Link from "next/link";
import Image from "next/image";
import { messages, publicHref, type Locale } from "@/lib/i18n";
import { MarketingHome } from "./marketing-home";
import { CookieSettingsButton } from "./visitor-overlays";
import { PrivacyNotice } from "./privacy-notice";
import { TermsNotice } from "./terms-notice";
import { MarketingPages } from "./marketing-pages";
import { VisualStudy } from "./visual-study";
import { visualStudy, visualStudyCards } from "@/lib/visual-studies";
import { readServerConfig } from "@/server/config";
import { newsletterAvailable } from "@/server/newsletter-runtime";
import { Gallery } from "./workspace-gallery";
import { journalOrigin } from "@/server/journal";
import "./marketing-v5.css";

export const publicPages = [
  "features",
  "gallery",
  "about",
  "pricing",
  "resources",
  "contact",
  "privacy",
  "terms",
  "login",
  "signup",
  "forgot-password",
  "reset-password",
  "verify-email",
  "onboarding",
] as const;

export function Marketing({
  locale,
  page = "",
  authReady = false,
}: {
  locale: Locale;
  page?: string;
  authReady?: boolean;
}) {
  const study = page.startsWith("resources/") ? visualStudy(page.slice(10), locale) : undefined;
  return (
    <main id="main" className="mk-site">
      {page === "gallery" ? (
        <div className="mk-wrap vn-public-gallery"><Gallery locale={locale} publicCollection /></div>
      ) : page === "privacy" ? (
        <PrivacyNotice locale={locale} newsletterEnabled={newsletterAvailable()} />
      ) : page === "terms" ? (
        <TermsNotice locale={locale} />
      ) : study ? (
        <VisualStudy study={study} locale={locale} />
      ) : page ? (
        <>
          <MarketingPages locale={locale} page={page} authReady={authReady}
            studyCards={page === "resources" ? visualStudyCards(locale) : undefined} />
          {page === "resources" && journalOrigin(process.env) && <div className="mk-wrap"><Link className="mk-action" href={publicHref("/resources/journal",locale)}>{locale==="en"?"Read the editorial journal":"Les tidsskriftet"} <span aria-hidden="true">↗</span></Link></div>}
        </>
      ) : (
        <MarketingHome
          locale={locale}
          uploadsEnabled={authReady && readServerConfig().uploadsEnabled}
        />
      )}
    </main>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = messages(locale);
  const groups = [
    [
      locale === "en" ? "Solutions" : "Løsninger",
      [
        [t.features, publicHref("/features", locale)],
        [t.open, "/app/library"],
      ],
    ],
    [
      "Studio",
      [
        [locale === "en" ? "Overview" : "Oversikt", "/app"],
        [locale === "en" ? "Gallery" : "Galleri", publicHref("/gallery", locale)],
      ],
    ],
    [
      locale === "en" ? "Company" : "Om oss",
      [
        [t.about, publicHref("/about", locale)],
        [t.resources, publicHref("/resources", locale)],
        [t.contact, publicHref("/contact", locale)],
      ],
    ],
  ] as const;
  return (
    <footer className="mk-footer">
      <div className="mk-wrap">
        <div className="mk-footer-main">
          <div>
            <Image
              unoptimized
              src="/brand/vastunord-primary-ivory.svg"
              width={217}
              height={20}
              alt="Vastu Nord"
            />
            <p>{t.foot}</p>
          </div>
          {groups.map(([label, links]) => (
            <div key={label}>
              <strong>{label}</strong>
              {links.map(([name, url]) => (
                <Link href={url} key={url}>
                  {name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="vn-footer-privacy">
          <Link href={publicHref("/terms", locale)}>{locale === "en" ? "Terms of use" : "Bruksvilkår"}</Link>
          <Link href={publicHref("/privacy", locale)}>{locale === "en" ? "Privacy and cookies" : "Personvern og informasjonskapsler"}</Link>
          <CookieSettingsButton locale={locale} />
        </div>
        <small>{t.foundation}. {locale === "en"
          ? "Images and AI suggestions illustrate design ideas. Verify dimensions, costs and safety with a qualified professional."
          : "Bilder og AI-forslag illustrerer designideer. Avklar mål, kostnader og sikkerhet med fagfolk."}</small>
      </div>
    </footer>
  );
}
