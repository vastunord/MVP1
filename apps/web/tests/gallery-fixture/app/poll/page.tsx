"use client";
import { tools } from "@vastunord/contracts/tools";
import { StudioRenderAction } from "../../../../src/components/studio-render-action";

const ignoreResult = () => {};
export default function PollFixture() {
  return <main><StudioRenderAction tool={tools.find((tool) => tool.id === "room-reimagination")!} values={{}} engine="fast" prompt="Synthetic room" avoid="" locale="en" enabled submissionEnabled workflow="design" selection={{ projectId: "project", sourceAssetId: "source", referenceIds: [] }} onResult={ignoreResult} /></main>;
}
