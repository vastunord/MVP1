import { guides } from "../components/workspace-experience-data.ts";
import type { Locale } from "./i18n";

export function marketingResources(locale: Locale) {
  const t = (nb: string, en: string) => (locale === "en" ? en : nb);
  const categories = [
    t("Oppussing", "Renovation"),
    t("Boligstyling", "Staging"),
    t("Interiør", "Interiors"),
    t("Arbeidsflyt", "Workflow"),
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
      image: "editorial/article-renovation",
      detailImage: "editorial/article-detail-renovation",
      tags: [0, 7],
      intro: t(
        "Hva vil du forandre, og hva skal bli? Begynn med én avgjørelse.",
        "What would you change and what would you keep? Start with one decision.",
      ),
      body: t(
        "Se rommet fra samme synsvinkel når du sammenligner alternativer. Bytt én ting om gangen, for eksempel gulvtonen eller plasseringen av en stol. Kontroller alltid mål og utførelse i det faktiske rommet.",
        "Compare alternatives from the same viewpoint. Change one thing at a time, such as the tone of a floor or the position of a chair. Always verify measurements and finishes in the actual room.",
      ),
      compare: t("Sammenlign et forslag som bare endrer overflater med ett som også endrer møblering. Behold samme synsvinkel slik at forskjellen er lettere å diskutere.", "Compare a finish-only proposal with one that also changes the furniture arrangement. Keep the viewpoint consistent so the difference is easier to discuss."),
      limitation: t("Et illustrert forslag er ikke en byggetegning og bekrefter verken bæreevne, mål, elektrisk arbeid eller nødvendige tillatelser.", "An illustrated proposal is not a construction drawing and does not confirm structural capacity, dimensions, electrical work or required permits."),
      tool: "room-reimagination",
      nextStep: t("Velg først om du vil beholde planløsningen eller undersøke en ny møblering. Sammenlign ett alternativ med originalen, noter hva som må måles, og be en fagperson vurdere konstruksjon og kostnader før arbeidet starter.", "First decide whether to retain the layout or explore a new furniture arrangement. Compare one option with the original, note what needs measuring, and ask a professional to assess construction and costs before work starts."),
    },
    {
      id: "virtual-staging-vs-traditional-staging",
      name: t(
        "Digital eller fysisk boligstyling?",
        "Virtual staging or traditional staging?",
      ),
      image: "editorial/article-staging",
      detailImage: "editorial/article-detail-staging",
      tags: [1, 2],
      intro: t(
        "To måter å vise hvordan et rom kan brukes.",
        "Two ways to show how a room could be used.",
      ),
      body: t(
        "Digital boligstyling illustrerer en mulig møblering i et bilde. Fysisk styling lar besøkende oppleve møblene på stedet. Merk digitale endringer tydelig og vis originalbildet sammen med illustrasjonen.",
        "Virtual staging illustrates a possible arrangement in a photograph. Physical staging lets visitors experience the furniture on site. Clearly label digital changes and keep the original image alongside the illustration.",
      ),
      compare: t("Et digitalt forslag kan deles som en illustrasjon. Fysisk styling viser møbleringen i det faktiske rommet og kan oppleves under en visning.", "A digital proposal can be shared as an illustration. Physical staging shows the furniture in the actual room and lets visitors experience it during a viewing."),
      limitation: t("Digitale møbler og overflater er ikke bevis på boligens faktiske tilstand. Behold originalen og merk endringer tydelig der bildet brukes.", "Digital furnishings and finishes are not evidence of the property’s actual condition. Keep the original and disclose changes wherever the image is used."),
      tool: "virtual-home-staging",
      nextStep: t("Velg digital styling for å utforske et visuelt forslag, eller fysisk styling når møbler og rom skal oppleves under visning. Et generert bilde viser ikke nødvendigvis hva som finnes på stedet; avklar merking med megler og følg lokale regler.", "Choose virtual staging to explore an illustrated proposal, or physical staging when visitors need to experience furniture on site. A generated image may not show what exists in the property; agree on disclosures with the agent and follow local rules."),
    },
    {
      id: "choosing-the-right-interior-style",
      name: t(
        "Finn en stil som passer rommet",
        "Choosing the right interior style",
      ),
      image: "editorial/article-style",
      detailImage: "editorial/article-detail-style",
      tags: [2, 4, 5],
      intro: t(
        "La hverdagen og materialene gi retning.",
        "Let daily life and materials shape the direction.",
      ),
      body: t(guides[1].body[0], guides[1].body[1]),
      compare: t("Sett en varm og en kjølig materialkombinasjon ved siden av det du allerede eier. Vurder både hvordan de ser ut og hvor lett de er å vedlikeholde.", "Place a warm and a cool material combination alongside items you already own. Compare both their appearance and the care they require."),
      limitation: t("Skjermer, bilder og genererte forslag gjengir ikke materialenes fysiske overflate eller farge pålitelig i alle lysforhold.", "Screens, photographs and generated proposals cannot reliably reproduce a material’s physical texture or colour in every lighting condition."),
      tool: "material-refinement",
      nextStep: t("Velg to materialer du liker og sammenlign prøvene i lyset rommet faktisk får. Noter ønsket slitestyrke og vedlikehold; et digitalt bilde kan ikke bekrefte tekstur, fargegjengivelse eller leveringstid.", "Choose two materials and compare physical samples in the room’s actual light. Note the durability and maintenance you need; a digital image cannot confirm texture, colour reproduction or availability."),
    },
    {
      id: "ai-for-homeowners",
      name: t("AI i boligplanlegging", "Using AI for home design"),
      image: "editorial/article-homeowner",
      detailImage: "editorial/article-detail-homeowner",
      tags: [3, 7],
      intro: t(
        "Finn en arbeidsflyt som passer spørsmålet ditt.",
        "Choose a workflow that fits your question.",
      ),
      body: t(
        "Begynn med oppgaven. Skal du sammenligne belysning, finne en ny fargepalett eller vurdere en møblering? Velg en arbeidsflyt i Studio og utforsk innstillingene med eksempelbilder.",
        "Start with the task. Are you comparing lighting, choosing a palette or considering a different arrangement? Choose a workflow in Studio and explore its settings with sample images.",
      ),
      compare: t("Sammenlign ett forslag med originalen og ett med en annen møblering eller overflate. Behold det som faktisk hjelper deg å ta en beslutning.", "Compare one proposal with the original and another with a different arrangement or finish. Keep the option that helps you make an actual decision."),
      limitation: t("AI kan endre detaljer utilsiktet og verifiserer ikke mål, byggeforskrifter eller sikkerhet. Bruk ikke bildet som grunnlag for byggearbeid alene.", "AI can change details unintentionally and does not verify dimensions, building regulations or safety. Do not use the image alone as a basis for construction."),
      tool: "room-reimagination",
      nextStep: t("Velg ett bilde og skriv ned én beslutning du vil utforske. Sammenlign forslaget med originalen, og bruk det som inspirasjon fremfor en teknisk plan. Mål, tillatelser og sikkerhet må undersøkes separat.", "Pick one image and write down one decision to explore. Compare the proposal with the original and use it as inspiration rather than a technical plan. Measurements, permits and safety need separate verification."),
    },
    {
      id: "design-trends",
      name: t("Designretninger i dagslys", "Design directions in daylight"),
      image: "editorial/article-light",
      detailImage: "editorial/article-detail-light",
      tags: [4, 5, 6],
      intro: t(
        "Utforsk samspillet mellom lys, farger og teksturer.",
        "Explore the relationship between light, colour and texture.",
      ),
      body: t(guides[0].body[0], guides[0].body[1]),
      compare: t("Sammenlign dagslys ved arbeidsplassen med en plan for lys etter mørkets frembrudd. Tenk på både aktiviteter, blending og hvordan lyset kan styres.", "Compare daylight at the work area with a plan for lighting after dark. Consider the activity, glare and how the lighting will be controlled."),
      limitation: t("En bildeillustrasjon måler ikke lysstyrke eller elektrisk kapasitet i rommet. Sjekk armaturer, installasjon og sikkerhet med fagfolk.", "An image does not measure illumination or electrical capacity in the room. Check fixtures, installation and safety with qualified professionals."),
      tool: "lighting-reimagination",
      nextStep: t("Sammenlign rommet morgen og kveld før du velger lyskilder. Bestem hvor du trenger arbeidslys og hvor et mykere lys er nyttig; bruk en kvalifisert elektriker til elektrisk arbeid.", "Compare the room in the morning and evening before choosing lights. Decide where task lighting helps and where softer light is useful; use a qualified electrician for electrical work."),
    },
  ];
  return { categories, articles };
}
