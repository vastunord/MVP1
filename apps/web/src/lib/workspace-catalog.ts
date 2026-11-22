import type { Locale } from "@/lib/i18n";
import { homeComparisons } from "./home-comparisons";

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
  { group: 0, href: "/app", title: ["Oversikt", "Overview"], icon: "grid" },
  {
    group: 0,
    href: "/app/projects",
    title: ["Prosjekter", "Projects"],
    icon: "folder",
  },
  {
    group: 0,
    href: "/app/library",
    title: ["Verktøy", "Tools"],
    icon: "tools",
  },
  {
    group: 0,
    href: "/app/renders",
    title: ["Bildegalleri", "Render gallery"],
    icon: "image",
  },
  { group: 0, href: "/app/albums", title: ["Album", "Albums"], icon: "layers" },
  {
    group: 0,
    href: "/app/files",
    title: ["Filer og ressurser", "Files and assets"],
    icon: "file",
  },
  {
    group: 1,
    href: "/app/home-experience",
    title: ["Boligopplevelse", "Home Experience"],
    icon: "home",
  },
  {
    group: 1,
    href: "/app/knowledge",
    title: ["Kunnskapsbase", "Knowledge hub"],
    icon: "book",
  },
  {
    group: 1,
    href: "/app/budget",
    title: ["Budsjett", "Budget"],
    icon: "chart",
  },
  {
    group: 2,
    href: "/app/shared",
    title: ["Delt med meg", "Shared with me"],
    icon: "users",
  },
  { group: 2, href: "/app/team", title: ["Team", "Team"], icon: "users" },
  {
    group: 2,
    href: "/app/credits",
    title: ["Kreditter", "Credit wallet"],
    icon: "wallet",
  },
  {
    group: 2,
    href: "/app/billing",
    title: ["Fakturering", "Billing"],
    icon: "file",
  },
  {
    group: 2,
    href: "/app/settings",
    title: ["Innstillinger", "Settings"],
    icon: "tools",
  },
] as const;
