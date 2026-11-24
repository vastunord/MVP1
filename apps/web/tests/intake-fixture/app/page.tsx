"use client";
import { useCallback, useState } from "react";
import { PrivateUpload } from "../../../src/components/private-upload";
import type { RenderSelection } from "../../../src/lib/studio-render";

export default function Fixture() {
  const [preview, setPreview] = useState("");
  const [selection, setSelection] = useState<RenderSelection>();
  const onSelection = useCallback((value: RenderSelection) => setSelection(value), []);
  return <main><h1>Room Reimagination</h1><label>Describe the room<input /></label>
    <label>Room setting<input defaultValue="Warm" /></label>
    <PrivateUpload locale="en" enabled onPreview={setPreview} onSelection={onSelection} />
    <output data-testid="selection">{JSON.stringify(selection)}</output>
    <output data-testid="preview">{preview}</output>
  </main>;
}
