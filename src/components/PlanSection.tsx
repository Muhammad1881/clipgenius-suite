import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Clock, Calendar, Gauge } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { getSubscriptionInfo } from "@/lib/billing.functions";

export function PlanSection() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const getInfo = useServerFn(getSubscriptionInfo);
  const [renewal, setRenewal] = useState<string | null>(null);

  const isPaid = profile?.plan && profile.plan !== "free";

  useEffect(() => {
    if (!user || !isPaid) return;
    getInfo({})
      .then((r) => setRenewal(r?.renewal_date ?? null))
      .catch(() => setRenewal(null));
  }, [user, isPaid, getInfo]);

  if (!user || !profile) return null;

  const planLabel = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
  const used = profile.minutes_used;
  const total = profile.monthly_minutes;
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;

  return (
    <div className="glass-strong rounded-3xl p-7 sm:p-8 border-gradient max-w-3xl mx-auto mb-12">
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
        {isPaid && (
          <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-vivid text-primary-foreground font-medium">
            Active
          </span>
        )}
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
            <div className="h-full bg-gradient-vivid" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="size-3.5" /> Renews</div>
          <div className="mt-1.5 text-2xl font-display font-semibold">
            {renewal ? new Date(renewal).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
