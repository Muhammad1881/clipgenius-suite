import { Link } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#features", label: "Features" },
    { href: "/#how", label: "How it works" },
    { href: "/pricing", label: "Pricing", to: true },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className={`mx-auto max-w-7xl px-3 sm:px-4 transition-all duration-500 ${scrolled ? "mt-2" : "mt-4"}`}>
        <nav className={`glass rounded-2xl flex items-center justify-between px-4 sm:px-5 py-3 transition-all duration-500 ${scrolled ? "shadow-elevated" : ""}`}>
          <Link to="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="grid place-items-center size-8 rounded-lg bg-gradient-vivid glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="text-lg">Clipra</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
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
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="glass rounded-2xl p-4 flex flex-col gap-1">
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
