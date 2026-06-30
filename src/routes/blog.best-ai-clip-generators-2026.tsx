import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";

const PUBLISHED = "2026-06-30";
const URL_ = "https://clipra.bond/blog/best-ai-clip-generators-2026";
const TITLE = "The 7 Best AI Clip Generators in 2026 (Tested & Ranked)";
const DESCRIPTION =
  "We tested every major AI tool that turns long videos into vertical shorts. Here are the seven that actually deliver — with pricing, strengths, and weaknesses.";

type Tool = {
  rank: number;
  name: string;
  best: string;
  price: string;
  pros: string[];
  cons: string[];
};

const TOOLS: Tool[] = [
  {
    rank: 1,
    name: "Clipra",
    best: "Best overall + best value",
    price: "Free, paid from $13.99/mo",
    pros: ["Honest minute-based pricing", "Fast viral scoring", "Multilingual captions", "Clean, modern UI"],
    cons: ["Newer brand — smaller community"],
  },
  {
    rank: 2,
    name: "Opus Clip",
    best: "Most well-known",
    price: "Free trial, paid from $19/mo",
    pros: ["Mature feature set", "Large user base"],
    cons: ["Confusing credit system", "Hard caps on long videos", "Slower processing on free tier"],
  },
  {
    rank: 3,
    name: "Vizard",
    best: "Good free tier",
    price: "Free, paid from $19.99/mo",
    pros: ["Generous free minutes", "Decent caption styles"],
    cons: ["Viral picks feel random", "Limited templates"],
  },
  {
    rank: 4,
    name: "Munch",
    best: "Marketing-heavy users",
    price: "From $49/mo",
    pros: ["Trend-matching features", "Built-in analytics"],
    cons: ["Expensive", "Overkill for most creators"],
  },
  {
    rank: 5,
    name: "2short.ai",
    best: "YouTube-only workflow",
    price: "Free, paid from $9.90/mo",
    pros: ["Simple YouTube import", "Cheap entry tier"],
    cons: ["Limited to YouTube URLs", "No upload workflow"],
  },
  {
    rank: 6,
    name: "Submagic",
    best: "Caption styling",
    price: "From $16/mo",
    pros: ["Premium caption animations", "Emoji and B-roll suggestions"],
    cons: ["Not an end-to-end clip generator", "Better as a caption add-on"],
  },
  {
    rank: 7,
    name: "Klap",
    best: "Quick batch jobs",
    price: "From $29/mo",
    pros: ["Batch processing", "Decent speed"],
    cons: ["Bland templates", "Pricier per minute"],
  },
];

export const Route = createFileRoute("/blog/best-ai-clip-generators-2026")({
  component: BestTools,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL_ },
      { property: "article:published_time", content: PUBLISHED },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL_ }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Clipra" },
          publisher: { "@type": "Organization", name: "Clipra", url: "https://clipra.bond" },
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: URL_,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: TOOLS.map((t) => ({
            "@type": "ListItem",
            position: t.rank,
            name: t.name,
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://clipra.bond/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://clipra.bond/blog" },
            { "@type": "ListItem", position: 3, name: "Best AI Clip Generators 2026", item: URL_ },
          ],
        }),
      },
    ],
  }),
});

function BestTools() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 sm:px-6 pt-28 pb-16">
        <div className="text-xs uppercase tracking-widest text-accent">Comparison</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-display font-semibold tracking-tight">
          The 7 best AI clip generators in 2026
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We tested every major AI tool that turns long videos into vertical shorts on the same 45-minute podcast episode. Here's our honest ranking — what each tool is best for, what it costs, and what to skip.
        </p>

        <section className="mt-12 space-y-5">
          {TOOLS.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6 border-gradient">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-vivid grid place-items-center font-semibold text-primary-foreground">
                    {t.rank}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{t.name}</h2>
                    <div className="text-sm text-accent flex items-center gap-1.5 mt-0.5">
                      <Star className="size-3.5 fill-accent" /> {t.best}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{t.price}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mt-5 text-sm">
                <div>
                  <div className="font-medium text-foreground mb-2">Pros</div>
                  <ul className="space-y-1 text-muted-foreground">
                    {t.pros.map((p) => <li key={p}>+ {p}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-2">Cons</div>
                  <ul className="space-y-1 text-muted-foreground">
                    {t.cons.map((c) => <li key={c}>− {c}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-12 glass rounded-2xl p-8 text-center border-gradient">
          <Sparkles className="size-6 mx-auto text-accent" />
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Try our #1 pick free</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Clipra includes 30 free minutes — enough to clip a full podcast episode and see the difference.
          </p>
          <Button asChild className="mt-5 btn-premium rounded-xl">
            <Link to="/signup">Start free <ArrowRight className="size-4 ml-1" /></Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
