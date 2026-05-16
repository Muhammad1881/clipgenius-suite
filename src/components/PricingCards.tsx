import { Check } from "lucide-react";
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
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`relative rounded-3xl p-8 ${p.featured ? "glass-strong glow" : "glass"}`}
        >
          {p.featured && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground font-medium">
              Most popular
            </div>
          )}
          <div className="text-sm text-muted-foreground">{p.name}</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-display font-semibold">{p.price}</span>
            <span className="text-muted-foreground text-sm">/mo</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{p.desc}</p>
          <Button
            asChild
            className={`w-full mt-6 rounded-xl ${p.featured ? "bg-gradient-primary text-primary-foreground hover:opacity-90" : "glass hover:bg-white/10"}`}
          >
            <Link to="/dashboard">{p.cta}</Link>
          </Button>
          <ul className="mt-7 space-y-3 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="size-4 text-accent" /> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
