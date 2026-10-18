import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function PreFooterCta() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      navigate({ to: "/upload" });
    } else {
      navigate({ to: "/upload" });
    }
  };

  return (
    <section className="py-20 px-6 border-t border-white/[0.07] relative overflow-hidden" id="convert">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B5CF6]/10 to-transparent pointer-events-none" />

      <div className="max-w-[1000px] mx-auto text-center glass-panel p-10 md:p-16 rounded-3xl border border-white/10 relative z-10 shadow-2xl">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
          Ready to clip your first video?
        </h2>
        <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          Drop in one long video. Turn hours of footage into a week of viral posts in minutes.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube link or drag video..."
            className="flex-grow bg-black/70 border border-zinc-700 rounded-xl px-5 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#06B6D4] transition-colors font-mono"
          />
          <button
            type="submit"
            className="bg-white text-black px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
          >
            Upload a video <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-zinc-500 mt-4 font-mono">
          60 free minutes monthly · No credit card required
        </p>
      </div>
    </section>
  );
}
