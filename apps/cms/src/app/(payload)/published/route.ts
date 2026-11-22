import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const locale = params.get("locale") === "en" ? "en" : "nb";
  const page = Number(params.get("page") ?? 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
    return Response.json({error:"Invalid page"}, {status:400});
  }
  const payload = await getPayload({config});
  const result = await payload.find({
    collection:"articles", draft:false, overrideAccess:true, depth:0, page, limit:24,
    sort:"slug", where:{_status:{equals:"published"}}, select:{slug:true, nb:true, en:true},
  });
  const articles = result.docs.map(doc => {
    const copy = doc[locale] as {title:string; summary:string};
    return {slug:doc.slug, title:copy.title, summary:copy.summary};
  });
  return Response.json({articles, page, pages:result.totalPages}, {headers:{"Cache-Control":"no-store"}});
}
