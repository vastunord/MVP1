import { VisitorExperience } from "../../../src/components/visitor-overlays";
import "../../../src/app/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><VisitorExperience initialLocale="en" newsletterEnabled pranaEnabled={false}>{children}</VisitorExperience></body></html>;
}
