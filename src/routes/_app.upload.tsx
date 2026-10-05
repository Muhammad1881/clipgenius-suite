import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload as UploadIcon, FileVideo, Link2, X, Sparkles, Loader2, Download, TrendingUp, AlertCircle, Lock, FileText, Scissors, Captions, Hash, ScanLine, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const API_URL = "/api/video-upload";
const BACKEND_BASE = "https://api.theclipra.com";

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

function nameFromUrl(u: URL): string {
  const seg = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() ?? "");
  const clean = seg.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60);
  return clean || `imported-${u.hostname}`;
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

type PlanKey = "free" | "starter" | "creator";
type ClipSize = "30-60" | "60-90";

const PLAN_RULES: Record<PlanKey, { maxInputMinutes: number; summary: string; tooLongMessage: string }> = {
  free: {
    maxInputMinutes: 30,
    summary: "720p • 9:16 Center Crop • Up to 30 min",
    tooLongMessage: "Free supports videos up to 30 minutes. Upgrade to process longer videos.",
  },
  starter: {
    maxInputMinutes: 60,
    summary: "1080p • 9:16 Center Crop • Translation • Up to 60 min",
    tooLongMessage: "Starter supports videos up to 60 minutes. Upgrade to Creator for videos up to 120 minutes.",
  },
  creator: {
    maxInputMinutes: 120,
    summary: "1080p • AI Reframe • Translation • Up to 120 min",
    tooLongMessage: "Creator supports videos up to 120 minutes.",
  },
};

const CLIP_SIZES: { v: ClipSize; label: string; desc: string }[] = [
  { v: "30-60", label: "30–60 sec", desc: "Punchy, fast-paced clips" },
  { v: "60-90", label: "60–90 sec", desc: "More context per clip" },
];

const TARGET_LANGUAGES = [
  "English", "Spanish", "French", "German", "Portuguese", "Italian",
  "Hindi", "Urdu", "Arabic", "Turkish", "Russian", "Japanese", "Korean", "Chinese",
];

const PAID_PROCESSING_STEPS = {
  starter: [
    { icon: FileText, label: "Reading the conversation", detail: "Building a precise transcript" },
    { icon: TrendingUp, label: "Finding viral moments", detail: "Looking for hooks and standout moments" },
    { icon: Scissors, label: "Creating vertical clips", detail: "Cutting polished 9:16 clips in 1080p" },
    { icon: Captions, label: "Styling captions", detail: "Preparing clear, engaging subtitles" },
    { icon: Hash, label: "Preparing social copy", detail: "Generating captions and relevant hashtags" },
  ],
  creator: [
    { icon: FileText, label: "Understanding your video", detail: "Mapping speakers, topics, and key moments" },
    { icon: TrendingUp, label: "Finding viral moments", detail: "Scoring hooks, emotion, and audience value" },
    { icon: ScanLine, label: "AI reframing speakers", detail: "Tracking the action for a natural 9:16 frame" },
    { icon: Captions, label: "Styling captions", detail: "Creating polished, word-perfect subtitles" },
    { icon: Hash, label: "Preparing social copy", detail: "Generating captions and relevant hashtags" },
  ],
} as const;


