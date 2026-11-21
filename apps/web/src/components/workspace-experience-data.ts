export type Bilingual = readonly [string, string];

type Guide = {
  id: string;
  topic: Bilingual;
  title: Bilingual;
  body: Bilingual;
  image: string;
};

// Editorial excerpts adapted from the supplied HTML reference's sample articles.
export const guides: Guide[] = [
  {
    id: "light",
    topic: ["Belysning", "Lighting"],
    title: ["Lys i flere lag", "The quiet art of layered lighting"],
    image: "soft-evening",
    body: [
      "Begynn med det du gjør i rommet. Grunnbelysning gir oversikt, en leselampe lyser opp boken, og et lite lys mot veggen gir dybde. Se hva dagslyset gjør før du velger lampene.",
      "Start with what you do in the room. Ambient light helps you find your way, a reading lamp lights the page, and a small wall light adds depth. Observe the daylight before choosing fixtures.",
    ],
  },
  {
    id: "material",
    topic: ["Materialer", "Materials"],
    title: ["Materialer som føles som hjemme", "Materials that feel like home"],
    image: "warm",
    body: [
      "Legg prøver av tre, stein og tekstil ved siden av hverandre. Kjenn på overflaten og se prøvene i dagslys. Vurder hvordan materialene eldes, og hvor mye stell de trenger i hverdagen.",
      "Place timber, stone and textile samples side by side. Touch each surface and look at it in daylight. Consider how each material will age and the care it will need in daily use.",
    ],
  },
  {
    id: "floor",
    topic: ["Planløsning", "Planning"],
    title: ["Plass til å bevege seg", "Room flow and movement"],
    image: "soft",
    body: [
      "Følg veien fra døren til godstolen og videre til vinduet. Legg merke til hvor du må gå rundt møbler. Mål på stedet før du bestiller noe eller endrer planløsningen.",
      "Trace your route from the door to a favourite chair and on to the window. Notice where furniture interrupts that path. Take measurements on site before ordering anything or changing the layout.",
    ],
  },
  {
    id: "nordic",
    topic: ["Nordisk design", "Nordic living"],
    title: ["Færre ting, tydeligere valg", "Less, but with intention"],
    image: "soft-bright",
    body: [
      "Velg én funksjon rommet skal støtte og én ting du vil beholde. La de to valgene styre møblering og materialer, og gi dagslyset plass.",
      "Choose one activity the room should support and one object you want to keep. Let those two choices guide furniture and finishes, and leave space for daylight.",
    ],
  },
  {
    id: "vastu",
    topic: ["Vastu", "Vastu principles"],
    title: ["Rom og retning", "Spatial balance and orientation"],
    image: "cover",
    body: [
      "Vastu er en tradisjon for å utforske rom, retning og forholdet mellom dem. Bruk det som et kulturelt perspektiv når du vurderer hvor du liker å sitte, bevege deg og hvile.",
      "Vastu is a tradition that explores space, orientation and their relationship. Use it as a cultural perspective when considering where you like to sit, move and rest.",
    ],
  },
  {
    id: "budget",
    topic: ["Oppussing", "Renovation"],
    title: [
      "Slik deler du opp et oppussingsbudsjett",
      "How to think about a renovation budget",
    ],
    image: "soft-moss",
    body: [
      "Sett av egne poster til arbeid, materialer, møbler og uforutsette utgifter. Skaff mål og lokale tilbud før du bruker beløpene til å ta en kjøpsbeslutning.",
      "Set aside separate amounts for labour, materials, furnishings and contingency. Obtain measurements and local quotations before using any figure to make a purchasing decision.",
    ],
  },
];

export const rooms = [
  {
    name: ["Stue", "Living room"],
    image: "soft",
    note: [
      "Se hvordan dagslyset faller på sitteplassen.",
      "Notice how daylight reaches the seating area.",
    ],
  },
  {
    name: ["Kjøkken", "Kitchen"],
    image: "warm",
    note: [
      "Sammenlign varme overflater med kjøligere dagslys.",
      "Compare warm finishes against cooler daylight.",
    ],
  },
  {
    name: ["Soverom", "Bedroom"],
    image: "cover",
    note: [
      "Utforsk myke kontraster for et roligere uttrykk.",
      "Explore softer contrasts for a quieter atmosphere.",
    ],
  },
  {
    name: ["Bad", "Bathroom"],
    image: "soft-bright",
    note: [
      "Se hvordan lyse toner endrer romfølelsen.",
      "See how light tones change the sense of space.",
    ],
  },
] as const;
export const finishes = [
  {
    name: ["Naturfarget eik", "Natural oak"],
    colour: "#c7a079",
    note: ["En varm, gyllen tretone.", "A warm, golden timber tone."],
  },
  {
    name: ["Salviegrønn puss", "Sage plaster"],
    colour: "#a2b7ad",
    note: [
      "En dempet grønntone med matt karakter.",
      "A muted green tone with a matte character.",
    ],
  },
  {
    name: ["Lys kalkstein", "Soft limestone"],
    colour: "#e7d8c3",
    note: ["En lys, sandfarget steintone.", "A light, sandy stone tone."],
  },
  {
    name: ["Mørk valnøtt", "Deep walnut"],
    colour: "#6b4936",
    note: [
      "En dyp brunfarge som gir kontrast.",
      "A deep brown that adds contrast.",
    ],
  },
] as const;
