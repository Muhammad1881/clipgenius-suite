import { UploadCloud, Sparkles, Crop, Download } from "lucide-react";
import { GlowCard } from "./GlowCard";
import { INPUT_LIMIT_SUMMARY, UPLOAD_OPTIONS } from "@/lib/public-offer";

const steps = [
  {
    num: "01",
    title: "Upload your video",
    desc: `${UPLOAD_OPTIONS} ${INPUT_LIMIT_SUMMARY}`,
    icon: UploadCloud,
    badgeClass: "bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]",
  },
  {
    num: "02",
    title: "AI finds the gold",
    desc: "Clipra transcribes your video, scores every moment for viral potential, and picks the segments most likely to pop off.",
    icon: Sparkles,
    badgeClass: "bg-[#06B6D4]/10 border-[#06B6D4]/30 text-[#06B6D4]",
  },
  {
    num: "03",
    title: "Auto-reframes to 9:16",
    desc: "Smart face tracking reframes each clip to perfect vertical — no manual cropping, no wasted edges, always on-subject.",
    icon: Crop,
    badgeClass: "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]",
  },
  {
    num: "04",
    title: "Caption & download",
    desc: "Animated captions in 30+ languages, hook-first titles, and ready-to-post shorts for TikTok, Reels and Shorts.",
    icon: Download,
    badgeClass: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 border-b border-white/[0.07]" id="workflow">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-[#06B6D4] bg-[#06B6D4]/10 px-3 py-1 rounded-full border border-[#06B6D4]/20 mb-3">
            HOW IT WORKS
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            From raw footage to viral, in 4 steps.
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
            No complicated timeline or video editing knowledge needed. Clipra
            automates the entire viral repurposing pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <GlowCard key={s.num} className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-white/30">
                      {s.num}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center ${s.badgeClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
