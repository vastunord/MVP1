"use client";
import { useState } from "react";
import Link from "next/link";
import { tools } from "@vastunord/contracts/tools";
import { Editor } from "../../../../src/components/editor";
import type { Locale } from "../../../../src/lib/i18n";

export default function EditorFixture() {
  const [locale, setLocale] = useState<Locale>("en");
  return <main><button onClick={() => setLocale(locale === "en" ? "nb-NO" : "en")}>Switch fixture locale</button><Link href="/other">Other fixture page</Link><Editor tool={tools.find((tool) => tool.id === "room-reimagination")!} locale={locale} uploadsEnabled renderEnabled submissionEnabled={false} improveEnabled={false} /></main>;
}
