import { answerTextRequest } from "@/server/text-request";
export const runtime = "nodejs";
export function POST(request: Request) {
  return answerTextRequest(request, "improve");
}
