import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Scissors,
  ChevronDown,
  Sparkles,
  Youtube,
  Mic,
  Music2,
  Instagram,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { isGuestMode } from "@/lib/guest-auth";
import { supabase } from "@/integrations/supabase/client";

const tools = [
  {
    to: "/ai-clip-generator",
    label: "AI Clip Generator",
    desc: "Long video to short form",
    icon: Sparkles,
    colorClass: "bg-[#8B5CF6]/20 text-[#8B5CF6]",
  },
  {
    to: "/youtube-shorts-generator",
    label: "YouTube Shorts Generator",
    desc: "Optimize for YouTube reach",
    icon: Youtube,
    colorClass: "bg-red-500/20 text-red-400",
  },
  {
    to: "/podcast-clip-maker",
    label: "Podcast Clip Maker",
    desc: "Speaker-tracked interviews",
    icon: Mic,
    colorClass: "bg-[#06B6D4]/20 text-[#06B6D4]",
  },
  {
    to: "/tiktok-clip-maker",
    label: "TikTok Clip Maker",
    desc: "Viral hooks & hashtags",
    icon: Music2,
    colorClass: "bg-cyan-500/20 text-cyan-300",
  },
  {
    to: "/instagram-reels-maker",
    label: "Instagram Reels Maker",
    desc: "Clean 9:16 aesthetic crops",
    icon: Instagram,
    colorClass: "bg-pink-500/20 text-pink-400",
  },
];

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-40 glass-panel border-b border-white/[0.07] transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] p-[1px] shadow-lg shadow-[#8B5CF6]/20">
            <div className="w-full h-full bg-[#0F111A] rounded-xl flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
              <Scissors className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
              Clipra
            </span>
            <span className="text-[9px] text-zinc-400 font-mono tracking-wider">
              theclipra.com
            </span>
          </div>
        </Link>

        {/* Center Nav Links + Dropdown Tools */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            {/* Tools Dropdown */}
            <div className="relative group py-2">
              <button
                type="button"
                className="flex items-center gap-1.5 hover:text-white transition-colors py-1 focus:outline-none"
              >
                <span>Tools</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 w-64 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="glass-panel p-2 rounded-2xl shadow-2xl border border-white/10 space-y-1">
                  {tools.map((t) => (
                    <Link
                      key={t.to}
                      to={t.to}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.colorClass}`}
                      >
                        <t.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {t.label}
                        </div>
                        <div className="text-[10px] text-zinc-500">{t.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="#footer" className="hover:text-white transition-colors">
              Contact us
            </a>
          </nav>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-4">
          {authed ? (
            <Link
              to="/dashboard"
              className="relative group px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="relative group px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm transition-all hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.18)]"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] opacity-0 group-hover:opacity-15 transition-opacity" />
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl glass-panel text-zinc-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 px-6 py-4 space-y-3">
          <div>
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className="w-full flex items-center justify-between text-sm font-medium text-zinc-300 py-2"
            >
              <span>Tools</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileToolsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileToolsOpen && (
              <div className="pl-3 space-y-2 pt-1 pb-2">
                {tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-white py-1"
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-zinc-300 py-1.5"
          >
            Features
          </a>
          <a
            href="#workflow"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-zinc-300 py-1.5"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-zinc-300 py-1.5"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-medium text-zinc-300 py-1.5"
          >
            FAQ
          </a>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-zinc-300"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
