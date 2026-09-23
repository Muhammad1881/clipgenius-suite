import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const tools = [
  { to: "/ai-clip-generator", label: "AI Clip Generator" },
  { to: "/youtube-shorts-generator", label: "YouTube Shorts Generator" },
  { to: "/podcast-clip-maker", label: "Podcast Clip Maker" },
  { to: "/tiktok-clip-maker", label: "TikTok Clip Maker" },
  { to: "/instagram-reels-maker", label: "Instagram Reels Maker" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing", to: true },
    { href: "/#faq", label: "FAQ" },
    { href: "mailto:muhammad.bhatti1616@gmail.com", label: "Contact us" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className={`mx-auto max-w-7xl px-3 sm:px-4 transition-all duration-500 ${scrolled ? "mt-2" : "mt-4"}`}>
        <nav className={`glass rounded-2xl flex items-center justify-between px-4 sm:px-5 py-3 transition-all duration-500 ${scrolled ? "shadow-elevated" : ""}`}>
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <img src={logo} alt="Clipra logo" className="size-8 rounded-lg glow" width={32} height={32} />
            <span className="text-lg">Clipra</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {/* Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                onClick={() => setToolsOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={toolsOpen}
              >
                Tools <ChevronDown className={`size-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 ${
                  toolsOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
                }`}
              >
                <div className="glass rounded-2xl p-2 min-w-[240px] shadow-elevated">
                  {tools.map((t) => (
                    <Link
                      key={t.to}
                      to={t.to}
                      className="block px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {links.map((l) => l.to ? (
              <Link key={l.label} to={l.href} className="hover:text-foreground transition-colors">{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} className="hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline transition-colors">Sign in</Link>
            <Button asChild size="sm" className="btn-premium rounded-xl hidden sm:inline-flex">
              <Link to="/signup">Get started</Link>
            </Button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden grid place-items-center size-9 rounded-lg glass hover:bg-white/10 transition"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="glass rounded-2xl p-4 flex flex-col gap-1">
            {/* Mobile Tools */}
            <button
              onClick={() => setMobileToolsOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition"
            >
              <span>Tools</span>
              <ChevronDown className={`size-4 transition-transform ${mobileToolsOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileToolsOpen ? "max-h-96" : "max-h-0"}`}>
              <div className="pl-3 flex flex-col gap-1">
                {tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            </div>
            {links.map((l) => l.to ? (
              <Link key={l.label} to={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition">{l.label}</Link>
            ) : (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition">{l.label}</a>
            ))}
            <Button asChild size="sm" className="btn-premium rounded-xl mt-2">
              <Link to="/signup" onClick={() => setOpen(false)}>Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
