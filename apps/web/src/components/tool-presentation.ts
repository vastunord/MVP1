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

const canvasDescriptions: Record<string, [string, string]> = {
  "room-reimagination": ["Lys stue med møbler og vegger i tre.", "Light living room with timber walls and furniture."],
  "virtual-home-staging": ["Lys stue med hvite sofaer mot vinduet.", "Bright living room with white sofas against the window."],
  "outdoor-visualization": ["Skogkledd strand med hus ved vannet.", "Wooded shoreline with a house at the water’s edge."],
  "hardscape-design": ["Terrassebord og sitteplass utendørs.", "Timber decking and outdoor seating."],
  "furniture-refresh": ["Sittegruppe ved vinduet i en klassisk stue.", "A seating arrangement by a traditional living room window."],
  "seasonal-styling": ["Tekstiler og tre i et soverom mot landskapet.", "Timber and textiles in a bedroom looking out over the landscape."],
  "visual-cleanup": ["Leker og bøker fordelt over gulvet i et lyst rom.", "Toys and books scattered across a bright room."],
  "resolution-enhancement": ["Detaljrike akustiske trepaneler og flygel.", "Detailed acoustic timber panels beside a grand piano."],
  "perspective-correction": ["Lang korridor kledd i tre.", "Long timber-clad corridor."],
  "decor-redefinition": ["Stue med kunst på veggen og dekor rundt sofaen.", "Living room with framed art and decorative objects around a sofa."],
  "material-refinement": ["Baderom med tre, speil og stein.", "Bathroom with timber, mirror and stone surfaces."],
  "lighting-reimagination": ["Lunt trepanel mot blått lys utenfor vinduet.", "Warm timber panelling framing a blue-lit window."],
  "garden-design": ["Beplantet hage med gangsti mellom bygninger.", "Planted garden with paths between buildings."],
  "pool-redesign": ["Rundt basseng under et åpent overlys.", "Round pool beneath a circular skylight."],
  "sky-transformation": ["Lav sol over vannet utenfor en bolig.", "Low sun over the water beside a house."],
  "seasonal-transformation": ["Rødt trehus ved en snødekt gate.", "Red timber house beside a snowy street."],
  "object-placement": ["Spisebord, stoler og planter ved vinduene.", "Dining table, chairs and plants near the windows."],
};

export function canvasDescription(id: string, locale: Locale) {
  return canvasDescriptions[id]?.[locale === "en" ? 1 : 0] ?? "";
}
