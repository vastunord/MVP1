import { NewsletterLinkPage } from "@/components/newsletter-link-page";

export async function generateMetadata({params}: {params: Promise<{action: string}>}) {
  return {
    title: (await params).action === "unsubscribe" ? "Meld deg av nyhetsbrevet" : "Bekreft nyhetsbrev",
    referrer: "no-referrer" as const,
    robots: { index: false, follow: false },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  return <NewsletterLinkPage action={(await params).action} locale="nb-NO" />;
}
