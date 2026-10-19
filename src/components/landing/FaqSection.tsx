import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What kinds of videos work best?",
    a: "Podcasts, interviews, webinars, educational videos, commentaries, and single or multi-speaker YouTube videos work best. Clipra's neural audio engine looks for clear conversational narrative, humor, strong opinions, and emotional inflection to identify viral hooks.",
  },
  {
    q: "How long does processing take?",
    a: "Most 30-to-60-minute long videos process in under 3 to 5 minutes. Clipra transcribes the full audio, scores viral moments, reframes faces to 9:16, generates dynamic animated captions, and produces ready-to-download clips simultaneously.",
  },
  {
    q: "Can I edit the clips after?",
    a: "Yes. While Clipra gives you export-ready clips automatically, you can open our built-in video editor to adjust start and end frames, edit subtitle wording, tweak font styles and colors, change vertical crop alignment, or customize hashtags.",
  },
  {
    q: "Do you support other languages?",
    a: "Yes, Clipra supports speech transcription and animated subtitles in multiple languages including Spanish, French, German, Italian, Portuguese, Hindi, Japanese, and Mandarin, along with instant translation into English.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, our Free plan provides 60 free minutes every month with no credit card required. You can try the entire automated pipeline, generate shorts, and upgrade only when you need watermark-free exports and extra monthly minutes.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 px-6 border-t border-white/[0.07]" id="faq">
      <div className="max-w-[850px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-[#06B6D4] bg-[#06B6D4]/10 px-3 py-1 rounded-full border border-[#06B6D4]/20 mb-3">
            FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Questions, answered.
          </h2>
          <p className="text-zinc-400 text-sm">
            Everything you need to know about processing videos with Clipra.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="glass-panel rounded-2xl overflow-hidden border border-zinc-800 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 flex justify-between items-center text-left bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
                >
                  <h3 className="font-semibold text-white text-base pr-4">
                    {faq.q}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100 px-6 pt-4 pb-5" : "max-h-0 opacity-0 px-6 py-0"
                  }`}
                >
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
