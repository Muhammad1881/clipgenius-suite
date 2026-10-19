import { Link } from "@tanstack/react-router";
import { PROJECT_RETENTION_HOURS } from "@/lib/public-offer";
import { Check, Lock, Sparkles, Type, Languages, Sliders, Zap } from "lucide-react";

export function PricingSection() {
  const starterPrice = "$13.99";
  const creatorPrice = "$19";

  return (
    <section className="py-24 px-6 relative" id="pricing">
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-[#06B6D4] bg-[#06B6D4]/10 px-3 py-1 rounded-full border border-[#06B6D4]/20 mb-3">
            PRICING
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Simple plans for every creator.
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you need more minutes or features. Billed monthly, cancel anytime.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* 1. FREE PLAN */}
          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-display text-2xl font-bold text-white">Free</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-6">Perfect for trying Clipra.</p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold text-white">
                  $0
                </span>
                <span className="text-zinc-500 text-sm">/mo</span>
              </div>

              <Link
                to="/signup"
                className="block w-full text-center py-3.5 rounded-xl border border-zinc-700 text-white font-semibold text-sm hover:bg-white/10 transition-colors mb-8"
              >
                Start free
              </Link>

              {/* Essentials List */}
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 font-semibold">
                Essentials
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> 60 minutes / month
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> Upload videos up to 30 minutes
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> Up to 5 clips per video
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> 720p HD Exports
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> AI Viral Moment Detection
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> Automatic Subtitles
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> Vertical 9:16 Smart Center Crop
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#10B981]" /> {PROJECT_RETENTION_HOURS}-Hour Project History
                </li>
              </ul>

              {/* Unlocks with Starter */}
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3 font-semibold">
                Unlocks with Starter
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-500">
                <li className="flex items-center gap-2.5">
                  <Lock className="w-3.5 h-3.5" /> Watermark-free Exports
                </li>
                <li className="flex items-center gap-2.5">
                  <Lock className="w-3.5 h-3.5" /> Fancy Animated Subtitles
                </li>
                <li className="flex items-center gap-2.5">
                  <Lock className="w-3.5 h-3.5" /> AI Titles & AI Hashtags
                </li>
                <li className="flex items-center gap-2.5">
                  <Lock className="w-3.5 h-3.5" /> Custom Clip Lengths
                </li>
              </ul>
            </div>
          </div>

          {/* 2. STARTER PLAN (Best Value) */}
          <div className="animated-border-wrap shadow-[0_0_50px_rgba(139,92,246,0.18)]">
            <div className="animated-border-inner p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-display text-2xl font-bold text-white">Starter</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider border border-[#8B5CF6]/30">
                    Best Value
                  </span>
                </div>
                <p className="text-sm text-zinc-400 mb-6">Everything you need to grow.</p>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-extrabold text-white">
                    {starterPrice}
                  </span>
                  <span className="text-zinc-500 text-sm">/mo</span>
                </div>

                <Link
                  to="/pricing"
                  className="block w-full text-center py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors mb-8 shadow-lg shadow-white/10"
                >
                  Get Starter
                </Link>

                {/* Essentials List */}
                <div className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] mb-3 font-semibold">
                  Essentials
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-zinc-200 mb-6">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> <strong>300 minutes</strong> / month
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> Upload videos up to 60 minutes
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> Up to 10 clips per video
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> 1080p Full HD Exports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> <strong>No Watermark</strong>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> Vertical 9:16 Smart Center Crop
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#8B5CF6]" /> {PROJECT_RETENTION_HOURS}-Hour Project History
                  </li>
                </ul>

                {/* AI Content */}
                <div className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] mb-2.5 font-semibold">
                  AI Content
                </div>
                <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> AI Viral Moment Detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" /> AI Captions, Titles & Hashtags
                  </li>
                </ul>

                {/* Subtitles & Controls */}
                <div className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] mb-2.5 font-semibold">
                  Subtitles & Controls
                </div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-[#8B5CF6]" /> Fancy Animated Subtitles
                  </li>
                  <li className="flex items-center gap-2">
                    <Languages className="w-3.5 h-3.5 text-[#8B5CF6]" /> Subtitle Translation (Multiple Languages)
                  </li>
                  <li className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#8B5CF6]" /> Custom Clip Lengths (30–90 sec)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. CREATOR PLAN (Most Popular) */}
          <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/10 hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-display text-2xl font-bold text-white">Creator</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-[10px] font-bold uppercase tracking-wider border border-[#06B6D4]/30">
                  Most Popular
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-6">Maximum power for serious creators.</p>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-extrabold text-white">
                  {creatorPrice}
                </span>
                <span className="text-zinc-500 text-sm">/mo</span>
              </div>

              <Link
                to="/pricing"
                className="block w-full text-center py-3.5 rounded-xl border border-[#06B6D4]/50 text-white font-semibold text-sm hover:bg-[#06B6D4]/10 transition-colors mb-8 shadow-sm"
              >
                Get Creator
              </Link>

              {/* Essentials List */}
              <div className="text-xs font-mono uppercase tracking-wider text-[#06B6D4] mb-3 font-semibold">
                Essentials
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-200 mb-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> <strong>500 minutes</strong> / month
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> Upload videos up to 120 minutes
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> Up to 15 clips per video
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> 1080p Full HD Exports
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> No Watermark
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> <strong>{PROJECT_RETENTION_HOURS}-Hour Project History</strong>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#06B6D4]" /> <strong>Priority Processing</strong>
                </li>
              </ul>

              {/* Premium AI Video */}
              <div className="text-xs font-mono uppercase tracking-wider text-[#06B6D4] mb-2.5 font-semibold">
                Premium AI Video
              </div>
              <ul className="space-y-2 text-xs text-zinc-300 mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#06B6D4]" /> AI Reframe with Intelligent Subject Tracking
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#06B6D4]" /> Automatic Vertical 9:16 Framing
                </li>
              </ul>

              {/* AI Content & Subtitles */}
              <div className="text-xs font-mono uppercase tracking-wider text-[#06B6D4] mb-2.5 font-semibold">
                AI Content & Subtitles
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" /> AI Viral Moments, Captions, Titles & Hashtags
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" /> Fancy Animated Subtitles & Multiple Translation Languages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-zinc-400" /> Custom Clip Lengths (30–90 sec)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
