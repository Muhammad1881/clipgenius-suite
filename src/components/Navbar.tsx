import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 mt-4">
        <nav className="glass rounded-2xl flex items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="grid place-items-center size-8 rounded-lg bg-gradient-primary glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="text-lg">Clipra</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition">Features</a>
            <a href="/#how" className="hover:text-foreground transition">How it works</a>
            <Link to="/pricing" className="hover:text-foreground transition">Pricing</Link>
            <a href="/#faq" className="hover:text-foreground transition">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Sign in</Link>
            <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl">
              <Link to="/dashboard">Get started</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
