import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { VisitorExperience } from "@/components/visitor-overlays";
import { newsletterAvailable } from "@/server/newsletter-runtime";
import "./globals.css";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};
export const metadata: Metadata = {
  title: { default: "Vastu Nord", template: "%s · Vastu Nord" },
  description: "Studio · Vastu Nord",
  robots: { index: false, follow: false },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = (await headers()).get("x-vn-locale") === "en" ? "en" : "nb-NO";
  const value = (await cookies()).get("vn-theme")?.value;
  const theme = value === "dark" || value === "light" ? value : "system";
  return (
    <html lang={lang} data-theme={theme}>
      <body>
        <VisitorExperience
          initialLocale={lang}
          newsletterEnabled={newsletterAvailable()}
        >
          {children}
        </VisitorExperience>
      </body>
    </html>
  );
}
