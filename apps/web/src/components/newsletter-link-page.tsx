import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "./header";
import { Footer } from "./marketing";
import { CookieNotice } from "./visitor-overlays";
import { NewsletterLinkForm } from "./newsletter-link-form";
import type { NewsletterLocale } from "@/server/newsletter";

export async function NewsletterLinkPage({
  action,
  locale,
}: {
  action: string;
  locale: NewsletterLocale;
}) {
  if (action !== "confirm" && action !== "unsubscribe") notFound();
  const value = (await cookies()).get("vn-theme")?.value;
  const theme = value === "light" || value === "dark" ? value : "system";
  const english = locale === "en";
  const confirm = action === "confirm";
  return (
    <>
      <Header locale={locale} theme={theme} />
      <CookieNotice locale={locale} />
      <main id="main" className="container page-pad">
        <section className="auth-panel">
          <h1>
            {confirm
              ? english
                ? "Confirm newsletter signup"
                : "Bekreft påmelding til nyhetsbrevet"
              : english
                ? "Unsubscribe from the newsletter"
                : "Meld deg av nyhetsbrevet"}
          </h1>
          <p>
            {confirm
              ? english
                ? "Confirm that you want design ideas and updates from Vastu Nord by email."
                : "Bekreft at du ønsker designideer og oppdateringer fra Vastu Nord på e-post."
              : english
                ? "Stop future Vastu Nord newsletters and invitations to this address."
                : "Stopp fremtidige nyhetsbrev og invitasjoner fra Vastu Nord til denne adressen."}
          </p>
          <NewsletterLinkForm action={action} locale={locale} />
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
