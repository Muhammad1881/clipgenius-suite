import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, TrendingUp, Clock, CalendarClock, BadgeCheck, Sparkles, Gauge, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { getSubscriptionInfo } from "@/lib/billing.functions";
import { Tilt3D } from "@/components/Tilt3D";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function Dashboard() {
  const { profile, loading } = useProfile();

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
  // Free plan: minutes reset 30 days after cycle_start
  const freeResetLabel = profile?.cycle_start
    ? new Date(new Date(profile.cycle_start).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
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
        <Tilt3D max={4} lift={4} className="lg:col-span-2 glass-strong rounded-2xl p-6 sm:p-7 border-gradient">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center size-10 rounded-xl bg-gradient-vivid shadow-card">
                <Sparkles className="size-5 text-primary-foreground" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-widest text-accent">Your plan</div>
                <div className="text-xl font-display font-semibold tracking-tight">{planLabel} Plan</div>
              </div>
            </div>
            <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium ${
              isPaid ? "bg-gradient-vivid text-primary-foreground" : "glass border border-white/10 text-muted-foreground"
            }`}>
              {isPaid ? "Active" : "Free"}
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Gauge className="size-3.5" /> Monthly minutes</div>
              <div className="mt-1.5 text-2xl font-display font-semibold">{total}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="size-3.5" /> Used this cycle</div>
              <div className="mt-1.5 text-2xl font-display font-semibold">{used} <span className="text-sm text-muted-foreground font-normal">/ {total}</span></div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full transition-all ${barColor}`} style={{ width: `${usedPct}%` }} />
              </div>
            </div>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" /> {isPaid ? "Renews" : "Minutes reset"}
              </div>
              <div className="mt-1.5 text-2xl font-display font-semibold">
                {isPaid
                  ? (renewalLabel ?? <span className="inline-block h-6 w-24 rounded-md bg-white/10 animate-pulse" />)
                  : (freeResetLabel ?? "—")}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            {isPaid
              ? "Your subscription renews automatically. Manage billing or cancel anytime from the Billing page."
              : `Free plan includes ${total} minutes every 30 days${freeResetLabel ? ` — your minutes reset on ${freeResetLabel}` : ""}. Upgrade for more minutes, 1080p and no watermark.`}
          </p>
        </Tilt3D>

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
                <span>{freeResetLabel ? <>Minutes reset on <span className="text-foreground font-medium">{freeResetLabel}</span></> : "Your 60 free minutes reset every 30 days."}</span>
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
