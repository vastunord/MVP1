"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { PrivateUpload } from "../../../src/components/private-upload";
import type { RenderSelection } from "../../../src/lib/studio-render";
import type { Locale } from "../../../src/lib/i18n";

export default function Fixture() {
  const [preview, setPreview] = useState("");
  const [selection, setSelection] = useState<RenderSelection>();
  const [locale, setLocale] = useState<Locale>("en");
  const onSelection = useCallback((value: RenderSelection) => setSelection(value), []);
  return <main><h1>Room Reimagination</h1><button onClick={() => setLocale(locale === "en" ? "nb-NO" : "en")}>Switch language</button><Link href="/other">Other page</Link><label>Describe the room<input /></label>
    <label>Room setting<input defaultValue="Warm" /></label>
    <PrivateUpload locale={locale} enabled onPreview={setPreview} onSelection={onSelection} />
    <output data-testid="selection">{JSON.stringify(selection)}</output>
    <output data-testid="preview">{preview}</output>
  </main>;
}
