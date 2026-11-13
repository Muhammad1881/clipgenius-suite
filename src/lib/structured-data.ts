import { INPUT_LIMIT_MINUTES, PROJECT_RETENTION_HOURS } from "@/lib/public-offer";

export const SITE_URL = "https://theclipra.com";

/** Plan prices shown on the Pricing page; keep in sync with PricingCards. */
export const PLAN_OFFERS = [
  { name: "Free", price: "0", description: `60 minutes per month, uploads up to ${INPUT_LIMIT_MINUTES.free} minutes, 5 clips, 720p with watermark.` },
  { name: "Starter", price: "13.99", description: `More monthly minutes, uploads up to ${INPUT_LIMIT_MINUTES.starter} minutes, 1080p, translation and clip length control.` },
  { name: "Creator", price: "19", description: `Uploads up to ${INPUT_LIMIT_MINUTES.creator} minutes, 1080p, AI reframe, translation and clip length control.` },
] as const;

export function softwareApplicationSchema(url = `${SITE_URL}/`) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Clipra",
    url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web browser",
    description:
      "Clipra is an AI clip generator that turns long videos and podcasts into short vertical clips with captions for YouTube Shorts, TikTok and Instagram Reels.",
    featureList: [
      "AI detection of highlight moments in long videos",
      "Automatic 9:16 vertical clips",
      "Auto captions",
      "AI reframe on the Creator plan",
      "Translation on paid plans",
      `Projects deleted after ${PROJECT_RETENTION_HOURS} hours`,
    ],
    offers: PLAN_OFFERS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "USD",
      description: p.description,
      url: `${SITE_URL}/pricing`,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export const ldScript = (data: unknown) => ({ type: "application/ld+json", children: JSON.stringify(data) });
