import {
  Flame,
  Crop,
  Languages,
  Type,
  ArrowUpRight,
  Hash,
} from "lucide-react";
import { GlowCard } from "./GlowCard";

export function WhyClipraSection() {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 max-w-3xl">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-[#8B5CF6] bg-[#8B5CF6]/10 px-3 py-1 rounded-full border border-[#8B5CF6]/20 mb-3">
            WHY CLIPRA
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Engineered to make you go viral.
          </h2>
          <p className="text-zinc-400 text-lg">
            No editor. No guesswork. Just the clips most likely to blow up —
            already vertical, captioned and ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Viral Scoring on Every Moment (Span 2) */}
          <GlowCard className="lg:col-span-2 p-8">
            <div className="flex flex-col justify-between h-full">
              <div className="h-44 bg-black/40 border border-zinc-800 rounded-2xl p-5 mb-6 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                  <span>VIRAL_RETENTION_CURVE</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> 97% Hook Score
                  </span>
                </div>
                {/* Retention graph visual */}
                <div className="flex items-end gap-2 h-20 w-full pt-4">
                  <div className="w-1/12 bg-zinc-800 h-1/3 rounded-t" />
                  <div className="w-1/12 bg-zinc-800 h-1/2 rounded-t" />
                  <div className="w-1/12 bg-zinc-700 h-2/3 rounded-t" />
                  <div className="w-2/12 bg-[#8B5CF6] h-full rounded-t relative flex items-center justify-center">
                    <span className="absolute -top-7 text-[10px] font-mono bg-[#8B5CF6] text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                      PEAK HOOK
                    </span>
                  </div>
                  <div className="w-1/12 bg-[#06B6D4] h-4/5 rounded-t" />
                  <div className="w-1/12 bg-zinc-700 h-3/5 rounded-t" />
                  <div className="w-1/12 bg-zinc-800 h-1/2 rounded-t" />
                  <div className="w-1/12 bg-zinc-800 h-2/5 rounded-t" />
                  <div className="w-1/12 bg-zinc-800 h-1/3 rounded-t" />
                  <div className="w-1/12 bg-zinc-900 h-1/4 rounded-t" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2.5">
                  <Flame className="w-6 h-6 text-[#8B5CF6]" />
                  Viral scoring on every moment
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Every second is ranked for hook strength, pacing and sentiment
                  — so you only export clips that hit.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Feature 2: 9:16 Auto-reframe */}
          <GlowCard className="p-8">
            <div className="flex flex-col justify-between h-full">
              <div className="h-44 bg-black/40 border border-zinc-800 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Speaker"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute w-24 h-32 border-2 border-[#06B6D4] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                  <span className="text-[9px] font-mono bg-black/80 text-[#06B6D4] px-2 py-0.5 rounded-full absolute -top-3 whitespace-nowrap">
                    ACTIVE SPEAKER
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Crop className="w-5 h-5 text-[#06B6D4]" />
                  9:16 auto-reframe
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  AI keeps the speaker centered as they move. Perfect vertical
                  every time, with zero manual editing.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Feature 3: Captions in Multiple Languages */}
          <GlowCard className="p-8">
            <div className="flex flex-col justify-between h-full">
              <div className="h-44 bg-black/40 border border-zinc-800 rounded-2xl mb-6 p-4 flex flex-col justify-center items-center text-center">
                <div className="caption-hormozi text-xl mb-2 text-[#FBBF24]">
                  MULTILINGUAL 🌍
                </div>
                <div className="text-xs text-zinc-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  English · Español · Deutsch · Français · हिन्दी
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-[#10B981]" />
                  Captions in multiple languages
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Animated, burn-in subtitles in your language — or
                  auto-translated to English with one click.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Feature 4: Hook-first titles & hashtags (Span 2) */}
          <GlowCard className="lg:col-span-2 p-8">
            <div className="flex flex-col justify-between h-full">
              <div className="h-44 bg-black/40 border border-zinc-800 rounded-2xl p-5 mb-6 flex flex-col justify-center font-mono text-xs">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Hash className="w-3.5 h-3.5" /> generated_viral_metadata
                </div>
                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-1.5">
                  <div className="text-white font-sans text-sm font-semibold">
                    Title: The #1 Habit That Changed Everything 🚀
                  </div>
                  <div className="text-[#06B6D4]">
                    #shorts #motivation #productivity #podcastclips #mindset
                  </div>
                  <div className="text-[10px] text-zinc-500 font-sans">
                    Optimized for TikTok Search & YouTube Algorithms
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2.5">
                  <Type className="w-6 h-6 text-yellow-400" />
                  Hook-first titles & hashtags
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Each clip ships with a scroll-stopping title and hashtag set
                  tuned for the platform it's going to.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}
