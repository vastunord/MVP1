import { RenderError } from "./mnml.ts";

// The authenticated catalog reports our account's render_usd per still image.
export async function verifyTestRenderQuote(key: string, http = fetch): Promise<number> {
  const options: RequestInit = {headers:{Authorization:`Bearer ${key}`}, cache:"no-store",
    redirect:"error", signal:AbortSignal.timeout(6000)};
  try {
    const [catalog, account] = await Promise.all(["engines","account"].map(async path => {
      const response = await http(`https://api.mnml.ai/v2/${path}`, options);
      if (!response.ok) throw new Error("Provider preflight unavailable");
      return (await response.json()).data;
    }));
    const fast = catalog?.engines?.find((engine: {id: string}) => engine.id === "v4.5-fast");
    if (fast?.available === true && fast.prices?.render_usd === 0.099 &&
      Number.isFinite(account?.balance_usd) && account.balance_usd >= 0.099) return 99000;
  } catch {
    // Keep account information and provider error bodies out of API responses.
  }
  throw new RenderError(503, "The approved test rendering price or balance could not be verified");
}
