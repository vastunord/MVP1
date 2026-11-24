import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
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
      width={1100}
      height={733}
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
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M7 5h12v12" /></svg>
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

export function Closing({ locale, title, photo }: { locale: Locale; title: string; photo: string }) {
  return (
    <section className="mk-closing" style={{ "--closing-photo": `url("/reference/editorial/${photo}.webp")` } as CSSProperties}>
      <div className="mk-wrap">
        <h2>{title}</h2>
        <Action href="/app/library">
          {locale === "en" ? "Open Studio" : "Åpne Studio"}
        </Action>
      </div>
    </section>
  );
}
