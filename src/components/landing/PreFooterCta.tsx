import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreFooterCta() {

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

        <Button asChild size="lg" className="gap-2">
          <Link to="/upload">Upload a video <ArrowRight className="w-4 h-4" /></Link>
        </Button>

        <p className="text-xs text-zinc-500 mt-4 font-mono">
          60 free minutes monthly · No credit card required
        </p>
      </div>
    </section>
  );
}
