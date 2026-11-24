import Link from "next/link";
import { tools } from "@vastunord/contracts/tools";
import { Editor } from "../../../../src/components/editor";

export default function EditorFixture() {
  return <main><Link href="/other">Other fixture page</Link><Editor tool={tools.find((tool) => tool.id === "room-reimagination")!} locale="en" uploadsEnabled renderEnabled submissionEnabled={false} improveEnabled={false} /></main>;
}
