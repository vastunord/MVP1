import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Vastu Nord", template: "%s · Vastu Nord" },
  description: "Vastu Nord — Studio foundation",
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
      <body>{children}</body>
    </html>
  );
}
