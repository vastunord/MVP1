import type { Locale } from "@/lib/i18n";

const descriptions: Record<string, [string, string]> = {
  "room-reimagination": [
    "Utforsk en ny retning for rommet.",
    "Explore a new direction for a room.",
  ],
  "virtual-home-staging": [
    "Velg møbler og uttrykk for et tomt rom.",
    "Choose furnishings for an empty room.",
  ],
  "outdoor-visualization": [
    "Utforsk lys, beplantning og vær i uterommet.",
    "Explore planting, weather and light outdoors.",
  ],
  "hardscape-design": [
    "Planlegg dekke, belegning og terrasser.",
    "Plan paving, decking and terrace finishes.",
  ],
  "furniture-refresh": [
    "Velg hvordan møblene skal fornyes.",
    "Consider a new furniture arrangement.",
  ],
  "seasonal-styling": [
    "Skift sesong med tekstiler og farger.",
    "Change the season with textiles and colour.",
  ],
  "visual-cleanup": [
    "Velg hvilke detaljer du ønsker å fjerne.",
    "Identify the distractions to remove.",
  ],
  "resolution-enhancement": [
    "Utforsk skarphet, utsnitt og kontrast.",
    "Explore sharpness, cropping and contrast.",
  ],
  "perspective-correction": [
    "Still inn kameravinkel og perspektiv.",
    "Set the camera angle and perspective.",
  ],
  "decor-redefinition": [
    "Utforsk dekor, plassering og stil.",
    "Explore decor, placement and style.",
  ],
  "material-refinement": [
    "Sett sammen overflater og materialer.",
    "Bring surfaces and materials together.",
  ],
  "lighting-reimagination": [
    "Utforsk lysstyrke og fargetemperatur.",
    "Explore brightness and light temperature.",
  ],
  "garden-design": [
    "Planlegg hagens stil, soner og beplantning.",
    "Plan the style, zones and planting in a garden.",
  ],
  "pool-redesign": [
    "Velg bassengform, overflater og plassering.",
    "Choose pool shape, finishes and placement.",
  ],
  "sky-transformation": [
    "Utforsk himmel, vær og tid på dagen.",
    "Explore sky, weather and time of day.",
  ],
  "seasonal-transformation": [
    "Velg årstid og forhold i uteområdet.",
    "Choose a season and conditions outdoors.",
  ],
  "object-placement": [
    "Angi hvor objekter skal stå i motivet.",
    "Specify where objects belong in a scene.",
  ],
};

export function toolDescription(id: string, locale: Locale) {
  return descriptions[id]?.[locale === "en" ? 1 : 0] ?? "";
}

export const sampleTones = [
  { id: "soft-day", nb: "Dagslys", en: "Daylight" },
  { id: "soft-evening", nb: "Kveldslys", en: "Evening" },
  { id: "soft-moss", nb: "Mosegrønn", en: "Moss" },
  { id: "soft-bright", nb: "Lys", en: "Bright" },
] as const;
