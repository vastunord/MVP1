import { getPayload } from "payload";
import config from "@payload-config";
import { publishedArticle } from "../../../../published.ts";

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const locale =
    new URL(request.url).searchParams.get("locale") === "en" ? "en" : "nb";
  const article = await publishedArticle(
    await getPayload({ config }),
    slug,
    locale,
  );
  if (!article) return new Response(null, { status: 404 });
  return Response.json(article, { headers: { "Cache-Control": "no-store" } });
}
