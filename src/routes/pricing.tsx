import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { PlanSection } from "@/components/PlanSection";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
  head: () => ({
    meta: [
      { title: "Pricing — Clipra" },
      { name: "description", content: "Simple plans for every creator. Free, Pro and Business." },
    ],
  }),
});

function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-mesh opacity-50 -z-10 animate-aurora pointer-events-none" />
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mt-3 tracking-tight">Plans that scale with your <span className="text-gradient">views</span>.</h1>
          <p className="text-muted-foreground mt-4">Start free. Upgrade when you're ready to dominate the algorithm.</p>
        </div>
        <div className="mt-14 sm:mt-16">
          <PricingCards />
        </div>

        <div className="mt-16 sm:mt-20 glass rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto border-gradient">
          <h3 className="text-2xl font-semibold tracking-tight">Need something custom?</h3>
          <p className="text-muted-foreground mt-2 leading-relaxed">Enterprise teams, education and large agencies get custom pricing and dedicated support.</p>
          <a href="mailto:sales@clipra.ai" className="btn-premium inline-block mt-5 rounded-xl px-6 py-2.5 text-sm font-medium">
            Talk to sales
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
