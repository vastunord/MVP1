import Link from "next/link";
import Image from "next/image";
import { messages, publicHref, type Locale } from "@/lib/i18n";
import { MarketingHome } from "./marketing-home";
import { MarketingPages } from "./marketing-pages";
import { readServerConfig } from "@/server/config";
import "./marketing-v5.css";

export const publicPages = [
  "features",
  "about",
  "pricing",
  "resources",
  "contact",
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
  return (
    <main id="main" className="mk-site">
      {page ? (
        <MarketingPages locale={locale} page={page} authReady={authReady} />
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
        [t.library, "/app/library"],
      ],
    ],
    [
      "Studio",
      [
        [t.home, "/app"],
        [locale === "en" ? "Image studies" : "Bildestudier", "/app/renders"],
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
        <small>{t.foundation}</small>
      </div>
    </footer>
  );
}
