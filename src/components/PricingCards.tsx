import { Check, Sparkles, Lock, Loader2, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { createCheckoutSession, type PlanKey } from "@/lib/billing.functions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Feature = { label: string; tip?: string; locked?: boolean };
type FeatureGroup = { label: string; items: Feature[]; note?: string };

type Plan = {
  name: string;
  price: string;
  desc: string;
  badge?: string;
  groups: FeatureGroup[];
  /** number of features (across groups) always visible on mobile */
  coreCount: number;
  cta: string;
  featured?: boolean;
  planKey?: PlanKey;
};

const TIPS = {
  fancy: "Eye-catching, social-ready subtitle styling designed for short-form content.",
  reframe: "AI automatically follows the main subject and keeps them perfectly framed in vertical video.",
  translate: "Translate your subtitles into another language for a global audience.",
  clipLength: "Choose between 30–60 second or 60–90 second clips.",
  viral: "Clipra scans your video and scores the moments most likely to go viral.",
  crop: "Your clip is centered and cropped to a vertical 9:16 frame.",
  priority: "Your videos jump ahead in the processing queue.",
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for trying Clipra.",
    coreCount: 4,
    groups: [
      {
        label: "Essentials",
        items: [
          { label: "60 minutes / month" },
          { label: "Upload videos up to 30 minutes" },
          { label: "Up to 5 clips per video" },
          { label: "720p HD Exports" },
          { label: "AI Viral Moment Detection", tip: TIPS.viral },
          { label: "Automatic Subtitles" },
          { label: "Vertical 9:16 Smart Center Crop", tip: TIPS.crop },
          { label: "7-Day Project History" },
        ],
      },
      {
        label: "Unlocks with Starter",
        items: [
          { label: "Watermark-free exports", locked: true },
          { label: "Fancy Animated Subtitles", locked: true, tip: TIPS.fancy },
          { label: "Subtitle Translation", locked: true, tip: TIPS.translate },
          { label: "Custom Clip Lengths", locked: true, tip: TIPS.clipLength },
        ],
      },
    ],
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "$13.99",
    desc: "Everything you need to grow.",
    badge: "Best value",
    coreCount: 7,
    groups: [
      {
        label: "Essentials",
        items: [
          { label: "300 minutes / month" },
          { label: "Upload videos up to 60 minutes" },
          { label: "Up to 10 clips per video" },
          { label: "1080p Full HD Exports" },
          { label: "No Watermark" },
          { label: "Vertical 9:16 Smart Center Crop", tip: TIPS.crop },
          { label: "30-Day Project History" },
        ],
      },
      {
        label: "AI Content",
        items: [
          { label: "AI Viral Moment Detection", tip: TIPS.viral },
          { label: "AI Captions" },
          { label: "AI Titles" },
          { label: "AI Hashtags" },
        ],
      },
      {
        label: "Subtitles & Language",
        items: [
          { label: "Fancy Animated Subtitles", tip: TIPS.fancy },
          { label: "Subtitle Translation", tip: TIPS.translate },
          { label: "Multiple Translation Languages" },
        ],
      },
      {
        label: "Clip Controls",
        items: [{ label: "Custom Clip Lengths (30–90 sec)", tip: TIPS.clipLength }],
      },
    ],
    cta: "Get Starter",
    planKey: "starter",
  },
  {
    name: "Creator",
    price: "$19",
    desc: "Maximum power for serious creators.",
    badge: "Most popular",
    coreCount: 7,
    featured: true,
    groups: [
      {
        label: "Essentials",
        items: [
          { label: "500 minutes / month" },
          { label: "Upload videos up to 120 minutes" },
          { label: "Up to 10 clips per video" },
          { label: "1080p Full HD Exports" },
          { label: "No Watermark" },
          { label: "Unlimited Project History" },
          { label: "Priority Processing", tip: TIPS.priority },
        ],
      },
      {
        label: "Premium AI Video",
        items: [
          { label: "AI Reframe", tip: TIPS.reframe },
          { label: "Intelligent Subject Tracking" },
          { label: "Automatic Vertical 9:16 Framing" },
        ],
      },
      {
        label: "AI Content",
        items: [
          { label: "AI Viral Moment Detection", tip: TIPS.viral },
          { label: "AI Captions" },
          { label: "AI Titles" },
          { label: "AI Hashtags" },
        ],
      },
      {
        label: "Subtitles & Language",
        items: [
          { label: "Fancy Animated Subtitles", tip: TIPS.fancy },
          { label: "Subtitle Translation", tip: TIPS.translate },
          { label: "Multiple Translation Languages" },
        ],
      },
      {
        label: "Clip Controls",
        items: [{ label: "Custom Clip Lengths (30–90 sec)", tip: TIPS.clipLength }],
      },
    ],
    cta: "Get Creator",
    planKey: "creator",
  },
];

