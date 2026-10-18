import { ShieldCheck, Youtube, Music2, Instagram, Mic } from "lucide-react";

const marqueeItems = [
  {
    type: "label",
    icon: Youtube,
    iconColor: "text-red-500",
    text: "YouTube Shorts",
  },
  {
    type: "stat",
    val: "3.8M+",
    color: "text-white",
    desc: "Clips Exported",
  },
  {
    type: "label",
    icon: Music2,
    iconColor: "text-[#06B6D4]",
    text: "TikTok Trending",
  },
  {
    type: "stat",
    val: "97%",
    color: "text-[#10B981]",
    desc: "Viral Retention",
  },
  {
    type: "label",
    icon: Instagram,
    iconColor: "text-pink-500",
    text: "Instagram Reels",
  },
  {
    type: "stat",
    val: "14.2x",
    color: "text-[#06B6D4]",
    desc: "Faster Than Manual",
  },
  {
    type: "label",
    icon: Mic,
    iconColor: "text-[#8B5CF6]",
    text: "Top Podcasts",
  },
];

export function SocialMarquee() {
  return (
    <section className="border-y border-white/[0.07] bg-[#0F111A]/40 py-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 mb-4 flex justify-between items-center">
        <p className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
          TRUSTED BY PODCASTERS, CREATORS & EDITORIAL TEAMS WORLDWIDE
        </p>
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Watermark-Free on Paid Plans</span>
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#07080E] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#07080E] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee whitespace-nowrap items-center gap-16 px-8">
          {/* Loop twice for seamless infinite marquee */}
          {[...marqueeItems, ...marqueeItems].map((item, idx) => {
            if (item.type === "label") {
              const Icon = item.icon!;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-zinc-300 font-display font-semibold text-lg"
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  <span>{item.text}</span>
                </div>
              );
            }
            return (
              <div
                key={idx}
                className={`text-xl font-bold font-mono ${item.color}`}
              >
                {item.val}{" "}
                <span className="text-xs text-zinc-500 font-sans block -mt-1 font-normal">
                  {item.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
