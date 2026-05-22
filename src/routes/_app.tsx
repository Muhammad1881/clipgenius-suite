import { Link, Outlet, useRouterState, useNavigate, createFileRoute, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Upload, FolderOpen, CreditCard, Sparkles, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl p-4 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold px-2 py-3">
          <span className="grid place-items-center size-8 rounded-lg bg-gradient-vivid glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </span>
          Clipra
        </Link>
        <nav className="mt-6 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.to;
            return (
              <Link key={n.to} to={n.to}
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Credits</span><span className="text-foreground font-medium">30 / 30</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-vivid" style={{ width: "100%" }} />
            </div>
            <Link to="/pricing" className="btn-premium mt-3 block text-center text-xs rounded-lg py-2 font-medium">
              Upgrade plan
            </Link>
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
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
