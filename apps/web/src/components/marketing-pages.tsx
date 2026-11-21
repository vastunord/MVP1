"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { publicHref, type Locale } from "@/lib/i18n";
import { marketingResources } from "@/lib/marketing-resources";
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
        photo="warm"
      >
        <div className="mp-link-row">
          <Action href="/app/library">
            {t("Utforsk Studio", "Explore Studio")}
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
          <Photo name="soft-day" />
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
          </div>
        </div>
      </Section>
      <Workflow t={t} />
      <Audience t={t} />
      <Closing
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
    [t("Dagslys", "Daylight"), "soft-day"],
    [t("Kveldslys", "Evening light"), "soft-evening"],
    [t("Salvietoner", "Sage tones"), "soft-moss"],
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
        photo="soft"
      >
        <div className="mp-link-row">
          <Action href="/app/tools/room-reimagination">
            {t("Utforsk romverktøyet", "Explore the room editor")}
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
          <Photo name="warm" />
        </div>
      </Section>
      <Section tone="dark">
        <p className="mp-kicker">{t("Muligheter", "Possibilities")}</p>
        <h2>
          {t("Ett rom. Flere retninger.", "One room. Different directions.")}
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
          <Photo name="soft-bright" />
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
          <Photo name={variants[variant][1]} />
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
        <h2>{t("Relaterte verktøy", "Related tools")}</h2>
        <div className="mp-link-row">
          {tools.slice(1, 4).map(([name, slug]) => (
            <Action key={slug} href={`/app/tools/${slug}`} secondary>
              {name}
            </Action>
          ))}
        </div>
      </Section>
      <Closing
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
        photo="soft-evening"
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
                      "Bli kjent med de 17 verktøyene og utforsk eksempelrom i Studio.",
                      "Browse the 17 tools and explore sample rooms in Studio.",
                    )}
              </p>
              {i ? (
                <span className="mp-status">
                  {t("Abonnement utilgjengelig", "Subscriptions unavailable")}
                </span>
              ) : (
                <Action href="/app/library">
                  {t("Åpne demonstrasjonen", "Open demonstration")}
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
                t("Verktøybibliotek", "Tool library"),
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
        locale={locale}
        title={t(
          "Utforsk Studio i ditt tempo.",
          "Explore Studio at your own pace.",
        )}
      />
    </>
  );
}
function Resources({ locale, t }: PageContext) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(-1);
  const { categories, articles } = marketingResources(locale);
  const results = articles.filter(
    (a) =>
      (filter < 0 || a.tags.includes(filter)) &&
      [a.name, a.intro, ...a.tags.map((i) => categories[i])]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <>
      <Hero
        caption={t("Ressurser", "Resource center")}
        title={t(
          "Lær. Utforsk. Bli inspirert.",
          "Learn. Explore. Get inspired.",
        )}
        body={t(
          "Finn en idé, utforsk en stil eller lær å bruke verktøyene.",
          "Find inspiration, explore a style or learn your way around the tools.",
        )}
        photo="warm"
      >
        <label className="mp-search">
          {t("Søk i ressurser", "Search resources")}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Søk etter guider og temaer",
              "Search guides and topics",
            )}
          />
        </label>
      </Hero>
      <Section id="articles">
        <div className="mp-section-line">
          <h2>{t("Begynn med disse.", "Start with these.")}</h2>
          <label>
            <span id="resource-topic-label">
              {t("Filtrer på tema", "Filter by topic")}
            </span>{" "}
            <select
              aria-labelledby="resource-topic-label"
              value={filter}
              onChange={(e) => setFilter(Number(e.target.value))}
            >
              <option value={-1}>{t("Alle temaer", "All topics")}</option>
              {categories.map((c, i) => (
                <option key={c} value={i}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mp-reads">
          {results.map((a) => (
            <details key={a.id} className="mp-read">
              <summary>
                <span className="mp-read-image">
                  <Photo name={a.image} />
                </span>
                <span className="mp-read-copy">
                  <small>{categories[a.tags[0]]}</small>
                  <strong>{a.name}</strong>
                  <span>{a.intro}</span>
                  <u>{t("Les guiden", "Read guide")}</u>
                </span>
              </summary>
              <p>{a.body}</p>
              <Link
                className="mp-permalink"
                href={publicHref("/resources/" + a.id, locale)}
              >
                {t("Åpne artikkelen", "Open article")} ↗
              </Link>
            </details>
          ))}
        </div>
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
                setFilter(-1);
                setQuery("");
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
                setFilter(i);
                setQuery("");
              }}
            >
              {c} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </Section>
      <Closing
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
        "Finn hjelp med verktøyene og arbeidsområdet.",
        "Find help with the tools and workspace.",
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
        photo="soft-evening"
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
                "Kontaktskjemaet er stengt i demonstrasjonen. Du kan lese guidene eller utforske Studio.",
                "The contact form is closed in this demonstration. You can browse the guides or explore Studio.",
              )}
            </p>
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
            t("Hvor finner jeg verktøyene?", "Where can I find the tools?"),
            t(
              "Åpne Studio fra hovedmenyen. Verktøybiblioteket samler alle de 17 verktøyene.",
              "Open Studio from the main navigation. The tool library brings together all 17 tools.",
            ),
          ],
          [
            t(
              "Kan jeg sende inn prosjektbilder her?",
              "Can I send project photos here?",
            ),
            t(
              "Demonstrasjonen tar ikke imot prosjektbilder eller kontakthenvendelser.",
              "This demonstration does not accept project photos or contact messages.",
            ),
          ],
        ]}
      />
      <Closing
        locale={locale}
        title={t("Bli kjent med Studio.", "Get to know Studio.")}
      />
    </>
  );
}
export function MarketingPages({
  locale,
  page,
}: {
  locale: Locale;
  page: string;
  authReady?: boolean;
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
            photo={article.image}
          >
            <Action href={publicHref("/resources", locale)} secondary>
              {t("Alle guider", "All guides")}
            </Action>
          </Hero>
          <Section>
            <div className="mp-article-body">
              <p>{article.body}</p>
              <Action href="/app/library">
                {t("Utforsk verktøyene", "Explore the tools")}
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
  const views: Record<string, (props: PageContext) => ReactNode> = {
    about: About,
    features: Features,
    pricing: Pricing,
    resources: Resources,
    contact: Contact,
  };
  const View = views[page];
  return View ? (
    <div className="mp-pages">
      <View locale={locale} t={t} />
    </div>
  ) : null;
}
