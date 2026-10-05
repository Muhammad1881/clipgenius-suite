import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24 sm:mt-32 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-12 sm:py-14 grid sm:grid-cols-2 md:grid-cols-5 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-lg">
            <img src={logo} alt="Clipra logo" className="size-8 rounded-lg glow" width={32} height={32} loading="lazy" />
            Clipra
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Turn long videos into scroll-stopping shorts with AI.
          </p>
        </div>
        {[
          { t: "Product", l: [["Pricing", "/pricing"], ["Sign up", "/signup"], ["Sign in", "/login"]] },
          { t: "Tools", l: [["AI Clip Generator", "/ai-clip-generator"], ["YouTube Shorts Generator", "/youtube-shorts-generator"], ["Podcast Clip Maker", "/podcast-clip-maker"], ["TikTok Clip Maker", "/tiktok-clip-maker"], ["Instagram Reels Maker", "/instagram-reels-maker"]] },
          { t: "Resources", l: [["Blog", "/blog"], ["Clipra vs Opus Clip", "/blog/clipra-vs-opus-clip"], ["Best AI clip tools", "/blog/best-ai-clip-generators-2026"], ["Podcast → Shorts guide", "/blog/how-to-repurpose-podcasts-into-shorts"]] },
          { t: "Company", l: [["Trust & Security", "/trust"], ["Contact", "mailto:support@theclipra.com"]] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-sm font-semibold mb-3">{c.t}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.l.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-foreground">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Clipra. Crafted for creators.
      </div>
    </footer>
  );
}
