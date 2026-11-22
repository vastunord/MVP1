type Caption = readonly [string, string];
type Album = "fjord" | "atelier" | "cabin";

export type GalleryScene = {
  id: string;
  image: string;
  thumbnail?: string;
  title: Caption;
  style: Caption;
  study: Album;
};

export const subjects = {
  architecture: ["Arkitektur", "Architecture"],
  bedroom: ["Soverom", "Bedrooms"],
  living: ["Oppholdsrom", "Living spaces"],
  detail: ["Materialer og detaljer", "Materials and details"],
  outdoors: ["Uterom", "Outdoor spaces"],
  wellness: ["Velvære", "Wellness"],
} as const;

// Each number identifies the same image in the placement register and its public derivative.
const entries: ReadonlyArray<readonly [string, Album, keyof typeof subjects, string, string]> = [
  ["01", "atelier", "architecture", "Gallerigang i grønt", "Green gallery with carved columns"],
  ["02", "cabin", "architecture", "Steinhus mellom vinrankene", "Stone house among the vines"],
  ["03", "fjord", "outdoors", "Opplyst gårdsrom i snøen", "Illuminated courtyard in the snow"],
  ["04", "atelier", "bedroom", "Soverom med grå gardiner", "Bedroom with grey curtains"],
  ["05", "fjord", "living", "Dagslys under kuppelen", "Daylight beneath the oculus"],
  ["06", "cabin", "wellness", "Badekar i gyllen stein", "Bathtub among golden stone walls"],
  ["07", "atelier", "architecture", "Veranda under trærne", "Veranda beneath the trees"],
  ["08", "cabin", "architecture", "Høyt tregalleri", "Double-height timber gallery"],
  ["09", "fjord", "outdoors", "Bassengterrasse mot fjorden", "Pool terrace facing the fjord"],
  ["10", "atelier", "bedroom", "Soverom med forgylte rammer", "Bedroom with gilded frames"],
  ["11", "cabin", "living", "Lesekrok ved vinduet", "Window seat with exposed beams"],
  ["12", "cabin", "wellness", "Steinrom mot hagen", "Stone retreat opening to the garden"],
  ["13", "cabin", "architecture", "Hus mellom terrasserte jorder", "House among terraced fields"],
  ["14", "fjord", "bedroom", "Fjellmotiv over sengen", "Mountain print above the bed"],
  ["15", "cabin", "living", "Lekerom med bokhyller", "Playroom with built-in bookshelves"],
  ["16", "fjord", "bedroom", "Soverom ved skogsglasset", "Glass-walled forest bedroom"],
  ["17", "atelier", "wellness", "Yogarom med trepanel", "Timber-lined yoga room"],
  ["18", "atelier", "detail", "Malt vegg i skrått sollys", "Painted wall in slanting sunlight"],
  ["19", "atelier", "living", "Liten sitteplass i tre", "Compact timber sitting room"],
  ["20", "fjord", "outdoors", "Gyllent kveldslys", "Golden evening light"],
  ["21", "fjord", "wellness", "Åpent gulv mot vannet", "Open floor overlooking the water"],
  ["22", "atelier", "architecture", "Gårdsrom sett ovenfra", "Courtyard geometry from above"],
  ["23", "cabin", "wellness", "Stille paviljong i snøen", "Quiet pavilion in the snow"],
  ["24", "cabin", "bedroom", "Gyngestol på tregulv", "Rocking horse on a pine floor"],
  ["25", "cabin", "living", "Peis mot vinterhagen", "Fireside seating facing the winter courtyard"],
  ["26", "atelier", "bedroom", "Grønn hodegavl mot tre", "Green headboard against timber"],
  ["27", "cabin", "detail", "Utskårne rammer ved spisebordet", "Carved joinery around a dining table"],
  ["28", "atelier", "outdoors", "Solnedgang gjennom buene", "Sunset through the arcade"],
  ["29", "atelier", "bedroom", "Soverom i hvitt", "White-on-white bedroom"],
  ["30", "cabin", "bedroom", "Soverom bak trebjelker", "Bedroom framed by timber beams"],
  ["31", "atelier", "architecture", "Garasje i lys eik", "Pale timber garage entrance"],
  ["32", "cabin", "wellness", "Bindingsverk rundt badekaret", "Half-timbered bathroom"],
  ["33", "fjord", "wellness", "Mørkt kar i en lun nisje", "Dark stone basin in a timber alcove"],
  ["34", "atelier", "bedroom", "Grått tekstil og grønne planter", "Grey textiles and leafy plants"],
  ["35", "fjord", "wellness", "Bad i lyst tre og blått", "Light timber bathroom with blue accents"],
  ["36", "atelier", "architecture", "Lys fasade mot gårdsplassen", "Pale façade surrounding a courtyard"],
  ["37", "cabin", "living", "Lekerom under saltaket", "Playroom beneath a pitched roof"],
  ["38", "cabin", "bedroom", "Soverom mellom åpne dører", "Bedroom between open doorways"],
  ["39", "fjord", "outdoors", "Hvit uteplass under åpen himmel", "White terrace under open sky"],
  ["40", "atelier", "architecture", "Hus med glassfelt i mørkt tre", "Glazed frontage set in dark timber"],
  ["41", "fjord", "wellness", "Meditasjonsrom i ask", "Meditation room in pale timber"],
  ["42", "fjord", "living", "Flygel under buet tretak", "Grand piano beneath a curved timber ceiling"],
  ["43", "cabin", "architecture", "Verandalys i skumringen", "Porch lights at dusk"],
  ["44", "atelier", "detail", "Bokhyller og malte søyler", "Bookshelves and painted columns"],
  ["45", "fjord", "architecture", "Hvit takflate i snølandskap", "White roof against the snow"],
  ["46", "cabin", "living", "Sollys i det malte lekerommet", "Sunlight in a painted playroom"],
  ["47", "fjord", "living", "Stue med åpent overlys", "Living area beneath a skylight"],
  ["48", "atelier", "living", "Sittegruppe i myke gråtoner", "Seating in soft grey tones"],
  ["49", "cabin", "wellness", "Stearinlys mot mørke trevegger", "Candlelight against dark timber"],
  ["50", "fjord", "architecture", "Rødt hus over vannet", "Red waterside house on stilts"],
];

export const renderGallery: GalleryScene[] = entries.map(([id, study, subject, nb, en]) => ({
  id: "gallery-" + id,
  image: `/media/gallery/scene-${id}.webp`,
  thumbnail: `/media/gallery/thumbs/scene-${id}.webp`,
  title: [nb, en],
  style: subjects[subject],
  study,
}));

export const fileExamples: GalleryScene[] = [
  { id: "file-fjord", image: "/reference/editorial/files-fjord.webp", title: ["Terrasse mot fjorden", "Fjord terrace"], style: subjects.outdoors, study: "fjord" },
  { id: "file-atelier", image: "/reference/editorial/files-atelier.webp", title: ["Lys fra peisen", "Firelight study"], style: subjects.living, study: "atelier" },
  { id: "file-cabin", image: "/reference/editorial/files-cabin.webp", title: ["Soverom med utsikt", "Bedroom with a view"], style: subjects.bedroom, study: "cabin" },
];
