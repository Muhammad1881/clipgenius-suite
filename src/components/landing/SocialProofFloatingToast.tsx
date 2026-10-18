export function SocialProofFloatingToast() {
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-float pointer-events-none hidden md:flex items-center gap-3 glass-panel px-4 py-2.5 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-white/10">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]" />
      </div>
      <span className="text-xs font-medium text-zinc-200">
        New clip generated:{" "}
        <span className="text-[#10B981] font-semibold">97% Viral Score</span>{" "}
        (Cristiano on life in Saudi)
      </span>
      <span className="text-[11px] text-zinc-500 border-l border-zinc-700 pl-3">
        Just now
      </span>
    </div>
  );
}
