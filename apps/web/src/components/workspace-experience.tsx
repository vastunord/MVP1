import type { Locale } from "@/lib/i18n";
import { ExperienceView } from "./workspace-experience-view";

const sections = [
  "home-experience",
  "knowledge",
  "budget",
  "billing",
  "credits",
] as const;
export type ExperienceRoute = (typeof sections)[number];

export function isExperienceRoute(section: string): section is ExperienceRoute {
  return sections.some((candidate) => section === candidate);
}

export function WorkspaceExperience({
  section,
  locale,
}: {
  section: ExperienceRoute;
  locale: Locale;
}) {
  return <ExperienceView key={section} section={section} locale={locale} />;
}
