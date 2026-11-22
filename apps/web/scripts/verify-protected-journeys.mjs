// Run through the isolated Vastu Nord CLI's env run. Results contain no tokens or page bodies.
const target = new URL(process.argv[2]);
if (
  target.protocol !== "https:" ||
  !/^vastunord-[a-z0-9-]+-vastu-nord\.vercel\.app$/.test(target.hostname) ||
  target.href !== target.origin + "/" ||
  !process.env.VERCEL_OIDC_TOKEN
) {
  throw new Error(
    "A scoped Preview URL and Vercel testing identity are required.",
  );
}
const headers = {
  "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN,
};
async function check(path, validate, json) {
  const response = await fetch(new URL(path, target), {
    headers: json
      ? {
          ...headers,
          "Content-Type": "application/json",
          Origin: target.origin,
        }
      : headers,
    method: json ? "POST" : "GET",
    body: json ? JSON.stringify(json) : undefined,
    redirect: "manual",
    signal: AbortSignal.timeout(45000),
  });
  const body = await response.text();
  const ok = validate(response.status, body);
  console.log(ok ? "PASS" : "FAIL", path, response.status);
  if (!ok) process.exitCode = 1;
  return ok;
}
const page = (text) => (code, body) => code === 200 && text.test(body);
await check("/en", page(/Open Studio/));
{
  for (const [path, condition] of [
    ["/", page(/Åpne Studio/i)],
    ["/en/gallery", page(/gallery/i)],
    ["/en/resources", page(/knowledge/i)],
    ["/en/signup", page(/email/i)],
    ["/en/terms", page(/Terms of use/)],
    ["/en/privacy", page(/Groq/)],
    ["/robots.txt", page(/Disallow: \/(?:\s|$)/)],
    [
      "/sitemap.xml",
      (code, body) =>
        code === 200 && body.includes(target.origin + "/en/gallery"),
    ],
    [
      "/api/auth/get-session",
      (code, body) => code === 200 && body.trim() === "null",
    ],
    ["/api/projects", (code) => code === 401],
  ])
    await check(path, condition);
  for (const [path, language, question, kind] of [
    [
      "/api/prana",
      "en",
      "Which lamp placement can soften a reading corner?",
      "home",
    ],
    [
      "/api/studio/improve",
      "nb-NO",
      "Behold eikegulvet og gi stuen mykere kveldslys.",
      "home",
    ],
    ["/api/prana", "en", "Give me a recipe for pancakes.", "outside"],
    ["/api/prana", "nb-NO", "Faen!", "abuse"],
  ])
    await check(
      path,
      (code, body) => {
        if (code !== 200) return false;
        try {
          const result = JSON.parse(body);
          return (
            result.kind === kind &&
            typeof result.answer === "string" &&
            result.answer.length > 6 &&
            [
              ...new Intl.Segmenter(language, {
                granularity: "sentence",
              }).segment(result.answer),
            ].length <= 3
          );
        } catch {
          return false;
        }
      },
      { question, language },
    );
}
