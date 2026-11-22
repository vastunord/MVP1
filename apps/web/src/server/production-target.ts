// Pinned to the Vastu Nord Frankfurt production branch, confirmed in Neon.
export const productionPool =
  "ep-shiny-block-bhmlplzm-pooler.c-10.eu-central-1.aws.neon.tech";
export const productionRuntimeRole = "vastunord_prod_runtime";
export function isProductionDatabase(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      ["postgresql:", "postgres:"].includes(url.protocol) &&
      url.hostname === productionPool &&
      (!url.port || url.port === "5432") &&
      url.username === productionRuntimeRole &&
      url.pathname === "/neondb" &&
      Boolean(decodeURIComponent(url.password)) &&
      !url.hash &&
      url.searchParams.getAll("sslmode").length === 1 &&
      ["require", "verify-full"].includes(
        url.searchParams.get("sslmode") ?? "",
      ) &&
      Array.from(url.searchParams.keys()).every((key) =>
        ["sslmode", "channel_binding"].includes(key),
      )
    );
  } catch {
    return false;
  }
}
