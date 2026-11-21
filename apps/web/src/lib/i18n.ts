export type Locale = "nb-NO" | "en";
export const dictionaries = {
  "nb-NO": {
    home: "Hjem",
    tools: "Verktøy",
    files: "Filer",
    projects: "Prosjekter",
    shared: "Delt",
    search: "Søk",
    settings: "Innstillinger",
    features: "Muligheter",
    about: "Om oss",
    pricing: "Priser",
    resources: "Kunnskap",
    contact: "Kontakt",
    login: "Logg inn",
    signup: "Opprett konto",
    "forgot-password": "Glemt passord",
    language: "Språk",
    theme: "Utseende",
    light: "Lyst",
    dark: "Mørkt",
    system: "System",
    menu: "Meny",
    close: "Lukk",
    skip: "Gå til innhold",
    foundation: "Ikke-kommersiell demonstrasjon · under utvikling",
    status:
      "Dette er et lokalt grensesnitt under utvikling. Innlogging, opplasting, generering og lagring er ikke tilgjengelig.",
    explore: "Utforsk verktøyene",
    title: "Se rommet ditt med nye øyne.",
    intro:
      "Utforsk mulighetene for rom, uterom og detaljer. Bli kjent med verktøyene i Vastu Nord Studio.",
    studio: "Ditt kreative arbeidsrom",
    library: "Verktøybibliotek",
    libraryIntro:
      "Velg et verktøy og utforsk innstillingene. Generering blir tilgjengelig i en senere fase.",
    all: "Alle",
    "Interior Design": "Interiørdesign",
    "Exterior & Landscape": "Eksteriør og landskap",
    "Virtual Staging": "Virtuell møblering",
    "Image Enhancement": "Bildeforbedring",
    open: "Åpne verktøy",
    unavailable: "Ikke tilgjengelig ennå",
    empty: "Ingenting å vise ennå",
    emptyBody: "Denne delen kobles til en sikker tjeneste i en senere fase.",
    upload: "Legg til bilde",
    uploadHelp:
      "JPEG, PNG eller WEBP · opptil 20 MB. Opplasting er deaktivert.",
    reference: "Valgfritt referansebilde",
    prompt: "Beskriv endringen",
    avoid: "Noe du vil unngå?",
    improve: "Forbedre beskrivelsen",
    controls: "Innstillinger",
    canvas: "Forhåndsvisning",
    canvasBody:
      "Bildet ditt og resultatet vises her når opplasting og generering er tilgjengelig.",
    actionHelp: "Generering er ikke koblet til. Ingen kreditter belastes.",
    unknown: "Standardvalg eller alternativer er ikke bekreftet",
    history: "Versjonshistorikk",
    export: "Last ned eller del",
    back: "Til verktøyene",
    previewNote:
      "Verktøynavn og referansevalg beholdes på engelsk inntil fagoversettelsen er godkjent.",
    info: "Om denne forhåndsvisningen",
    privacy: "Bildene dine skal være private som standard.",
    step1: "Velg bilde",
    step2: "Utforsk innstillinger",
    step3: "Se mulighetene",
    foot: "Der muligheter tar form.",
    noResults: "Ingen verktøy samsvarer med søket.",
    notFound: "Denne siden finnes ikke.",
    show: "Vis",
    clear: "Tilbakestill",
  },
  en: {
    home: "Home",
    tools: "Tools",
    files: "Files",
    projects: "Projects",
    shared: "Shared",
    search: "Search",
    settings: "Settings",
    features: "Features",
    about: "About",
    pricing: "Pricing",
    resources: "Knowledge",
    contact: "Contact",
    login: "Sign in",
    signup: "Create account",
    "forgot-password": "Forgot password",
    language: "Language",
    theme: "Appearance",
    light: "Light",
    dark: "Dark",
    system: "System",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    foundation: "Noncommercial demonstration · in development",
    status:
      "This is a local interface in development. Sign-in, upload, generation and saving are unavailable.",
    explore: "Explore the tools",
    title: "See your space in a new light.",
    intro:
      "Explore possibilities for rooms, outdoor spaces and details. Get to know the tools in Vastu Nord Studio.",
    studio: "Your creative workspace",
    library: "Tool library",
    libraryIntro:
      "Choose a tool and explore its settings. Generation will be available in a later phase.",
    all: "All",
    "Interior Design": "Interior Design",
    "Exterior & Landscape": "Exterior & Landscape",
    "Virtual Staging": "Virtual Staging",
    "Image Enhancement": "Image Enhancement",
    open: "Open tool",
    unavailable: "Not available yet",
    empty: "Nothing here yet",
    emptyBody: "This area will connect to a secure service in a later phase.",
    upload: "Add a photo",
    uploadHelp: "JPEG, PNG or WEBP · up to 20 MB. Upload is disabled.",
    reference: "Optional reference image",
    prompt: "Describe the change",
    avoid: "Anything to avoid?",
    improve: "Improve description",
    controls: "Settings",
    canvas: "Preview",
    canvasBody:
      "Your photo and result will appear here when upload and generation become available.",
    actionHelp: "Generation is not connected. No credits will be charged.",
    unknown: "Default or options are not confirmed",
    history: "Version history",
    export: "Download or share",
    back: "Back to tools",
    previewNote:
      "Tool names and reference options retain their observed English wording pending approved specialist translations.",
    info: "About this preview",
    privacy: "Your images will be private by default.",
    step1: "Choose a photo",
    step2: "Explore settings",
    step3: "See the possibilities",
    foot: "Where possibilities take shape.",
    noResults: "No tools match your search.",
    notFound: "This page does not exist.",
    show: "Show",
    clear: "Reset",
  },
} as const;
export type MessageKey = keyof typeof dictionaries.en;
export function messages(locale: Locale) {
  return dictionaries[locale];
}
export function publicHref(path: string, locale: Locale) {
  return (locale === "en" ? "/en" : "") + (path === "/" ? "" : path) || "/";
}
export function switchLocalePath(path: string, locale: Locale) {
  if (path === "/app" || path.startsWith("/app/")) return path;
  return publicHref(path.replace(/^\/en(?=\/|$)/, "") || "/", locale);
}
export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale).format(value);
}
export function formatDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "Europe/Oslo",
  }).format(value);
}
