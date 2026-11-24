import type { Locale } from "@/lib/i18n";
import { homeComparisons } from "./home-comparisons";
import { renderGallery, fileExamples } from "./render-gallery";

export const studies = [
  {
    id: "fjord",
    name: ["Fjordboligen", "Fjord Residence"],
    location: "Oslo",
    image: "soft.webp",
    sampleTool: "room-reimagination",
    sampleAlt: [
      "En lys stue med vedovn, eikebord og sofa ved vinduet.",
      "A light-filled living room with a wood stove, an oak table and a sofa by the window.",
    ],
    rooms: 5,
  },
  {
    id: "atelier",
    name: ["Atelierleiligheten", "The Atelier Apartment"],
    location: "Bergen",
    image: "warm.webp",
    sampleTool: "material-refinement",
    sampleAlt: [
      "En loftsstue med mosegrønn sofa, mørk stein og en stol i skinn.",
      "A loft living room with a moss-green sofa, dark stone and a leather chair.",
    ],
    rooms: 3,
  },
  {
    id: "cabin",
    name: ["Den nordiske hytta", "Nordic Cabin"],
    location: "Lillehammer",
    image: "cover.webp",
    sampleTool: "lighting-reimagination",
    sampleAlt: [
      "En stue med høye skogvendte vinduer, trehimling og peis.",
      "A living room with tall windows facing the trees, a timber ceiling and a fireplace.",
    ],
    rooms: 4,
  },
] as const;

export type StudioSample = {
  id: string;
  name: readonly [string, string];
  image: string;
  sampleAlt: readonly [string, string];
  sampleTool: string;
};

export function findStudioSample(value?: string | string[]): StudioSample | undefined {
  if (typeof value !== "string") return;
  if (value.startsWith("gallery-") || value.startsWith("file-")) {
    const scene = (value.startsWith("gallery-") ? renderGallery : fileExamples).find(item => item.id === value);
    if (scene) return {id: value, name: scene.title, image: scene.image, sampleAlt: scene.title, sampleTool: "room-reimagination"};
    return;
  }
  if (!value.startsWith("hero-")) return studies.find((study) => study.id === value);
  const scene = homeComparisons.find((item) => "hero-" + item.id === value);
  if (scene) return { id: value, name: scene.title, image: scene.before, sampleAlt: scene.beforeAlt, sampleTool: "room-reimagination" };
}

export function studioSampleHref(sample: StudioSample, tool = sample.sampleTool) {
  return `/app/tools/${tool}?sample=${sample.id}`;
}

export const translated = (pair: readonly [string, string], locale: Locale) =>
  pair[locale === "en" ? 1 : 0];

export const destinations = [
  { group: 0, href: "/app", description: ["Gjenåpne arbeid og studier.", "Return to recent work and studies."], title: ["Oversikt", "Overview"], icon: "grid" },
  {
    group: 0,
    href: "/app/projects", description: ["Samle rom og bilder i prosjekter.", "Organize rooms and photos by project."],
    title: ["Prosjekter", "Projects"],
    icon: "folder",
  },
  {
    group: 0,
    href: "/app/library", description: ["Velg blant 17 arbeidsflyter.", "Choose from 17 design workflows."],
    title: ["Studio-bibliotek", "Studio library"],
    icon: "tools",
  },
  {
    group: 0,
    href: "/app/renders", description: ["Utforsk bilder og åpne dem i Studio.", "Explore images and try them in Studio."],
    title: ["Bildegalleri", "Render gallery"],
    icon: "image",
  },
  { group: 0, href: "/app/albums", description: ["Bla etter rom og eksempelprosjekt.", "Browse studies grouped by project."], title: ["Album", "Albums"], icon: "layers" },
  {
    group: 0,
    href: "/app/files", description: ["Finn kildebilder og referanser.", "Find source photos and references."],
    title: ["Filer og ressurser", "Files and assets"],
    icon: "file",
  },
  {
    group: 1,
    href: "/app/home-experience", description: ["Utforsk et rom i ulike lys og materialer.", "Explore a room’s light and finishes."],
    title: ["Boligopplevelse", "Home Experience"],
    icon: "home",
  },
  {
    group: 1,
    href: "/app/knowledge", description: ["Les illustrerte designguider.", "Read illustrated design guides."],
    title: ["Kunnskapsbase", "Knowledge hub"],
    icon: "book",
  },
  {
    group: 1,
    href: "/app/budget", description: ["Sammenlign oppussingsscenarioer.", "Compare renovation scenarios."],
    title: ["Budsjett", "Budget"],
    icon: "chart",
  },
  {
    group: 2,
    href: "/app/shared", description: ["Finn arbeid andre deler med deg.", "Find work shared with you."],
    title: ["Delt med meg", "Shared with me"],
    icon: "users",
  },
  { group: 2, href: "/app/team", description: ["Se hvem som kan samarbeide.", "Review collaboration access."], title: ["Team", "Team"], icon: "users" },
  {
    group: 2,
    href: "/app/credits", description: ["Se status for bruk og kreditter.", "Check usage and credit availability."],
    title: ["Kreditter", "Credit wallet"],
    icon: "wallet",
  },
  {
    group: 2,
    href: "/app/billing", description: ["Se status for fakturering.", "Check billing availability."],
    title: ["Fakturering", "Billing"],
    icon: "file",
  },
  {
    group: 2,
    href: "/app/settings", description: ["Administrer språk og kontovalg.", "Manage account preferences."],
    title: ["Innstillinger", "Settings"],
    icon: "tools",
  },
] as const;
