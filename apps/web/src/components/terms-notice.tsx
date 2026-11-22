import Link from "next/link";
import { publicHref, type Locale } from "@/lib/i18n";
import "./privacy-notice.css";

export function TermsNotice({ locale }: { locale: Locale }) {
  const t = (nb: string, en: string) => locale === "en" ? en : nb;
  return <article className="vn-privacy">
    <h1>{t("Bruksvilkår", "Terms of use")}</h1>
    <section>
      <h2>{t("Om demonstrasjonen", "Using the demonstration")}</h2>
      <p>{t("Vastu Nord tilbyr denne demonstrasjonen for personlig, ikke-kommersiell utforsking av rom, materialer og lys. Det er gratis å se de publiserte studiene. Eksempelprosjekter er illustrasjoner. Funksjoner som krever en konto eller en ekstern tjeneste kan være stengt.", "Vastu Nord offers this demonstration for personal, noncommercial exploration of spaces, materials and light. Published studies are free to browse. Sample projects are illustrations. Features that require an account or an external service may be unavailable.")}</p>
    </section>
    <section>
      <h2>{t("Fra idé til byggeprosjekt", "From an idea to a building project")}</h2>
      <p>{t("Bilder, AI-svar og kostnadseksempler gir ideer. De kan vise feil mål, materialer eller løsninger. Kontroller mål på stedet. Før du bygger, kjøper eller endrer bærende konstruksjoner, må fagfolk vurdere sikkerhet, kostnader og nødvendige tillatelser.", "Images, AI suggestions and example budgets are for exploring ideas. They can depict incorrect dimensions, materials or construction details. Check measurements on site and obtain qualified advice on safety, costs and permits before building, purchasing or making structural changes.")}</p>
    </section>
    <section>
      <h2>{t("Bilder og rettigheter", "Images and permissions")}</h2>
      <p>{t("Bruk bare bilder og tekst du har rett til å bruke. Unngå personopplysninger og bilder av andre uten deres tillatelse. Vastu Nords logo, redaksjonelle bilder og demonstrasjonsmateriell krever tillatelse for gjenpublisering. Du beholder rettighetene du allerede har til eget materiale.", "Use images and text you have permission to use. Leave out personal details and photos of others without their permission. Obtain permission before republishing Vastu Nord branding, editorial images or demo material. You retain your existing rights in your own material.")}</p>
      <p>{t("Når deling er tilgjengelig, velger du separat om et bilde kan vurderes for galleriet eller en bestemt sosial kanal. Kontakt oss hvis du vil trekke tilbake en tillatelse, få et bilde vurdert for fjerning eller melde en rettighetsfeil.", "Where sharing is available, you choose separately whether an image may be considered for the gallery or a particular social channel. Contact us to withdraw permission, request removal or report a rights issue.")}</p>
    </section>
    <section>
      <h2>{t("Kontakt", "Contact")}</h2>
      <p><a href="mailto:contact@vastu.no">contact@vastu.no</a></p>
      <p><Link href={publicHref("/privacy", locale)}>{t("Personvern og informasjonskapsler", "Privacy and cookies")}</Link></p>
    </section>
  </article>;
}
