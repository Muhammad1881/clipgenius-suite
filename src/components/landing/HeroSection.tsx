import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Zap,
  Flame,
  Target,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

interface ClipData {
  title: string;
  sub: string;
  score: string;
  scoreVal: number;
  img: string;
}

const clipsData: Record<number, ClipData> = {
  1: {
    title: '"THE EARLY BIRD<br />CATCHES THE WORM" ☀️',
    sub: "Alternative terms for early risers",
    score: "91% VIRAL SCORE",
    scoreVal: 91,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80",
  },
  2: {
    title: '"WHOLE LIFE, IT\'S<br />ABOUT CHALLENGE." ⚽',
    sub: "Cristiano on life in Saudi Arabia",
    score: "97% VIRAL SCORE",
    scoreVal: 97,
    img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80",
  },
  3: {
    title: '"YOU WON\'T BELIEVE<br />WHAT HAPPENED NEXT!" ⚡',
    sub: "The unexpected plot twist",
    score: "87% VIRAL SCORE",
    scoreVal: 87,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80",
  },
};

type CaptionStyle = "hormozi" | "mrbeast" | "minimal";

export function HeroSection() {
  const [activeClip, setActiveClip] = useState<number>(1);
  const [activeStyle, setActiveStyle] = useState<CaptionStyle>("hormozi");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handleSelectClip = (id: number) => {
    if (id === activeClip) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveClip(id);
      setIsTransitioning(false);
    }, 120);
  };

  const clip = clipsData[activeClip];

  return (
    <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-20 px-6 min-h-[85vh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
        {/* Hero Copy */}
        <div className="flex flex-col items-start z-10 lg:-translate-y-6 xl:-translate-y-10">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[4.85rem] xl:text-[5.4rem] font-extrabold leading-[1.03] tracking-tight text-white mb-8 max-w-2xl">
            Turn long videos into <br className="hidden sm:inline" />
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative inline-block mt-1"
            >
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] via-[#10B981] to-[#8B5CF6] bg-[length:250%_auto] animate-gradient-shift inline-block drop-shadow-[0_0_35px_rgba(139,92,246,0.4)]">
                viral shorts in minutes.
              </span>
              <span
                className="absolute -inset-x-3 -inset-y-2 bg-gradient-to-r from-[#8B5CF6]/30 via-[#06B6D4]/30 to-[#10B981]/30 blur-2xl opacity-75 animate-pulse-glow -z-0 pointer-events-none"
                aria-hidden="true"
              />
            </motion.span>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-bold text-base hover:scale-105 hover:bg-zinc-100 transition-all shadow-[0_0_35px_rgba(255,255,255,0.18)] group"
            >
              Start creating free{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#workflow"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-panel text-white font-medium text-base hover:bg-white/10 transition-all"
            >
              <PlayCircle className="w-5 h-5 text-[#06B6D4]" /> Watch demo
            </a>
          </div>

          {/* Subtext */}
          <p className="text-xs sm:text-sm text-zinc-500 mt-5 flex items-center gap-2 font-mono">
            <Zap className="w-4 h-4 text-[#10B981]" /> 60 free minutes monthly ·
            No credit card required
          </p>
        </div>

        {/* Hero Interactive Sandbox (Vertical 9:16 Showcase) */}
        <div className="relative w-full flex items-center justify-center z-10">
          {/* Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-tr from-[#8B5CF6]/25 via-[#06B6D4]/20 to-[#10B981]/15 blur-3xl opacity-75"
          />

          <div className="relative w-full max-w-[340px] sm:max-w-[360px] glass-panel rounded-[2.25rem] p-4 sm:p-4.5 shadow-[0_25px_80px_-15px_rgba(139,92,246,0.3)] border border-white/15 flex flex-col gap-3.5 backdrop-blur-2xl">
            {/* Top Tabs: 3 Real Clips */}
            <div className="grid grid-cols-3 gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-zinc-800/80">
              {[
                { id: 1, label: "CLIP 01", name: "Early Risers", score: "91% Score" },
                { id: 2, label: "CLIP 02", name: "Cristiano", score: "97% Score" },
                { id: 3, label: "CLIP 03", name: "Unexpected", score: "87% Score" },
              ].map((c) => {
                const isActive = activeClip === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectClip(c.id)}
                    className={`py-1.5 px-1.5 rounded-xl text-xs font-semibold transition-all text-center flex flex-col items-center ${
                      isActive
                        ? "bg-white/15 text-white border border-white/20 shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="text-[9px] text-zinc-400 font-mono">
                      {c.label}
                    </span>
                    <span className="truncate w-full font-sans text-[11px] font-medium">{c.name}</span>
                    <span className="text-[10px] text-[#10B981] font-bold mt-0.5">
                      {c.score}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Preview Stage (Vertical 9:16 Aspect Ratio) */}
            <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-zinc-800/90 flex items-center justify-center group shadow-inner">
              {/* Phone Speaker / Dynamic Island Top Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black/85 rounded-full border border-white/10 z-20 pointer-events-none flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="w-1 h-1 rounded-full bg-[#06B6D4]/50" />
              </div>

              {/* Video Simulation Image */}
              <img
                src={clip.img}
                alt={clip.sub}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isTransitioning ? "opacity-30" : "opacity-100"
                }`}
              />

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />

              {/* Top Meta Badges */}
              <div className="absolute top-7 left-2.5 right-2.5 flex items-center justify-between z-10">
                <span className="px-2 py-0.5 rounded-full bg-[#10B981] text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Flame className="w-3 h-3 fill-black" />
                  <span>{clip.score}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 text-[9px] font-mono border border-white/10 flex items-center gap-1">
                  <Target className="w-3 h-3 text-[#06B6D4]" /> 9:16 Face Tracked
                </span>
              </div>

              {/* Floating Caption Center / Bottom */}
              <div className="absolute inset-x-0 bottom-14 px-4 text-center z-10">
                <div
                  className={`text-xl sm:text-2xl font-extrabold transition-all duration-300 leading-tight caption-${activeStyle} drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]`}
                  dangerouslySetInnerHTML={{ __html: clip.title }}
                />
                <div className="text-[11px] text-zinc-200 mt-2 font-medium bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm inline-block border border-white/10">
                  {clip.sub}
                </div>
              </div>

              {/* Social Interaction Badges (Vertical Right Rail) */}
              <div className="absolute right-2.5 bottom-16 flex flex-col gap-3 items-center text-white drop-shadow z-10">
                <div className="flex flex-col items-center">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  <span className="text-[9px] font-bold">182K</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-4 h-4 fill-white text-white" />
                  <span className="text-[9px] font-bold">2.4K</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-4 h-4" />
                  <span className="text-[9px] font-bold">48K</span>
                </div>
              </div>

              {/* Progress Scrubber line at the bottom */}
              <div className="absolute bottom-1.5 inset-x-3 h-1 bg-white/20 rounded-full overflow-hidden z-20">
                <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] w-2/3 rounded-full" />
              </div>
            </div>

            {/* Caption Style Switcher Controls */}
            <div className="flex items-center justify-between pt-0.5 px-0.5">
              <span className="text-[11px] text-zinc-400 font-mono">
                Animated Style:
              </span>
              <div className="flex items-center gap-1.5">
                {(["hormozi", "mrbeast", "minimal"] as CaptionStyle[]).map(
                  (style) => {
                    const isStyleActive = activeStyle === style;
                    const styleName =
                      style.charAt(0).toUpperCase() + style.slice(1);
                    return (
                      <button
                        key={style}
                        onClick={() => setActiveStyle(style)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isStyleActive
                            ? "bg-white/15 text-white border border-white/25 shadow-sm"
                            : "text-zinc-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {styleName}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
