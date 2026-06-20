import { Link, Outlet, useRouterState, useNavigate, createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Upload, FolderOpen, CreditCard, Sparkles, LogOut, Menu, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { createCustomerPortalSession } from "@/lib/billing.functions";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.pathname } });
    }
  },
  component: AppLayout,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/results", label: "Projects", icon: FolderOpen },
  { to: "/pricing", label: "Billing", icon: CreditCard },
];

function AppLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const openPortal = useServerFn(createCustomerPortalSession);
  const [portalLoading, setPortalLoading] = useState(false);

  const total = profile?.monthly_minutes ?? 30;
  const used = profile?.minutes_used ?? 0;
  const usedPct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const overQuota = !!profile && used >= total;
  const nearQuota = !overQuota && usedPct >= 80;
  const barColor = overQuota ? "bg-destructive" : nearQuota ? "bg-amber-500" : "bg-gradient-vivid";
  const isPaid = !!profile?.plan && profile.plan !== "free";
  const planLabel = profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : "Free";

  const displayName = (user?.user_metadata?.display_name as string)
    || (user?.user_metadata?.username as string)
    || user?.email?.split("@")[0]
    || "Account";
  const email = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/login" });
  };

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

  const SidebarBody = (
    <>
      <Link to="/" className="flex items-center gap-2 font-display font-semibold px-2 py-3" onClick={() => setMobileOpen(false)}>
        <span className="grid place-items-center size-8 rounded-lg bg-gradient-vivid glow">
          <Sparkles className="size-4 text-primary-foreground" />
        </span>
        Clipra
      </Link>
      <nav className="mt-6 space-y-1">
        {nav.map((n) => {
          const active = pathname === n.to;
          return (
            <Link key={n.to} to={n.to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active ? "glass-strong text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}>
              <n.icon className="size-4" /> {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="glass rounded-2xl p-4 border-gradient">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium ${
              isPaid ? "bg-gradient-vivid text-primary-foreground" : "bg-white/10 text-muted-foreground"
            }`}>
              {planLabel} Plan
            </span>
            {overQuota && (
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-medium">
                Over
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{used}</span> / {total} minutes used
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className={`h-full transition-all ${barColor}`} style={{ width: `${usedPct}%` }} />
          </div>
          {!isPaid ? (
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="btn-premium mt-3 block text-center text-xs rounded-lg py-2 font-medium">
              Upgrade plan
            </Link>
          ) : (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-lg py-2 border border-white/10"
            >
              {portalLoading ? "Opening…" : <>Manage billing <ExternalLink className="size-3" /></>}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 p-2">
          <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-sm font-semibold text-primary-foreground shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground truncate">{email}</div>
          </div>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 transition-colors">
          <LogOut className="size-3.5" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl p-4 sticky top-0 h-screen">
        {SidebarBody}
      </aside>

      <main className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="grid place-items-center size-7 rounded-lg bg-gradient-vivid glow">
              <Sparkles className="size-3.5 text-primary-foreground" />
            </span>
            Clipra
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-medium ${
              isPaid ? "bg-gradient-vivid text-primary-foreground" : "bg-white/10 text-muted-foreground"
            }`}>
              {planLabel}
            </span>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="grid place-items-center size-9 rounded-lg border border-white/10 hover:bg-white/5">
                  <Menu className="size-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar/95 backdrop-blur-xl p-4 flex flex-col">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                {SidebarBody}
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
