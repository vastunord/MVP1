import "server-only";
import { newsletterSettings } from "./newsletter";

export function newsletterAvailable() {
  return Boolean(newsletterSettings(process.env));
}
