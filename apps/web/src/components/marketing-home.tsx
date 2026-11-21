"use client";
import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { Action, Closing, FAQ, Photo, Section } from "./marketing-elements";

const directions = [
  [
    "Gi rommet ny form",
    "Reimagine a space",
    "Utforsk møblering, stil og stemning.",
    "Explore layout, style and atmosphere.",
    "room-reimagination",
    "Room Reimagination",
    "⌂",
  ],
  [
    "Forvandle uterommet",
    "Transform outdoors",
    "Prøv en retning for hage og landskap.",
    "Find a direction for gardens and landscapes.",
    "garden-design",
    "Garden Design",
    "☼",
  ],
  [
    "Finjuster detaljene",
    "Refine the details",
    "Se materialer og overflater i sammenheng.",
    "Consider materials and finishes together.",
    "material-refinement",
    "Material Refinement",
    "◈",
  ],
  [
    "Forbedre et bilde",
    "Perfect an image",
    "Utforsk utsnitt, perspektiv og renere linjer.",
    "Explore framing, perspective and cleaner lines.",
    "perspective-correction",
    "Perspective Correction",
    "⌗",
  ],
] as const;
const scenes = [
  [
    "soft-day",
    "Interiørstudie",
    "Interior study",
    "Et nytt blikk på stuen.",
    "Reimagine your living room.",
  ],
  [
    "warm",
    "Materialstudie",
    "Material study",
    "Utforsk tekstur og dybde.",
    "Explore texture and depth.",
  ],
  [
    "cover",
    "Lysstudie",
    "Light study",
    "Se hva lyset gjør med rommet.",
    "See how light shapes a space.",
  ],
] as const;
const steps = [
  [
    "Velg",
    "Choose",
    "Begynn med et rom og en idé.",
    "Start with a space and an idea.",
    "cover",
  ],
  [
    "Skap",
    "Create",
    "Velg verktøy, stil og detaljer i Studio.",
    "Choose your tool, style and details in the Studio.",
    "soft-day",
  ],
  [
    "Utforsk",
    "Explore",
    "Se varianter ved siden av hverandre.",
    "View alternatives alongside each other.",
    "soft-moss",
  ],
  [
    "Bestem",
    "Decide",
    "Ta med den retningen du liker videre.",
    "Carry your preferred direction into the next decision.",
    "warm",
  ],
] as const;

