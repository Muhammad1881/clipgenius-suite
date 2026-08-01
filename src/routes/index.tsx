import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Upload, ArrowRight, Play, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroBg from "@/assets/hero-bg.jpg";
import clip1Video from "@/assets/clip-9.mp4.asset.json";
import clip2Video from "@/assets/cristiano-saudi.mp4.asset.json";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Clipra — Turn long videos into viral shorts with AI" },
      { name: "description", content: "Clipra uses AI to find your most viral moments, auto-reframe them, add captions, and ship them to every platform — while you sleep." },
      { property: "og:title", content: "Clipra — Turn long videos into viral shorts with AI" },
      { property: "og:description", content: "Clipra uses AI to find your most viral moments, auto-reframe them, add captions, and ship them to every platform — while you sleep." },
      { property: "og:url", content: "https://clipra.bond/" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/12b2dfda-f1cd-4c24-969b-577ec332e625/id-preview-73ce43b2--b72c6876-6188-4025-9601-5368f65970f8.lovable.app-1781448753872.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/12b2dfda-f1cd-4c24-969b-577ec332e625/id-preview-73ce43b2--b72c6876-6188-4025-9601-5368f65970f8.lovable.app-1781448753872.png" },
    ],
    links: [
      { rel: "canonical", href: "https://clipra.bond/" },
      { rel: "preload", as: "image", href: heroBg, fetchpriority: "high" } as any,
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
  { n: "01", t: "Upload your video", d: "Drag a podcast, webinar, YouTube link or raw footage. Up to 4 hours." },
  { n: "02", t: "AI finds the gold", d: "Clipra transcribes, scores moments and picks your most viral segments." },
  { n: "03", t: "Export & post", d: "Download captioned, reframed shorts ready for TikTok, Reels and Shorts." },
];

const testimonials = [
  { name: "Maya Chen", role: "Creator, 1.2M followers", quote: "I went from posting twice a week to twice a day. Clipra basically runs my shorts pipeline." },
  { name: "Jordan Reyes", role: "Podcast host", quote: "It picked the exact moment that made one of my episodes hit 3M views. Spooky good." },
  { name: "Aisha Khan", role: "Agency founder", quote: "We replaced three editors with Clipra and our clients' engagement actually went up." },
];

const faqs = [
  { q: "What kinds of videos work best?", a: "Podcasts, interviews, webinars, vlogs, and any long-form talking-head content. Clipra also handles gameplay and educational footage." },
  { q: "How long does processing take?", a: "Most one-hour videos finish in under 5 minutes on the Pro plan. Free users may wait a bit longer in the shared queue." },
  { q: "Can I edit the clips after?", a: "Yes — every clip opens in our editor where you can tweak captions, trim, and adjust framing before exporting." },
  { q: "Do you support other languages?", a: "We transcribe and caption in 30+ languages and can translate captions to English (and back)." },
  { q: "Is there a free trial?", a: "Yes. The Free plan gives you 60 minutes of clipping every month, forever — no credit card required." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 overflow-hidden bg-aurora-hero">
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="aurora-blob aurora-blob-purple -top-[20%] -left-[10%] w-[60%] h-[60%] animate-aurora-breathe" />
          <div className="aurora-blob aurora-blob-cyan top-[10%] -right-[10%] w-[50%] h-[50%] animate-aurora-breathe" style={{ animationDelay: "2s" }} />
          <div className="aurora-blob aurora-blob-indigo -bottom-[20%] left-[20%] w-[70%] h-[60%] animate-aurora-breathe" style={{ animationDelay: "4s" }} />
        </div>

        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/20 to-background" />

        <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center">
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
              Clipra uses AI to find your most viral moments, auto-reframe them, add captions, and ship them to every platform — while you sleep.
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
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}</div>
              <span>Trusted by 10,000+ creators</span>
            </div>
          </motion.div>

          {/* Floating 3D preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-14 sm:mt-16 relative w-full max-w-4xl mx-auto group"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-glow/20 to-purple-glow/20 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="relative float-3d glass-strong rounded-3xl p-2 sm:p-3 border-gradient">
              <div className="rounded-2xl bg-card/60 aspect-video grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex flex-col justify-between p-3 sm:p-4 animate-float shadow-card"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    {i === 1 && (
                      <video
                        src={clip1Video.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    {i === 2 && (
                      <video
                        src={clip2Video.url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="relative text-[10px] uppercase tracking-wider text-muted-foreground">Clip 0{i}</div>
                    <div className="relative">
                      <div className="text-[11px] sm:text-xs text-foreground font-medium leading-tight">{i === 1 ? "Alternative Terms For Early Risers" : i === 2 ? "Cristiano on adapting to life in Saudi Arabia" : "\"You won't believe what happened next…\""}</div>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-accent"><Trophy className="size-3" /> 94% viral score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 sm:py-28 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">How it works</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">From raw footage to viral, in 3 steps.</h2>
        </div>
        <div className="mt-12 sm:mt-14 grid md:grid-cols-3 gap-4 sm:gap-5 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-2xl p-7 relative hover-lift border-gradient"
            >
              <div className="text-5xl font-display text-gradient-aurora">{s.n}</div>
              <div className="mt-4 text-xl font-semibold tracking-tight">{s.t}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">Loved by creators</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Built for the next billion views.</h2>
        </div>
        <div className="mt-12 sm:mt-14 grid md:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-7 hover-lift border-gradient">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}</div>
              <p className="mt-4 text-foreground/90 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-vivid shadow-card" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-20 sm:py-28 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Simple plans for every creator.</h2>
        </div>
        <PricingCards />
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">FAQ</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Questions, answered.</h2>
        </div>
        <Accordion type="single" collapsible className="glass rounded-2xl px-5 sm:px-6 border-gradient">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`${i}`} className="border-white/10">
              <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 mx-auto max-w-5xl px-5 sm:px-6">
        <div className="relative glass-strong rounded-3xl p-10 sm:p-14 text-center overflow-hidden border-gradient">
          <div className="absolute inset-0 -z-10 opacity-60 animate-aurora" style={{ background: "var(--gradient-mesh)" }} />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/60 to-background" />
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">Ready to go <span className="text-gradient-aurora">viral</span>?</h3>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Upload your first video free. No credit card required.</p>
          <Button asChild size="lg" className="mt-7 btn-premium rounded-2xl h-14 px-8 text-base font-bold">
            <Link to="/upload"><Upload className="mr-1 size-4" /> Upload a video</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
