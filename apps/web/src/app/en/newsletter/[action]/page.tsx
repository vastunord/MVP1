import { NewsletterLinkPage } from "@/components/newsletter-link-page";

export const metadata = {
  title: "Newsletter · Vastu Nord",
  referrer: "no-referrer" as const,
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  return <NewsletterLinkPage action={(await params).action} locale="en" />;
}