function StudyCompare({ en }: { en: boolean }) {
  const [variant, setVariant] = useState(0);
  const [split, setSplit] = useState(48);
  const names = en
    ? ["Daylight", "Evening", "Moss"]
    : ["Dagslys", "Kveld", "Mose"];
  return (
    <div>
      <div className="mk-compare">
        <Photo name="soft" />
        <div
          className="mk-compare-layer"
          style={{ clipPath: "inset(0 0 0 " + split + "%)" }}
        >
          <Photo name={["soft-bright", "soft-evening", "soft-moss"][variant]} />
        </div>
        <span className="mk-image-tag left">
          {en ? "Original" : "Original"}
        </span>
        <span className="mk-image-tag right">{names[variant]}</span>
        <span className="mk-divider" style={{ left: split + "%" }}>
          <b>↔</b>
        </span>
        <input
          aria-label={en ? "Compare image studies" : "Sammenlign bildestudier"}
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
        />
      </div>
      <div className="mk-variants">
        {names.map((name, i) => (
          <button
            key={name}
            aria-pressed={variant === i}
            onClick={() => setVariant(i)}
          >
            <Photo name={["soft-bright", "soft-evening", "soft-moss"][i]} />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MarketingHome({
  locale,
  authReady,
}: {
  locale: Locale;
  authReady: boolean;
}) {
  const en = locale === "en";
  const t = (nb: string, english: string) => (en ? english : nb);
  const [sceneIndex, setScene] = useState(0);
  const [heroSplit, setHeroSplit] = useState(46);
  const [direction, setDirection] = useState(0);
  const [step, setStep] = useState(0);
  const scene = scenes[sceneIndex],
    item = directions[direction];
  return (
    <>
      <section className="mk-hero">
        <div className="mk-wrap">
          <div className="mk-hero-grid">
            <div className="mk-hero-text">
              <p className="mk-label">
                {t(
                  "Visuell design og forvandling",
                  "Visual design & transformation",
                )}
              </p>
              <h1>{t("Se hva som er mulig.", "See what’s possible.")}</h1>
              <p className="mk-deck">
                {t(
                  "Gi ideene dine form. Utforsk rom, prøv nye detaljer og se mulighetene før du tar neste beslutning.",
                  "Turn your ideas into visuals. Reimagine spaces, transform details, and explore possibilities before deciding what comes next.",
                )}
              </p>
              <div className="mk-actions">
                <Action href="/app/library">
                  {t("Begynn å skape", "Start creating")}
                </Action>
                <Action href="#workflow" secondary>
                  {t("Se hvordan det fungerer", "See how it works")}
                </Action>
              </div>
              <div className="mk-breadcrumb">
                {steps.map((s) => (
                  <span key={s[0]}>{s[en ? 1 : 0]}</span>
                ))}
              </div>
            </div>
            <div className="mk-story">
              <Photo
                name={scene[0]}
                alt={t(
                  "Interiørfotografi fra Vastu Nords bildesamling",
                  "Interior photograph from the Vastu Nord brand collection",
                )}
              />
              {sceneIndex === 0 && (
                <>
                  <div
                    className="mk-story-wipe"
                    style={{ clipPath: "inset(0 0 0 " + heroSplit + "%)" }}
                  >
                    <Photo name="soft-evening" />
                  </div>
                  <div
                    className="mk-story-grip"
                    style={{ left: heroSplit + "%" }}
                  >
                    <b>↔</b>
                  </div>
                  <input
                    className="mk-story-range"
                    type="range"
                    min="0"
                    max="100"
                    value={heroSplit}
                    onChange={(e) => setHeroSplit(Number(e.target.value))}
                    aria-label={t(
                      "Sammenlign lyset i rommet",
                      "Compare room lighting",
                    )}
                  />
                </>
              )}
              <div className="mk-story-bars">
                {scenes.map((s, i) => (
                  <i data-active={i === sceneIndex} key={s[0]} />
                ))}
              </div>
              <div className="mk-story-bottom">
                <div aria-live="polite">
                  <small>{scene[en ? 2 : 1]}</small>
                  <h2>{scene[en ? 4 : 3]}</h2>
                </div>
                <div className="mk-story-arrows">
                  {[-1, 1].map((delta) => (
                    <button
                      key={delta}
                      onClick={() =>
                        setScene(
                          (sceneIndex + delta + scenes.length) % scenes.length,
                        )
                      }
                      aria-label={
                        delta < 0
                          ? t("Forrige studie", "Previous study")
                          : t("Neste studie", "Next study")
                      }
                    >
                      {delta < 0 ? "←" : "→"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mk-start">
            <div>
              <h2>
                {t("Hva vil du forvandle?", "What do you want to transform?")}
              </h2>
              <div className="mk-start-links">
                <Link href="/app/assets">
                  {t("Velg fra bildesamlingen", "Choose from assets")} ↗
                </Link>
                {authReady ? (
                  <Link href="/app/tools/room-reimagination">
                    {t("Last opp et bilde", "Upload an image")} ↗
                  </Link>
                ) : (
                  <span>
                    {t(
                      "Opplasting krever privat tilgang",
                      "Upload requires private access",
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className="mk-quick">
              {directions.map((d, i) => (
                <a
                  key={d[4]}
                  href="#directions"
                  onClick={() => setDirection(i)}
                >
                  <b aria-hidden="true">{d[6]}</b>
                  {d[en ? 1 : 0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Section>
        <div className="mk-split">
          <div>
            <p className="mk-label">
              01 / {t("Muligheten", "The possibility")}
            </p>
            <h2>
              {t(
                "Det vanskeligste er å se hva som er mulig.",
                "The hardest part isn’t creating. It’s seeing what’s possible.",
              )}
            </h2>
            <p>
              {t(
                "Ett rom kan romme mange ideer. Se hvordan en liten endring i lys eller fargetone oppleves, før du velger retning.",
                "One room can hold many ideas. See how a small shift in light or colour feels before choosing a direction.",
              )}
            </p>
          </div>
          <div className="mk-mosaic">
            <Photo name="soft" />
            <div>
              {["soft-day", "soft-evening", "soft-bright", "soft-moss"].map(
                (n) => (
                  <Photo key={n} name={n} />
                ),
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section tone="sand" id="directions">
        <p className="mk-label">
          02 / {t("Velg retning", "Choose a direction")}
        </p>
        <h2>{t("Hva vil du forvandle?", "What do you want to transform?")}</h2>
        <div className="mk-split">
          <div className="mk-options">
            {directions.map((d, i) => (
              <button
                key={d[4]}
                onClick={() => setDirection(i)}
                aria-pressed={direction === i}
              >
                <span className="mk-glyph">{d[6]}</span>
                <span>
                  <strong>{d[en ? 1 : 0]}</strong>
                  <small>{d[en ? 3 : 2]}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div
            className={"mk-direction" + (direction === 1 ? " mk-outdoor" : "")}
          >
            {direction !== 1 && (
              <Photo
                name={["cover", "soft-moss", "warm", "soft-bright"][direction]}
              />
            )}
            <div>
              <p className="mk-label">Studio</p>
              <h3>{item[5]}</h3>
              <Action href={"/app/tools/" + item[4]}>
                {t("Utforsk verktøyet", "Explore this tool")}
              </Action>
            </div>
          </div>
        </div>
      </Section>
      <Section id="examples">
        <p className="mk-label">03 / {t("Bildestudier", "Image studies")}</p>
        <h2>{t("Se hva du kan skape.", "See what you can create.")}</h2>
        <p>
          {t(
            "Dra skillet og bytt fargestudie for å sammenligne tre uttrykk fra samme interiørfoto.",
            "Drag the divider and switch colour studies to compare three treatments of the same interior photograph.",
          )}
        </p>
        <StudyCompare en={en} />
      </Section>
      <Section tone="dark" id="workflow">
        <p className="mk-label">
          04 / {t("Slik fungerer det", "How it works")}
        </p>
        <h2>
          {t(
            "Fra idé til uttrykk i fire steg.",
            "From idea to visual in four steps.",
          )}
        </h2>
        <div className="mk-split">
          <div className="mk-steps">
            {steps.map((s, i) => (
              <button
                key={s[0]}
                onClick={() => setStep(i)}
                aria-pressed={step === i}
              >
                <span>0{i + 1}</span>
                <div>
                  <strong>{s[en ? 1 : 0]}</strong>
                  {step === i && <p>{s[en ? 3 : 2]}</p>}
                </div>
              </button>
            ))}
          </div>
          <Photo className="mk-step-image" name={steps[step][4]} />
        </div>
      </Section>
      <Section tone="sand">
        <p className="mk-label">05 / {t("Hvem det er for", "Who it’s for")}</p>
        <h2>
          {t(
            "For deg som vil se ideen før du går videre.",
            "Built for people who need to see an idea before moving forward.",
          )}
        </h2>
        <div className="mk-audiences">
          {[
            [t("Boligeiere", "Homeowners"), "cover"],
            [t("Eiendomsfolk", "Property professionals"), "soft-day"],
            [t("Designere og arkitekter", "Designers & architects"), "warm"],
          ].map(([name, photo]) => (
            <Link key={name} href="/app/library">
              <Photo name={photo} />
              <strong>{name}</strong>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </Section>
      <FAQ
        title={t("Før du begynner.", "Before you start.")}
        items={[
          [
            t("Trenger jeg designerfaring?", "Do I need design experience?"),
            t(
              "Du kan utforske verktøy og studier uten forkunnskaper.",
              "Explore the tools and studies without prior design training.",
            ),
          ],
          [
            t("Hva kan jeg utforske?", "What can I explore?"),
            t(
              "Åpne Studio for rom, uterom, materialer og bildeforbedring.",
              "Open the Studio to explore interiors, outdoors, materials and image refinement.",
            ),
          ],
          [
            t(
              "Kan jeg bruke en studie som byggetegning?",
              "Can I build directly from a study?",
            ),
            t(
              "Studiene viser visuelle idéer. Mål, materialvalg og løsninger må kontrolleres faglig før utførelse.",
              "Studies illustrate a visual idea. Dimensions, materials and construction decisions require professional verification.",
            ),
          ],
        ]}
      />
      <Closing
        locale={locale}
        title={t(
          "Begynn med en idé. Se hvor den tar deg.",
          "Start with an idea. See where it takes you.",
        )}
      />
    </>
  );
}
