import type { Locale } from "@/lib/i18n";
import { Photo, Section } from "./marketing-elements";
import "./home-questions.css";

const questions = [
  {
    illustration: "home-direction-room",
    no: [
      "Trenger jeg designerfaring?",
      "Begynn med én ting du vil endre, for eksempel hvor sofaen står. Åpne et eksempel i Studio, velg et romkonsept og juster én innstilling om gangen.",
      "Lys stue med sofa, rundt bord og god plass rundt sittegruppen.",
    ],
    en: [
      "Do I need design experience?",
      "Start with one thing you would change, such as the position of the sofa. Open a sample in Studio, choose a room brief, and adjust one setting at a time.",
      "Light living room with a sofa, a round table and open space around the seating.",
    ],
  },
  {
    illustration: "home-direction-frame",
    no: [
      "Hvordan tar jeg et godt utgangsbilde?",
      "Hold kameraet rett og få med overgangen mellom vegg og gulv. Ta med et vindu, en dør eller et møbel som gir rommet målestokk. Bruk samme ståsted hvis du vil sammenligne flere bilder.",
      "Spisestue fotografert på langs med synlige bjelker og rette vinduskarmer.",
    ],
    en: [
      "How should I photograph my room?",
      "Keep the camera level and include the line where the wall meets the floor. A doorway, window or familiar piece of furniture gives the room scale. Use the same viewpoint for any follow-up photos.",
      "Dining room photographed along its length with visible beams and upright window frames.",
    ],
  },
  {
    illustration: "home-tone-comparison",
    no: [
      "Kan jeg ta med et eksempel inn i Studio?",
      "Ja. Dra skillet i bildet øverst på siden. Velg «Åpne Studio» når rommet du ønsker vises. Studio åpner med utgangsbildet du valgte.",
      "Åpen stue og spisestue med sofa, spisebord og opplyst vegg.",
    ],
    en: [
      "Can I take a sample photo into Studio?",
      "Yes. Drag the divider at the top of this page. When you find a room you like, select “Open Studio”. Studio opens with that scene’s original photo.",
      "Open-plan living and dining space with seating, a dining table and illuminated wall.",
    ],
  },
  {
    illustration: "home-direction-material",
    no: [
      "Hvordan sammenligner jeg materialer?",
      "Hold lys og kameravinkel like. Velg én flate, som gulvet, og prøv en lys og en mørk variant. Legg deretter de fysiske materialprøvene i rommets eget dagslys.",
      "Tregulv og mørke overflater ved et stort vindu med fjellutsikt.",
    ],
    en: [
      "How can I compare finishes?",
      "Keep the lighting and viewpoint fixed. Choose one surface, such as the floor, and try a light and a dark finish. Then take physical samples into the room and compare them in its own daylight.",
      "Timber floor and darker surfaces beside a broad window overlooking the mountains.",
    ],
  },
  {
    illustration: "home-audience-home",
    no: [
      "Hvordan beholder jeg rommets særpreg?",
      "Beskriv detaljene du vil bevare først. Det kan være et karnapp, en list eller et gammelt parkettgulv. Nevn deretter én endring, som et nytt teppe eller en annen veggfarge.",
      "Fargerik stue med karnappvinduer og et rikt dekorert tak.",
    ],
    en: [
      "How do I keep the character of an older room?",
      "Name the features you love first, such as the bay window, cornice or old parquet floor. Then describe one change, like a new rug or wall colour, so the brief gives those original features priority.",
      "Colourful sitting room with bay windows and an ornate ceiling.",
    ],
  },
  {
    illustration: "home-steps-create",
    no: [
      "Hvordan vurderer jeg ganglinjene?",
      "Tenk gjennom veien fra døren til sitteplassen eller kjøkkenet. Hold den synlig i utkastet og prøv plasseringen på gulvet med maskeringstape. Åpne skap og dører mens du går ruten.",
      "En sammenhengende ganglinje gjennom en korridor med mørke trebjelker.",
    ],
    en: [
      "How do I check a furniture layout?",
      "Trace the route from the door to the seating or kitchen. Keep that path visible in the study, then mark the proposed furniture on the floor with tape. Walk the route with doors and cupboards open.",
      "An uninterrupted route along a corridor framed by dark timber posts.",
    ],
  },
  {
    illustration: "home-direction-outdoors",
    no: [
      "Kan jeg planlegge en terrasse eller hage?",
      "Åpne Garden Design i Studio. Start med én brukssituasjon, som et måltid ute. Merk av døren og utsikten du vil beholde før du prøver plasseringen av bord, sitteplasser og beplantning.",
      "Utebord på en treterrasse ved en bjørkeskog.",
    ],
    en: [
      "Can I explore a terrace or garden?",
      "Open Garden Design in Studio. Start with one use, such as eating outside. Identify the doorway and the view you want to keep before trying positions for a table, seating and planting.",
      "Outdoor dining table on a timber deck beside a birch grove.",
    ],
  },
  {
    illustration: "home-steps-choose",
    no: [
      "Hvordan kan ett rom passe til flere aktiviteter?",
      "Velg et fast holdepunkt for hver aktivitet. Et vindu kan gi en lesekrok dagslys, mens en fri gulvflate gir plass til lek. Tegn inn oppbevaring der tingene faktisk brukes.",
      "Et barnerom med bokhylle, åpen gulvplass og lesebenk ved vinduet.",
    ],
    en: [
      "How can one room serve several activities?",
      "Give each activity an anchor. A window can light a reading nook, while clear floor space can accommodate play. Plan storage where the books, toys or equipment will actually be used.",
      "Children’s room with shelving, open floor space and a window seat.",
    ],
  },
  {
    illustration: "home-steps-explore",
    no: [
      "Hvordan utforsker jeg lyset i rommet?",
      "Legg merke til hvor sollyset treffer om morgenen og ettermiddagen. Beskriv hvilken tid du planlegger for, og behold de samme møblene når du sammenligner lysretninger.",
      "Sollys faller gjennom høye vinduer mot en sitteplass.",
    ],
    en: [
      "How do I explore light in a room?",
      "Observe where sunlight lands in the morning and afternoon. Choose the time of day you are designing for, then keep the furniture fixed while you compare light directions.",
      "Sunlight passing through tall windows towards a seating area.",
    ],
  },
  {
    illustration: "home-steps-decide",
    no: [
      "Hvordan finner jeg riktig plass til plantene?",
      "Start med lyset ved vinduene og plassen planten trenger når den vokser. Prøv én gruppe langs veggen, og sjekk at du kommer til for vanning og fortsatt kan åpne vinduet.",
      "Planter samlet langs vinduene i et rom med lyst tregulv.",
    ],
    en: [
      "Where should I try adding plants?",
      "Start with the light near the windows and the space a mature plant will need. Try grouping pots along one wall, then check that you can water them and still open the window.",
      "Plants grouped by the windows in a light timber-floored room.",
    ],
  },
  {
    illustration: "home-audience-design",
    no: [
      "Hva bør jeg skrive i en rombeskrivelse?",
      "Fortell hva du skal gjøre i rommet, hva som må få plass, og én stemning du liker. For et musikkrom kan det være plass til flygelet, fri utsikt fra pianokrakken og varmt treverk.",
      "Et flygel foran et stort vindu i et buet rom kledd med tre.",
    ],
    en: [
      "What should a room brief include?",
      "Describe the activity, the object that needs to fit, and a mood you like. For a music room that might mean space for a grand piano, a view from the piano stool and warm timber walls.",
      "Grand piano facing a wide window in an arched timber-lined room.",
    ],
  },
  {
    illustration: "home-audience-property",
    no: [
      "Kan jeg bruke en studie som byggetegning?",
      "Bruk studien til å forklare idéen for en fagperson. Før du bestiller eller bygger, må mål, konstruksjon og plassering kontrolleres mot oppmåling og prosjekterte tegninger.",
      "Illustrert bolig sett ovenfra med bygningens form og plassering i hagen.",
    ],
    en: [
      "Can I build directly from a study?",
      "Use the image to discuss the idea with a professional. Before ordering or building, have the dimensions, construction and position checked against a measured survey and project drawings.",
      "Illustrated house viewed from above showing the building form and garden layout.",
    ],
  },
] as const;

export function HomeQuestions({ locale }: { locale: Locale }) {
  return (
    <Section tone="sand" id="questions">
      <p className="mk-label">FAQ</p>
      <h2>{locale === "en" ? "Before you start." : "Før du begynner."}</h2>
      <div className="home-questions">
        {questions.map((item) => {
          const [question, answer, alt] = locale === "en" ? item.en : item.no;
          return (
            <details
              key={item.illustration}
              name="home-questions"
              open={item === questions[0]}
            >
              <summary>
                <span>{question}</span>
                <span aria-hidden="true" className="home-question-toggle" />
              </summary>
              <div className="home-question-answer">
                <Photo name={"editorial/" + item.illustration} alt={alt} />
                <p>{answer}</p>
              </div>
            </details>
          );
        })}
      </div>
    </Section>
  );
}
