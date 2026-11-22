import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { journalOrigin, journalEntry, journalList } from "@/server/journal";
import { publicHref, type Locale } from "@/lib/i18n";
import { Section } from "./marketing-elements";

export const readJournalEntry = cache(async (slug: string, locale: Locale) => {
  const origin = journalOrigin(process.env);
  return origin ? journalEntry(origin, slug, locale) : null;
});
export async function Journal({
  slug,
  locale,
  page,
}: {
  slug?: string;
  locale: Locale;
  page: number;
}) {
  const en = locale === "en";
  const origin = journalOrigin(process.env);
  if (!origin) notFound();
  const base = publicHref("/resources/journal", locale);
  if (slug) {
    const entry = await readJournalEntry(slug, locale);
    if (!entry) notFound();
    return (
      <Section>
        <article className="visual-study">
          <Link href={base}>{en ? "← Journal" : "← Tidsskrift"}</Link>
          <h1>{entry.title}</h1>
          <p>{entry.summary}</p>
          <Image
            width={1100}
            height={733}
            unoptimized
            className="mk-photo"
            src={entry.cover}
            alt={entry.alt}
          />
          {entry.body.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      </Section>
    );
  }
  const result = await journalList(origin, page, locale);
  if (page > 1 && page > result.pages) notFound();
  return (
    <Section>
      <Link href={publicHref("/resources", locale)}>
        {en ? "← Knowledge Hub" : "← Kunnskapsbase"}
      </Link>
      <h1>{en ? "Journal" : "Tidsskrift"}</h1>
      {result.articles.map((item) => (
        <article key={item.slug}>
          <h2>
            <Link href={base + "/" + item.slug}>{item.title}</Link>
          </h2>
          <p>{item.summary}</p>
        </article>
      ))}
      {!result.articles.length && (
        <p>
          {en
            ? "There are no published articles yet."
            : "Ingen artikler er publisert her ennå."}
        </p>
      )}
      <nav aria-label={en ? "Journal pages" : "Sider i tidsskriftet"}>
        {page > 1 && (
          <Link href={base + "?page=" + (page - 1)}>
            {en ? "← Previous page" : "← Forrige side"}
          </Link>
        )}{" "}
        {page < result.pages && (
          <Link href={base + "?page=" + (page + 1)}>
            {en ? "Next page →" : "Neste side →"}
          </Link>
        )}
      </nav>
    </Section>
  );
}
