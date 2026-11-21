import { guides } from "@/components/workspace-experience-data";
import type { Locale } from "./i18n";

export function marketingResources(locale: Locale) {
  const t = (nb: string, en: string) => (locale === "en" ? en : nb);
  const categories = [
    t("Oppussing", "Renovation"),
    t("Boligstyling", "Staging"),
    t("Interiør", "Interiors"),
    t("Verktøy", "Tools"),
    t("Design", "Design"),
    t("Materialer", "Materials"),
    t("Belysning", "Lighting"),
    t("Planlegging", "Planning"),
  ];
  const articles = [
    {
      id: "visualize-a-renovation-before-you-build",
      name: t(
        "Visualiser oppussingen før du begynner",
        "Visualize a renovation before you build",
      ),
      image: "soft",
      tags: [0, 7],
      intro: t(
        "Hva vil du forandre, og hva skal bli? Begynn med én avgjørelse.",
        "What would you change and what would you keep? Start with one decision.",
      ),
      body: t(
        "Se rommet fra samme synsvinkel når du sammenligner alternativer. Bytt én ting om gangen, for eksempel gulvtonen eller plasseringen av en stol. Kontroller alltid mål og utførelse i det faktiske rommet.",
        "Compare alternatives from the same viewpoint. Change one thing at a time, such as the tone of a floor or the position of a chair. Always verify measurements and finishes in the actual room.",
      ),
    },
    {
      id: "virtual-staging-vs-traditional-staging",
      name: t(
        "Digital eller fysisk boligstyling?",
        "Virtual staging or traditional staging?",
      ),
      image: "warm",
      tags: [1, 2],
      intro: t(
        "To måter å vise hvordan et rom kan brukes.",
        "Two ways to show how a room could be used.",
      ),
      body: t(
        "Digital boligstyling illustrerer en mulig møblering i et bilde. Fysisk styling lar besøkende oppleve møblene på stedet. Merk digitale endringer tydelig og vis originalbildet sammen med illustrasjonen.",
        "Virtual staging illustrates a possible arrangement in a photograph. Physical staging lets visitors experience the furniture on site. Clearly label digital changes and keep the original image alongside the illustration.",
      ),
    },
    {
      id: "choosing-the-right-interior-style",
      name: t(
        "Finn en stil som passer rommet",
        "Choosing the right interior style",
      ),
      image: "soft-moss",
      tags: [2, 4, 5],
      intro: t(
        "La hverdagen og materialene gi retning.",
        "Let daily life and materials shape the direction.",
      ),
      body: t(guides[1].body[0], guides[1].body[1]),
    },
    {
      id: "ai-for-homeowners",
      name: t("AI-verktøy for boligeiere", "AI tools for homeowners"),
      image: "soft-day",
      tags: [3, 7],
      intro: t(
        "Finn en arbeidsflyt som passer spørsmålet ditt.",
        "Choose a workflow that fits your question.",
      ),
      body: t(
        "Begynn med oppgaven. Skal du sammenligne belysning, finne en ny fargepalett eller vurdere en møblering? I Studio kan du åpne et verktøy og utforske kontrollene med eksempelbilder.",
        "Start with the task. Are you comparing lighting, choosing a palette or considering a different arrangement? Open a Studio tool and explore its controls with sample images.",
      ),
    },
    {
      id: "design-trends",
      name: t("Designretninger i dagslys", "Design directions in daylight"),
      image: "soft-bright",
      tags: [4, 5, 6],
      intro: t(
        "Utforsk samspillet mellom lys, farger og teksturer.",
        "Explore the relationship between light, colour and texture.",
      ),
      body: t(guides[0].body[0], guides[0].body[1]),
    },
  ];
  return { categories, articles };
}
