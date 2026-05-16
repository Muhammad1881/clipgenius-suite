import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="grid place-items-center size-8 rounded-lg bg-gradient-primary">
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
