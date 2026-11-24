"use client";
import { tools } from "@vastunord/contracts/tools";
import { StudioRenderAction } from "../../../../src/components/studio-render-action";
import { useCallback, useState } from "react";
import type { StudioResult } from "../../../../src/lib/studio-render";

export default function PollFixture() {
  const [project, setProject] = useState("project");
  const [result, setResult] = useState<StudioResult | null>(null);
  const onResult = useCallback((value: StudioResult | null) => setResult(value), []);
  return <main><button onClick={() => { setProject("other"); setResult(null); }}>Switch project</button><output data-testid="result">{result?.output ?? ""}</output><StudioRenderAction key={project} tool={tools.find((tool) => tool.id === "room-reimagination")!} values={{}} engine="fast" prompt="Synthetic room" avoid="" locale="en" enabled submissionEnabled workflow="design" selection={{ projectId: project, sourceAssetId: "source", referenceIds: [] }} onResult={onResult} /></main>;
}
