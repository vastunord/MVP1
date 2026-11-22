import Image from "next/image";
import Link from "next/link";
import {
  categories,
  tools,
  type ToolDefinition,
} from "@vastunord/contracts/tools";
import { messages, type Locale } from "@/lib/i18n";
import { studioSampleHref, type StudioSample } from "@/lib/workspace-catalog";

export function StudioToolSwitcher({
  tool,
  locale,
  sample,
}: {
  tool: ToolDefinition;
  locale: Locale;
  sample?: StudioSample;
}) {
  const t = messages(locale);
  return (
    <details className="studio-tool-switcher">
      <summary>
        <span className="switcher-glyph" aria-hidden="true">
          ▦
        </span>
        <span>{locale === "en" ? "Workflow" : "Arbeidsflyt"}</span>
        <span className="switcher-current">{tool.name}</span>
      </summary>
      <nav
        aria-label={
          locale === "en" ? "Workflow" : "Arbeidsflyt"
        }
      >
        {categories.map((category) => (
          <section key={category}>
            <h2>{t[category]}</h2>
            <div>
              {tools
                .filter((item) => item.category === category)
                .map((item) => (
                  <Link
                    key={item.id}
                    href={
                      sample ? studioSampleHref(sample, item.id) : item.route
                    }
                    aria-current={tool.id === item.id ? "page" : undefined}
                  >
                    <Image
                      src={"/media/tools/" + item.id + ".webp"}
                      alt=""
                      unoptimized
                      width={42}
                      height={36}
                    />
                    <span>{item.name}</span>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </nav>
    </details>
  );
}
