import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

export function Photo({
  name,
  alt = "",
  className = "",
}: {
  name: string;
  alt?: string;
  className?: string;
}) {
  return (
    <Image
      unoptimized
      src={"/reference/" + name + ".webp"}
      width={name === "cover" ? 825 : 1500}
      height={name === "cover" ? 1100 : 1000}
      alt={alt}
      className={"mk-photo " + className}
    />
  );
}

export function Action({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={"mk-action" + (secondary ? " secondary" : "")}>
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function Section({
  children,
  tone,
  id,
}: {
  children: ReactNode;
  tone?: "sand" | "dark";
  id?: string;
}) {
  return (
    <section className={"mk-section " + (tone || "")} id={id}>
      <div className="mk-wrap">{children}</div>
    </section>
  );
}

export function FAQ({
  items,
  title,
}: {
  items: readonly (readonly [string, string])[];
  title: string;
}) {
  return (
    <Section>
      <div className="mk-faq">
        <div>
          <p className="mk-label">FAQ</p>
          <h2>{title}</h2>
        </div>
        <div>
          {items.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function Closing({ locale, title }: { locale: Locale; title: string }) {
  return (
    <section className="mk-closing">
      <div className="mk-wrap">
        <h2>{title}</h2>
        <Action href="/app/library">
          {locale === "en" ? "Explore the Studio" : "Utforsk Studio"}
        </Action>
      </div>
    </section>
  );
}
