"use client";
import { useState } from "react";
import { findTool } from "@vastunord/contracts/tools";
import { Editor } from "../../../../src/components/editor";
import { StudioShell } from "../../../../src/components/workspace";

export default function MayaFixture() {
  const [user, setUser] = useState("synthetic-a");
  const [toolId, setToolId] = useState("room-reimagination");
  return <><button onClick={() => setUser(user === "synthetic-a" ? "synthetic-b" : "synthetic-a")}>Switch account</button><button onClick={() => setToolId(toolId === "room-reimagination" ? "garden-design" : "room-reimagination")}>Switch tool</button><StudioShell userId={user} locale="en"><Editor key={toolId} userId={user} tool={findTool(toolId)!} locale="en" uploadsEnabled renderEnabled={false} submissionEnabled={false} improveEnabled={false} /></StudioShell></>;
}
