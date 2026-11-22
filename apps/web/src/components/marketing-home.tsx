import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { Action, Closing, Photo, Section } from "./marketing-elements";
import { HomePhotoHero } from "./home-photo-hero";
import { HomeQuestions } from "./home-questions";

const directions = [
  {
    tool: "room-reimagination",
    no: "Gi rommet ny form",
    en: "Reimagine a room",
    symbol: "⌂",
  },
  {
    tool: "lighting-reimagination",
    no: "Endre lyset i rommet",
    en: "Change the lighting",
    symbol: "☼",
  },
  {
    tool: "material-refinement",
    no: "Prøv nye materialer",
    en: "Explore materials",
    symbol: "◈",
  },
  {
    tool: "furniture-refresh",
    no: "Forny møblene",
    en: "Refresh the furniture",
    symbol: "⌗",
  },
] as const;
export function MarketingHome({
  locale,
  uploadsEnabled,
}: {
  locale: Locale;
  uploadsEnabled: boolean;
}) {
  const en = locale === "en";
  const t = (nb: string, english: string) => (en ? english : nb);
  return (
    <>
      <HomePhotoHero locale={locale} uploadsEnabled={uploadsEnabled} />
      <section className="home-start" aria-labelledby="home-goal">
        <div className="mk-start">
          <h2 id="home-goal">
            {t("Hva vil du forvandle?", "What do you want to transform?")}
          </h2>
          <div className="mk-quick">
            {directions.map((direction) => (
              <Link key={direction.tool} href={"/app/tools/" + direction.tool}>
                <b aria-hidden="true">{direction.symbol}</b>
                {en ? direction.en : direction.no}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Section>
        <div className="mk-split">
          <div>
            <p className="mk-label">
              {t("Muligheten", "The possibility")}
            </p>
            <h2>
              {t(
                "Det vanskeligste er å se hva som er mulig.",
                "The hardest part isn’t creating. It’s seeing what’s possible.",
              )}
            </h2>
            <p>
              {t(
                "Ett rom kan romme mange ideer. Se hvordan en liten endring i lys eller fargetone oppleves, før du velger retning.",
                "One room can hold many ideas. See how a small shift in light or colour feels before choosing a direction.",
              )}
            </p>
            <Action href="/app/library">
              {t("Åpne Studio", "Open Studio")}
            </Action>
          </div>
          <div className="mk-mosaic">
            <Photo name="editorial/home-mosaic-center" />
            <div>
              {[
                "editorial/home-mosaic-light",
                "editorial/home-mosaic-warm",
                "editorial/home-mosaic-wood",
                "editorial/home-mosaic-garden",
              ].map((n) => (
                <Photo key={n} name={n} />
              ))}
            </div>
          </div>
        </div>
      </Section>
      <HomeQuestions locale={locale} />
      <Closing
        photo="home-close"
        locale={locale}
        title={t(
          "Begynn med en idé. Se hvor den tar deg.",
          "Start with an idea. See where it takes you.",
        )}
      />
    </>
  );
}
