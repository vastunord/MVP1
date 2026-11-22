type Localized = readonly [string, string];
type Lesson = {
  tag: number;
  name: Localized;
  exercise: Localized;
  check: Localized;
};

// Norwegian and English descriptions used with a separately observed image and task for each study.
export const studyLessons = {
  glow: {
    tag: 6,
    name: ["Kveldslys", "Evening light"],
    exercise: [
      "Dekk det varmeste lysfeltet med en papirlapp mens du ser på bildet. Hvilken del blir viktigst nå? Ta bort lappen og legg merke til hva den ene lyskilden forteller om rommets bruk.",
      "Cover the warmest pool of light with a slip of paper while looking at the picture. Which part comes forward now? Remove the paper and consider what that single light tells you about how the space is used.",
    ],
    check: [
      "Ta to bilder fra samme sted i skumringen, med og uten én lampe. Behold samme eksponering så du kan vurdere forskjellen rundt lampen.",
      "Take two photographs from the same position at dusk, with one lamp on and off. Keep the exposure fixed so you can judge the change around the lamp.",
    ],
  },
  repeat: {
    tag: 4,
    name: ["Rytme og gjentakelse", "Rhythm and repetition"],
    exercise: [
      "Følg en gjentatt kant fra den ene enden av bildet til den andre. Marker hvor avstanden endres. Et større mellomrom kan gjøre en inngang eller sitteplass lettere å finne.",
      "Trace a repeated edge across the picture and mark where the spacing changes. A wider interval can help a doorway or seat stand out. Try covering just that interval to see what the repetition contributes.",
    ],
    check: [
      "Tegn rekken med enkle streker. Flytt bare én strek på skissen og se om du fortsatt legger merke til det samme stedet først.",
      "Draw the sequence as a row of simple marks. Move just one mark in the sketch and check whether the same part still catches your eye first.",
    ],
  },
  texture: {
    tag: 5,
    name: ["Overflatestruktur", "Surface texture"],
    exercise: [
      "Sammenlign et belyst felt med et skyggefelt på samme materiale. Korte skygger kan fortelle mer om relieffet enn materialets grunnfarge. Se etter et sted der strukturen nesten forsvinner.",
      "Compare a lit patch with a shaded patch on the same apparent finish. Short shadows often describe the relief more clearly than the base colour. Find a patch where the texture nearly disappears.",
    ],
    check: [
      "Se på en virkelig materialprøve med en flyttbar lampe først forfra, så fra siden. Velg plassering etter hvordan du faktisk skal se og berøre overflaten.",
      "Look at a real sample with a movable lamp first facing it, then grazing it from the side. Judge the finish from the position where you will actually see and touch it.",
    ],
  },
  outline: {
    tag: 4,
    name: ["Silhuett", "Silhouette"],
    exercise: [
      "Knip øynene litt sammen til detaljene forsvinner. Følg ytterkanten til motivet og se hvor den går i ett med bakgrunnen. Selv en liten forskyvning i synsvinkel kan skille to former.",
      "Narrow your eyes until the details soften. Follow the main outline and find where it merges with the background. A small shift in viewpoint can separate two shapes without adding another colour.",
    ],
    check: [
      "Prøv to fotostandpunkter med et lite skritt mellom. Velg det der omrisset av det du vil vise, kan følges lengst.",
      "Try two camera positions a small step apart. Choose the one where the outline of the object you want to show can be followed furthest.",
    ],
  },
  horizon: {
    tag: 7,
    name: ["Utsikt og øyehøyde", "Views and eye level"],
    exercise: [
      "Følg den fjerneste tydelige vannrette linjen. Se hvilke nære kanter som skjærer over den. Hev eller senk et papir foran bildet for å etterligne hva et høyere møbel ville skjule.",
      "Follow the most distant clear horizontal line and notice which near edges cross it. Raise or lower a sheet of paper in front of the picture to mimic the view a taller furnishing would hide.",
    ],
    check: [
      "Kontroller utsynet både sittende og stående på stedet. Legg begge synslinjene inn på samme enkle skisse før du velger høyde eller posisjon.",
      "Check the actual view while seated and standing. Put both sightlines on the same simple sketch before deciding on a height or position.",
    ],
  },
  accent: {
    tag: 4,
    name: ["Fargeaksent", "Accent colour"],
    exercise: [
      "Se bort og tilbake på bildet. Merk hvilken farge som fanger blikket først, og hvor liten plass den opptar. Sammenlign med den største fargeflaten, som ofte virker roligere.",
      "Look away, then back at the picture. Note which colour catches your eye first and how little space it occupies. Compare it with the largest area of colour, which often feels quieter.",
    ],
    check: [
      "Prøv aksentfargen på et løst tekstil eller et ark. Flytt det mellom to synlige steder og fotografer begge fra samme posisjon.",
      "Try the accent on a loose textile or sheet of coloured paper. Move it between two visible positions and photograph both from the same spot.",
    ],
  },
  mirror: {
    tag: 6,
    name: ["Speiling", "Reflections"],
    exercise: [
      "Velg én synlig kant i bildet og følg den mot glasset eller vannet. Sjekk om den fortsetter rett frem eller kommer tilbake som en speiling. Se hvilke ekstra flater refleksen får deg til å oppfatte.",
      "Choose a visible edge and follow it towards the glass or water. Check whether it continues through the surface or returns as a reflection. Notice what extra planes the reflection makes you perceive.",
    ],
    check: [
      "Se på en blank prøve fra to ulike vinkler. En speiling som er nyttig fra døren, kan dekke motivet når du setter deg.",
      "Look at a glossy sample from two angles. A reflection that helps from the doorway may mask the subject when you sit down.",
    ],
  },
  frame: {
    tag: 4,
    name: ["Innramming", "Framing a view"],
    exercise: [
      "Bruk to papirstrimler til å gjøre åpningen litt smalere. Legg merke til når motivet mister en viktig kant, eller når en forstyrrende detalj faller utenfor.",
      "Use two strips of paper to narrow the opening a little. Notice when the subject loses an important edge or a distracting detail disappears. Compare the open view with this tighter frame.",
    ],
    check: [
      "Se fra stedet du bruker mest i rommet. Marker rammen på et foto før du flytter gardiner, planter eller møbler rundt utsynet.",
      "Stand or sit where you spend most time in the room. Mark the frame on a photograph before moving curtains, plants or furnishings around the view.",
    ],
  },
  layers: {
    tag: 7,
    name: ["Dybde i bildet", "Depth in a scene"],
    exercise: [
      "Finn noe nærmest deg, en tydelig mellomgrunn og et fjernere punkt. Følg kanten der to av dem overlapper. Det er ofte nok til å forklare avstand uten å kjenne noen mål.",
      "Find something near you, a distinct middle plane and a distant point. Trace the edge where two overlap. That small overlap often communicates distance even when the picture gives no reliable dimensions.",
    ],
    check: [
      "Skisser de tre lagene med tre gråtoner. Hvis to flyter sammen, prøv et annet standpunkt før du foreslår nye materialer.",
      "Sketch the three planes in three shades of grey. If two merge, try a different viewpoint before proposing different materials.",
    ],
  },
  edge: {
    tag: 5,
    name: ["Overganger", "Reading an edge"],
    exercise: [
      "Følg skjøten mellom to flater. Finn stedet der kanten er tydeligst, og stedet der den glir bort. Sammenlign farge, glans og skygge langs samme skjøt.",
      "Follow the joint between two planes. Find where the edge is clearest and where it starts to disappear. Compare colour, sheen and shadow along that same joint.",
    ],
    check: [
      "Legg to virkelige prøver kant i kant og se på dem fra normal avstand. Gjenta forsøket i både vinduslys og rommets kveldslys.",
      "Put two real samples edge to edge and view them from the usual distance. Repeat in both window light and the room's evening light.",
    ],
  },
  soft: {
    tag: 2,
    name: ["Myke konturer", "Soft contours"],
    exercise: [
      "Følg vekslingen mellom en rett kant og en mer uregelmessig form. Dekk formen en kort stund og se om den rette kanten virker lengre eller hardere.",
      "Follow the transition between a straight edge and a more irregular shape. Briefly cover the irregular shape and see whether the straight edge feels longer or harder.",
    ],
    check: [
      "Prøv én flyttbar plante eller tekstilprøve ved siden av en fast kant. Sjekk både konturen og hvor mye dagslys den tar.",
      "Try one movable plant or textile sample beside a fixed edge. Check both its outline and how much daylight it takes away.",
    ],
  },
  route: {
    tag: 7,
    name: ["Ganglinjer", "Circulation"],
    exercise: [
      "La blikket følge den synlige ruten fra nærmeste kant til et mål i bakgrunnen. Merk hvor den vrir seg, og hvor den forsvinner bak noe. En fri siktlinje kan se bredere ut enn den gangplassen som finnes.",
      "Trace the visible route from the nearest edge to a destination further back. Mark where it turns and where an object hides it. A clear sightline can look wider than the walking space actually available.",
    ],
    check: [
      "Prøv samme bevegelse i det virkelige rommet, også med dører åpne og stoler trukket ut. Mål den trangeste passasjen på stedet.",
      "Walk the corresponding route in the real space, with doors open and chairs pulled out. Measure the narrowest passage on site.",
    ],
  },
  figure: {
    tag: 4,
    name: ["Motiv og bakgrunn", "Figure and ground"],
    exercise: [
      "Dekk hovedmotivet og se på formen som står igjen rundt det. Sett det tilbake. Et motiv som er lite i utsnittet kan likevel være lett å finne når bakgrunnen gir det en lesbar kontur.",
      "Cover the main subject and look at the space around it, then uncover it. A subject that occupies little of the picture can still be easy to find when its background gives it a readable contour.",
    ],
    check: [
      "Fotografer det samme motivet mot to bakgrunner fra samme avstand. Sjekk først hvilket omriss du ser, deretter detaljene.",
      "Photograph the same subject against two backgrounds from the same distance. Compare the outlines first and the details second.",
    ],
  },
  shadow: {
    tag: 6,
    name: ["Lys og skygge", "Light and shadow"],
    exercise: [
      "Se på kanten av den tydeligste skyggen. Følg den over mer enn én flate hvis det er mulig. Der kanten skifter retning, forteller den noe om underlagets form.",
      "Look at the edge of the clearest shadow. Follow it across more than one plane if possible. Where the edge changes direction, it tells you something about the shape of the surface beneath.",
    ],
    check: [
      "Ta et nytt bilde fra samme sted senere på dagen. Sammenlign skyggekanten før du konkluderer med at selve materialfargen bør endres.",
      "Take another picture from the same position later in the day. Compare the shadow edges before deciding that the material colour itself needs to change.",
    ],
  },
  threshold: {
    tag: 7,
    name: ["Terskler og innganger", "Thresholds"],
    exercise: [
      "Finn skillet mellom rommet foran åpningen og rommet bak. Legg merke til hva som skifter først langs ruten, for eksempel gulvretning, lysstyrke eller takhøyde.",
      "Find the boundary between the space in front of the opening and the space beyond it. Notice what changes first along the route, such as floor direction, brightness or apparent ceiling height.",
    ],
    check: [
      "Still deg rett foran en tilsvarende åpning og gå et skritt til siden. Se hvilken del av det neste rommet som først forsvinner.",
      "Stand in front of a similar opening and move one step sideways. Notice which part of the next space disappears first.",
    ],
  },
  task: {
    tag: 6,
    name: ["Lys ved arbeidsplassen", "Light for an activity"],
    exercise: [
      "Tenk deg personen som skal bruke plassen. Finn hvor hendene eller blikket vil være, og hvor lyset kommer fra. Vurder om kroppen vil skygge for det man holder på med.",
      "Picture the person using this spot. Locate where their hands or eyes will be, then find the direction of the light. Consider whether the person's own body would shade the activity.",
    ],
    check: [
      "Legg et ark på arbeidsstedet og prøv aktiviteten med en flyttbar lampe. Se etter gjenskinn fra brukerens vanlige øyehøyde.",
      "Place a sheet of paper at the work spot and try the activity with a movable lamp. Check for glare from the user's normal eye level.",
    ],
  },
  empty: {
    tag: 2,
    name: ["Åpent rom", "Unoccupied space"],
    exercise: [
      "Tegn omrisset av den største frie flaten. Vurder hva den gjør mulig, for eksempel å snu, flytte en stol eller la et møbel stå alene mot en vegg.",
      "Trace the shape of the largest clear area. Consider what it makes possible, such as turning, moving a chair or letting a single piece of furniture sit against an uninterrupted wall.",
    ],
    check: [
      "Marker et tenkt møbel med papir eller tape på gulvet. Gjenta den vanlige bevegelsen gjennom rommet før du bestemmer om du vil fylle plassen.",
      "Mark a proposed furnishing with paper or tape on the floor. Repeat your normal movement through the room before deciding whether to fill the space.",
    ],
  },
  contrast: {
    tag: 5,
    name: ["Lyshetskontrast", "Tonal contrast"],
    exercise: [
      "Se på to flater som møtes. Gjør bildet grått på telefonen eller hold det på armlengdes avstand. Undersøk om kantene fortsatt skiller seg når fargene ikke får like mye oppmerksomhet.",
      "Look at two adjoining surfaces. View the picture in greyscale or hold it at arm's length. Check whether the boundary survives when the colours themselves carry less weight.",
    ],
    check: [
      "Sammenlign to prøveflater i rommet gjennom dagen. En kontrast som virker tydelig på skjermen kan være svak fra et annet standpunkt.",
      "Compare two samples in the actual room through the day. A contrast that looks clear on screen can be weak from another position.",
    ],
  },
  grain: {
    tag: 5,
    name: ["Treverkets retning", "Timber direction"],
    exercise: [
      "Følg en synlig linje i treverket til neste skjøt. Se om naboflaten fortsetter retningen eller bryter den. Dette kan skille møbel, vegg og gulv selv når tretonene er like.",
      "Follow a visible line in the timber to the next joint. See whether the adjacent surface continues that direction or breaks it. This can distinguish a furnishing, wall or floor even when the timber tones are similar.",
    ],
    check: [
      "Snu én prøve en kvart omdreining ved siden av en annen. Se på skjøten fra døren og på nært hold før du velger retningen.",
      "Turn one sample a quarter turn beside another. Look at the joint from the doorway and up close before choosing the direction.",
    ],
  },
  zone: {
    tag: 2,
    name: ["Møbleringssoner", "Furniture zones"],
    exercise: [
      "Tegn et omriss rundt møblene som brukes sammen. Legg til plassen man trenger for å sette seg, snu seg og gå videre. Sammenlign dette omrisset med gulvet rundt.",
      "Draw an outline around the furnishings used together. Add the space someone needs to sit down, turn around and move on. Compare this outline with the floor around it.",
    ],
    check: [
      "Prøv oppstillingen med løse stoler før du velger faste løsninger. Sjekk at en annen person kan passere mens plassen er i bruk.",
      "Test the arrangement with loose chairs before choosing fixed pieces. Check that someone else can pass while the spot is occupied.",
    ],
  },
  axis: {
    tag: 7,
    name: ["Siktakser", "Alignment"],
    exercise: [
      "Trekk en tenkt linje fra det fremste midtpunktet til motivet lenger inne. Se hvilke detaljer som ligger litt på siden av linjen. Det viser hvor symmetrien er sterk og hvor den brytes.",
      "Draw an imaginary line from the nearest centre point to the subject further back. Notice which details fall slightly to one side. This shows where the alignment holds and where it breaks.",
    ],
    check: [
      "Skisser to plasseringer av ett flyttbart objekt. Sammenlign dem fra den faktiske døråpningen og sitteplassen, som kan gi ulike midtlinjer.",
      "Sketch two positions for one movable object. Compare them from the actual doorway and seat, which can give different centre lines.",
    ],
  },
  focus: {
    tag: 4,
    name: ["Blikkfang", "Focal points"],
    exercise: [
      "Se på bildet i to sekunder og dekk det til. Hvilke to detaljer husker du? Sammenlign størrelsen, kontrasten og plasseringen deres for å finne ut hvorfor begge tiltrekker seg oppmerksomhet.",
      "Look at the image for two seconds and cover it. Which two details do you remember? Compare their size, contrast and position to understand why both draw attention.",
    ],
    check: [
      "Skjerm ett av blikkfangene på en kopi av bildet. Vurder om det andre kommer tydeligere frem og om rommet fortsatt virker balansert.",
      "Mask one focal point on a copy of the image. Consider whether the other reads more clearly and whether the space still feels balanced.",
    ],
  },
} satisfies Record<string, Lesson>;
export type StudyLens = keyof typeof studyLessons;
