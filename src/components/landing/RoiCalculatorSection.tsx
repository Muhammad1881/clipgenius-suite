import { useState } from "react";

export function RoiCalculatorSection() {
  const [videoCount, setVideoCount] = useState<number>(8);

  const hoursSaved = videoCount * 4;
  const costSaved = (videoCount * 150).toLocaleString();
  const shortsGenerated = videoCount * 8;

  return (
    <section className="py-20 px-6 border-y border-white/[0.07] bg-[#0F111A]/20">
      <div className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl border border-white/10">
        <div className="text-center mb-10">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            Calculate Your Content Savings
          </h3>
          <p className="text-zinc-400 text-sm">
            See how much time and editing budget Clipra saves you every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-4">
              Monthly Long Videos Recorded:
              <span className="text-2xl font-bold text-white block mt-1">
                {videoCount} {videoCount > 1 ? "Videos" : "Video"}
              </span>
            </label>
            <input
              type="range"
              min={1}
              max={25}
              value={videoCount}
              onChange={(e) => setVideoCount(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#06B6D4] mb-6"
            />
            <div className="flex justify-between text-xs text-zinc-500 font-mono">
              <span>1 Video</span>
              <span>12 Videos</span>
              <span>25+ Videos</span>
            </div>
          </div>

          <div className="space-y-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8">
            <div>
              <div className="text-xs text-zinc-400 font-mono uppercase">
                Editing Time Saved
              </div>
              <div className="text-3xl font-extrabold text-white">
                <span>{hoursSaved}</span>{" "}
                <span className="text-lg text-zinc-500 font-normal">hrs/mo</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono uppercase">
                Freelance Budget Saved
              </div>
              <div className="text-3xl font-extrabold text-[#10B981]">
                ${costSaved}{" "}
                <span className="text-lg text-emerald-800 font-normal">/mo</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400 font-mono uppercase">
                Estimated Shorts Generated
              </div>
              <div className="text-3xl font-extrabold text-[#06B6D4]">
                <span>{shortsGenerated}</span>{" "}
                <span className="text-lg text-cyan-800 font-normal">clips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
