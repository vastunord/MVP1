// Read-only provider diagnostics for a protected Vastu Nord Preview build.
if (process.env.VERCEL_ENV !== "preview" || process.env.APP_ENV !== "preview") {
  throw new Error("MNML diagnostic requires the Preview environment");
}
const key = (process.env.MNMLAPI || process.env.MNML_API_KEY)?.trim();
if (!key) {
  console.log("MNML_DIAGNOSTIC", JSON.stringify({ keyPresent: false }));
} else {
  const report = { keyPresent: true, documentedKeyFormat: key.startsWith("mk_live_") };
  for (const path of ["account", "engines"]) {
    try {
      const response = await fetch("https://api.mnml.ai/v2/" + path, {
        headers: { Authorization: "Bearer " + key },
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      report[path + "Status"] = response.status;
      if (!response.ok) {
        try {
          const result = await response.json();
          const code = result.error?.code;
          if (typeof code === "string" && /^[A-Z0-9_]{1,64}$/.test(code))
            report[path + "Code"] = code;
        } catch {
          // Do not log provider response bodies.
        }
      }
      if (response.ok) {
        const result = await response.json();
        if (path === "account") {
          report.balanceUsd = typeof result.data?.balance_usd === "number"
            ? result.data.balance_usd : null;
        } else {
          report.engines = Array.isArray(result.data?.engines)
            ? result.data.engines.map(({ id, available, prices, capabilities }) =>
                ({ id, available, prices, modes: capabilities?.modes }))
            : null;
        }
      }
    } catch {
      report[path + "Status"] = "network-error";
    }
  }
  console.log("MNML_DIAGNOSTIC", JSON.stringify(report));
}
