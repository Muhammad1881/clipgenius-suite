import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Wand2, Scissors, Captions, Upload, Zap, Trophy, ArrowRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({ component: Landing });

const features = [
  { icon: Wand2, title: "AI viral detection", desc: "Our model scores every moment of your video and surfaces clips with the highest viral potential." },
  { icon: Scissors, title: "Auto-cut shorts", desc: "Perfect 9:16 reframing that tracks faces and action — no editing required." },
  { icon: Captions, title: "Animated captions", desc: "Word-by-word captions in 30+ languages, styled to match your brand." },
  { icon: Zap, title: "Lightning fast", desc: "A one-hour podcast becomes a stack of shorts in under 5 minutes." },
  { icon: Trophy, title: "Hook generator", desc: "AI writes titles, hashtags and thumbnails optimized for each platform." },
  { icon: Sparkles, title: "Smart B-roll", desc: "Auto-inserts relevant b-roll, emojis and zooms to maximize retention." },
];

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
  { q: "Is there a free trial?", a: "Yes. The Free plan lets you process 3 videos every month, forever — no credit card required." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-32">
        <img src={heroBg} alt="" width={1920} height={1080} className="absolute inset-0 size-full object-cover opacity-50 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="absolute inset-0 -z-10 grid-bg" />

        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-6">
              <span className="size-1.5 rounded-full bg-accent animate-pulse-glow" />
              New: AI hook generator for TikTok is live
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              Turn long videos into
              <br />
              <span className="text-gradient">viral shorts</span> in minutes.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Clipra uses AI to find your most viral moments, auto-reframe them, add captions, and ship them to every platform — while you sleep.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl glow h-12 px-6">
                <Link to="/upload">Start creating free <ArrowRight className="ml-1 size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="glass hover:bg-white/10 rounded-xl h-12 px-6">
                <a href="#how"><Play className="mr-1 size-4" /> Watch demo</a>
              </Button>
            </div>
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}</div>
              Loved by 12,000+ creators
            </div>
          </motion.div>

          {/* hero mock */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 glass-strong rounded-3xl p-3 max-w-4xl mx-auto glow">
            <div className="rounded-2xl bg-card/80 aspect-video grid grid-cols-3 gap-3 p-4">
              {[1,2,3].map((i) => (
                <div key={i} className="rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex flex-col justify-between p-4 animate-float" style={{animationDelay: `${i*0.3}s`}}>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Clip 0{i}</div>
                  <div>
                    <div className="text-xs text-foreground font-medium leading-tight">"You won't believe what happened next…"</div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-accent"><Trophy className="size-3" /> 94% viral score</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">Features</div>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Everything you need to win the algorithm.</h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition group">
              <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center mb-5 group-hover:scale-110 transition">
                <f.icon className="size-5 text-primary-foreground" />
              </div>
              <div className="font-semibold text-lg">{f.title}</div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">How it works</div>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">From raw footage to viral, in 3 steps.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5 relative">
          {steps.map((s, i) => (
            <motion.div key={s.n}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-2xl p-7 relative">
              <div className="text-5xl font-display text-gradient">{s.n}</div>
              <div className="mt-4 text-xl font-semibold">{s.t}</div>
              <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">Loved by creators</div>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Built for the next billion views.</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-7">
              <div className="flex">{Array.from({length:5}).map((_,i)=><Star key={i} className="size-4 fill-accent text-accent" />)}</div>
              <p className="mt-4 text-foreground/90 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-primary" />
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
      <section className="py-28 mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Simple plans for every creator.</h2>
        </div>
        <PricingCards />
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 mx-auto max-w-3xl px-6">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">FAQ</div>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Questions, answered.</h2>
        </div>
        <Accordion type="single" collapsible className="glass rounded-2xl px-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`${i}`} className="border-white/10">
              <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="py-20 mx-auto max-w-5xl px-6">
        <div className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden glow">
          <div className="absolute inset-0 -z-10 opacity-50" style={{background: "var(--gradient-glow)"}} />
          <h3 className="text-3xl md:text-4xl font-semibold">Ready to go viral?</h3>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Upload your first video free. No credit card required.</p>
          <Button asChild size="lg" className="mt-7 bg-gradient-primary text-primary-foreground hover:opacity-90 rounded-xl h-12 px-7">
            <Link to="/upload"><Upload className="mr-1 size-4" /> Upload a video</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
