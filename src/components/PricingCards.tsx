import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { createCheckoutSession, type PlanKey } from "@/lib/billing.functions";

type FeatureGroup = { label: string; items: string[]; note?: string };

type Plan = {
  name: string;
  price: string;
  desc: string;
  features?: string[];
  groups?: FeatureGroup[];
  cta: string;
  featured?: boolean;
  planKey?: PlanKey;
};

const AI_VIDEO_FEATURES = [
  "AI Auto Reframing",
  "Smart Subject Tracking",
  "Head Framing",
  "Camera Smoothing",
  "Dead Zone Stabilization",
];

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    desc: "Try Clipra and create your first viral clips.",
    features: [
      "60 minutes / month",
      "Upload videos up to 30 minutes",
      "Maximum 5 clips per video",
      "AI viral detection",
      "Auto subtitles",
      "HD exports (with Clipra watermark)",
      "7-day project history",
    ],
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "$13.99",
    desc: "For creators getting serious about shorts.",
    groups: [
      {
        label: "Essentials",
        items: [
          "300 minutes / month",
          "Upload videos up to 60 minutes",
          "Maximum 10 clips per video",
          "Auto subtitles",
          "HD exports",
          "No watermark",
          "30-day project history",
        ],
      },
      {
        label: "AI Content",
        items: ["AI Viral Detection", "AI Captions", "AI Titles", "AI Hashtags"],
      },
      {
        label: "AI Video",
        items: AI_VIDEO_FEATURES,
      },
    ],
    cta: "Get Starter",
    planKey: "starter",
  },
  {
    name: "Creator",
    price: "$19",
    desc: "Built for power creators who publish daily.",
    groups: [
      {
        label: "Essentials",
        items: [
          "500 minutes / month",
          "Upload videos up to 120 minutes",
          "Maximum 10 clips per video",
          "Auto subtitles",
          "HD exports",
          "No watermark",
          "Unlimited project history",
          "Priority processing",
        ],
      },
      {
        label: "AI Content",
        items: ["AI Viral Detection", "AI Captions", "AI Titles", "AI Hashtags"],
      },
      {
        label: "AI Video",
        items: AI_VIDEO_FEATURES,
      },
      {
        label: "Premium AI",
        items: ["Future Premium AI Features"],
        note: "Includes all upcoming premium AI upgrades at no additional cost.",
      },
    ],
    cta: "Get Creator",
    featured: true,
    planKey: "creator",
  },
];


export function PricingCards() {
  const checkout = useServerFn(createCheckoutSession);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const currentPlan = profile?.plan ?? "free";
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const handleUpgrade = async (planKey: PlanKey) => {
    setLoadingPlan(planKey);
    try {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/login" });
        return;
      }
      const res = await checkout({ data: { plan: planKey, origin: window.location.origin } });
      if (res?.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not start checkout");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
      {plans.map((p) => (
        <div
          key={p.name}
          className={`relative rounded-3xl p-7 sm:p-8 border-gradient hover-lift ${
            p.featured ? "glass-strong glow md:-translate-y-2" : "glass"
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
          {p.planKey && currentPlan === p.planKey ? (
            <Button disabled className="w-full mt-6 rounded-xl h-11 glass border border-white/10 opacity-80">
              Current plan
            </Button>
          ) : p.planKey ? (
            <Button
              onClick={() => handleUpgrade(p.planKey!)}
              disabled={loadingPlan !== null}
              className={`w-full mt-6 rounded-xl h-11 ${
                p.featured ? "btn-premium" : "glass hover:bg-white/10 border border-white/10 transition-all"
              }`}
            >
              {loadingPlan === p.planKey ? <Loader2 className="size-4 animate-spin" /> : p.cta}
            </Button>
          ) : currentPlan !== "free" ? (
            <Button disabled className="w-full mt-6 rounded-xl h-11 glass border border-white/10 opacity-60">
              {p.cta}
            </Button>
          ) : (
            <Button
              asChild
              className={`w-full mt-6 rounded-xl h-11 ${
                p.featured ? "btn-premium" : "glass hover:bg-white/10 border border-white/10 transition-all"
              }`}
            >
              <Link to="/dashboard">{p.cta}</Link>
            </Button>
          )}
          <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {p.features && (
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
          )}
          {p.groups && (
            <div className="space-y-6">
              {p.groups.map((g) => (
                <div key={g.label}>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{g.label}</div>
                  <ul className="space-y-3 text-sm">
                    {g.items.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span className={`grid place-items-center size-5 rounded-full ${p.featured ? "bg-gradient-vivid" : "bg-white/5"}`}>
                          <Check className={`size-3 ${p.featured ? "text-primary-foreground" : "text-accent"}`} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {g.note && <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">{g.note}</p>}
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  );
}
