import { newsletterPost } from "@/server/newsletter-http";

export function POST(request: Request) {
  return newsletterPost(request, "request");
}
