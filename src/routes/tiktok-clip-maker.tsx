import { createFileRoute } from "@tanstack/react-router";
import { ToolLanding, toolLandingHead } from "@/components/ToolLanding";

const URL_ = "https://theclipra.com/tiktok-clip-maker";
const TITLE = "TikTok Clip Maker — AI Vertical Clips with Captions | Clipra";
const DESCRIPTION = "Make TikTok-ready clips from any long video. Clipra's AI picks viral moments, reframes to 9:16, and adds animated captions optimised for TikTok.";

const faqs = [
  { q: "Are Clipra clips optimised for the TikTok algorithm?", a: "Yes — vertical 9:16, hook in the first 2 seconds, burned-in captions, and 15-60 second pacing tuned for watch-through." },
  { q: "Will my clips get flagged as reposts?", a: "No. Clips are unique edits with new captions, framing and length — TikTok treats them as fresh content." },
  { q: "Can I add trending sounds?", a: "Export the video, then drop a trending sound on top inside TikTok before posting for max reach." },
  { q: "Does it write TikTok captions and hashtags too?", a: "Yes. Paid plans generate a social caption + hashtag pack for every clip." },
];

export const Route = createFileRoute("/tiktok-clip-maker")({
  component: Page,
  head: () => toolLandingHead({ title: TITLE, description: DESCRIPTION, url: URL_, faqs }),
});

function Page() {
  return (
    <ToolLanding
      eyebrow="TikTok Clip Maker"
      h1="Make TikTok clips that the algorithm loves."
      highlight="the algorithm loves"
      intro="Clipra turns any long video into TikTok-ready clips with hook-first edits, animated captions, and vertical reframing. Built for creators who want to post daily without editing."
      bullets={[
        "Hook in the first 2 seconds — every time",
        "Animated captions tuned for TikTok readability",
        "Auto face-tracking 9:16 reframe",
        "Caption + hashtag pack per clip",
        "Multilingual captions for global reach",
        "Daily posting workflow on autopilot",
      ]}
      steps={[
        { t: "Upload long video", d: "Podcasts, streams, vlogs, interviews — all work." },
        { t: "AI clips for TikTok", d: "Hook-first, vertical, captioned, ready to post." },
        { t: "Post and grow", d: "Drop a trending sound, hit post, repeat." },
      ]}
      faqs={faqs}
    />
  );
}
