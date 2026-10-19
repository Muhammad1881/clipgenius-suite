import { createFileRoute } from "@tanstack/react-router";
import { ToolLanding, toolLandingHead } from "@/components/ToolLanding";
import { INPUT_LIMIT_SUMMARY } from "@/lib/public-offer";

const URL_ = "https://theclipra.com/ai-clip-generator";
const TITLE = "AI Clip Generator — Turn Long Videos into Viral Shorts | Clipra";
const DESCRIPTION = "Clipra's AI clip generator finds your most viral moments, auto-reframes to 9:16, and adds captions in minutes. Free to try, 60 minutes per month included.";

const faqs = [
  { q: "What is an AI clip generator?", a: "An AI clip generator analyses a long video, scores the best moments for short-form, and exports them as captioned vertical clips ready for TikTok, Reels and Shorts." },
  { q: "Is Clipra's AI clip generator free?", a: "Yes — every account includes 60 free minutes of processing per month. Paid plans start at $13.99/mo for 300 minutes." },
  { q: "How accurate is the viral scoring?", a: "Clipra ranks moments using hook strength, sentiment shifts, and pacing. Most creators find 2-3 high-score clips per hour of footage." },
  { q: "What video formats are supported?", a: `MP4, MOV and WebM video files. ${INPUT_LIMIT_SUMMARY}` },
];

export const Route = createFileRoute("/ai-clip-generator")({
  component: Page,
  head: () => toolLandingHead({ title: TITLE, description: DESCRIPTION, url: URL_, faqs }),
});

function Page() {
  return (
    <ToolLanding
      eyebrow="AI Clip Generator"
      h1="The AI clip generator built for viral shorts."
      highlight="viral shorts"
      intro="Upload any long video and Clipra's AI finds the moments most likely to go viral, reframes them vertically, and adds animated captions — all in minutes."
      bullets={[
        "Smart viral scoring on every moment",
        "Auto 9:16 reframing with face tracking",
        "Animated captions in 30+ languages",
        "Ready-to-post TikTok, Reels & Shorts",
        "Hook-first titles and hashtags",
        INPUT_LIMIT_SUMMARY,
      ]}
      steps={[
        { t: "Upload", d: "Drop in a podcast, webinar, vlog or any long-form video." },
        { t: "AI clips it", d: "Clipra transcribes, scores moments and picks the best." },
        { t: "Post anywhere", d: "Download captioned, vertical clips and ship them." },
      ]}
      faqs={faqs}
    />
  );
}
