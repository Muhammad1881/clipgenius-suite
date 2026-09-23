import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const URL_ = "https://theclipra.com/blog";
const TITLE = "Clipra Blog — AI Video Clipping, Shorts & Creator Growth";
const DESCRIPTION =
  "Guides on turning long videos into viral shorts: AI clip generators, podcast repurposing, TikTok and Reels strategy, and honest tool comparisons.";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
};

const POSTS: Post[] = [
  {
    slug: "/blog/clipra-vs-opus-clip",
    title: "Clipra vs Opus Clip: The Honest 2026 Comparison",
    excerpt:
      "Pricing, viral scoring accuracy, speed, captions and languages — pick the right AI short-clip generator.",
    date: "2026-06-30",
    read: "8 min read",
  },
  {
    slug: "/blog/how-to-repurpose-podcasts-into-shorts",
    title: "How to Repurpose a Podcast into Viral Shorts (2026 Guide)",
    excerpt:
      "A step-by-step workflow to turn a 60-minute podcast into 10+ shorts for TikTok, Reels and YouTube Shorts.",
    date: "2026-06-30",
    read: "9 min read",
  },
  {
    slug: "/blog/best-ai-clip-generators-2026",
    title: "The 7 Best AI Clip Generators in 2026 (Tested & Ranked)",
    excerpt:
      "We tested the top AI tools that turn long videos into shorts. Here are the seven that actually deliver.",
    date: "2026-06-30",
    read: "10 min read",
  },
];

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL_ },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL_ }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Clipra Blog",
          url: URL_,
          publisher: { "@type": "Organization", name: "Clipra", url: "https://theclipra.com" },
          blogPost: POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `https://theclipra.com${p.slug}`,
            datePublished: p.date,
          })),
        }),
      },
    ],
  }),
});

function BlogIndex() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 sm:px-6 pt-28 pb-16">
        <header className="mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">Blog</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-display font-semibold tracking-tight">
            Make better shorts, faster
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Practical guides on AI clipping, podcast repurposing, and growing on TikTok, Reels, and YouTube Shorts.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-5">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              to={p.slug as any}
              className="glass rounded-2xl p-6 hover-lift border-gradient group flex flex-col"
            >
              <div className="text-xs text-muted-foreground">
                {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {p.read}
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent group-hover:gap-2 transition-all">
                Read article <ArrowRight className="size-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
