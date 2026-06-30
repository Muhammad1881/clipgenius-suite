import { createFileRoute } from "@tanstack/react-router";
import { ToolLanding, toolLandingHead } from "@/components/ToolLanding";

const URL_ = "https://clipra.bond/youtube-shorts-generator";
const TITLE = "YouTube Shorts Generator — AI Clips from Long Videos | Clipra";
const DESCRIPTION = "Turn long YouTube videos into Shorts automatically. Clipra's AI picks viral moments, reframes vertically, and adds captions — built for YouTube creators.";

const faqs = [
  { q: "How do I turn a long YouTube video into Shorts?", a: "Upload your video to Clipra. The AI transcribes it, scores viral moments, exports each as a captioned 9:16 clip under 60 seconds — ready to upload as a YouTube Short." },
  { q: "Will Shorts made by Clipra get monetised?", a: "Yes. YouTube monetises Shorts based on watch time and engagement, not how they were edited. Clipra clips meet all YouTube Shorts technical specs." },
  { q: "Can I keep the original audio?", a: "Yes — original audio, captions, and pacing are preserved. You can also swap captions languages." },
  { q: "How many Shorts per long video?", a: "Most 30-60 minute videos produce 5-12 high-scoring Shorts." },
];

export const Route = createFileRoute("/youtube-shorts-generator")({
  component: Page,
  head: () => toolLandingHead({ title: TITLE, description: DESCRIPTION, url: URL_, faqs }),
});

function Page() {
  return (
    <ToolLanding
      eyebrow="YouTube Shorts Generator"
      h1="Turn your long YouTube videos into Shorts that pop."
      highlight="Shorts that pop"
      intro="Clipra is the fastest way to convert long-form YouTube videos into vertical Shorts. AI picks the moments, auto-reframes, and captions every clip in seconds."
      bullets={[
        "Optimised for the YouTube Shorts feed",
        "60-second clips with viral hooks first",
        "Auto 9:16 reframing keeps faces centered",
        "Burned-in captions for silent viewing",
        "Bulk export — upload a week of Shorts at once",
        "Works with podcast, vlog, gaming and tutorial footage",
      ]}
      steps={[
        { t: "Upload your long video", d: "Drag in any video up to 4 hours." },
        { t: "AI picks Shorts", d: "Clipra scores viral moments and clips them." },
        { t: "Upload to YouTube", d: "Download vertical Shorts with captions baked in." },
      ]}
      faqs={faqs}
    />
  );
}
