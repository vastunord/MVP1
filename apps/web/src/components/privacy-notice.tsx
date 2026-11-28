import type { Locale } from "@/lib/i18n";
import "./privacy-notice.css";

export const privacyTitle = (locale: Locale) =>
  locale === "en" ? "Privacy and cookies" : "Personvern og informasjonskapsler";

export function PrivacyNotice({ locale, newsletterEnabled }: { locale: Locale; newsletterEnabled: boolean }) {
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
            "Vercel leverer sidene, bildene og skrifttypen Inter fra nettstedet vårt. Ved slike forespørsler mottar Vercel tekniske opplysninger, blant annet IP-adressen din.",
            "Vercel delivers the pages, images and Inter font from our website. Vercel receives technical information, including your IP address, when serving these requests.",
          )}
        </p>
      </section>
      <section>
        <h2>Prana</h2>
        <p>{t("Når du ber om et direktesvar, sendes spørsmålet til Groq for å lage svaret. Unngå adresser og andre personopplysninger. Spørsmål og svar vises midlertidig i appen. Vastu Nord lagrer ingen samtalehistorikk i appdatabasen. Groq håndterer trafikkgrenser og beskriver sin egen databehandling her.", "When you request a live answer, your question goes to Groq to generate a response. Leave out addresses and other personal details. The app displays the exchange temporarily. Vastu Nord does not save a conversation history in its database. Groq manages service limits and describes its own data handling here.")} <a href="https://console.groq.com/docs/your-data">{t("Groqs databehandling", "Groq’s data policy")}</a></p>
      </section>
      <section>
        <h2>{t("Bilder, film og favoritter", "Images, films and favourites")}</h2>
        <p>{t("Favorittene dine i galleriet lagres i denne nettleseren. Du kan fjerne dem med hjerteknappen. Hvis du velger å spille en redaksjonell film fra YouTube, kobler nettleseren seg til YouTube når du trykker på knappen.", "Gallery favourites are saved in this browser. Select the heart again to remove a favourite. If you choose to load an editorial film from YouTube, your browser connects to YouTube when you press the play button.")}</p>
        <p>{t("Der generering er aktivert, kan du velge å sende prosjektbildet, referansebilder og instruksjonen til MNML. Du må godkjenne overføringen før du starter. Et resultat lagres i det private prosjektet først når lagringen er fullført; ved feil kan et lagret resultat mangle. Bruk bare bilder du har rett til å sende.", "Where rendering is available, you can choose to send your project photo, selected reference images and design brief to MNML. You must confirm this transfer before starting. A result is saved to the private project only after storage completes; a failure may leave no saved result. Use only images you have permission to share with the provider.")}</p>
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
            newsletterEnabled ? "Bruk nyhetsbrevfanen for å melde deg på." : "Påmelding til nyhetsbrevet er stengt her.",
            newsletterEnabled ? "Use the newsletter tab to subscribe." : "Newsletter signup is closed here.",
          )}
        </p>
      </section>
      <section>
        <h2>{t("Konto og privat lagring", "Accounts and private storage")}</h2>
        <p>{t("Der kontofunksjonene er åpne, brukes e-postadressen din til bekreftelse og gjenoppretting gjennom Resend. Neon lagrer kontoen, prosjektinformasjon og metadata om filer. Private bilder lagres i Vercel Blob. Et valg om offentlig galleri, Pinterest eller YouTube gjelder bare den valgte kanalen og krever redaksjonell godkjenning før publisering.", "Where accounts are enabled, your email address is used for verification and recovery through Resend. Neon stores account and project records and file metadata. Private images are kept in Vercel Blob. A choice to share with the public gallery, Pinterest or YouTube applies only to that destination and requires editorial approval before publication.")}</p>
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
        <p>{t("Du kan trekke tilbake samtykke og be oss vurdere begrensning av behandling. Hvis du mener at opplysningene dine er behandlet ulovlig, kan du klage til Datatilsynet.", "You can withdraw consent and request a restriction on processing. If you believe your data has been handled unlawfully, you can complain to the Norwegian Data Protection Authority.")} <a href={locale === "en" ? "https://www.datatilsynet.no/en/about-us/contact-us/how-to-complain-to-the-norwegian-dpa/" : "https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/klage-til-datatilsynet/"}>{t("Klage til Datatilsynet", "How to make a complaint")}</a></p>
      </section>
    </article>
  );
}
