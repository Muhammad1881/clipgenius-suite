import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24 sm:mt-32 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-12 sm:py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="grid place-items-center size-8 rounded-lg bg-gradient-vivid glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            Clipra
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            Turn long videos into scroll-stopping shorts with AI.
          </p>
        </div>
        {[
          { t: "Product", l: ["Features", "Pricing", "Changelog", "Roadmap"] },
          { t: "Company", l: ["About", "Blog", "Careers", "Contact"] },
          { t: "Legal", l: ["Privacy", "Terms", "Security", "DPA"] },
        ].map((c) => (
          <div key={c.t}>
            <div className="text-sm font-semibold mb-3">{c.t}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.l.map((x) => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Clipra. Crafted for creators.
      </div>
    </footer>
  );
}
