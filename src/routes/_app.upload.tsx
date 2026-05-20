import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileVideo, Link2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/upload")({ component: UploadPage });

function UploadPage() {
  const nav = useNavigate();
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const onFile = useCallback((f: File) => {
    setFile(f); setProgress(0); setDone(false);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); setDone(true); return 100; }
        return p + 4;
      });
    }, 80);
  }, []);

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto relative">
      <div className="absolute inset-x-0 top-0 h-80 bg-mesh opacity-40 -z-10 pointer-events-none" />
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Upload a video</h1>
      <p className="text-muted-foreground mt-1.5">Drop a file or paste a link. We support MP4, MOV, WEBM up to 4 hours.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className={`mt-8 glass rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-2 border-dashed ${
          drag ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10"
        }`}
      >
        <div className="mx-auto size-16 rounded-2xl bg-gradient-vivid grid place-items-center glow mb-5 animate-float shadow-elevated">
          <UploadIcon className="size-7 text-primary-foreground" />
        </div>
        <div className="text-lg font-semibold tracking-tight">Drag & drop your video here</div>
        <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
        <label className="inline-block mt-5">
          <input type="file" accept="video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          <span className="btn-premium inline-flex items-center gap-2 cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium">
            <FileVideo className="size-4" /> Select file
          </span>
        </label>
        <div className="mt-6 flex items-center gap-3 max-w-md mx-auto">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Paste YouTube or video URL" className="pl-9 glass border-white/10" />
          </div>
          <Button className="btn-premium rounded-xl">Import</Button>
        </div>
      </div>

      {file && (
        <div className="mt-6 glass rounded-2xl p-5 sm:p-6 border-gradient">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-xl bg-gradient-to-br from-primary/40 to-accent/30 grid place-items-center shadow-card">
              <FileVideo className="size-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024 / 1024).toFixed(1)} MB · video/{file.type.split("/")[1] || "mp4"}</div>
            </div>
            <button onClick={() => { setFile(null); setProgress(0); setDone(false); }} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-muted-foreground">{done ? "Upload complete" : "Uploading..."}</span>
              <span className="text-foreground font-medium">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-vivid transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="glass rounded-xl p-3"><div className="text-xs text-muted-foreground">Duration</div><div className="font-medium mt-1">~ 47 min</div></div>
            <div className="glass rounded-xl p-3"><div className="text-xs text-muted-foreground">Resolution</div><div className="font-medium mt-1">1920 × 1080</div></div>
            <div className="glass rounded-xl p-3"><div className="text-xs text-muted-foreground">Est. credits</div><div className="font-medium mt-1">47 credits</div></div>
          </div>

          <Button disabled={!done} onClick={() => nav({ to: "/processing" })}
            className="mt-6 w-full btn-premium rounded-xl h-12 disabled:opacity-50">
            <Sparkles className="size-4 mr-2" /> Generate viral shorts
          </Button>
        </div>
      )}
    </div>
  );
}
