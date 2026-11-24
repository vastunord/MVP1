import type { Locale } from "./i18n.ts";

type Destination = { href: string; title: readonly [string, string] };
type ToolLookup = (id: string) => { name: string } | undefined;

/** Titles never include project IDs, project names, asset names or query data. */
export function studioPageTitle(path: string[], locale: Locale, destinations: readonly Destination[], findTool: ToolLookup): string {
  const en = locale === "en";
  const first = path[0];
  if (!first) return "Studio";
  if (path.length === 2 && (first === "tools" || first === "editor")) {
    const tool = findTool(path[1]);
    return tool ? `${tool.name} · Studio` : "Studio";
  }
  if (first === "projects" && path.length === 2) return en ? "Project · Studio" : "Prosjekt · Studio";
  if (first === "studies" && path.length === 2) return en ? "Example study · Studio" : "Eksempelstudie · Studio";
  if (first === "settings" && path.length === 2) {
    const settings: Record<string, readonly [string, string]> = {
      profile: ["Profil", "Profile"], security: ["Sikkerhet", "Security"],
      notifications: ["Varsler", "Notifications"], exports: ["Eksport", "Exports"], billing: ["Fakturering", "Billing"],
    };
    const label = settings[path[1]];
    return label ? `${label[en ? 1 : 0]} · Studio` : "Studio";
  }
  if (path.length !== 1) return "Studio";
  const alias: Record<string, string> = {
    dashboard: "", studio: "library", tools: "library", gallery: "renders", assets: "files",
    experience: "home-experience", explore: "knowledge", wallet: "credits",
  };
  const canonical = Object.hasOwn(alias, first) ? alias[first] : first;
  const destination = destinations.find(item => item.href === `/app${canonical ? `/${canonical}` : ""}`);
  if (destination) return `${destination.title[en ? 1 : 0]} · Studio`;
  if (first === "search") return en ? "Search · Studio" : "Søk · Studio";
  return "Studio";
}
