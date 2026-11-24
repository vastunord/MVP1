import { MAX_IMAGE_MIB } from "./image-upload-policy.ts";
export type Locale = "nb-NO" | "en";
export const dictionaries = {
  "nb-NO": {
    terms: "Bruksvilkår",
    home: "Hjem",
    tools: "Arbeidsflyt",
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
    "reset-password": "Tilbakestill passord",
    "verify-email": "Bekreft e-post",
    onboarding: "Kom i gang",
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
      "Utforsk arbeidsflytene og bildestudiene i demonstrasjonen. Innlogging, opplasting, generering og lagring er deaktivert her.",
    explore: "Åpne Studio",
    title: "Se rommet ditt med nye øyne.",
    intro:
      "Utforsk mulighetene for rom, uterom og detaljer. Velg en arbeidsflyt i Studio.",
    studio: "Studio",
    library: "Studio",
    libraryIntro:
      "Velg en arbeidsflyt og utforsk innstillingene. Generering blir tilgjengelig i en senere fase.",
    all: "Alle",
    "Interior Design": "Interiørdesign",
    "Exterior & Landscape": "Eksteriør og landskap",
    "Virtual Staging": "Virtuell møblering",
    "Image Enhancement": "Bildeforbedring",
    open: "Åpne Studio",
    unavailable: "Ikke tilgjengelig ennå",
    empty: "Ingenting å vise ennå",
    emptyBody: "Denne delen kobles til en sikker tjeneste i en senere fase.",
    upload: "Legg til bilde",
    uploadHelp:
      `JPEG, PNG eller WebP · opptil ${MAX_IMAGE_MIB} MiB. Opplasting er deaktivert.`,
    reference: "Valgfritt referansebilde",
    prompt: "Beskriv endringen",
    avoid: "Noe du vil unngå?",
    improve: "Forbedre beskrivelsen",
    controls: "Innstillinger",
    canvas: "Forhåndsvisning",
    canvasBody:
      "Bildet ditt og resultatet vises her når opplasting og generering er tilgjengelig.",
    actionHelp: "Generering er ikke koblet til. Ingen kreditter belastes.",
    history: "Versjonshistorikk",
    export: "Last ned eller del",
    back: "Åpne Studio",
    previewNote:
      "Navn på arbeidsflyter og referansevalg beholdes på engelsk inntil fagoversettelsen er godkjent.",
    info: "Om denne forhåndsvisningen",
    privacy: "Bildene dine skal være private som standard.",
    step1: "Velg bilde",
    step2: "Utforsk innstillinger",
    step3: "Se mulighetene",
    foot: "Der muligheter tar form.",
    noResults: "Ingen arbeidsflyter samsvarer med søket.",
    notFound: "Denne siden finnes ikke.",
    show: "Vis",
    clear: "Tilbakestill",
  },
  en: {
    terms: "Terms of use",
    home: "Home",
    tools: "Workflow",
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
    "reset-password": "Reset password",
    "verify-email": "Verify email",
    onboarding: "Get started",
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
      "Explore the workflows and image studies in the demonstration. Sign-in, uploads, generation and saving are disabled here.",
    explore: "Open Studio",
    title: "See your space in a new light.",
    intro:
      "Explore possibilities for rooms, outdoor spaces and details. Choose a workflow in Studio.",
    studio: "Studio",
    library: "Studio",
    libraryIntro:
      "Choose a workflow and explore its settings. Generation will be available in a later phase.",
    all: "All",
    "Interior Design": "Interior Design",
    "Exterior & Landscape": "Exterior & Landscape",
    "Virtual Staging": "Virtual Staging",
    "Image Enhancement": "Image Enhancement",
    open: "Open Studio",
    unavailable: "Not available yet",
    empty: "Nothing here yet",
    emptyBody: "This area will connect to a secure service in a later phase.",
    upload: "Add a photo",
    uploadHelp: `JPEG, PNG or WebP · up to ${MAX_IMAGE_MIB} MiB. Upload is disabled.`,
    reference: "Optional reference image",
    prompt: "Describe the change",
    avoid: "Anything to avoid?",
    improve: "Improve description",
    controls: "Settings",
    canvas: "Preview",
    canvasBody:
      "Your photo and result will appear here when upload and generation become available.",
    actionHelp: "Generation is not connected. No credits will be charged.",
    history: "Version history",
    export: "Download or share",
    back: "Open Studio",
    previewNote:
      "Workflow names and reference options retain their observed English wording pending approved specialist translations.",
    info: "About this preview",
    privacy: "Your images will be private by default.",
    step1: "Choose a photo",
    step2: "Explore settings",
    step3: "See the possibilities",
    foot: "Where possibilities take shape.",
    noResults: "No workflows match your search.",
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