function UploadPage() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stage, setStage] = useState<string | null>(null);
  const [waitingStep, setWaitingStep] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [clipSize, setClipSize] = useState<ClipSize>("30-60");
  const [translate, setTranslate] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(TARGET_LANGUAGES[0]);
  const { profile } = useProfile();
  const consume = useServerFn(consumeMinutes);
  const refund = useServerFn(refundMinutes);
  const profilePlan = profile?.plan;
  const planKey: PlanKey = profilePlan === "starter" || profilePlan === "creator" ? profilePlan : "free";

  const refetchProfile = async () => {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("profile:refresh"));
  };

  const remainingMinutes = profile ? profile.monthly_minutes - profile.minutes_used : 0;
  const busy = phase === "uploading" || phase === "processing";

  const processingSteps = planKey === "creator" ? PAID_PROCESSING_STEPS.creator : PAID_PROCESSING_STEPS.starter;

  useEffect(() => {
    if (phase !== "processing" || planKey === "free") {
      setWaitingStep(0);
      return;
    }
    const timer = window.setInterval(() => {
      setWaitingStep((current) => (current + 1) % processingSteps.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [phase, planKey, processingSteps.length]);


  // Cancellation / refund bookkeeping
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const importAbortRef = useRef<AbortController | null>(null);
  const jobIdRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reservationRef = useRef<{ minutes: number; active: boolean }>({ minutes: 0, active: false });
  const [cancelling, setCancelling] = useState(false);

  // Best-effort immediate cancel on the backend so the GPU job stops now.
  const notifyBackendCancel = useCallback((jobId: string) => {
    const url = `${BACKEND_BASE}/jobs/${jobId}/cancel`;
    // sendBeacon survives page unload; fetch(keepalive) is the fallback.
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([], { type: "text/plain" }));
      }
    } catch { /* noop */ }
    void fetch(url, { method: "POST", keepalive: true }).catch(() => { /* backend may not support cancel */ });
  }, []);

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
    try { importAbortRef.current?.abort(); } catch { /* noop */ }
    importAbortRef.current = null;

    const jobId = jobIdRef.current;
    jobIdRef.current = null;
    if (jobId) {
      // Tell the backend to kill the GPU/RunPod job immediately.
      void notifyBackendCancel(jobId);
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
        try { importAbortRef.current?.abort(); } catch { /* noop */ }
        // Kill the GPU job on the backend too when the user leaves mid-processing.
        if (jobIdRef.current) notifyBackendCancel(jobIdRef.current);
        void releaseReservation();
      }
    };
  }, [releaseReservation, notifyBackendCancel]);

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

  const saveProject = useCallback(async (payload: { clips: Clip[]; transcript?: any; viral_moments?: any }, sourceName: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { error: insertErr } = await supabase.from("projects").insert({
        user_id: uid,
        video_name: sourceName,
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
  }, []);

  const finish = useCallback(async (arr: Clip[], extra: { transcript?: any; viral_moments?: any }, sourceName: string) => {
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
    await saveProject({ clips: arr, transcript: extra.transcript, viral_moments: extra.viral_moments }, sourceName);
  }, [releaseReservation, saveProject]);

  // Shared job polling for both file uploads and link imports.
  const runJob = useCallback(async (jobId: string, sourceName: string, deductOnFinish: boolean) => {
    jobIdRef.current = jobId;
    setPhase("processing");
    setProgress(0);
    setStage("Queued…");
    const startedAt = Date.now();
    const MAX_WAIT_MS = 30 * 60 * 1000;

    const poll = async () => {
      if (cancelledRef.current) return;
      try {
        const res = await fetch(`${BACKEND_BASE}/jobs/${jobId}`);
        const job = await res.json();
        if (cancelledRef.current) return;

        if (job.status === "completed") {
          const arr: Clip[] = (job.result?.clips || []) as Clip[];
          // Link imports have no upfront reservation: deduct once, only for a real
          // result — and only hand over the clips if the deduction succeeds.
          if (deductOnFinish && arr.length > 0) {
            const secs = Number(
              job.result?.duration ??
              job.result?.duration_seconds ??
              job.result?.video_duration ??
              job.result?.input_duration ??
              0,
            );
            // If the processor doesn't report a duration, charge the plan's max
            // upload length — the same worst case a file upload would reserve.
            const minutes = secs > 0
              ? Math.min(240, Math.ceil(secs / 60))
              : PLAN_RULES[planKey].maxInputMinutes;
            let paid = false;
            try {
              const r = await consume({ data: { minutes } });
              paid = !!r.ok;
              await refetchProfile();
            } catch (e) {
              console.error("Failed to deduct minutes for imported video:", e);
            }
            if (!paid) {
              setError(`This video needed ${minutes} minutes, but your plan doesn't have enough left. Upgrade your plan and import it again — you were not charged.`);
              setStage(null);
              setPhase("error");
              return;
            }
          }
          await finish(arr, {
            transcript: job.result?.transcript,
            viral_moments: job.result?.viral_moments ?? job.result?.moments,
          }, sourceName);
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
  }, [consume, finish, releaseReservation, planKey, refetchProfile]);

  const importFromUrl = async () => {
    if (busy) return;
    const rawLink = videoUrl.trim();
    if (!rawLink) {
      setError("Paste a video link first, or drop a file above.");
      return;
    }
    let parsedLink: URL;
    try {
      parsedLink = new URL(/^https?:\/\//i.test(rawLink) ? rawLink : `https://${rawLink}`);
    } catch {
      setError("That doesn't look like a valid link — paste the full URL.");
      return;
    }
    if (parsedLink.protocol !== "http:" && parsedLink.protocol !== "https:") {
      setError("Only http(s) links are supported.");
      return;
    }

    const host = parsedLink.hostname.replace(/^www\./, "").toLowerCase();
    const SOCIAL_HOSTS = [
      "youtube.com", "youtu.be", "tiktok.com", "instagram.com", "vimeo.com",
      "facebook.com", "fb.watch", "twitter.com", "x.com", "twitch.tv",
      "dailymotion.com", "reddit.com",
    ];
    if (SOCIAL_HOSTS.some((s) => host === s || host.endsWith(`.${s}`))) {
      const msg = "YouTube and social links aren't supported yet. Direct video file links (.mp4, .mov, .webm) import today — or upload the file above.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (remainingMinutes <= 0) {
      const msg = "You do not have enough minutes remaining.";
      setError(msg);
      toast.error(msg);
      return;
    }

    cancelledRef.current = false;
    jobIdRef.current = null;
    setPhase("processing");
    setStage("Downloading video from link…");
    setProgress(0);
    setError(null);
    setClips([]);
    setFile(null);
    setDurationMin(null);

    const controller = new AbortController();
    importAbortRef.current = controller;

    try {
      const res = await fetch("/api/video-import", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: parsedLink.toString(),
          plan: planKey,
          clipSize: planKey !== "free" ? clipSize : undefined,
          translate: planKey !== "free" ? translate : false,
          targetLanguage: planKey !== "free" && translate ? targetLanguage : undefined,
        }),
        signal: controller.signal,
      });
      importAbortRef.current = null;
      if (cancelledRef.current) return;
      const data = await res.json().catch(() => null);
      if (res.ok && data?.jobId) {
        await runJob(String(data.jobId), nameFromUrl(parsedLink), true);
      } else {
        const msg =
          data?.error ||
          data?.detail ||
          (res.status === 415 ? "That link isn't a direct video file." : undefined) ||
          "Could not import from this link. Try a direct .mp4 link or upload the file.";
        setError(msg);
        setPhase("error");
        toast.error(msg);
      }
    } catch (e: any) {
      importAbortRef.current = null;
      if (cancelledRef.current || e?.name === "AbortError") return;
      const msg = "Could not reach that link. Check it and try again, or upload the file directly.";
      setError(msg);
      setPhase("error");
      toast.error(msg);
    }
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
    xhr.upload.onload = () => {
      if (!cancelledRef.current) {
        setProgress(0);
        setStage("Queued…");
        setPhase("processing");
      }
    };
    xhr.onabort = () => { /* handled by cancelJob */ };


    xhr.onload = async () => {
      if (cancelledRef.current) return;
      const raw = xhr.responseText;
      let parsed: any = null;
      try { parsed = JSON.parse(raw); } catch { /* not json */ }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (parsed?.jobId) {
          await runJob(String(parsed.jobId), file.name, false);
        } else {
          const arr: Clip[] = Array.isArray(parsed?.clips)
            ? parsed.clips
            : Array.isArray(parsed)
              ? parsed
              : [];

          await finish(arr, {
            transcript: parsed?.transcript,
            viral_moments: parsed?.viral_moments ?? parsed?.moments,
          }, file.name);
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
        <form
          className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          onSubmit={(e) => { e.preventDefault(); void importFromUrl(); }}
        >
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={videoUrl}
              onChange={(e) => { setVideoUrl(e.target.value); if (error && !file) setError(null); }}
              placeholder="Paste YouTube or video URL"
              disabled={busy}
              className="pl-9 glass border-white/10"
            />
          </div>
          <Button type="submit" disabled={busy} className="btn-premium rounded-xl">Import</Button>
        </form>
        {error && !file && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm max-w-md mx-auto">
            <AlertCircle className="size-4 text-destructive mt-0.5 shrink-0" />
            <div className="text-destructive text-left">{error}</div>
          </div>
        )}
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


          {phase === "uploading" && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Uploading securely…</span>
                <span className="text-foreground font-medium">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-vivid transition-all duration-300"
                  style={{ width: `${progress}%` }}
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
        <div className="mt-8 glass rounded-2xl p-6 sm:p-8 border-gradient" aria-live="polite">
          <div className="relative mx-auto size-20 grid place-items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-vivid opacity-40 blur-2xl animate-pulse-glow" />
            <div className="relative size-14 rounded-2xl bg-gradient-vivid grid place-items-center glow">
              <Loader2 className="size-6 text-primary-foreground animate-spin" />
            </div>
          </div>
          {planKey === "free" ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold mt-5">Waiting for your clips…</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Your video is safely processing on the server. Keep this page open and your clips will appear here when ready.
              </p>
              <div className="mt-5 h-1.5 max-w-sm mx-auto overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/3 rounded-full bg-gradient-vivid animate-processing-wait" />
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-accent">
                  {planKey === "creator" ? "Creator AI workflow" : "Starter workflow"}
                </div>
                <h2 className="text-lg font-semibold mt-1">{processingSteps[waitingStep]?.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{processingSteps[waitingStep]?.detail}</p>
                {translate && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent">
                    <Languages className="size-3.5" /> Translating subtitles to {targetLanguage}
                  </div>
                )}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {processingSteps.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === waitingStep;
                  return (
                    <div
                      key={item.label}
                      className={`flex min-h-14 items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-500 ${active ? "border-primary/40 bg-primary/10 shadow-card" : "border-white/5 bg-white/[0.02] opacity-55"}`}
                    >
                      <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${active ? "bg-gradient-vivid text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}>
                        {active ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="text-xs font-medium">{item.label}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{item.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {stage && stage !== "Processing…" ? `Server status: ${stage}` : "This can take a few minutes. Your video keeps processing while you wait."}
              </p>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={cancelling}
            onClick={() => void cancelJob()}
            className="mt-5 rounded-xl border-white/15"
          >
            {cancelling ? <><Loader2 className="size-3.5 mr-1.5 animate-spin" /> Cancelling</> : <><X className="size-3.5 mr-1.5" /> {reservationRef.current.active ? "Cancel and refund minutes" : "Cancel"}</>}
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
                        isPaid={planKey !== "free"}
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
