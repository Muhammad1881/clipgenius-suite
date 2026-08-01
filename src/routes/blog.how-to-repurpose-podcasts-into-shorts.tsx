import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

const PUBLISHED = "2026-06-30";
const URL_ = "https://clipra.bond/blog/how-to-repurpose-podcasts-into-shorts";
const TITLE = "How to Repurpose a Podcast into Viral Shorts (2026 Guide)";
const DESCRIPTION =
  "A step-by-step workflow to turn a 60-minute podcast into 10+ viral shorts for TikTok, Reels, and YouTube Shorts using AI.";

const FAQS = [
  {
    q: "How many shorts can I get from a one-hour podcast?",
    a: "Most one-hour podcasts produce 8–15 usable shorts. The exact number depends on how conversational the episode is — interviews with strong stories and hot takes tend to produce more than monologues.",
  },
  {
    q: "What length should podcast shorts be?",
    a: "Aim for 30–60 seconds for TikTok and Reels, and 45–90 seconds for YouTube Shorts. Clipra defaults are tuned for these ranges, but you can trim further in any editor.",
  },
  {
    q: "Do I need to add captions?",
    a: "Yes. 85% of social video is watched on mute. Clipra burns animated word-by-word captions into every short automatically, in the original language or translated to English.",
  },
  {
    q: "How often should I post podcast clips?",
    a: "Daily, if possible. One long episode per week plus daily clips across TikTok, Reels, and Shorts is the sustainable workflow most podcasters use to grow.",
  },
];

export const Route = createFileRoute("/blog/how-to-repurpose-podcasts-into-shorts")({
  component: PodcastGuide,
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
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
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
            { "@type": "ListItem", position: 3, name: TITLE, item: URL_ },
          ],
        }),
      },
    ],
  }),
});

function PodcastGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 sm:px-6 pt-28 pb-16">
        <div className="text-xs uppercase tracking-widest text-accent">Guide</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-display font-semibold tracking-tight">
          How to repurpose a podcast into viral shorts
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A repeatable workflow to turn a single 60-minute episode into 10+ short-form videos for TikTok, Instagram Reels, and YouTube Shorts — using AI to do the heavy lifting.
        </p>

        <article className="mt-10 prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Why podcasters need shorts</h2>
            <p className="text-muted-foreground mt-3">
              Long-form podcasts build deep audience trust, but they don't drive discovery. Short, vertical clips are how new listeners find you in 2026 — every major platform (TikTok, Reels, Shorts) prioritizes vertical video in feeds, and creators who clip consistently grow 4–8× faster than those who only publish full episodes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">The 5-step workflow</h2>
            <ol className="mt-4 space-y-5">
              {[
                { t: "Record with clips in mind", d: "Frame guests so faces sit in the safe area for 9:16 cropping. Ask follow-up questions that produce 30–60 second answers — those are your future hooks." },
                { t: "Upload the full episode to Clipra", d: "Drop the raw MP4 or MOV. Clipra transcribes, scores every moment for virality, and proposes the top clips ranked by hook strength." },
                { t: "Review the AI-picked clips", d: "Spend 5 minutes scanning the suggested clips. Keep the ones with a strong opening line in the first 2 seconds. Trim or skip anything that needs context to make sense." },
                { t: "Auto-caption in the right language", d: "85% of viewers watch muted. Burn animated captions — same as audio, or translated to English to reach a wider audience." },
                { t: "Publish on a daily schedule", d: "One short per day per platform beats batch-dumping ten clips at once. Use the AI-generated title, hashtags and caption as starting points, then add your personality." },
              ].map((s, i) => (
                <li key={i} className="glass rounded-xl p-5 flex gap-4 border-gradient">
                  <div className="size-8 shrink-0 rounded-lg bg-gradient-vivid grid place-items-center font-semibold text-sm text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{s.t}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">What makes a podcast clip go viral</h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              {[
                "Strong hook in the first 2 seconds — a question, a hot take, or an unexpected number.",
                "Self-contained story — the viewer should understand without context.",
                "Emotional arc — surprise, conflict, or a satisfying payoff.",
                "Vertical-first framing with face visible the whole time.",
                "Captions sync'd word-by-word, not sentence-by-sentence.",
              ].map((t) => (
                <li key={t} className="flex gap-3"><CheckCircle2 className="size-4 text-accent mt-0.5 shrink-0" />{t}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              {FAQS.map((f) => (
                <div key={f.q} className="glass rounded-xl p-5">
                  <div className="font-semibold">{f.q}</div>
                  <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <div className="mt-12 glass rounded-2xl p-8 text-center border-gradient">
          <Sparkles className="size-6 mx-auto text-accent" />
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Try it on your next episode</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Upload a podcast and get viral-ready shorts in minutes — 60 free minutes included.
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
