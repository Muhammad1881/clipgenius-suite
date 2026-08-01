import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ArrowRight, Check, Sparkles, Zap, Wand2, Globe } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type ToolLandingProps = {
  eyebrow: string;
  h1: string;
  highlight: string;
  intro: string;
  bullets: string[];
  steps: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
};

export function ToolLanding(p: ToolLandingProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 sm:px-6 pt-28 sm:pt-32 pb-20">
        <div className="text-xs uppercase tracking-widest text-accent">{p.eyebrow}</div>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          {p.h1.split(p.highlight)[0]}
          <span className="text-gradient">{p.highlight}</span>
          {p.h1.split(p.highlight)[1]}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">{p.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg" className="btn-premium rounded-xl h-12 px-6">
            <Link to="/signup">Start free <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="glass hover:bg-white/10 rounded-xl h-12 px-6 border border-white/10">
            <Link to="/pricing">See pricing</Link>
          </Button>
        </div>

        <section className="mt-16 grid sm:grid-cols-2 gap-4">
          {p.bullets.map((b) => (
            <div key={b} className="glass rounded-2xl p-5 flex items-start gap-3 border-gradient">
              <Check className="size-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-foreground/90">{b}</span>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {p.steps.map((s, i) => {
              const Icon = [Wand2, Zap, Globe][i] ?? Sparkles;
              return (
                <div key={s.t} className="glass rounded-2xl p-6 border-gradient hover-lift">
                  <Icon className="size-5 text-accent" />
                  <div className="mt-3 text-lg font-semibold">{s.t}</div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.d}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">FAQ</h2>
          <Accordion type="single" collapsible className="mt-6 glass rounded-2xl px-5 sm:px-6 border-gradient">
            {p.faqs.map((f, i) => (
              <AccordionItem key={i} value={`${i}`} className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mt-20 glass-strong rounded-3xl p-10 text-center border-gradient">
          <Sparkles className="size-6 mx-auto text-accent" />
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">Try Clipra free</h2>
          <p className="text-muted-foreground mt-2">60 free minutes. No credit card required.</p>
          <Button asChild className="mt-5 btn-premium rounded-xl">
            <Link to="/signup">Get started <ArrowRight className="size-4 ml-1" /></Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function toolLandingHead(opts: {
  title: string;
  description: string;
  url: string;
  faqs: { q: string; a: string }[];
}) {
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: opts.url },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: opts.url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: opts.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
}
