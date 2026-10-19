import { createFileRoute } from "@tanstack/react-router";
import { ToolLanding, toolLandingHead } from "@/components/ToolLanding";
import { INPUT_LIMIT_SUMMARY } from "@/lib/public-offer";

const URL_ = "https://theclipra.com/podcast-clip-maker";
const TITLE = "Podcast Clip Maker — AI Clips from Podcast Episodes | Clipra";
const DESCRIPTION = "Repurpose podcast episodes into viral short clips. Clipra's AI finds the best soundbites, adds captions, and reframes for TikTok, Reels and Shorts.";

const faqs = [
  { q: "Can Clipra handle audio-only podcasts?", a: "Clipra currently accepts video files and direct video file links. For an audio-only episode, create a video file with your own image in another editor before uploading." },
  { q: "How does it pick the best podcast moments?", a: "Clipra analyses transcript sentiment, story arcs, and hook strength to find the soundbites most likely to perform on short-form." },
  { q: "Does it work with multi-speaker podcasts?", a: "Yes. Speakers are transcribed separately and captions label each one when needed." },
  { q: "Can I edit clips before posting?", a: "Yes — trim, swap captions, change framing or language before exporting." },
];

export const Route = createFileRoute("/podcast-clip-maker")({
  component: Page,
  head: () => toolLandingHead({ title: TITLE, description: DESCRIPTION, url: URL_, faqs }),
});

function Page() {
  return (
    <ToolLanding
      eyebrow="Podcast Clip Maker"
      h1="The fastest way to clip podcast episodes."
      highlight="clip podcast episodes"
      intro="Turn video podcast episodes into vertical clips. Clipra's AI finds the best moments, captions them, and packages them for TikTok, Reels and YouTube Shorts."
      bullets={[
        "Built for long-form interview podcasts",
        "Multi-speaker transcription and labels",
        "Video file uploads and direct video file links",
        "Captions in 30+ languages",
        "Hook detection picks moments that stop the scroll",
        "Export 10+ clips from a single episode",
      ]}
      steps={[
        { t: "Drop in your episode", d: `Upload your episode as a video file. ${INPUT_LIMIT_SUMMARY}` },
        { t: "AI finds soundbites", d: "Clipra ranks the most clip-worthy moments." },
        { t: "Post everywhere", d: "Export vertical clips with captions." },
      ]}
      faqs={faqs}
    />
  );
}
