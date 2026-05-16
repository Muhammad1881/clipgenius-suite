import { createFileRoute } from "@tanstack/react-router";
import { Download, Copy, RefreshCw, Play, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/_app/results")({ component: Results });

const clips = [
  { title: "The one thing nobody tells you about AI...", score: 96, duration: "0:42", views: "Hook + payoff" },
  { title: "Why 99% of creators fail at shorts", score: 92, duration: "0:38", views: "Controversial take" },
  { title: "I tried this for 30 days and...", score: 88, duration: "0:51", views: "Story arc" },
  { title: "The exact moment everything changed", score: 85, duration: "0:29", views: "Emotional peak" },
  { title: "You're doing this wrong (here's how to fix it)", score: 82, duration: "0:47", views: "Tutorial" },
  { title: "Nobody is talking about this", score: 78, duration: "0:35", views: "Insight" },
];

function Results() {
  const [copied, setCopied] = useState<number | null>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent">Project</div>
          <h1 className="text-3xl font-semibold mt-1">Podcast Ep. 42 — Lex Friedman</h1>
          <p className="text-muted-foreground mt-1">{clips.length} viral clips generated · 47 min source</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="glass hover:bg-white/10 rounded-xl"><RefreshCw className="size-4 mr-2" /> Regenerate all</Button>
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl"><Download className="size-4 mr-2" /> Download all</Button>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {clips.map((c, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden group hover:bg-white/[0.07] transition">
            <div className="aspect-[9/16] relative bg-gradient-to-br from-primary/40 via-card to-accent/30 grid place-items-center">
              <button className="size-14 rounded-full bg-white/90 text-background grid place-items-center hover:scale-110 transition">
                <Play className="size-5 fill-current ml-0.5" />
              </button>
              <div className="absolute top-3 left-3 glass px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <TrendingUp className="size-3 text-accent" /> <span className="text-accent font-medium">{c.score}</span>
              </div>
              <div className="absolute top-3 right-3 glass px-2 py-1 rounded-md text-xs">{c.duration}</div>
              <div className="absolute bottom-3 inset-x-3 text-center">
                <div className="text-[11px] uppercase tracking-wider text-white/70">Caption preview</div>
                <div className="text-sm font-bold text-white drop-shadow-lg mt-1 line-clamp-2">{c.title}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground">{c.views}</div>
              <div className="font-medium mt-1 line-clamp-2 text-sm">{c.title}</div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-lg">
                  <Download className="size-3.5 mr-1.5" /> Download
                </Button>
                <Button size="sm" variant="ghost" className="glass hover:bg-white/10 rounded-lg"
                  onClick={() => { navigator.clipboard?.writeText(c.title); setCopied(i); setTimeout(() => setCopied(null), 1500); }}>
                  {copied === i ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
                <Button size="sm" variant="ghost" className="glass hover:bg-white/10 rounded-lg">
                  <RefreshCw className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
