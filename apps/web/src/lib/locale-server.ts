import { cookies } from "next/headers";
import type { Locale } from "./i18n";
export async function savedLocale(): Promise<Locale> {
  return (await cookies()).get("vn-locale")?.value === "en" ? "en" : "nb-NO";
}
