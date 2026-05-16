import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, Play, MoreHorizontal, TrendingUp, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const projects = [
  { title: "Podcast Ep. 42 — Lex Friedman", date: "2 hours ago", clips: 12, score: 94, status: "Ready" },
  { title: "Webinar: AI in 2026", date: "Yesterday", clips: 8, score: 88, status: "Ready" },
  { title: "Vlog — Tokyo Day 3", date: "3 days ago", clips: 6, score: 76, status: "Ready" },
  { title: "Interview with Sarah K.", date: "Last week", clips: 14, score: 91, status: "Ready" },
];

const stats = [
  { label: "Videos this month", value: "18", icon: Play, change: "+24%" },
  { label: "Clips generated", value: "240", icon: Sparkles, change: "+38%" },
  { label: "Avg viral score", value: "87", icon: TrendingUp, change: "+6%" },
  { label: "Processing time saved", value: "42h", icon: Clock, change: "+12h" },
];

function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back, Alex 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your shorts pipeline.</p>
        </div>
        <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl glow">
          <Link to="/upload"><Upload className="size-4 mr-2" /> New upload</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <s.icon className="size-5 text-accent" />
              <span className="text-xs text-accent">{s.change}</span>
            </div>
            <div className="mt-4 text-3xl font-display font-semibold">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Recent projects</h2>
            <Link to="/results" className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
          </div>
          <div className="space-y-2">
            {projects.map((p) => (
              <Link to="/results" key={p.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition">
                <div className="size-14 rounded-lg bg-gradient-to-br from-primary/40 to-accent/30 grid place-items-center shrink-0">
                  <Play className="size-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.date} · {p.clips} clips</div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-sm text-accent">
                  <TrendingUp className="size-3.5" /> {p.score}
                </div>
                <span className="hidden sm:inline text-xs glass px-2 py-1 rounded-md">{p.status}</span>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-strong rounded-2xl p-6 glow">
            <div className="text-xs uppercase tracking-widest text-accent">Credits</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-display font-semibold">240</span>
              <span className="text-muted-foreground text-sm">/ 500</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: "48%" }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Renews in 14 days. 1 credit ≈ 1 minute of video.</p>
            <Button asChild className="mt-5 w-full bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
              <Link to="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="font-semibold">💡 Tip of the day</div>
            <p className="text-sm text-muted-foreground mt-2">Add a hook in the first 1.5 seconds — Clipra's data shows it doubles retention on TikTok.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
