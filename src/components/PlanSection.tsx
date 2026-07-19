import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Clock, Calendar, Gauge, ExternalLink, AlertTriangle, XCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { getSubscriptionInfo, createCustomerPortalSession, cancelSubscriptionNow } from "@/lib/billing.functions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function PlanSection() {
  const { user } = useAuth();
  const { profile, refetch } = useProfile();
  const getInfo = useServerFn(getSubscriptionInfo);
  const openPortal = useServerFn(createCustomerPortalSession);
  const cancelNow = useServerFn(cancelSubscriptionNow);
  const [renewal, setRenewal] = useState<string | null>(null);
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const isPaid = !!profile?.plan && profile.plan !== "free";

  useEffect(() => {
    if (!user || !isPaid) return;
    setRenewalLoading(true);
    getInfo({})
      .then((r) => setRenewal(r?.renewal_date ?? null))
      .catch(() => setRenewal(null))
      .finally(() => setRenewalLoading(false));
  }, [user, isPaid, getInfo]);

  if (!user || !profile) return null;

  const planLabel = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
  const used = profile.minutes_used;
  const total = profile.monthly_minutes;
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  const overQuota = used >= total;
  const nearQuota = !overQuota && pct >= 80;
  const barColor = overQuota
    ? "bg-destructive"
    : nearQuota
    ? "bg-amber-500"
    : "bg-gradient-vivid";

  const handlePortal = async () => {
    try {
      setPortalLoading(true);
      const r = await openPortal({ data: { origin: window.location.origin } });
      if (r?.url) window.location.href = r.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCancelNow = async () => {
    try {
      setCancelLoading(true);
      await cancelNow({});
      toast.success("Subscription cancelled. You're on the Free plan now.");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel subscription");
    } finally {
      setCancelLoading(false);
    }
  };

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
            <div className={`h-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          {overQuota && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
              <AlertTriangle className="size-3.5" /> Out of minutes
            </div>
          )}
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="size-3.5" /> Renews</div>
          <div className="mt-1.5 text-2xl font-display font-semibold">
            {!isPaid ? (
              "—"
            ) : renewalLoading ? (
              <span className="inline-block h-6 w-24 rounded-md bg-white/10 animate-pulse" />
            ) : renewal ? (
              new Date(renewal).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
            ) : (
              "—"
            )}
          </div>
        </div>
      </div>

      {isPaid && (
        <div className="mt-6 flex justify-end gap-2 flex-wrap">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={cancelLoading}
                className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <XCircle className="size-3.5 mr-1.5" />
                {cancelLoading ? "Cancelling…" : "Cancel & downgrade now"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-strong border-gradient">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel subscription immediately?</AlertDialogTitle>
                <AlertDialogDescription>
                  This cancels your paid plan right now, stops any pending charges,
                  and moves you to the Free plan (60 minutes/month). You won't be
                  charged again. You can re-subscribe anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Keep subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelNow}
                  className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Yes, cancel now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePortal}
            disabled={portalLoading}
            className="rounded-xl"
          >
            {portalLoading ? "Opening…" : <>Manage billing <ExternalLink className="size-3.5 ml-1.5" /></>}
          </Button>
        </div>
      )}
    </div>
  );
}
