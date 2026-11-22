import type { Locale } from "@/lib/i18n";
import "./privacy-notice.css";

export const privacyTitle = (locale: Locale) =>
  locale === "en" ? "Privacy and cookies" : "Personvern og informasjonskapsler";

export function PrivacyNotice({ locale }: { locale: Locale }) {
  const t = (nb: string, en: string) => (locale === "en" ? en : nb);
  return (
    <article className="vn-privacy">
      <h1>{privacyTitle(locale)}</h1>
      <p>
        {t(
          "Slik behandler Vastu Nord opplysninger når du besøker denne demonstrasjonen.",
          "Here is how Vastu Nord handles information when you visit this demonstration.",
        )}
      </p>
      <section>
        <h2>{t("Valg på enheten din", "Choices on your device")}</h2>
        <p>
          {t(
            "Nettleseren husker språk, utseende og personvernvalg. Samtykkevalget omfatter tidspunkt, versjon og hvilke kategorier du har valgt. Vi husker også om du har lukket nyhetsbrevinvitasjonen, slik at den ikke avbryter deg igjen.",
            "Your browser remembers your language, appearance and privacy choices. Your consent record includes the time, policy version and categories selected. We also remember whether you closed the newsletter invitation so it does not interrupt you again.",
          )}
        </p>
        <p>
          {t(
            "Bruk den runde knappen med informasjonskapselen nederst til venstre, eller velg «Innstillinger for informasjonskapsler» i bunnteksten, for å endre valgene dine. Du kan også slette lagrede nettstedsdata i nettleseren.",
            "Use the round cookie button at the bottom left or open Cookie settings in the footer to change your choices. You can also clear stored site data in your browser.",
          )}
        </p>
      </section>
      <section>
        <h2>{t("Statistikk og markedsføring", "Statistics and marketing")}</h2>
        <p>
          {t(
            "Begge kategoriene er av inntil du selv velger dem. Demonstrasjonen bruker ingen valgfrie analyseverktøy, sporingspiksler eller annonseskript. Du har tilgang til de samme sidene uansett hva du velger.",
            "Both categories start off until you choose them. This demo uses no optional analytics tools, tracking pixels or advertising scripts. You can browse the same pages with either choice.",
          )}
        </p>
      </section>
      <section>
        <h2>{t("Levering av nettsiden", "Delivering the site")}</h2>
        <p>
          {t(
            "Vercel leverer sidene og bildene. Nettleseren henter skrifttypen Zalando Sans Expanded fra Google Fonts. Ved slike forespørsler mottar leverandøren tekniske opplysninger, blant annet IP-adressen din.",
            "Vercel delivers the pages and images. Your browser requests Zalando Sans Expanded from Google Fonts. These requests share technical information, including your IP address, with the provider.",
          )}
        </p>
      </section>
      <section>
        <h2>{t("Nyhetsbrev", "Newsletter")}</h2>
        <p>
          {t(
            "Påmelding krever et eget valg og bekreftelse per e-post der tjenesten er aktiv. Listen bruker e-postadressen, språket, samtykketidspunktet og status for bekreftelse eller avmelding. Du kan melde deg av via lenken i e-posten. Dette er uavhengig av personvernvalgene dine og av om du bruker Studio.",
            "Where signup is available, joining requires separate consent and email confirmation. The list uses your email address, language, consent time and confirmation or withdrawal status. You can unsubscribe through the email link. This is independent of your cookie choices and use of Studio.",
          )}
        </p>
        <p>
          {t(
            "Den offentlige demonstrasjonen tar ikke imot e-postadresser til nyhetsbrevet.",
            "The public demonstration does not collect newsletter email addresses.",
          )}
        </p>
      </section>
      <section>
        <h2>{t("Kontakt om personvern", "Privacy enquiries")}</h2>
        <p>
          {t(
            "Du kan kontakte Vastu Nord om lagrede opplysninger eller be om innsyn, retting eller sletting.",
            "Contact Vastu Nord about information held about you or to request access, correction or deletion.",
          )}{" "}
          <a href="mailto:contact@vastu.no">contact@vastu.no</a>
        </p>
      </section>
    </article>
  );
}
