import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload as UploadIcon, FileVideo, Link2, X, Sparkles, Loader2, Download, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { consumeMinutes, refundMinutes } from "@/lib/billing.functions";
import { CopyButton, SocialMetaBlock } from "@/components/ClipSocialMeta";


export const Route = createFileRoute("/_app/upload")({
  component: UploadPage,
  head: () => ({
    meta: [
      { title: "Upload Video — Clipra" },
      { name: "description", content: "Upload a long video to Clipra and let AI clip the most viral moments with captions." },
      { property: "og:title", content: "Upload Video — Clipra" },
      { property: "og:description", content: "Drop a video or paste a link — Clipra finds the most viral moments and clips them for you." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const API_URL = "/api/video-upload";
const BACKEND_BASE = "https://api.clipra.bond";

function resolveClipUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/clips/")) return `/api/clips/${url.slice("/clips/".length)}`;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BACKEND_BASE}${url}`;
  return url;
}

function safeFileName(title: string): string {
  return `${title.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60) || "clip"}.mp4`;
}

function toDownloadUrl(url: string | undefined, title: string): string | undefined {
  const resolved = resolveClipUrl(url);
  if (!resolved) return undefined;
  if (!resolved.startsWith("/api/clips/")) return resolved;
  return `${resolved}?download=1&filename=${encodeURIComponent(safeFileName(title))}`;
}



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
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [subtitleLanguage, setSubtitleLanguage] = useState<"same" | "english">("same");
  const { profile } = useProfile();
  const consume = useServerFn(consumeMinutes);
  const refund = useServerFn(refundMinutes);
  const isPaid = (profile?.plan ?? "free") !== "free";
  const refetchProfile = async () => {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("profile:refresh"));
  };

  const remainingMinutes = profile ? profile.monthly_minutes - profile.minutes_used : 0;

  // Cancellation / refund bookkeeping
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const jobIdRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reservationRef = useRef<{ minutes: number; active: boolean }>({ minutes: 0, active: false });
  const [cancelling, setCancelling] = useState(false);

  const releaseReservation = useCallback(async () => {
    const res = reservationRef.current;
    if (!res.active || res.minutes <= 0) return;
    reservationRef.current = { minutes: 0, active: false };
    try {
      await refund({ data: { minutes: res.minutes } });
      if (typeof window !== "undefined") window.dispatchEvent(new Event("profile:refresh"));
    } catch (e) {
      console.error("Failed to refund minutes:", e);
    }
  }, [refund]);

  const cancelJob = useCallback(async () => {
    cancelledRef.current = true;
    setCancelling(true);
    if (pollTimerRef.current) { clearTimeout(pollTimerRef.current); pollTimerRef.current = null; }
    try { xhrRef.current?.abort(); } catch { /* noop */ }
    xhrRef.current = null;

    const jobId = jobIdRef.current;
    jobIdRef.current = null;
    if (jobId) {
      try {
        await fetch(`${BACKEND_BASE}/jobs/${jobId}/cancel`, { method: "POST", keepalive: true });
      } catch { /* backend may not support cancel; ignore */ }
    }

    await releaseReservation();
    setPhase("idle");
    setStage(null);
    setProgress(0);
    setClips([]);
    setError(null);
    setCancelling(false);
    toast.success("Processing cancelled — your minutes were not used.");
  }, [releaseReservation]);

  // Abandon safely if the user leaves mid-processing: refund reserved minutes.
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      if (reservationRef.current.active) {
        cancelledRef.current = true;
        try { xhrRef.current?.abort(); } catch { /* noop */ }
        void releaseReservation();
      }
    };
  }, [releaseReservation]);

  const readDurationMinutes = (f: File): Promise<number> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(f);
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(v.duration / 60);
      };
      v.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read video duration.")); };
      v.src = url;
    });

  const onFile = useCallback(async (f: File) => {
    setFile(f); setProgress(0); setPhase("idle"); setError(null); setClips([]); setDurationMin(null);
    try {
      const mins = await readDurationMinutes(f);
      setDurationMin(mins);
    } catch (e: any) {
      setError(e?.message || "Could not read video duration.");
    }
  }, []);

  const reset = () => {
    if (phase === "uploading" || phase === "processing") {
      void cancelJob();
      return;
    }
    setFile(null); setProgress(0); setPhase("idle"); setError(null); setClips([]); setDurationMin(null); setStage(null);
  };

  const upload = async () => {
    if (!file) return;
    const minutesNeeded = durationMin != null ? Math.ceil(durationMin) : null;
    if (minutesNeeded == null) {
      setError("Could not read video duration.");
      setPhase("error");
      return;
    }

    const rules = PLAN_RULES[planKey];
    if (minutesNeeded > rules.maxInputMinutes) {
      setError(rules.tooLongMessage);
      setPhase("error");
      toast.error(rules.tooLongMessage);
      return;
    }


    const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // Cloudflare proxy body limit
    if (file.size > MAX_UPLOAD_BYTES) {
      const msg = `This file is ${(file.size / 1024 / 1024).toFixed(0)} MB. Uploads are limited to 100 MB — please compress or trim the video and try again.`;
      setError(msg);
      setPhase("error");
      toast.error(msg);
      return;
    }



    // Server-side quota reservation (atomic) BEFORE upload starts.
    cancelledRef.current = false;
    jobIdRef.current = null;
    setPhase("uploading"); setError(null); setClips([]); setProgress(0); setStage(null);
    try {
      const r = await consume({ data: { minutes: minutesNeeded } });
      if (!r.ok) {
        const msg = "You do not have enough minutes remaining.";
        setError(msg);
        setPhase("error");
        toast.error(msg);
        await refetchProfile();
        return;
      }
      reservationRef.current = { minutes: minutesNeeded, active: true };
      await refetchProfile();
      if (cancelledRef.current) { await releaseReservation(); return; }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not reserve minutes.";
      setError(msg);
      setPhase("error");
      toast.error(msg);
      return;
    }

    const form = new FormData();
    form.append("video", file);
    form.append("plan", planKey);
    if (planKey !== "free") {
      form.append("clipSize", clipSize);
      form.append("translate", translate ? "true" : "false");
      if (translate) form.append("targetLanguage", targetLanguage);
    } else {
      form.append("translate", "false");
    }


    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", API_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.upload.onload = () => { if (!cancelledRef.current) setPhase("processing"); };
    xhr.onabort = () => { /* handled by cancelJob */ };

    const saveProject = async (payload: { clips: Clip[]; transcript?: any; viral_moments?: any }) => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData.user?.id;
        if (!uid) return;
        const { error: insertErr } = await supabase.from("projects").insert({
          user_id: uid,
          video_name: file.name,
          transcript: (payload.transcript ?? null) as string | null,
          viral_moments: payload.viral_moments ?? null,
          clips: payload.clips as any,
        });
        if (insertErr) {
          console.error("Failed to save project:", insertErr);
          toast.error("Clips generated, but couldn't save project history.");
        } else {
          toast.success("Project saved to your history.");
        }
      } catch (e) {
        console.error(e);
      }
    };

    const finish = async (arr: Clip[], extra: { transcript?: any; viral_moments?: any }) => {
      if (cancelledRef.current) return;
      setClips(arr);
      setStage(null);
      setPhase("done");
      if (arr.length === 0) {
        // Nothing was generated — never charge for that.
        await releaseReservation();
        toast.error("No clips could be generated from this video — your minutes were not deducted.");
        return;
      }
      reservationRef.current = { minutes: 0, active: false };
      await saveProject({ clips: arr, transcript: extra.transcript, viral_moments: extra.viral_moments });
    };

    xhr.onload = async () => {
      if (cancelledRef.current) return;
      const raw = xhr.responseText;
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch { /* not json */ }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (parsed?.jobId) {
          jobIdRef.current = String(parsed.jobId);
          setPhase("processing");
          setStage("Queued…");
          const startedAt = Date.now();
          const MAX_WAIT_MS = 30 * 60 * 1000;

          const poll = async () => {
            if (cancelledRef.current) return;
            try {
              const res = await fetch(`${BACKEND_BASE}/jobs/${parsed.jobId}`);
              const job = await res.json();
              if (cancelledRef.current) return;

              if (job.status === "completed") {
                await finish((job.result?.clips || []) as Clip[], {
                  transcript: job.result?.transcript,
                  viral_moments: job.result?.viral_moments ?? job.result?.moments,
                });
                return;
              }

              if (job.status === "failed" || job.status === "cancelled") {
                setError(job.error || "The processing server could not finish this video. Your minutes were not deducted.");
                setStage(null);
                setPhase("error");
                await releaseReservation();
                return;
              }

              if (typeof job.progress === "number") setProgress(job.progress);
              setStage(job.stage || "Processing…");

              if (Date.now() - startedAt > MAX_WAIT_MS) {
                setError("Processing is taking unusually long, so we stopped it and returned your minutes. Please try again or use a shorter video.");
                setStage(null);
                setPhase("error");
                await releaseReservation();
                return;
              }

              pollTimerRef.current = setTimeout(poll, 2500);
            } catch {
              if (!cancelledRef.current) pollTimerRef.current = setTimeout(poll, 4000);
            }
          };

          poll();
        } else {
          const arr: Clip[] = Array.isArray(parsed?.clips)
            ? parsed.clips
            : Array.isArray(parsed)
              ? parsed
              : [];

          await finish(arr, {
            transcript: parsed?.transcript,
            viral_moments: parsed?.viral_moments ?? parsed?.moments,
          });
        }
      } else {

        const timedOut = xhr.status === 524 || xhr.status === 522 || xhr.status === 504;
        const msg = timedOut
          ? "Processing took longer than the 100-second network limit, so the connection was closed before your clips came back. Try a shorter video for now — long videos need the processing server to run in the background."
          : parsed?.error ||
            parsed?.message ||
            parsed?.detail ||
            (raw && raw.length < 500 ? raw : "") ||
            `Upload failed (${xhr.status} ${xhr.statusText || ""})`.trim();
        setError(`${msg} Your minutes were not deducted.`);
        setPhase("error");
        await releaseReservation();
      }
    };
    xhr.onerror = async () => {
      if (cancelledRef.current) return;
      setError(
        "The processing connection was interrupted, so your minutes were returned. Your video size is not necessarily the problem—please try once more."
      );
      setPhase("error");
      await releaseReservation();
    };


    xhr.send(form);
  };


  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto relative">
      <div className="absolute inset-x-0 top-0 h-80 bg-mesh opacity-40 -z-10 pointer-events-none" />
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Upload a video</h1>
      <p className="text-muted-foreground mt-1.5">Drop a file or paste a link.</p>
      <div className="mt-4 inline-flex flex-wrap items-center gap-2 glass rounded-full px-4 py-2 border border-white/10">
        <span className="text-[10px] uppercase tracking-widest text-accent">{planKey} plan</span>
        <span className="h-3 w-px bg-white/10" />
        <span className="text-xs text-muted-foreground">{PLAN_RULES[planKey].summary}</span>
      </div>


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
              <div className="text-xs text-muted-foreground mt-0.5">
                {(file.size / 1024 / 1024).toFixed(1)} MB · video/{file.type.split("/")[1] || "mp4"}
                {durationMin != null && <> · {Math.ceil(durationMin)} min · {remainingMinutes} min remaining</>}
              </div>
            </div>
            <button
              onClick={reset}
              disabled={cancelling}
              title={phase === "uploading" || phase === "processing" ? "Cancel processing" : "Remove file"}
              aria-label={phase === "uploading" || phase === "processing" ? "Cancel processing" : "Remove file"}
              className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {planKey !== "free" && (
              <div>
                <div className="text-sm font-medium mb-2">Clip Length</div>
                <div className="grid grid-cols-2 gap-2">
                  {CLIP_SIZES.map((opt) => {
                    const active = clipSize === opt.v;
                    return (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setClipSize(opt.v)}
                        disabled={busy}
                        className={`text-left rounded-xl px-4 py-3 border transition-all ${
                          active
                            ? "border-primary bg-primary/10 shadow-card"
                            : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                        }`}
                      >
                        <div className="text-sm font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Translate Subtitles</span>
                  {planKey === "free" && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                      <Lock className="size-3" /> Upgrade
                    </span>
                  )}
                </div>
                <Switch
                  checked={translate}
                  disabled={planKey === "free" || busy}
                  onCheckedChange={(v) => setTranslate(v)}
                  aria-label="Translate subtitles"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {planKey === "free"
                  ? "Subtitle translation is available on Starter and Creator."
                  : "Burn translated subtitles into your clips."}
              </p>

              {planKey !== "free" && translate && (
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1.5">Target language</div>
                  <select
                    value={targetLanguage}
                    disabled={busy}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                  >
                    {TARGET_LANGUAGES.map((l) => (
                      <option key={l} value={l} className="bg-background">{l}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>


          {(phase === "uploading" || phase === "processing") && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">
                  {phase === "uploading" ? "Uploading..." : (stage || "Processing on server...")}
                </span>
                <span className="text-foreground font-medium">{progress ? `${progress}%` : ""}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full bg-gradient-vivid transition-all duration-300 ${phase === "processing" && !progress ? "animate-pulse w-full" : ""}`}
                  style={{ width: progress ? `${progress}%` : undefined }}
                />

              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Cancelling returns your reserved minutes.
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={cancelling}
                  onClick={() => void cancelJob()}
                  className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {cancelling ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Cancelling</> : <><X className="size-3.5 mr-1.5" /> Cancel</>}
                </Button>
              </div>
            </div>
          )}

          {phase === "error" && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-destructive">{error}</div>
            </div>
          )}

          {durationMin != null && Math.ceil(durationMin) > remainingMinutes && phase !== "uploading" && phase !== "processing" && (
            <div className="mt-5 text-sm text-destructive">
              You do not have enough minutes remaining.
            </div>
          )}

          <Button
            disabled={
              phase === "uploading" ||
              phase === "processing" ||
              (durationMin != null && Math.ceil(durationMin) > remainingMinutes)
            }
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
          <p className="text-sm text-muted-foreground mt-1">{stage ? `${stage}${progress ? ` · ${progress}%` : ""}` : "Our AI is analyzing your video. This may take a few minutes."}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={cancelling}
            onClick={() => void cancelJob()}
            className="mt-5 rounded-xl border-white/15"
          >
            {cancelling ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Cancelling</> : <><X className="size-3.5 mr-1.5" /> Cancel and refund minutes</>}
          </Button>
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

          <p className="text-xs text-muted-foreground mb-4">
            Generated files are automatically deleted after 24 hours.
          </p>


          {clips.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
              The server returned no clips.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {clips.map((c, i) => {
                const videoSrc = resolveClipUrl((c.video_url || c.url || c.preview_url) as string | undefined);
                const title = (c.title as string) || `Clip ${i + 1}`;
                const downloadHref = toDownloadUrl((c.download_url || c.url || c.video_url) as string | undefined, title);
                const score = typeof c.score === "number" ? Math.round(c.score) : undefined;
                return (
                  <div key={i} className="glass rounded-2xl overflow-hidden group hover-lift border-gradient flex flex-col">
                    <div className="aspect-[9/16] max-h-[50vh] relative bg-gradient-to-br from-primary/40 via-card to-accent/30 overflow-hidden rounded-t-2xl">
                      {videoSrc ? (
                        <video src={videoSrc} controls className="w-full h-full object-contain rounded-t-2xl" />
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
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium line-clamp-2 text-sm flex-1">{title}</div>
                        <CopyButton value={title} label="Title" />
                      </div>
                      <SocialMetaBlock
                        title={title}
                        reason={(c.reason as string) ?? null}
                        transcript={(c.transcript as string) ?? null}
                        isPaid={isPaid}
                      />
                      <div className="mt-4">
                        <Button
                          asChild={!!downloadHref}
                          size="sm"
                          disabled={!downloadHref}
                          className="w-full btn-premium rounded-lg"
                        >
                          {downloadHref ? (
                            <a href={downloadHref} download={safeFileName(title)} rel="noreferrer">
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
