import type { Locale } from "@/lib/i18n";

export const studies = [
  {
    id: "fjord",
    name: ["Fjordboligen", "Fjord Residence"],
    location: "Oslo",
    image: "soft.webp",
    rooms: 5,
  },
  {
    id: "atelier",
    name: ["Atelierleiligheten", "The Atelier Apartment"],
    location: "Bergen",
    image: "warm.webp",
    rooms: 3,
  },
  {
    id: "cabin",
    name: ["Den nordiske hytta", "Nordic Cabin"],
    location: "Lillehammer",
    image: "cover.webp",
    rooms: 4,
  },
] as const;

export const scenes = [
  {
    image: "soft.webp",
    title: ["Skandinavisk ro", "Quiet Scandinavian"],
    style: ["Nordisk", "Nordic calm"],
    study: "fjord",
  },
  {
    image: "warm.webp",
    title: ["Varme tretoner", "Warm timber edit"],
    style: ["Organisk", "Organic modern"],
    study: "fjord",
  },
  {
    image: "soft-evening.webp",
    title: ["Gyllent kveldslys", "Golden hour"],
    style: ["Varm minimalisme", "Warm minimal"],
    study: "fjord",
  },
  {
    image: "soft-moss.webp",
    title: ["Salvie og stein", "Sage & stone"],
    style: ["Jordtoner", "Earthy Nordic"],
    study: "atelier",
  },
  {
    image: "soft-bright.webp",
    title: ["Åpen planløsning", "Open-plan study"],
    style: ["Dagslys", "Daylight"],
    study: "atelier",
  },
  {
    image: "cover.webp",
    title: ["Vintermorgen", "Soft winter morning"],
    style: ["Vinterro", "Winter retreat"],
    study: "cabin",
  },
] as const;

export type Scene = (typeof scenes)[number];
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
  { group: 1, href: "/app/prana", title: ["Prana", "Prana"], icon: "spark" },
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
