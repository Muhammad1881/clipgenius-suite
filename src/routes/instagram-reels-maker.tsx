import { createFileRoute } from "@tanstack/react-router";
import { ToolLanding, toolLandingHead } from "@/components/ToolLanding";

const URL_ = "https://theclipra.com/instagram-reels-maker";
const TITLE = "Instagram Reels Maker — AI Reels from Long Videos | Clipra";
const DESCRIPTION = "Create Instagram Reels from any long video with AI. Clipra picks viral moments, reframes vertically, and adds captions optimised for the Reels feed.";

const faqs = [
  { q: "What length should Instagram Reels be?", a: "Reels perform best between 15 and 60 seconds. Clipra picks clip lengths inside that range automatically." },
  { q: "Are captions important for Reels?", a: "Yes — most Reels are watched on mute. Clipra burns in animated captions so your message lands without sound." },
  { q: "Can I post the same clip to TikTok and Reels?", a: "Yes. The same 9:16 export works for Instagram Reels, TikTok and YouTube Shorts." },
  { q: "Does Clipra handle Stories or Carousels?", a: "Clipra focuses on Reels — vertical 9:16 video clips. You can repurpose the same exports for Stories." },
];

export const Route = createFileRoute("/instagram-reels-maker")({
  component: Page,
  head: () => toolLandingHead({ title: TITLE, description: DESCRIPTION, url: URL_, faqs }),
});

function Page() {
  return (
    <ToolLanding
      eyebrow="Instagram Reels Maker"
      h1="Turn long videos into Reels that actually convert."
      highlight="Reels that actually convert"
      intro="Clipra's AI picks the most engaging moments from your long videos and packages them as Instagram Reels — captioned, vertical, hook-first."
      bullets={[
        "Optimised for the Reels recommendation feed",
        "Captions burned in for mute viewing",
        "9:16 vertical with face-aware reframing",
        "Clip lengths tuned for Reels watch-through",
        "Hook-first edits to win the first 2 seconds",
        "Caption + hashtag suggestions per Reel",
      ]}
      steps={[
        { t: "Upload your video", d: "Long-form content of any kind works." },
        { t: "AI makes Reels", d: "Vertical, captioned, hook-first — automatically." },
        { t: "Post to Instagram", d: "Drop into Reels, add a sound, and ship." },
      ]}
      faqs={faqs}
    />
  );
}
