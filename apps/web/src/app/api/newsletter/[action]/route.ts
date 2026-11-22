import { newsletterPost, newsletterReply } from "@/server/newsletter-http";

export async function POST(
  request: Request,
  context: { params: Promise<{ action: string }> },
) {
  const { action } = await context.params;
  if (action !== "confirm" && action !== "unsubscribe")
    return newsletterReply("unknown-action", 404);
  return newsletterPost(request, action);
}
