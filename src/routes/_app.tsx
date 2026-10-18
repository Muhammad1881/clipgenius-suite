import { Link, Outlet, useRouterState, useNavigate, createFileRoute, redirect } from "@tanstack/react-router";
import {
  LayoutGrid,
  UploadCloud,
  FolderArchive,
  CreditCard,
  LogOut,
  X,
  Menu,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { createCustomerPortalSession } from "@/lib/billing.functions";
import logo from "@/assets/logo.png";

// Toast context for dashboard feedback
interface ToastContextType {
  showToast: (title: string, msg: string) => void;
}
const ToastContext = createContext<ToastContextType>({ showToast: () => {} });
export const useDashboardToast = () => useContext(ToastContext);

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.pathname } });
    }
  },
  component: AppLayout,
});

export function AppLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openPortal = useServerFn(createCustomerPortalSession);
  const [portalLoading, setPortalLoading] = useState(false);

  const [toastData, setToastData] = useState<{ title: string; msg: string; visible: boolean }>({
    title: "",
    msg: "",
    visible: false,
  });

  const showToast = (title: string, msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastData({ title, msg, visible: true });
    toastTimeoutRef.current = setTimeout(() => {
      setToastData((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Performance-optimized mouse spotlight tracker
  useEffect(() => {
    let animationFrameId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    const updateGlowCards = () => {
      if (!latestEvent) return;
      const cards = document.querySelectorAll<HTMLElement>(".glow-card");
      if (cards.length > 0) {
        const clientX = latestEvent.clientX;
        const clientY = latestEvent.clientY;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
        });
      }
      animationFrameId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      latestEvent = e;
      if (!animationFrameId) animationFrameId = requestAnimationFrame(updateGlowCards);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [pathname]);

  const total = profile?.monthly_minutes ?? 60;
  const used = profile?.minutes_used ?? 0;
  const isPaid = !!profile?.plan && profile.plan !== "free";
  const planLabel = profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : "Free";

  const displayName =
    (user?.user_metadata?.display_name as string) ||
    (user?.user_metadata?.username as string) ||
    profile?.display_name ||
    user?.email?.split("@")[0] ||
    "Account";
  const email = user?.email ?? "";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    showToast("Signed Out", "Redirecting to login...");
    navigate({ to: "/login" });
  };

  const handlePortal = async () => {
    try {
      setPortalLoading(true);
      const r = await openPortal({ data: { origin: window.location.origin } });
      if (r?.url) window.location.href = r.url;
    } catch (e) {
      showToast("Billing", e instanceof Error ? e.message : "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const getBreadcrumbTitle = () => {
    if (pathname.includes("/upload")) return "Upload";
    if (pathname.includes("/results") || pathname.includes("/projects")) return "Projects";
    if (pathname.includes("/billing") || pathname.includes("/pricing")) return "Billing & Plan";
    return "Dashboard";
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, iconColor: "text-[#8B5CF6]", badge: null as React.ReactNode },
    {
      to: "/upload",
      label: "Upload Video",
      icon: UploadCloud,
      iconColor: "text-zinc-400",
      badge: (
        <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4] font-semibold">
          NEW
        </span>
      ),
    },
    { to: "/results", label: "Projects", icon: FolderArchive, iconColor: "text-zinc-400", badge: null as React.ReactNode },
    { to: "/pricing", label: "Billing & Plan", icon: CreditCard, iconColor: "text-zinc-400", badge: null as React.ReactNode },
  ];

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="h-[100dvh] flex overflow-hidden text-sm selection:bg-[#8B5CF6]/40 selection:text-white bg-[#07080E] text-[#F3F4F6] relative">
        {/* Ambient Backdrop Illumination */}
        <div className="ambient-glow w-[500px] h-[500px] bg-[#8B5CF6] top-[-100px] left-[-100px]" />
        <div className="ambient-glow w-[600px] h-[600px] bg-[#06B6D4] bottom-[-150px] right-[-100px] opacity-10" />
        <div className="ambient-glow w-[400px] h-[400px] bg-[#10B981] top-1/2 left-1/3 opacity-5" />

        {/* Feedback Toast Notification */}
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-5 right-5 z-50 transform transition-all duration-300 ease-out pointer-events-none flex items-center gap-3 glass-panel px-4 py-3 rounded-xl border border-[#10B981]/30 shadow-2xl ${
            toastData.visible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          <div>
            <div className="font-semibold text-xs text-white">{toastData.title}</div>
            <div className="text-[11px] text-zinc-400">{toastData.msg}</div>
          </div>
        </div>

        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`w-64 h-[100dvh] shrink-0 glass-panel border-r border-white/[0.08] flex flex-col justify-between fixed lg:sticky top-0 inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out overflow-hidden select-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-4 flex flex-col h-full justify-between overflow-hidden">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <img src={logo} alt="Clipra logo" className="w-8 h-8 rounded-lg" width={32} height={32} />
                  <div className="flex flex-col">
                    <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
                      Clipra
                    </span>
                    <span className="text-[9px] text-zinc-400 font-mono tracking-widest mt-1">
                      STUDIO
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary Nav Links */}
              <nav className="mt-4 space-y-1">
                {navLinks.map((item) => {
                  const isActive =
                    (item.to === "/dashboard" && pathname === "/dashboard") ||
                    (item.to === "/upload" && pathname.startsWith("/upload")) ||
                    (item.to === "/results" && (pathname.startsWith("/results") || pathname.startsWith("/projects"))) ||
                    (item.to === "/pricing" && (pathname.startsWith("/billing") || pathname.startsWith("/pricing")));

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-white bg-white/[0.08] border border-white/10 shadow-inner-glass"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? item.iconColor : "text-zinc-400"}`} />
                      <span>{item.label}</span>
                      {item.badge}
                    </Link>
                  );
                })}

                {/* Back to Website link */}
                <div className="pt-2 border-t border-white/[0.06] mt-2">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 text-zinc-400" />
                    <span>Back to Website</span>
                  </Link>
                </div>
              </nav>

              {/* Plan / minutes mini card */}
              <div className="mt-4 glass-panel rounded-2xl p-3.5 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold ${
                      isPaid
                        ? "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30"
                        : "bg-white/10 text-zinc-400 border border-white/10"
                    }`}
                  >
                    {planLabel} Plan
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  <span className="text-white font-semibold">{used}</span> / {total} mins used
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-black/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] rounded-full transition-all"
                    style={{ width: `${total > 0 ? Math.min(100, (used / total) * 100) : 0}%` }}
                  />
                </div>
                {!isPaid ? (
                  <Link
                    to="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 block text-center text-[11px] font-semibold rounded-lg py-2 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white hover:opacity-90 transition-opacity"
                  >
                    Upgrade plan
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="mt-3 w-full text-center text-[11px] font-medium text-zinc-300 hover:text-white rounded-lg py-2 border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    {portalLoading ? "Opening…" : "Manage billing"}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Section: User Account */}
            <div className="pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0">
                    {initial}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[110px]">
                      {email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 flex flex-col h-[100dvh] max-w-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Top App Bar */}
          <header className="h-16 border-b border-white/[0.08] glass-panel sticky top-0 z-30 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
                className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-zinc-600">app</span>
                <span className="text-zinc-600">/</span>
                <span className="text-white font-medium">{getBreadcrumbTitle()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-400" />
                <span>Back to Website</span>
              </Link>
            </div>
          </header>

          {/* Child Page View */}
          <Outlet />
        </div>
      </div>
    </ToastContext.Provider>
  );
}
