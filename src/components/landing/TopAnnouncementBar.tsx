export function TopAnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#8B5CF6]/20 via-[#06B6D4]/20 to-[#8B5CF6]/20 border-b border-white/10 py-2 px-4 text-center text-xs font-medium text-zinc-300 flex items-center justify-center gap-2 relative z-50 backdrop-blur-md">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#8B5CF6]/30 text-[#06B6D4] text-[11px]">
        ⚡
      </span>
      <span>New: AI hook generator for TikTok is live</span>
      <a
        href="#features"
        className="underline underline-offset-4 text-white hover:text-[#06B6D4] transition-colors ml-1"
      >
        Explore Feature &rarr;
      </a>
    </div>
  );
}
