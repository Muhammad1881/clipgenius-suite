import { Link, Outlet, useRouterState, createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Upload, FolderOpen, CreditCard, Settings, Sparkles, LogOut } from "lucide-react";

export const Route = createFileRoute("/_app")({ component: AppLayout });

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/results", label: "Projects", icon: FolderOpen },
  { to: "/pricing", label: "Billing", icon: CreditCard },
];

function AppLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-sidebar p-4">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold px-2 py-3">
          <span className="grid place-items-center size-8 rounded-lg bg-gradient-primary glow">
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
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Credits</span><span className="text-foreground font-medium">240 / 500</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: "48%" }} />
            </div>
            <Link to="/pricing" className="mt-3 block text-center text-xs rounded-lg bg-gradient-primary text-primary-foreground py-2 font-medium">
              Upgrade plan
            </Link>
          </div>
          <div className="flex items-center gap-3 p-2">
            <div className="size-9 rounded-full bg-gradient-primary" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Alex Morgan</div>
              <div className="text-xs text-muted-foreground truncate">alex@studio.io</div>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><Settings className="size-4" /></button>
          </div>
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2">
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
