"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { publicHref, type Locale } from "@/lib/i18n";
import { marketingResources } from "@/lib/marketing-resources";
import { knowledgeSearch, readKnowledgeState, type KnowledgeState } from "@/lib/knowledge-state";
import type { StudyCard } from "@/lib/visual-studies";
import { StudyPagination, studyPageSize } from "./study-pagination";
import { TopicChoices } from "./topic-choices";
import { KnowledgeReturn } from "./knowledge-return";
import { Action, Closing, FAQ, Photo, Section } from "./marketing-elements";
import "./marketing-pages.css";

type T = (nb: string, en: string) => string;
type PageContext = { locale: Locale; t: T };
function Hero({
  caption,
  title,
  body,
  photo,
  split = false,
  children,
}: {
  caption: string;
  title: string;
  body: string;
  photo: string;
  split?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={`mp-hero ${split ? "mp-split" : ""}`}>
      {!split && (
        <div className="mp-backdrop">
          <Photo name={photo} />
        </div>
      )}
      <div className="mp-hero-inner">
        <div className="mp-copy">
          <p className="mp-kicker">{caption}</p>
          <h1>{title}</h1>
          <p>{body}</p>
          {children}
        </div>
        {split && (
          <div className="mp-hero-photo">
            <Photo name={photo} />
          </div>
        )}
      </div>
    </section>
  );
}
function Cards({
  items,
}: {
  items: { title: string; body: string; href?: string }[];
}) {
  return (
    <div className="mp-cards">
      {items.map(({ title, body, href }) => (
        <article key={title}>
          <h3>{href ? <Link href={href}>{title} ↗</Link> : title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}
function Workflow({ t }: { t: T }) {
  return (
    <Section>
      <h2>{t("Fra idé til valg", "From idea to decision")}</h2>
      <ol className="mp-workflow">
        {[
          [
            t("Velg rom", "Choose your space"),
            t(
              "Begynn med rommet og det du ønsker å beholde.",
              "Start with the room and what you want to keep.",
            ),
          ],
          [
            t("Prøv en retning", "Explore a direction"),
            t(
              "Velg lys, materialer og stil i Studio.",
              "Choose light, materials and style in Studio.",
            ),
          ],
          [
            t("Sammenlign", "Compare"),
            t(
              "Se etter forskjellene i alternativene.",
              "Look for the differences between alternatives.",
            ),
          ],
          [
            t("Ta et valg", "Make a decision"),
            t(
              "Ta ideene med til neste samtale om rommet.",
              "Bring your ideas into the next conversation about the room.",
            ),
          ],
        ].map(([title, body], i) => (
          <li key={title}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
function Audience({ t }: { t: T }) {
  return (
    <Section tone="sand">
      <h2>{t("Hvem er det for?", "Who is it for?")}</h2>
      <Cards
        items={[
          {
            title: t("Boligeiere", "Homeowners"),
            body: t(
              "Utforsk nye muligheter for rommene du bor i.",
              "Explore possibilities for the spaces you live in.",
            ),
          },
          {
            title: t("Designere", "Designers"),
            body: t(
              "Gi en visuell retning til en samtale med kunden.",
              "Give a client conversation a visual starting point.",
            ),
          },
          {
            title: t("Eiendomsrådgivere", "Property professionals"),
            body: t(
              "Vis hvordan en bolig kan innredes.",
              "Explore how a property could be furnished.",
            ),
          },
        ]}
      />
    </Section>
  );
}
function About({ locale, t }: PageContext) {
  return (
    <>
      <Hero
        split
        caption={t("Om Vastu Nord", "About Vastu Nord")}
        title={t(
          "Du skal slippe å se alt for deg i hodet.",
          "You shouldn’t have to imagine it all in your head.",
        )}
        body={t(
          "Det er lettere å snakke om en forandring når du kan se den. Vi utforsker rom, lys og materialer med utgangspunkt i hjemmet ditt.",
          "A change is easier to discuss when you can see it. We explore space, light and materials with your home as the starting point.",
        )}
        photo="editorial/about-hero"
      >
        <div className="mp-link-row">
          <Action href="/app/library">
            {t("Åpne Studio", "Open Studio")}
          </Action>
          <Action href="#decisions" secondary>
            {t("Se eksempler", "See examples")}
          </Action>
        </div>
      </Hero>
      <Section id="decisions">
        <h2>
          {t(
            "Designvalg skal ikke føles som et sprang i blinde.",
            "Design shouldn’t feel like a leap of faith.",
          )}
        </h2>
        <p>
          {t(
            "Før du velger et materiale eller flytter et møbel, melder spørsmålene seg.",
            "Before you choose a finish or move the furniture, the questions begin.",
          )}
        </p>
        <div className="mp-questions">
          {[
            t("Hvordan vil det se ut her?", "What would it look like here?"),
            t("Hvilken stil passer rommet?", "Which style suits this room?"),
            t(
              "Hva skjer hvis vi endrer lyset?",
              "What if we change the light?",
            ),
            t(
              "Hvilket alternativ skal vi velge?",
              "Which option should we choose?",
            ),
          ].map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </Section>
      <Section tone="dark">
        <div className="mp-feature-row">
          <Photo name="editorial/about-study" />
          <div>
            <p className="mp-kicker">{t("Vår idé", "Our mission")}</p>
            <h2>
              {t(
                "Når du ser en mulighet, endrer det valget.",
                "Seeing a possibility changes the decision.",
              )}
            </h2>
            <p>
              {t(
                "Et bilde gir deg noe konkret å sammenligne, justere og snakke om før du går videre.",
                "An image gives you something specific to compare, refine and discuss before moving forward.",
              )}
            </p>
            <p>{t("Spørsmål til Vastu Nord? Skriv til", "Questions for Vastu Nord? Contact")} <a href="mailto:contact@vastu.no">contact@vastu.no</a>.</p>
          </div>
        </div>
      </Section>
      <Workflow t={t} />
      <Audience t={t} />
      <Closing
        photo="about-close"
        locale={locale}
        title={t(
          "Utforsk mulighetene for ditt rom.",
          "Explore what your space could become.",
        )}
      />
    </>
  );
}
function Features({ locale, t }: PageContext) {
  const [variant, setVariant] = useState(0);
  const tools = [
    [
      t("En ny romfølelse", "Reimagine a room"),
      "room-reimagination",
      t(
        "Utforsk flere innredningsretninger.",
        "Explore different design directions.",
      ),
    ],
    [
      t("Andre møbler", "Refresh furniture"),
      "furniture-refresh",
      t(
        "Studer form, plassering og proporsjoner.",
        "Study shape, position and proportion.",
      ),
    ],
    [
      t("Nye materialer", "Refine materials"),
      "material-refinement",
      t("Sammenlign tekstur og farge.", "Compare textures and finishes."),
    ],
    [
      t("Et annet lys", "Change the light"),
      "lighting-reimagination",
      t(
        "Utforsk stemningen fra dag til kveld.",
        "Explore the mood from day to evening.",
      ),
    ],
    [
      t("Personlig dekor", "Restyle the details"),
      "decor-redefinition",
      t(
        "Se hvilken forskjell detaljene gjør.",
        "Consider the difference details make.",
      ),
    ],
    [
      t("Møbler et tomt rom", "Stage an empty room"),
      "virtual-home-staging",
      t(
        "Undersøk hvordan rommet kan brukes.",
        "Explore how a space could be used.",
      ),
    ],
  ];
  const variants = [
    [t("Dagslys", "Daylight"), "editorial/feature-triptych-light"],
    [t("Kveldslys", "Evening light"), "editorial/feature-triptych-mood"],
    [t("Salvietoner", "Sage tones"), "editorial/feature-triptych-soft"],
  ];
  return (
    <>
      <Hero
        split
        caption={t("Interiør · Stue", "Interior design · Living room")}
        title={t(
          "Forvandle stuen før du flytter et eneste møbel.",
          "Transform your living room before moving a single piece of furniture.",
        )}
        body={t(
          "Utforsk hvordan møbler, materialer og dagslys kan forandre rommet, før du bestemmer deg.",
          "Explore the difference furniture, finishes and daylight can make before you decide.",
        )}
        photo="editorial/feature-hero"
      >
        <div className="mp-link-row">
          <Action href="/app/tools/room-reimagination">
            {t("Åpne Studio", "Open Studio")}
          </Action>
          <Action href="#variations" secondary>
            {t("Se eksempler", "See examples")}
          </Action>
        </div>
      </Hero>
      <Section>
        <div className="mp-feature-row">
          <div>
            <h2>
              {t(
                "Å pusse opp innebærer mange valg.",
                "Renovating means making decisions.",
              )}
            </h2>
            <p>
              {t(
                "En liten materialprøve kan være vanskelig å vurdere i et helt rom. Et visuelt utgangspunkt gjør det enklere å sammenligne alternativene.",
                "A single material swatch can be hard to picture across a whole room. A visual starting point makes alternatives easier to compare.",
              )}
            </p>
          </div>
          <Photo name="editorial/feature-materials" />
        </div>
      </Section>
      <Section tone="dark">
        <p className="mp-kicker">{t("Muligheter", "Possibilities")}</p>
        <h2>
          {t("Tre stuer. Tre retninger.", "Three living rooms. Three directions.")}
        </h2>
        <div className="mp-triptych">
          {variants.map(([title, name]) => (
            <figure key={name}>
              <Photo name={name} />
              <figcaption>{title}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <Section>
        <h2>
          {t(
            "Seks måter å utforske stuen på",
            "Six ways to explore your living room",
          )}
        </h2>
        <Cards
          items={tools.map(([title, slug, body]) => ({
            title,
            body,
            href: `/app/tools/${slug}`,
          }))}
        />
      </Section>
      <Section tone="sand">
        <div className="mp-feature-row">
          <Photo name="editorial/feature-application" />
          <div>
            <h2>
              {t(
                "Ta med ideen inn i rommet.",
                "Bring the idea into your room.",
              )}
            </h2>
            <p>
              {t(
                "Se fargene sammen, sammenlign materialene og finn ordene for det du vil endre.",
                "See colours together, compare finishes and find the words for what you want to change.",
              )}
            </p>
          </div>
        </div>
      </Section>
      <Workflow t={t} />
      <Audience t={t} />
      <Section id="variations">
        <h2>{t("Sammenlign uttrykk", "Compare directions")}</h2>
        <div className="mp-variant">
          <Photo name="editorial/feature-variant" className={["mk-tone-daylight", "mk-tone-evening", "mk-tone-moss"][variant]} />
        </div>
        <div
          className="mp-pills"
          role="group"
          aria-label={t("Eksempelvarianter", "Example variants")}
        >
          {variants.map(([label], i) => (
            <button
              key={label}
              aria-pressed={i === variant}
              onClick={() => setVariant(i)}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>
      <FAQ
        title={t("Vanlige spørsmål", "Frequently asked questions")}
        items={[
          [
            t("Kan jeg prøve ulike uttrykk?", "Can I explore different looks?"),
            t(
              "Ja. Åpne Studio og sammenlign de tilgjengelige eksemplene.",
              "Yes. Open Studio and compare the available examples.",
            ),
          ],
          [
            t("Kan jeg laste opp et bilde?", "Can I upload a photograph?"),
            t(
              "Private opplastinger er slått av i den offentlige demonstrasjonen.",
              "Private uploads are disabled in the public demonstration.",
            ),
          ],
        ]}
      />
      <Section tone="sand">
        <h2>{t("Relaterte arbeidsflyter", "Related workflows")}</h2>
        <div className="mp-link-row">
          {tools.slice(1, 4).map(([name, slug]) => (
            <Action key={slug} href={`/app/tools/${slug}`} secondary>
              {name}
            </Action>
          ))}
        </div>
      </Section>
      <Closing
        photo="feature-close"
        locale={locale}
        title={t(
          "Se på stuen med nye øyne.",
          "See your living room in a new light.",
        )}
      />
    </>
  );
}
function Pricing({ locale, t }: PageContext) {
  return (
    <>
      <Hero
        caption={t("Abonnement", "Plans")}
        title={t(
          "Velg tilgangen som passer deg.",
          "Find the plan that fits your space.",
        )}
        body={t(
          "Utforsk planoversikten. Denne demonstrasjonen er åpen for utprøving uten kjøp eller abonnement.",
          "Explore the plan overview. This demonstration is open for testing without a purchase or subscription.",
        )}
        photo="editorial/pricing-hero"
      >
        <Action href="#plans">{t("Se planene", "View plans")}</Action>
      </Hero>
      <Section id="plans">
        <h2>{t("Planoversikt", "Plan overview")}</h2>
        <div className="mp-plans">
          {["Free", "Pro"].map((name, i) => (
            <article key={name}>
              <p className="mp-kicker">
                {i
                  ? t("Utvidet tilgang", "Extended access")
                  : t("Utforsk", "Explore")}
              </p>
              <h3>{name}</h3>
              <p>
                {i
                  ? t(
                      "Betalte abonnement åpner først når priser og vilkår er godkjent.",
                      "Paid subscriptions will open once prices and terms are approved.",
                    )
                  : t(
                      "Bli kjent med de 17 arbeidsflytene og utforsk eksempelrom i Studio.",
                      "Browse the 17 workflows and explore sample rooms in Studio.",
                    )}
              </p>
              {i ? (
                <span className="mp-status">
                  {t("Abonnement utilgjengelig", "Subscriptions unavailable")}
                </span>
              ) : (
                <Action href="/app/library">
                  {t("Åpne Studio", "Open Studio")}
                </Action>
              )}
            </article>
          ))}
        </div>
      </Section>
      <Section tone="sand">
        <h2>{t("Sammenlign tilgang", "Compare access")}</h2>
        <table className="mp-table">
          <thead>
            <tr>
              <th>{t("Funksjon", "Feature")}</th>
              <th>Free</th>
              <th>Pro</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Studio",
                t("Åpent i demo", "Demo access"),
              ],
              [
                t("Generering", "Generation"),
                t("Utilgjengelig", "Unavailable"),
              ],
              [
                t("Kjøp av kreditter", "Credit purchases"),
                t("Utilgjengelig", "Unavailable"),
              ],
            ].map(([name, state]) => (
              <tr key={name}>
                <th>{name}</th>
                <td>{state}</td>
                <td>{t("Uavklart", "Unconfirmed")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <FAQ
        title={t("Vanlige spørsmål", "Frequently asked questions")}
        items={[
          [
            t("Må jeg oppgi kortdetaljer?", "Do I need a payment card?"),
            t(
              "Demonstrasjonen er tilgjengelig uten betalingsinformasjon.",
              "You can explore the demonstration without entering payment information.",
            ),
          ],
          [
            t("Kan jeg kjøpe kreditter?", "Can I buy credits?"),
            t(
              "Kredittkjøp og betaling er slått av.",
              "Credit purchases and payments are disabled.",
            ),
          ],
        ]}
      />
      <Closing
        photo="pricing-close"
        locale={locale}
        title={t(
          "Ditt neste interiørprosjekt",
          "Your next interior project",
        )}
      />
    </>
  );
}
function Resources({ locale, t, studyCards }: PageContext & { studyCards: StudyCard[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(-1);
  const [page, setPage] = useState(0);
  const { categories, articles } = marketingResources(locale);
  useEffect(() => {
    const restore = () => {
      const state = readKnowledgeState(window.location.search);
      setQuery(state.query); setFilter(state.topic); setPage(state.page);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function update(state: KnowledgeState) {
    setQuery(state.query); setFilter(state.topic); setPage(state.page);
    window.history.replaceState(window.history.state, "", window.location.pathname + knowledgeSearch(state) + window.location.hash);
  }
  const results = [...articles, ...studyCards].filter(
    (a) =>
      (filter < 0 || a.tags.includes(filter)) &&
      [a.name, a.intro, ...a.tags.map((i) => categories[i])]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const visiblePage = Math.min(page, Math.max(0, Math.ceil(results.length / studyPageSize) - 1));
  return (
    <>
      <Hero
        caption={t("Ressurser", "Resource center")}
        title={t(
          "Lær. Utforsk. Bli inspirert.",
          "Learn. Explore. Get inspired.",
        )}
        body={t(
          "Finn en idé, utforsk en stil eller lær å bruke Studio.",
          "Find inspiration, explore a style or learn your way around Studio.",
        )}
        photo="editorial/resources-hero"
      >
        <label className="mp-search">
          {t("Søk i ressurser", "Search resources")}
          <input
            type="search"
            value={query}
            onChange={(e) => update({query: e.target.value, topic: filter, page: 0})}
            placeholder={t(
              "Søk etter guider og temaer",
              "Search guides and topics",
            )}
          />
        </label>
      </Hero>
      <Section id="articles">
        <div className="mp-section-line">
          <h2>{t("Guider og bildestudier", "Guides and visual studies")} ({results.length})</h2>
          <TopicChoices
            label={t("Filtrer på tema", "Filter by topic")}
            options={[{ id: -1, name: t("Alle temaer", "All topics") }, ...categories.map((name, id) => ({ id, name }))]}
            value={filter}
            onChange={(id) => update({query, topic: id, page: 0})}
          />
        </div>
        <div className="mp-reads">
          {results.slice(visiblePage * studyPageSize, (visiblePage + 1) * studyPageSize).map((a) => (
            <article key={a.id} className="mp-read">
              <Link href={publicHref("/resources/" + a.id, locale) + knowledgeSearch({query, topic: filter, page: visiblePage})}>
                <span className="mp-read-image">
                  <Photo name={a.image} />
                </span>
                <span className="mp-read-copy">
                  <small>{"body" in a ? t("Guide", "Guide") : t("Bildestudie", "Visual study")} · {categories[a.tags[0]]}</small>
                  <strong>{a.name}</strong>
                  <span>{a.intro}</span>
                  <u>{"body" in a ? t("Les guiden", "Read guide") : t("Se bildestudien", "View visual study")}</u>
                </span>
              </Link>
            </article>
          ))}
        </div>
        <StudyPagination page={visiblePage} count={results.length} locale={locale} move={(next) => update({query, topic: filter, page: next})}/>
        {!results.length && (
          <div role="status">
            <p>
              {t(
                "Ingen guider passer til søket.",
                "No guides match your search.",
              )}
            </p>
            <button
              className="button"
              onClick={() => {
                update({topic: -1, query: "", page: 0});
              }}
            >
              {t("Vis alle guider", "Show all guides")}
            </button>
          </div>
        )}
      </Section>
      <Section tone="sand">
        <h2>{t("Utforsk etter tema", "Explore by topic")}</h2>
        <div className="mp-topics">
          {categories.map((c, i) => (
            <a
              key={c}
              href="#articles"
              onClick={() => {
                update({topic: i, query: "", page: 0});
              }}
            >
              {c} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </Section>
      <Closing
        photo="resources-close"
        locale={locale}
        title={t("Gå fra idé til romstudie.", "Take an idea into Studio.")}
      />
    </>
  );
}
function Contact({ locale, t }: PageContext) {
  const paths = [
    [
      t("Produkthjelp", "Product support"),
      t(
        "Finn hjelp med arbeidsflytene i Studio.",
        "Find help with Studio workflows.",
      ),
    ],
    [
      t("Salg", "Sales"),
      t(
        "Spørsmål om abonnement og tilgang.",
        "Questions about plans and access.",
      ),
    ],
    [
      t("Samarbeid", "Partnerships"),
      t("Utforsk muligheter for samarbeid.", "Explore partnership enquiries."),
    ],
    [
      t("Tilbakemelding", "Feedback"),
      t(
        "Del en idé om produktopplevelsen.",
        "Share an idea about the product experience.",
      ),
    ],
  ];
  const [subject, setSubject] = useState(0);
  return (
    <>
      <Hero
        caption={t("Kontakt", "Contact")}
        title={t(
          "La oss snakke om rommet ditt.",
          "Let’s talk about your space.",
        )}
        body={t(
          "Velg et tema eller finn svar på vanlige spørsmål om Studio.",
          "Choose a topic or find answers to common questions about Studio.",
        )}
        photo="editorial/contact-hero"
      >
        <Action href="#contact-paths">
          {t("Se kontaktmuligheter", "Explore contact options")}
        </Action>
      </Hero>
      <Section id="contact-paths">
        <h2>{t("Velg riktig inngang.", "Pick the right door.")}</h2>
        <div className="mp-topics mp-contact-paths">
          {paths.map(([name, hint], i) => (
            <a href="#contact-form" onClick={() => setSubject(i)} key={name}>
              <strong>{name} ↘</strong>
              <p>{hint}</p>
            </a>
          ))}
        </div>
      </Section>
      <Section tone="sand" id="contact-form">
        <div className="mp-form-grid">
          <div>
            <p className="mp-kicker">{t("Kontakt oss", "Get in touch")}</p>
            <h2>{t("Send en melding", "Send a message")}</h2>
            <p>
              {t(
                "Kontaktskjemaet er stengt i demonstrasjonen. Send oss gjerne en e-post, eller les guidene.",
                "The contact form is closed in this demonstration. You can email us or browse the guides.",
              )}
            </p>
            <p><a href={`mailto:contact@vastu.no?subject=${encodeURIComponent(paths[subject][0])}`}>contact@vastu.no</a></p>
            <Action href={publicHref("/resources", locale)} secondary>
              {t("Se ressursene", "Browse resources")}
            </Action>
          </div>
          <fieldset disabled className="mp-contact-form">
            <legend>{t("Kontaktskjema", "Contact form")}</legend>
            <label>
              {t("Navn", "Name")}
              <input type="text" />
            </label>
            <label>
              {t("E-post", "Email")}
              <input type="email" />
            </label>
            <label>
              {t("Emne", "Subject")}
              <input readOnly value={paths[subject][0]} />
            </label>
            <label>
              {t("Melding", "Message")}
              <textarea rows={4} />
            </label>
            <button type="button" className="button" disabled>
              {t("Innsending utilgjengelig", "Sending unavailable")}
            </button>
          </fieldset>
        </div>
      </Section>
      <FAQ
        title={t("Raske svar", "Quick answers")}
        items={[
          [
            t("Hvor finner jeg arbeidsflytene?", "Where can I find the workflows?"),
            t(
              "Velg «Åpne Studio» i hovedmenyen for å se alle de 17 arbeidsflytene.",
              "Choose “Open Studio” in the main navigation to see all 17 workflows.",
            ),
          ],
          [
            t(
              "Kan jeg sende inn prosjektbilder her?",
              "Can I send project photos here?",
            ),
            t(
              "Demonstrasjonen tar ikke imot prosjektbilder eller meldinger via skjemaet. Du kan kontakte oss på e-post.",
              "This demonstration does not accept project photos or messages through the form. You can contact us by email.",
            ),
          ],
        ]}
      />
      <Closing
        photo="contact-close"
        locale={locale}
        title={t("Bli kjent med Studio.", "Get to know Studio.")}
      />
    </>
  );
}
export function MarketingPages({
  locale,
  page,
  studyCards = [],
}: {
  locale: Locale;
  page: string;
  authReady?: boolean;
  studyCards?: StudyCard[];
}) {
  const t: T = (nb, en) => (locale === "en" ? en : nb);
  if (page.startsWith("resources/")) {
    const { articles, categories } = marketingResources(locale);
    const article = articles.find(
      (a) => a.id === page.slice("resources/".length),
    );
    if (!article) return null;
    const related = articles.filter((a) => a.id !== article.id).slice(0, 2);
    return (
      <div className="mp-pages">
        <article>
          <Hero
            split
            caption={categories[article.tags[0]]}
            title={article.name}
            body={article.intro}
            photo={article.detailImage}
          >
            <KnowledgeReturn locale={locale} className="mk-action secondary">
              {t("Alle guider", "All guides")}
            </KnowledgeReturn>
          </Hero>
          <Section>
            <div className="mp-article-body">
              <p>{article.body}</p>
              <h2>{t("Sammenlign alternativene", "Compare the options")}</h2>
              <p>{article.compare}</p>
              <h2>{t("Dette kan ikke bildet bekrefte", "What the image cannot confirm")}</h2>
              <p>{article.limitation}</p>
              <h2>{t("Neste steg", "Next step")}</h2>
              <p>{article.nextStep}</p>
              <Action href={"/app/tools/" + article.tool}>
                {t("Åpne Studio", "Open Studio")}
              </Action>
            </div>
          </Section>
        </article>
        <Section tone="sand">
          <h2>{t("Les videre", "Related reading")}</h2>
          <Cards
            items={related.map((a) => ({
              title: a.name,
              body: a.intro,
              href: publicHref("/resources/" + a.id, locale),
            }))}
          />
        </Section>
      </div>
    );
  }
  if (page === "resources") return <div className="mp-pages"><Resources locale={locale} t={t} studyCards={studyCards}/></div>;
  const views: Record<string, (props: PageContext) => ReactNode> = {
    about: About,
    features: Features,
    pricing: Pricing,
    contact: Contact,
  };
  const View = views[page];
  return View ? (
    <div className="mp-pages">
      <View locale={locale} t={t} />
    </div>
  ) : null;
}
