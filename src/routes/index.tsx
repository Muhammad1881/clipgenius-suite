import { createFileRoute } from "@tanstack/react-router";
import { ParticleCanvas } from "@/components/landing/ParticleCanvas";
import { TopAnnouncementBar } from "@/components/landing/TopAnnouncementBar";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialMarquee } from "@/components/landing/SocialMarquee";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { WhyClipraSection } from "@/components/landing/WhyClipraSection";
import { RoiCalculatorSection } from "@/components/landing/RoiCalculatorSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { PreFooterCta } from "@/components/landing/PreFooterCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

const HERO_TITLE = "Clipra — Turn long videos into viral shorts with AI";
const HERO_DESC =
  "Drop in one long video. Clipra’s AI finds the moments most likely to blow up, reframes them to 9:16, and drops animated captions — turning hours of footage into a week of posts in minutes.";

const faqs = [
  {
    q: "What kinds of videos work best?",
    a: "Podcasts, interviews, webinars, educational videos, commentaries, and single or multi-speaker YouTube videos work best. Clipra's neural audio engine looks for clear conversational narrative, humor, strong opinions, and emotional inflection to identify viral hooks.",
  },
  {
    q: "How long does processing take?",
    a: "Most 30-to-60-minute long videos process in under 3 to 5 minutes. Clipra transcribes the full audio, scores viral moments, reframes faces to 9:16, generates dynamic animated captions, and produces ready-to-download clips simultaneously.",
  },
  {
    q: "Can I edit the clips after?",
    a: "Yes. While Clipra gives you export-ready clips automatically, you can open our built-in video editor to adjust start and end frames, edit subtitle wording, tweak font styles and colors, change vertical crop alignment, or customize hashtags.",
  },
  {
    q: "Do you support other languages?",
    a: "Yes, Clipra supports speech transcription and animated subtitles in 30+ languages including Spanish, French, German, Italian, Portuguese, Hindi, Japanese, and Mandarin, along with instant translation into English.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, our Free plan provides 60 free minutes every month with no credit card required. You can try the entire automated pipeline, generate shorts, and upgrade only when you need watermark-free exports and extra monthly minutes.",
  },
];

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: HERO_TITLE },
      { name: "description", content: HERO_DESC },
      {
        name: "keywords",
        content:
          "Clipra, theclipra.com, AI video editor, repurpose video, YouTube Shorts Generator, TikTok Clip Maker, Instagram Reels Maker, Podcast Clip Maker, auto reframe, kinetic captions, viral hook score, AI video shorts",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://theclipra.com/" },
      { property: "og:title", content: HERO_TITLE },
      { property: "og:description", content: HERO_DESC },
      { property: "og:site_name", content: "Clipra" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: "https://theclipra.com/" },
      { name: "twitter:title", content: HERO_TITLE },
      { name: "twitter:description", content: HERO_DESC },
    ],
    links: [{ rel: "canonical", href: "https://theclipra.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-[#07080E] text-white selection:bg-[#8B5CF6]/40 selection:text-white overflow-x-hidden relative">
      {/* Ambient Canvas & Textures */}
      <ParticleCanvas />

      {/* Live Social Proof Banner (Bottom-Left) */}

      {/* Top Announcement Bar */}
      <TopAnnouncementBar />

      {/* Header & Navigation */}
      <LandingHeader />

      <main>
        {/* Hero Section with Interactive Sandbox */}
        <HeroSection />

        {/* Social Proof Stats Marquee */}
        <SocialMarquee />

        {/* How It Works (4 Steps) */}
        <HowItWorksSection />

        {/* Why Clipra (Bento Grid) */}
        <WhyClipraSection />

        {/* Dynamic ROI & Cost Calculator */}
        <RoiCalculatorSection />

        {/* Pricing Section (Free, Starter $13.99, Creator $19) */}
        <PricingSection />

        {/* FAQ Section */}
        <FaqSection />

        {/* Pre-Footer CTA */}
        <PreFooterCta />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
