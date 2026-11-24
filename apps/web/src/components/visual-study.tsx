import Link from "next/link";
import { publicHref, type Locale } from "@/lib/i18n";
import { relatedVisualStudies, type visualStudy } from "@/lib/visual-studies";
import { Action, Photo, Section } from "./marketing-elements";
import { KnowledgeReturn } from "./knowledge-return";
import "./visual-study.css";

export function VisualStudy({
  study,
  locale,
}: {
  study: NonNullable<ReturnType<typeof visualStudy>>;
  locale: Locale;
}) {
  const en = locale === "en";
  const translate = (nb: string, eng: string) => (en ? eng : nb);
  return (
    <article className="visual-study">
      <div className="study-intro">
        <div>
          <KnowledgeReturn locale={locale}>
            <span aria-hidden="true">← </span>{translate("Alle guider", "All guides")}
          </KnowledgeReturn>
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
              "Illustrerende farger og lys",
              "Illustrative colour and light",
            )}
          >
            <h2>{translate("Fargeinspirasjon", "Colour inspiration")}</h2>
            <ul className="study-palette" aria-hidden="true">
              {study.palette.map((hex, i) => (
                <li key={i}>
                  <span style={{ backgroundColor: "#" + hex }} />
                </li>
              ))}
            </ul>
            <p>
              {translate(
                "Fargene er kun til inspirasjon. Sammenlign fysiske prøver i rommet før du velger overflate.",
                "These colours are for inspiration only. Compare physical samples in the room before choosing a finish.",
              )}
            </p>
            <p>{translate("Bildet er en illustrasjon, ikke en måling av lys eller farger i et faktisk rom.", "This image is an illustration, not a measurement of light or colour in a real room.")}</p>
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
              {item.name} <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </Section>
    </article>
  );
}
