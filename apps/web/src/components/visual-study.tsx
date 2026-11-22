import Link from "next/link";
import { publicHref, type Locale } from "@/lib/i18n";
import { relatedVisualStudies, type visualStudy } from "@/lib/visual-studies";
import { Action, Photo, Section } from "./marketing-elements";
import "./visual-study.css";

const regions = [
  ["øverst til venstre", "top left"],
  ["øverst i midten", "top centre"],
  ["øverst til høyre", "top right"],
  ["midt til venstre", "middle left"],
  ["i midten", "centre"],
  ["midt til høyre", "middle right"],
  ["nederst til venstre", "bottom left"],
  ["nederst i midten", "bottom centre"],
  ["nederst til høyre", "bottom right"],
] as const;

export function VisualStudy({
  study,
  locale,
}: {
  study: NonNullable<ReturnType<typeof visualStudy>>;
  locale: Locale;
}) {
  const en = locale === "en";
  const translate = (nb: string, eng: string) => (en ? eng : nb);
  const high = Math.max(...study.light);
  const low = Math.min(...study.light);
  const lightest = regions[study.light.indexOf(high)][en ? 1 : 0];
  const darkest = regions[study.light.indexOf(low)][en ? 1 : 0];
  return (
    <article className="visual-study">
      <div className="study-intro">
        <div>
          <Link href={publicHref("/resources", locale)}>
            {translate("← Alle guider", "← All guides")}
          </Link>
          <p className="mk-label">{study.topic}</p>
          <h1>{study.name}</h1>
          <p>{study.intro}</p>
        </div>
        <figure>
          <Photo name={study.image} alt={study.intro} />
          <figcaption>
            {translate(
              "Designstudie fra Vastu Nord",
              "Vastu Nord design study",
            )}
          </figcaption>
        </figure>
      </div>
      <Section>
        <div className="study-reading">
          <div>
            <h2>{translate("Se nærmere", "Look closer")}</h2>
            <p>{study.exercise}</p>
            <h2>{translate("Prøv i ditt eget rom", "Try it in your space")}</h2>
            <p>{study.check}</p>
            <Action href="/app/library">
              {translate("Åpne Studio", "Open Studio")}
            </Action>
          </div>
          <aside
            aria-label={translate(
              "Bildets farger og lys",
              "Colour and light in this image",
            )}
          >
            <h2>{translate("Paletten i bildet", "The image palette")}</h2>
            <ul className="study-palette">
              {study.palette.map((hex, i) => (
                <li key={i}>
                  <span style={{ backgroundColor: "#" + hex }} />
                  <code>#{hex.toUpperCase()}</code>
                </li>
              ))}
            </ul>
            <p>
              {translate(
                "Tre av de mest utbredte fargegruppene, hentet fra selve illustrasjonen. Sammenlign fysiske prøver i rommet før du velger overflate.",
                "Three prevalent colour groups sampled from this illustration. Compare physical samples in the room before choosing a finish.",
              )}
            </p>
            <h2>
              {translate("Hvor faller lyset?", "Where does the light fall?")}
            </h2>
            <div className="study-tones" aria-hidden="true">
              {study.light.map((n, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: `rgb(${n} ${n} ${n})` }}
                />
              ))}
            </div>
            <p>
              {en
                ? `Across nine equal areas, the brightest average is at the ${lightest} (${high}/255) and the darkest at the ${darkest} (${low}/255). Look back at the illustration to see which surfaces account for that difference.`
                : `Av ni like store felt er gjennomsnittet lysest ${lightest} (${high}/255) og mørkest ${darkest} (${low}/255). Se på illustrasjonen igjen og finn flatene som skaper forskjellen.`}
            </p>
          </aside>
        </div>
      </Section>
      <Section tone="sand">
        <h2>{translate("Les videre", "Related reading")}</h2>
        <div className="study-related">
          {relatedVisualStudies(study.id, locale).map((item) => (
            <Link
              key={item.id}
              href={publicHref("/resources/" + item.id, locale)}
            >
              {item.name} ↗
            </Link>
          ))}
        </div>
      </Section>
    </article>
  );
}
