import Link from "next/link";
import { messages, publicHref, type Locale, type MessageKey } from "@/lib/i18n";
export const publicPages = [
  "features",
  "about",
  "pricing",
  "resources",
  "contact",
  "login",
  "signup",
  "forgot-password",
] as const;
export function Marketing({
  locale,
  page = "",
}: {
  locale: Locale;
  page?: string;
}) {
  const t = messages(locale);
  if (page)
    return (
      <main id="main" className="container page-pad">
        <p className="eyebrow">{t.foundation}</p>
        <h1>{t[page as MessageKey]}</h1>
        <section className="empty-section">
          <h2>{t.unavailable}</h2>
          <p>{t.emptyBody}</p>
          <p>{t.status}</p>
          <Link className="button" href="/app/library">
            {t.explore}
          </Link>
        </section>
      </main>
    );
  return (
    <main id="main">
      <section className="hero container">
        <div>
          <p className="eyebrow">VASTU NORD / {t.foundation}</p>
          <h1>{t.title}</h1>
          <p className="lede">{t.intro}</p>
          <Link className="button primary" href="/app/library">
            {t.explore}
            <span aria-hidden="true">↗</span>
          </Link>
          <p className="small">{t.actionHelp}</p>
        </div>
        <div
          className="space-study"
          aria-label={
            locale === "en"
              ? "Abstract layout study, not a generated image"
              : "Abstrakt planskisse, ikke et generert bilde"
          }
        >
          <div className="plan-grid">
            <div className="plan-room room-a" />
            <div className="plan-room room-b" />
            <div className="plan-room room-c" />
            <span className="plan-point" />
          </div>
          <span className="study-caption">
            {locale === "en"
              ? "SPACE / A STUDY OF POSSIBILITIES"
              : "ROM / EN STUDIE AV MULIGHETER"}
          </span>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <p className="eyebrow">01 / STUDIO</p>
          <h2>{t.library}</h2>
          <p>{t.libraryIntro}</p>
        </div>
        <div className="pillar-grid">
          {[
            "Interior Design",
            "Exterior & Landscape",
            "Virtual Staging",
            "Image Enhancement",
          ].map((name, i) => (
            <Link className="category-card" href="/app/library" key={name}>
              <span className="serial">0{i + 1}</span>
              <h3>{t[name as MessageKey]}</h3>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section container">
        <p className="eyebrow">
          02 / {locale === "en" ? "THE PROCESS" : "PROSESSEN"}
        </p>
        <div className="steps">
          {[t.step1, t.step2, t.step3].map((s, i) => (
            <div key={s}>
              <span className="serial">0{i + 1}</span>
              <h3>{s}</h3>
            </div>
          ))}
        </div>
        <p className="small">{t.status}</p>
      </section>
    </main>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = messages(locale);
  return (
    <footer className="footer container">
      <div>
        <strong>Vastu Nord</strong>
        <p>{t.foot}</p>
      </div>
      <nav aria-label={locale === "en" ? "Footer" : "Bunnmeny"}>
        {["about", "resources", "contact"].map((k) => (
          <Link key={k} href={publicHref("/" + k, locale)}>
            {t[k as MessageKey]}
          </Link>
        ))}
      </nav>
      <p className="small">{t.foundation}</p>
    </footer>
  );
}
