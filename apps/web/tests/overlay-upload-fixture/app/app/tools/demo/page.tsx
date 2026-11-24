"use client";
import { useState } from "react";
import { PrivateUpload } from "../../../../../../src/components/private-upload";

export default function Fixture() {
  const [preview, setPreview] = useState("");
  return <main><h1>Upload fixture</h1><PrivateUpload locale="en" enabled onPreview={setPreview} /><output data-testid="preview">{preview}</output></main>;
}
