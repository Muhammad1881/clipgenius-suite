import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Upload, ArrowRight, Play, Sparkles, Wand2, Crop, Languages, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tilt3D } from "@/components/Tilt3D";
import { HeroClipDeck } from "@/components/HeroClipDeck";
import { AuroraStreaks } from "@/components/AuroraStreaks";
import heroBg from "@/assets/hero-bg.jpg";

const HERO_TITLE = "Clipra — Turn long videos into viral shorts with AI";
const HERO_DESC = "Drop in one long video. Clipra's AI finds the moments most likely to blow up, reframes them to 9:16, and drops animated captions — turning hours of footage into a week of posts in minutes.";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: HERO_TITLE },
      { name: "description", content: HERO_DESC },
      { property: "og:title", content: HERO_TITLE },
      { property: "og:description", content: HERO_DESC },
      { property: "og:url", content: "https://theclipra.com/" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/12b2dfda-f1cd-4c24-969b-577ec332e625/id-preview-73ce43b2--b72c6876-6188-4025-9601-5368f65970f8.lovable.app-1781448753872.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/12b2dfda-f1cd-4c24-969b-577ec332e625/id-preview-73ce43b2--b72c6876-6188-4025-9601-5368f65970f8.lovable.app-1781448753872.png" },
    ],
    links: [
      { rel: "canonical", href: "https://theclipra.com/" },
      { rel: "preload", as: "image", href: heroBg, fetchPriority: "high" } as any,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

const steps = [
  { n: "01", t: "Upload your video", d: "Drag in a podcast, webinar, YouTube link or raw footage. We handle files up to 4 hours long.", icon: Upload },
  { n: "02", t: "AI finds the gold", d: "Clipra transcribes your video, scores every moment for viral potential, and picks the segments most likely to pop off.", icon: TrendingUp },
  { n: "03", t: "Auto-reframes to 9:16", d: "Smart face tracking reframes each clip to perfect vertical — no manual cropping, no wasted edges, always on-subject.", icon: Crop },
  { n: "04", t: "Caption & download", d: "Animated captions in 30+ languages, hook-first titles, and ready-to-post shorts for TikTok, Reels and Shorts.", icon: Languages },
];

const features = [
  { icon: TrendingUp, t: "Viral scoring on every moment", d: "Every second is ranked for hook strength, pacing and sentiment — so you only export clips that hit." },
  { icon: Crop, t: "9:16 auto-reframe", d: "AI keeps the speaker centered as they move. Perfect vertical every time, with zero manual editing." },
  { icon: Languages, t: "Captions in 30+ languages", d: "Animated, burn-in subtitles in your language — or auto-translated to English with one click." },
  { icon: Wand2, t: "Hook-first titles & hashtags", d: "Each clip ships with a scroll-stopping title and hashtag set tuned for the platform it's going to." },
];

const faqs = [
  { q: "What kinds of videos work best?", a: "Podcasts, interviews, webinars, vlogs, and any long-form talking-head content. Clipra also handles gameplay and educational footage." },
  { q: "How long does processing take?", a: "Most one-hour videos finish in under 5 minutes on the Creator plan. Free users may wait a bit longer in the shared queue." },
  { q: "Can I edit the clips after?", a: "Yes — every clip opens in our editor where you can tweak captions, trim, and adjust framing before exporting." },
  { q: "Do you support other languages?", a: "We transcribe and caption in 30+ languages and can translate captions to English (and back)." },
  { q: "Is there a free trial?", a: "Yes. The Free plan gives you 60 minutes of clipping every month, forever — no credit card required." },
];

function Landing() {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blobY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 overflow-hidden bg-aurora-hero">
        {/* Animated Aurora Background */}
        <AuroraStreaks />
        <motion.div
          style={reduce ? undefined : { y: blobY }}
          className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        >
          <div className="aurora-blob aurora-blob-purple -top-[20%] -left-[10%] w-[60%] h-[60%] animate-aurora-breathe" />
          <div className="aurora-blob aurora-blob-cyan top-[10%] -right-[10%] w-[50%] h-[50%] animate-aurora-breathe" style={{ animationDelay: "2s" }} />
          <div className="aurora-blob aurora-blob-indigo -bottom-[20%] left-[20%] w-[70%] h-[60%] animate-aurora-breathe" style={{ animationDelay: "4s" }} />
        </motion.div>

        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/20 to-background" />

        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroFade }}
          className="mx-auto max-w-5xl px-5 sm:px-6 text-center"
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Floating glow badge */}
            <div className="group relative inline-flex mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-glow to-purple-glow rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt" />
              <div className="relative inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-cyan-glow animate-pulse-glow" />
                New: AI hook generator for TikTok is live
              </div>
            </div>

            <h1 className="font-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.02] tracking-tight">
              Turn long videos into
              <br />
              <span className="text-gradient-aurora">viral shorts</span> in minutes.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {HERO_DESC}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-premium rounded-2xl h-14 px-8 text-base font-bold">
                <Link to="/upload">Start creating free <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="glass hover:bg-white/10 rounded-2xl h-14 px-8 border border-white/10 transition-all hover:-translate-y-0.5">
                <a href="#how"><Play className="mr-1 size-4" /> Watch demo</a>
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-accent" />
              <span>60 free minutes monthly · No credit card required</span>
            </div>
          </motion.div>

          <HeroClipDeck />
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 sm:py-28 mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal direction="blur" className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">How it works</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">From raw footage to viral, in 4 steps.</h2>
        </Reveal>
        <RevealGroup className="mt-12 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <RevealItem key={s.n}>
                <Tilt3D className="glass rounded-2xl p-6 border-gradient h-full hover:shadow-[0_24px_60px_-20px_hsl(var(--primary)/0.55)]">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-display text-gradient-aurora">{s.n}</div>
                    <div className="grid place-items-center size-10 rounded-xl bg-white/5 border border-white/10">
                      <Icon className="size-5 text-accent" />
                    </div>
                  </div>
                  <div className="mt-4 text-lg font-semibold tracking-tight">{s.t}</div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
                </Tilt3D>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* WHY CLIPRA (feature showcase — replaces fake testimonials) */}
      <section className="py-20 sm:py-28 mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal direction="blur" className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">Why Clipra</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Engineered to make you go viral.</h2>
          <p className="text-muted-foreground mt-4">No editor. No guesswork. Just the clips most likely to blow up — already vertical, captioned and ready.</p>
        </Reveal>
        <RevealGroup className="mt-12 sm:mt-14 grid md:grid-cols-2 gap-4 sm:gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <RevealItem key={f.t}>
                <Tilt3D max={6} className="glass rounded-2xl p-7 border-gradient h-full flex items-start gap-4 hover:shadow-[0_24px_60px_-20px_hsl(var(--primary)/0.5)]">
                  <div className="grid place-items-center size-12 rounded-xl bg-gradient-vivid shrink-0 glow">
                    <Icon className="size-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight">{f.t}</div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.d}</p>
                  </div>
                </Tilt3D>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-20 sm:py-28 mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal direction="blur" className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Simple plans for every creator.</h2>
        </Reveal>
        <Reveal direction="scale" delay={0.1}>
          <PricingCards />
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 mx-auto max-w-3xl px-5 sm:px-6">
        <Reveal direction="blur" className="text-center mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">FAQ</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Questions, answered.</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="glass rounded-2xl px-5 sm:px-6 border-gradient">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`${i}`} className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal direction="scale" amount={0.3}>
          <div className="relative glass-strong rounded-3xl p-10 sm:p-14 text-center overflow-hidden border-gradient">
            <div className="absolute inset-0 -z-10 opacity-60 animate-aurora" style={{ background: "var(--gradient-mesh)" }} />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/60 to-background" />
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to go <span className="text-gradient-aurora">viral</span>?</h3>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Upload your first video free. No credit card required.</p>
            <Button asChild size="lg" className="mt-7 btn-premium rounded-2xl h-14 px-8 text-base font-bold">
              <Link to="/upload"><Upload className="mr-1 size-4" /> Upload a video</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
