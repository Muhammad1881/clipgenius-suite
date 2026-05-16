import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Upload, FileText, Wand2, Scissors, Captions, Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/processing")({ component: Processing });

const steps = [
  { icon: Upload, label: "Uploading", desc: "Securely uploading your video to the cloud" },
  { icon: FileText, label: "Transcribing", desc: "AI is transcribing every word with 99% accuracy" },
  { icon: Wand2, label: "Finding viral moments", desc: "Scoring every second for viral potential" },
  { icon: Scissors, label: "Generating clips", desc: "Auto-reframing to 9:16 and cutting clips" },
  { icon: Captions, label: "Adding captions", desc: "Word-by-word captions, styled to convert" },
];

function Processing() {
  const nav = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= steps.length) { setTimeout(() => nav({ to: "/results" }), 600); return; }
    const t = setTimeout(() => setCurrent((c) => c + 1), 1600);
    return () => clearTimeout(t);
  }, [current, nav]);

  const pct = Math.min(100, (current / steps.length) * 100);

  return (
    <div className="min-h-screen p-8 grid place-items-center">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <div className="relative mx-auto size-32 grid place-items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 blur-2xl animate-pulse-glow" />
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-2 rounded-full border border-primary/40 animate-spin" style={{animationDuration: "3s"}} />
            <div className="absolute inset-5 rounded-full border border-accent/40 animate-spin" style={{animationDuration: "5s", animationDirection: "reverse"}} />
            <div className="relative size-16 rounded-2xl bg-gradient-primary grid place-items-center glow">
              <Wand2 className="size-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold mt-8">Working our magic ✨</h1>
          <p className="text-muted-foreground mt-2">Sit tight — usually takes 2-5 minutes.</p>
          <div className="mt-6 max-w-sm mx-auto">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{Math.round(pct)}% complete</div>
          </div>
        </div>

        <div className="mt-12 glass-strong rounded-3xl p-3">
          <ul>
            {steps.map((s, i) => {
              const state = i < current ? "done" : i === current ? "active" : "pending";
              return (
                <li key={s.label} className={`flex items-center gap-4 p-4 rounded-2xl transition ${state === "active" ? "bg-white/5" : ""}`}>
                  <div className={`size-10 rounded-xl grid place-items-center shrink-0 ${
                    state === "done" ? "bg-accent/20 text-accent" :
                    state === "active" ? "bg-gradient-primary text-primary-foreground glow" : "bg-white/5 text-muted-foreground"
                  }`}>
                    {state === "done" ? <Check className="size-5" /> :
                     state === "active" ? <Loader2 className="size-5 animate-spin" /> :
                     <s.icon className="size-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${state === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                  <span className={`text-xs ${state === "done" ? "text-accent" : state === "active" ? "text-foreground" : "text-muted-foreground"}`}>
                    {state === "done" ? "Done" : state === "active" ? "In progress" : "Waiting"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
