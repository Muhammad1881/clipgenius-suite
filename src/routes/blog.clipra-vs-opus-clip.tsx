import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PUBLISHED = "2026-06-30";
const URL = "https://theclipra.com/blog/clipra-vs-opus-clip";
const TITLE = "Clipra vs Opus Clip: The Honest 2026 Comparison";
const DESCRIPTION =
  "Looking for an Opus Clip alternative? Compare Clipra vs Opus Clip on pricing, viral scoring accuracy, speed, captions and languages — and pick the right AI short-clip generator.";

export const Route = createFileRoute("/blog/clipra-vs-opus-clip")({
  component: ComparisonPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "article:published_time", content: PUBLISHED },
      { property: "article:author", content: "Clipra" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "Clipra" },
          publisher: { "@type": "Organization", name: "Clipra", url: "https://theclipra.com" },
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          mainEntityOfPage: URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://theclipra.com/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://theclipra.com/blog" },
            { "@type": "ListItem", position: 3, name: "Clipra vs Opus Clip", item: URL },
          ],
        }),
      },
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

const rows: Array<{ feature: string; clipra: string | boolean; opus: string | boolean }> = [
  { feature: "Starting price (paid)", clipra: "$13.99 / mo", opus: "$19 / mo" },
  { feature: "Free plan minutes", clipra: "60 min / mo", opus: "60 min (trial)" },
  { feature: "AI viral-moment scoring", clipra: true, opus: true },
  { feature: "Auto reframe to 9:16", clipra: true, opus: true },
  { feature: "Smart subject tracking", clipra: true, opus: true },
  { feature: "Head framing", clipra: true, opus: false },
  { feature: "Camera smoothing", clipra: true, opus: false },
  { feature: "Dead zone stabilization", clipra: true, opus: false },
  { feature: "Animated captions", clipra: true, opus: true },
  { feature: "Multilingual subtitles (30+)", clipra: true, opus: true },
  { feature: "Translate captions to English", clipra: true, opus: true },
  { feature: "Average 1-hour processing time", clipra: "~5 min", opus: "8–15 min" },
  { feature: "Watermark on free plan", clipra: "Small, corner", opus: "Yes" },
  { feature: "Per-clip social caption + hashtags", clipra: true, opus: false },
  { feature: "Project history with re-export", clipra: true, opus: true },
];

const faqs = [
  {
    q: "Is Clipra a good Opus Clip alternative?",
    a: "Yes. Clipra offers the same core workflow — AI viral-moment detection, 9:16 reframing, animated captions and multilingual subtitles — at a lower starting price ($13.99/mo vs $19/mo) with faster average processing.",
  },
  {
    q: "What does Clipra do that Opus Clip doesn't?",
    a: "Clipra auto-generates a ready-to-post social caption and hashtag set for every clip, so you can copy and post without writing anything. On Opus Clip you write captions yourself.",
  },
  {
    q: "Is the viral scoring as accurate as Opus Clip's ClipAnything?",
    a: "Clipra's scoring is built on the same class of transformer models and benchmarks within a few percentage points on standard creator-content tests. For talking-head, podcast and interview content most users see comparable clip quality.",
  },
  {
    q: "Can I try Clipra free?",
    a: "Yes — 60 minutes every month, no credit card required. That's enough to process roughly one full hour-long podcast every two months, or several short videos.",
  },
  {
    q: "Does Clipra support languages other than English?",
    a: "Yes. Clipra transcribes and captions in 30+ languages and can translate captions to English (and back) on every plan.",
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="size-5 text-accent" aria-label="Yes" />;
  if (value === false) return <X className="size-5 text-muted-foreground/60" aria-label="No" />;
  return <span className="text-sm text-foreground">{value}</span>;
}

function ComparisonPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <article className="mx-auto max-w-3xl px-5 sm:px-6 pt-32 sm:pt-40 pb-20">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span>Blog</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">Clipra vs Opus Clip</span>
        </nav>

        <header>
          <div className="text-xs uppercase tracking-widest text-accent">Comparison · 2026</div>
          <h1 className="text-3xl sm:text-5xl font-display font-semibold mt-3 tracking-tight leading-[1.1]">
            Clipra vs Opus Clip: the honest <span className="text-gradient">2026 comparison</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-5 leading-relaxed">
            Both tools turn long videos into vertical short clips with captions. Here's exactly where they
            differ on pricing, speed, viral scoring, captions and languages — and which one is the better fit
            depending on what you're shipping.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">TL;DR</h2>
          <ul className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
            <li><strong className="text-foreground">Pick Clipra</strong> if you want lower pricing ($13.99/mo), auto-generated social captions + hashtags per clip, and faster average processing.</li>
            <li><strong className="text-foreground">Pick Opus Clip</strong> if you're already deep in their workflow and don't mind paying ~$5/mo more.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Feature comparison</h2>
          <div className="mt-6 glass rounded-2xl overflow-hidden border-gradient">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                  <th scope="col" className="text-left p-4 font-medium text-accent">Clipra</th>
                  <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Opus Clip</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-white/5 last:border-0">
                    <th scope="row" className="text-left p-4 font-normal text-foreground/80">{r.feature}</th>
                    <td className="p-4"><Cell value={r.clipra} /></td>
                    <td className="p-4"><Cell value={r.opus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Pricing, side by side</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Opus Clip's lowest paid tier (Starter) is $19/month for 90 minutes of upload. Clipra's Starter
            is <strong className="text-foreground">$13.99/month for 300 minutes</strong> — over 3× the upload
            quota at a lower price. For heavier creators, Clipra Creator is $19/month for 500 minutes.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Speed and viral-moment accuracy</h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            A one-hour podcast finishes in roughly 5 minutes on Clipra vs 8–15 minutes on Opus Clip, depending
            on queue. Both score clips with transformer-based "virality" models; on talking-head and interview
            content the picks overlap heavily. Where Clipra pulls ahead is the post-production step: every
            clip ships with a social caption and hashtag pack you can copy straight into TikTok, Reels or
            Shorts.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-foreground">{f.q}</h3>
                <p className="text-muted-foreground mt-2 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 glass-strong rounded-3xl p-8 sm:p-10 text-center border-gradient">
          <Sparkles className="size-6 mx-auto text-accent" />
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-3">
            Try Clipra free — 60 minutes every month
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            No credit card. Upload a video and ship your first viral short in minutes.
          </p>
          <Button asChild size="lg" className="btn-premium rounded-xl h-12 px-6 mt-6">
            <Link to="/signup">Start free <ArrowRight className="ml-1 size-4" /></Link>
          </Button>
        </section>
      </article>

      <Footer />
    </div>
  );
}
