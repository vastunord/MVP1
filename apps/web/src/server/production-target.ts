// Pinned to the Vastu Nord Frankfurt production branch, confirmed in Neon.
export const productionPool =
  "ep-shiny-block-bhmlplzm-pooler.c-10.eu-central-1.aws.neon.tech";
export const productionRuntimeRole = "vastunord_prod_runtime";
export function isProductionDatabase(value: string | undefined) {
  return matchesDatabase(value, productionPool, productionRuntimeRole);
}
// These booleans are safe to record in protected deployment logs. They never
// include any part of the supplied connection string.
export function productionBindingChecks(value: string | undefined) {
  const result = { present: Boolean(value), parseable: false, protocol: false,
    host: false, port: false, role: false, database: false, password: false,
    tls: false, parameters: false, noFragment: false };
  if (!value) return result;
  try {
    const url = new URL(value);
    result.parseable = true;
    result.protocol = ["postgresql:", "postgres:"].includes(url.protocol);
    result.host = url.hostname === productionPool;
    result.port = !url.port || url.port === "5432";
    result.role = decodeURIComponent(url.username) === productionRuntimeRole;
    result.database = decodeURIComponent(url.pathname) === "/neondb";
    result.password = Boolean(decodeURIComponent(url.password));
    result.tls = url.searchParams.getAll("sslmode").length === 1 &&
      ["require", "verify-full"].includes(url.searchParams.get("sslmode") ?? "");
    result.parameters = Array.from(url.searchParams.keys()).every((key) =>
      ["sslmode", "channel_binding"].includes(key));
    result.noFragment = !url.hash;
  } catch { /* A malformed URL is reported only as failed checks. */ }
  return result;
}
export function matchesDatabase(
  value: string | undefined,
  pool: string,
  role: string,
) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      ["postgresql:", "postgres:"].includes(url.protocol) &&
      url.hostname === pool &&
      (!url.port || url.port === "5432") &&
      url.username === role &&
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
