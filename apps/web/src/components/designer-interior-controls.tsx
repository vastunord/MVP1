import { useId } from "react";
import type { Control } from "@vastunord/contracts/tools";
import type { Locale } from "@/lib/i18n";
import { roomLabel } from "./room-settings";
import "./designer-interior-controls.css";

// The descriptions explain how each choice changes the design brief.
const descriptions: Record<string, [string, string, string]> = {
  "Eye level": ["Øyehøyde", "A view from about 1.6 metres above the floor.", "Se rommet fra omtrent 1,6 meter over gulvet."],
  Low: ["Lav", "Bring the furniture into the foreground.", "Fremhev møblene i forgrunnen."],
  High: ["Høy", "View the room from a raised position.", "Se rommet fra et høyt ståsted."],
  "Straight on": ["Rett forfra", "Face the wall directly.", "Se rett mot veggen."],
  "Warm minimal": ["Varm minimalisme", "A few tactile pieces in oak, linen and clay.", "Noen få elementer i eik, lin og leire."],
  Gallery: ["Galleri", "Let artwork lead the arrangement.", "La kunstverkene styre plasseringen."],
  "Layered textile": ["Tekstiler i lag", "Build depth with woven textures and soft furnishings.", "Skap dybde med vevde teksturer og myke tekstiler."],
  "Mid-century": ["Mid-century", "Sculptural silhouettes, timber and brass.", "Skulpturelle former, tre og messing."],
  Coastal: ["Kyst", "Light timber, sand tones and an airy arrangement.", "Lyst tre, sandtoner og luftig plassering."],
  Monochrome: ["Monokrom", "Highlight shape and texture within one colour family.", "Fremhev form og tekstur innen én fargefamilie."],
  Pool: ["Basseng", "Plan a pool and its surround.", "Planlegg basseng og området rundt."],
  Spa: ["Spa", "Shape a dedicated bathing and relaxation area.", "Form et eget område for bad og avslapning."],
  "Pool + Spa": ["Basseng + spa", "Arrange the pool and spa together.", "Plasser basseng og spa sammen."],
  Family: ["Familie", "Durable fabrics, shared dining and space to play.", "Slitesterke tekstiler, spiseplass og rom for lek."],
  "Young professional": ["Ung yrkesaktiv", "A desk nook, compact seating and clean lines.", "En arbeidskrok, kompakte møbler og rene linjer."],
  Downsizer: ["Mindre bolig", "Fewer pieces and clear paths through the room.", "Færre møbler og god plass til å bevege seg."],
  Luxury: ["Luksus", "Sculptural lighting, rich materials and art.", "Skulpturelle lamper, rike materialer og kunst."],
  Neutral: ["Nøytral", "Light oak and neutral linen leave room for interpretation.", "Lys eik og nøytralt lin lar kjøperen se egne muligheter."],
  Spring: ["Vår", "Fresh flowers, light linen and pastel accents.", "Friske blomster, lett lin og pasteller."],
  Summer: ["Sommer", "Airy textiles, greenery and sun-bleached tones.", "Luftige tekstiler, grønne planter og solblekede toner."],
  Autumn: ["Høst", "Wool throws, warm lamps and amber tones.", "Ullpledd, varmt lampelys og ravtoner."],
  Winter: ["Vinter", "Layered knits, candlelight and evergreen branches.", "Strikkede tekstiler, levende lys og vintergrønne grener."],
  Naturalistic: ["Naturnær", "Meadow grasses, stone and wildflowers.", "Enggress, stein og markblomster."],
  Formal: ["Formell", "Clipped hedges, gravel and symmetry.", "Klippede hekker, grus og symmetri."],
  Mediterranean: ["Middelhavsstil", "Olive trees, terracotta and lavender.", "Oliventrær, terrakotta og lavendel."],
  Nordic: ["Nordisk", "Birch, granite and moss.", "Bjørk, granitt og mose."],
  Desert: ["Ørken", "Succulents, sand and weathered steel.", "Sukkulenter, sand og patinert stål."],
  Tropical: ["Tropisk", "Broad leaves, timber and bright flowers.", "Store blader, treverk og sterke blomsterfarger."],
};

export function DesignerCards({ control, value, locale, onChange, outdoorSeason = false }: {
  control: Control; value: string; locale: Locale; onChange: (value: string) => void; outdoorSeason?: boolean;
}) {
  const name = useId();
  const en = locale === "en";
  return <fieldset className="design-card-group">
    <legend>{roomLabel(control.label, locale)}</legend>
    <div>{control.options?.map((choice) => {
      const gardenSeasons: Record<string, [string,string,string]> = {
        Spring: ["Vår","Fresh foliage and new growth.","Friskt løv og nye skudd."],
        Summer: ["Sommer","Full foliage and flowering borders.","Tett løvverk og blomstrende bed."],
        Autumn: ["Høst","Copper leaves and warmer planting tones.","Kobberfarget løv og varmere plantetoner."],
        Winter: ["Vinter","Bare branches, frost or snow cover.","Nakne greiner, rim eller snødekke."]
      };
      const [nb, description, descriptionNb] = (outdoorSeason && gardenSeasons[choice]) || descriptions[choice] || [choice, "", ""];
      return <label key={choice}>
        <input type="radio" name={name} checked={value === choice} value={choice} onChange={() => onChange(choice)} />
        <span><strong>{en ? choice : nb}</strong><small>{en ? description : descriptionNb}</small></span>
      </label>;
    })}</div>
  </fieldset>;
}
const clutterNb = ["Søppeldunker", "Kabler", "Biler", "Personer", "Skilt", "Løse gjenstander", "Luftledninger", "Reflekser"];
export function ClutterChoices({ controls, values, locale, onChange, garden = false }: {
  controls: Control[]; values: Record<string, string | number | boolean>; locale: Locale; garden?: boolean;
  onChange: (id: string, checked: boolean) => void;
}) {
  return <fieldset className="clutter-choices">
    <legend>{garden ? (locale === "en" ? "Garden tasks" : "Hagearbeid") : (locale === "en" ? "Common clutter" : "Vanlige forstyrrelser")}</legend>
    <div>{controls.map((field, index) => <label key={field.id}>
      <input type="checkbox" checked={values[field.id] === true} onChange={e => onChange(field.id, e.target.checked)} />
      {locale === "en" ? field.label : garden ? ["Klipp plen og kanter","Luk ugress","Legg ny bark","Beskjær og form","Rengjør belegget","Fyll tomrom"][index] : clutterNb[index]}
    </label>)}</div>
  </fieldset>;
}
