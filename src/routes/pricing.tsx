import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";

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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-40 pb-20 mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
          <h1 className="text-5xl md:text-6xl font-semibold mt-3">Plans that scale with your views.</h1>
          <p className="text-muted-foreground mt-4">Start free. Upgrade when you're ready to dominate the algorithm.</p>
        </div>
        <div className="mt-16">
          <PricingCards />
        </div>

        <div className="mt-20 glass rounded-3xl p-10 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold">Need something custom?</h3>
          <p className="text-muted-foreground mt-2">Enterprise teams, education and large agencies get custom pricing and dedicated support.</p>
          <a href="mailto:sales@clipra.ai" className="inline-block mt-5 rounded-xl bg-gradient-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90">
            Talk to sales
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