function FeatureRow({ f, featured }: { f: Feature; featured?: boolean }) {
  const icon = f.locked ? (
    <span className="grid place-items-center size-5 rounded-full bg-white/5 shrink-0">
      <Lock className="size-3 text-muted-foreground" />
    </span>
  ) : (
    <span className={`grid place-items-center size-5 rounded-full shrink-0 ${featured ? "bg-gradient-vivid" : "bg-white/5"}`}>
      <Check className={`size-3 ${featured ? "text-primary-foreground" : "text-accent"}`} />
    </span>
  );

  return (
    <>
      {icon}
      <span className="min-w-0 flex items-center gap-1.5 leading-snug">
        {f.label}
        {f.tip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`About ${f.label}`} className="shrink-0 text-muted-foreground/70 hover:text-accent transition-colors">
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px] text-xs leading-relaxed">{f.tip}</TooltipContent>
          </Tooltip>
        )}
      </span>
    </>
  );
}

export function PricingCards() {
  const checkout = useServerFn(createCheckoutSession);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const currentPlan = profile?.plan ?? "free";
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
    <TooltipProvider delayDuration={150}>
      <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start">
        {plans.map((p) => {
          const isOpen = !!expanded[p.name];
          // Flatten with a running index so we can cap what's visible on mobile.
          let seen = 0;
          const rendered = p.groups.map((g) => {
            const items = g.items.map((it) => {
              const idx = seen++;
              return { it, hiddenOnMobile: idx >= p.coreCount && !isOpen };
            });
            const allHidden = items.every((i) => i.hiddenOnMobile);
            return { g, items, allHidden };
          });
          const hasHidden = seen > p.coreCount;

          return (
            <div
              key={p.name}
              className={`relative rounded-3xl p-7 sm:p-8 border-gradient hover-lift ${
                p.featured ? "glass-strong glow md:-translate-y-2" : "glass"
              }`}
            >
              {p.badge && (
                <>
                  {p.featured && <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />}
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                      p.featured
                        ? "bg-gradient-vivid text-primary-foreground shadow-card"
                        : "glass border border-white/10 text-muted-foreground"
                    }`}
                  >
                    {p.featured && <Sparkles className="size-3" />} {p.badge}
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

              <div className="space-y-6">
                {rendered.map(({ g, items, allHidden }) => (
                  <div key={g.label} className={allHidden ? "hidden md:block" : ""}>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{g.label}</div>
                    <ul className="space-y-3 text-sm">
                      {items.map(({ it, hiddenOnMobile }) => (
                        <li
                          key={it.label}
                          className={`flex items-start gap-3 ${it.locked ? "text-muted-foreground" : ""} ${
                            hiddenOnMobile ? "hidden md:flex" : ""
                          }`}
                        >
                          <FeatureRow f={it} featured={p.featured} />
                        </li>
                      ))}
                    </ul>
                    {g.note && <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">{g.note}</p>}
                  </div>
                ))}
              </div>

              {hasHidden && (
                <button
                  type="button"
                  onClick={() => setExpanded((s) => ({ ...s, [p.name]: !isOpen }))}
                  className="md:hidden mt-6 w-full flex items-center justify-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  {isOpen ? "Show less" : "See all features"}
                  <ChevronDown className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
