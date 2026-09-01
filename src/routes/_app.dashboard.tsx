import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, TrendingUp, Clock, CalendarClock, BadgeCheck, Sparkles, Gauge, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { getSubscriptionInfo } from "@/lib/billing.functions";
import { Tilt3D } from "@/components/Tilt3D";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

// Real user data would come from the backend. New users start with no projects.
const userProjects: Array<{ title: string; date: string; clips: number; score: number; status: string }> = [];

function Dashboard() {
  const { profile, loading } = useProfile();
  const hasProjects = userProjects.length > 0;

  const total = profile?.monthly_minutes ?? 30;
  const used = profile?.minutes_used ?? 0;
  const remaining = Math.max(0, total - used);
  const usedPct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const overQuota = !loading && !!profile && used >= total;
  const nearQuota = !overQuota && usedPct >= 80;
  const barColor = overQuota ? "bg-destructive" : nearQuota ? "bg-amber-500" : "bg-gradient-vivid";
  const planLabel = profile?.plan
    ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)
    : "Free";
  const isPaid = !!profile?.plan && profile.plan !== "free";

  const getInfo = useServerFn(getSubscriptionInfo);
  const [renewal, setRenewal] = useState<string | null>(null);
  useEffect(() => {
    if (!isPaid) return;
    let alive = true;
    getInfo({})
      .then((r) => { if (alive) setRenewal(r?.renewal_date ?? null); })
      .catch(() => {});
    return () => { alive = false; };
  }, [isPaid, getInfo]);
  const renewalLabel = renewal
    ? new Date(renewal).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;

  const stats = [
    { label: "Remaining minutes", value: loading ? "—" : String(remaining), icon: Clock, change: "—" },
    { label: "Avg viral score", value: "—", icon: TrendingUp, change: "—" },
    { label: "Processing time saved", value: "0h", icon: Clock, change: "—" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto relative">
      <div className="absolute inset-x-0 top-0 h-80 bg-mesh opacity-50 -z-10 pointer-events-none" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Welcome to Clipra 👋</h1>
          <p className="text-muted-foreground mt-1.5">Upload your first video to start generating viral shorts.</p>
        </div>
        <Button asChild className="btn-premium rounded-xl h-11 px-5">
          <Link to="/upload"><Upload className="size-4 mr-2" /> New upload</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {stats.map((s) => (
          <Tilt3D key={s.label} max={7} lift={6} className="glass rounded-2xl p-5 border-gradient">
            <div className="flex items-center justify-between">
              <div className="size-9 rounded-lg bg-gradient-vivid grid place-items-center shadow-card">
                <s.icon className="size-4 text-primary-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{s.change}</span>
            </div>
            <div className="mt-4 text-3xl font-display font-semibold tracking-tight">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </Tilt3D>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-5 sm:p-6 border-gradient">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold tracking-tight">Your projects</h2>
            {hasProjects && (
              <Link to="/results" className="text-sm text-muted-foreground hover:text-foreground transition-colors">View all →</Link>
            )}
          </div>

          {hasProjects ? (
            <div className="space-y-1.5">
              {/* Real projects render here once the backend is wired up */}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.015]">
              <div className="mx-auto size-14 rounded-2xl glass grid place-items-center mb-4">
                <FolderOpen className="size-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold tracking-tight">No projects yet</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed">
                Your uploaded videos and generated clips will appear here. Get started with your first upload.
              </p>
              <Button asChild className="btn-premium rounded-xl h-10 px-5 mt-5">
                <Link to="/upload"><Upload className="size-4 mr-2" /> Upload your first video</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div className="glass-strong rounded-2xl p-6 glow border-gradient relative overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-60 animate-aurora" style={{background: "var(--gradient-mesh)"}} />
            <div className="text-xs uppercase tracking-widest text-accent">Remaining minutes</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-display font-semibold tracking-tight">{loading ? "—" : remaining}</span>
              <span className="text-muted-foreground text-sm">/ {total}</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full transition-all ${barColor}`} style={{ width: `${usedPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              {overQuota
                ? "You've used all your minutes this cycle."
                : `${planLabel} plan. 1 minute per minute of video processed.`}
            </p>
            <Button asChild className="mt-5 w-full btn-premium rounded-xl">
              <Link to="/pricing">{isPaid ? "Manage plan" : "Upgrade plan"}</Link>
            </Button>
          </div>
          <div className="glass rounded-2xl p-6 border-gradient">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className={`size-4 ${isPaid ? "text-accent" : "text-muted-foreground"}`} />
                <span className="font-semibold tracking-tight">{planLabel} plan</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${isPaid ? "bg-gradient-vivid text-primary-foreground border-transparent" : "glass border-white/10 text-muted-foreground"}`}>
                {isPaid ? "Active" : "Free"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4 shrink-0" />
              {isPaid ? (
                <span>{renewalLabel ? <>Renews on <span className="text-foreground font-medium">{renewalLabel}</span></> : "Renewal date loading…"}</span>
              ) : (
                <span>Your 60 free minutes reset every 30 days.</span>
              )}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{used}</span> / {total} minutes used this cycle
            </div>
            <Button asChild variant="ghost" className="mt-4 w-full glass border border-white/10 rounded-xl h-10">
              <Link to="/pricing">{isPaid ? "Manage subscription" : "See plans"}</Link>
            </Button>
          </div>

          <div className="glass rounded-2xl p-6 border-gradient">
            <div className="font-semibold tracking-tight">💡 Tip of the day</div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Add a hook in the first 1.5 seconds — Clipra's data shows it doubles retention on TikTok.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
