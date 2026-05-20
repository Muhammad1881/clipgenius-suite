import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Try Clipra and create your first viral clips.",
    features: ["3 videos / month", "Up to 15 min uploads", "720p exports", "Auto captions"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For creators serious about going viral.",
    features: ["50 videos / month", "Up to 2 hr uploads", "1080p exports", "AI viral scoring", "Custom branding", "Priority queue"],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Business",
    price: "$99",
    desc: "Built for teams and agencies at scale.",
    features: ["Unlimited videos", "4K exports", "Team workspaces", "API access", "Dedicated support", "Custom AI fine-tune"],
    cta: "Contact sales",
  },
];

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`relative rounded-3xl p-7 sm:p-8 border-gradient hover-lift ${
            p.featured
              ? "glass-strong glow md:-translate-y-2"
              : "glass"
          }`}
        >
          {p.featured && (
            <>
              <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-gradient-vivid text-primary-foreground font-medium shadow-card flex items-center gap-1">
                <Sparkles className="size-3" /> Most popular
              </div>
            </>
          )}
          <div className="text-sm text-muted-foreground uppercase tracking-wider">{p.name}</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-5xl font-display font-semibold tracking-tight">{p.price}</span>
            <span className="text-muted-foreground text-sm">/mo</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
          <Button
            asChild
            className={`w-full mt-6 rounded-xl h-11 ${
              p.featured
                ? "btn-premium"
                : "glass hover:bg-white/10 border border-white/10 transition-all"
            }`}
          >
            <Link to="/dashboard">{p.cta}</Link>
          </Button>
          <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <ul className="space-y-3 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className={`grid place-items-center size-5 rounded-full ${p.featured ? "bg-gradient-vivid" : "bg-white/5"}`}>
                  <Check className={`size-3 ${p.featured ? "text-primary-foreground" : "text-accent"}`} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
