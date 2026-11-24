import { NewsletterLinkPage } from "@/components/newsletter-link-page";

export async function generateMetadata({params}: {params: Promise<{action: string}>}) {
  return {
    title: (await params).action === "unsubscribe" ? "Unsubscribe from newsletter" : "Confirm newsletter",
    referrer: "no-referrer" as const,
    robots: { index: false, follow: false },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  return <NewsletterLinkPage action={(await params).action} locale="en" />;
}
