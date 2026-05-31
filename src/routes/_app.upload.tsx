import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileVideo, Link2, X, Sparkles, Loader2, Download, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/upload")({ component: UploadPage });

const API_URL = "http://178.105.192.132:5000/upload";

type Clip = {
  title?: string;
  score?: number;
  url?: string;
  video_url?: string;
  preview_url?: string;
  download_url?: string;
  [k: string]: unknown;
};

type Phase = "idle" | "uploading" | "processing" | "done" | "error";

function UploadPage() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);

  const onFile = useCallback((f: File) => {
    setFile(f); setProgress(0); setPhase("idle"); setError(null); setClips([]);
  }, []);

  const reset = () => {
    setFile(null); setProgress(0); setPhase("idle"); setError(null); setClips([]);
  };

  const upload = () => {
    if (!file) return;
    setPhase("uploading"); setError(null); setClips([]); setProgress(0);

    const form = new FormData();
    form.append("video", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.upload.onload = () => setPhase("processing");

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const arr: Clip[] = Array.isArray(data?.clips) ? data.clips : Array.isArray(data) ? data : [];
          setClips(arr);
          setPhase("done");
        } catch {
          setError("Invalid response from server"); setPhase("error");
        }
      } else {
        setError(`Upload failed (${xhr.status})`); setPhase("error");
      }
    };
    xhr.onerror = () => {
      setError("Network error. The backend may be unreachable or blocked by mixed-content (HTTPS → HTTP)."); setPhase("error");
    };

    xhr.send(form);
  };

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
            <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {(phase === "uploading" || phase === "processing") && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">
                  {phase === "uploading" ? "Uploading..." : "Processing on server..."}
                </span>
                <span className="text-foreground font-medium">{phase === "uploading" ? `${progress}%` : ""}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full bg-gradient-vivid transition-all duration-300 ${phase === "processing" ? "animate-pulse w-full" : ""}`}
                  style={phase === "uploading" ? { width: `${progress}%` } : undefined}
                />
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-destructive">{error}</div>
            </div>
          )}

          <Button
            disabled={phase === "uploading" || phase === "processing"}
            onClick={upload}
            className="mt-6 w-full btn-premium rounded-xl h-12 disabled:opacity-50"
          >
            {phase === "uploading" || phase === "processing" ? (
              <><Loader2 className="size-4 mr-2 animate-spin" /> {phase === "uploading" ? "Uploading" : "Generating clips"}</>
            ) : (
              <><Sparkles className="size-4 mr-2" /> Generate viral shorts</>
            )}
          </Button>
        </div>
      )}

      {phase === "processing" && (
        <div className="mt-8 glass rounded-2xl p-8 text-center border-gradient">
          <div className="relative mx-auto size-20 grid place-items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-vivid opacity-40 blur-2xl animate-pulse-glow" />
            <div className="relative size-14 rounded-2xl bg-gradient-vivid grid place-items-center glow">
              <Loader2 className="size-6 text-primary-foreground animate-spin" />
            </div>
          </div>
          <h2 className="text-lg font-semibold mt-5">Finding viral moments…</h2>
          <p className="text-sm text-muted-foreground mt-1">Our AI is analyzing your video. This may take a few minutes.</p>
        </div>
      )}

      {phase === "done" && (
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent">Results</div>
              <h2 className="text-xl sm:text-2xl font-semibold mt-1 tracking-tight">
                {clips.length} clip{clips.length === 1 ? "" : "s"} generated
              </h2>
            </div>
          </div>

          {clips.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
              The server returned no clips.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {clips.map((c, i) => {
                const videoSrc = (c.video_url || c.url || c.preview_url) as string | undefined;
                const downloadHref = (c.download_url || c.url || c.video_url) as string | undefined;
                const title = (c.title as string) || `Clip ${i + 1}`;
                const score = typeof c.score === "number" ? Math.round(c.score) : undefined;
                return (
                  <div key={i} className="glass rounded-2xl overflow-hidden group hover-lift border-gradient">
                    <div className="aspect-[9/16] relative bg-gradient-to-br from-primary/40 via-card to-accent/30 overflow-hidden">
                      {videoSrc ? (
                        <video src={videoSrc} controls className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">No preview</div>
                      )}
                      {score !== undefined && (
                        <div className="absolute top-3 left-3 glass px-2 py-1 rounded-md text-xs flex items-center gap-1 pointer-events-none">
                          <TrendingUp className="size-3 text-accent" />
                          <span className="text-accent font-medium">{score}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-medium line-clamp-2 text-sm">{title}</div>
                      <div className="mt-4">
                        <Button
                          asChild={!!downloadHref}
                          size="sm"
                          disabled={!downloadHref}
                          className="w-full btn-premium rounded-lg"
                        >
                          {downloadHref ? (
                            <a href={downloadHref} download target="_blank" rel="noreferrer">
                              <Download className="size-3.5 mr-1.5" /> Download
                            </a>
                          ) : (
                            <span><Download className="size-3.5 mr-1.5" /> Download</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
