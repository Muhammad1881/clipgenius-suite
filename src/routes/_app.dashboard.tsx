import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Clock,
  TrendingUp,
  ChevronRight,
  Video,
  RefreshCw,
  Trash2,
  Play,
  Copy,
  Hash,
  Download,
  Target,
  Languages,
  X,
  Loader2,
  Upload as UploadIcon,
  CalendarDays,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { getSubscriptionInfo } from "@/lib/billing.functions";
import { useDashboardToast } from "./_app";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

const BACKEND_BASE = "https://api.theclipra.com";

type Clip = {
  title?: string;
  score?: number;
  reason?: string;
  transcript?: string;
  url?: string;
  video_url?: string;
  preview_url?: string;
  download_url?: string;
  [k: string]: unknown;
};

type Project = {
  id: string;
  video_name: string;
  clips: Clip[];
  created_at: string;
};

function resolveClipUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/clips/")) return `/api/clips/${url.slice("/clips/".length)}`;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BACKEND_BASE}${url}`;
  return url;
}

function toDownloadUrl(url: string | undefined, title: string): string | undefined {
  const resolved = resolveClipUrl(url);
  if (!resolved) return undefined;
  if (!resolved.startsWith("/api/clips/")) return resolved;
  const name = `${title.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60) || "clip"}.mp4`;
  return `${resolved}?download=1&filename=${encodeURIComponent(name)}`;
}

function avgScore(clips: Clip[]): number | null {
  const scores = clips
    .map((c) => (typeof c.score === "number" ? c.score : null))
    .filter((n): n is number => n !== null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function Dashboard() {
  const { showToast } = useDashboardToast();
  const { profile, loading } = useProfile();
  const getInfo = useServerFn(getSubscriptionInfo);

  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [activeClip, setActiveClip] = useState<{ clip: Clip; index: number } | null>(null);
  const [renewal, setRenewal] = useState<string | null>(null);

  const total = profile?.monthly_minutes ?? 60;
  const used = profile?.minutes_used ?? 0;
  const remaining = Math.max(0, total - used);
  const usedPct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const remainPct = Math.max(0, 100 - usedPct);
  const isPaid = !!profile?.plan && profile.plan !== "free";
  const planLabel = profile?.plan
    ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)
    : "Free";

  const renewalLabel = renewal
    ? new Date(renewal).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : null;
  const freeResetLabel = profile?.cycle_start
    ? new Date(new Date(profile.cycle_start).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
        undefined,
        { month: "short", day: "numeric", year: "numeric" },
      )
    : null;

  // Load latest project (projects auto-expire after 24h)
  useEffect(() => {
    let alive = true;
    (async () => {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("projects")
        .select("id, video_name, clips, created_at")
        .gte("created_at", cutoff)
        .order("created_at", { ascending: false })
        .limit(1);
      if (!alive) return;
      const p = data?.[0];
      setProject(
        p
          ? {
              id: p.id,
              video_name: p.video_name,
              created_at: p.created_at,
              clips: Array.isArray(p.clips) ? (p.clips as unknown as Clip[]) : [],
            }
          : null,
      );
      setProjectLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load renewal date for paid plans
  useEffect(() => {
    if (!isPaid) return;
    let alive = true;
    getInfo({})
      .then((r) => {
        if (alive) setRenewal(r?.renewal_date ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isPaid, getInfo]);

  // Close modal on Escape & lock background scroll
  useEffect(() => {
    if (!activeClip) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveClip(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [activeClip]);

  const copyToClipboard = async (text: string, successMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to Clipboard!", successMsg);
    } catch {
      showToast("Copy Failed", "Please manually select and copy the text.");
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) {
      showToast("Delete Failed", error.message);
      return;
    }
    showToast("Project Removed", "The project and its clips were deleted.");
    setProject(null);
  };

  const avg = project ? avgScore(project.clips) : null;

  return (
    <main className="view-tab p-6 md:p-8 space-y-8 flex-1">
      {/* Hero Greeting */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-white/10 bg-gradient-to-br from-[#0D0F18] via-[#07080E] to-[#141824] shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#8B5CF6]/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#06B6D4]/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Welcome to Clipra <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Upload a video and let AI extract your most viral moments.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shrink-0"
          >
            <UploadIcon className="w-4 h-4" /> New upload
          </Link>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Remaining Minutes */}
        <div className="glow-card p-5">
          <div className="glow-content">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Remaining Quota
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl font-extrabold text-white">
                {loading ? "—" : remaining}
              </span>
              <span className="text-xs text-zinc-500 font-mono">/ {total} mins left</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden mt-3 mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] rounded-full transition-all"
                style={{ width: `${remainPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
              <span>{used}m consumed</span>
              <span className="text-[#10B981]">{Math.round(remainPct)}% remaining</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Avg Viral Score (latest project) */}
        <div className="glow-card p-5">
          <div className="glow-content">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Avg Viral Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl font-extrabold text-[#10B981]">
                {avg !== null ? `${avg}%` : "—"}
              </span>
              <span className="text-xs text-zinc-400 font-sans">
                {avg !== null ? "Latest project" : "No clips yet"}
              </span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-zinc-500">
              {avg !== null ? "Across your latest generated clips" : "Upload a video to get scored clips"}
            </div>
          </div>
        </div>

        {/* Stat 3: Clips generated */}
        <div className="glow-card p-5">
          <div className="glow-content">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Clips Generated
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl font-extrabold text-white">
                {projectLoading ? "—" : (project?.clips.length ?? 0)}
              </span>
              <span className="text-xs text-zinc-400 font-sans">in latest project</span>
            </div>
            <div className="mt-2 text-[10px] font-mono text-zinc-500">
              Clips are cached for 24 hours
            </div>
          </div>
        </div>

        {/* Stat 4: Plan Status */}
        <div className="glow-card p-5">
          <div className="glow-content">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Plan Status
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isPaid
                    ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
                    : "bg-white/10 text-zinc-300 border-white/10"
                }`}
              >
                {isPaid ? "ACTIVE" : "FREE"}
              </span>
            </div>
            <div className="font-display text-2xl font-bold text-white mb-1">{planLabel}</div>
            <p className="text-xs text-zinc-400 mt-1.5 font-sans leading-relaxed flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              {isPaid
                ? renewalLabel
                  ? `Renews ${renewalLabel}`
                  : "Renewal date loading…"
                : freeResetLabel
                  ? `Minutes reset ${freeResetLabel}`
                  : "60 free minutes every 30 days"}
            </p>
          </div>
        </div>
      </div>

      {/* LATEST PROJECT & CLIPS */}
      {projectLoading ? (
        <div className="grid place-items-center py-16 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : project ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#06B6D4]">
                RECENTLY GENERATED
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                Latest Video & Extracted Clips
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono hidden md:inline">
                Clips automatically cached for 24h
              </span>
              <Link
                to="/results"
                className="text-xs text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <span>View All Projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
            {/* Source Video Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-red-400 flex-shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-base">{project.video_name}</h3>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center gap-3 flex-wrap">
                    <span>
                      Processed: {new Date(project.created_at).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="text-[#10B981] font-semibold">
                      {project.clips.length} Clip{project.clips.length === 1 ? "" : "s"} Extracted
                    </span>
                    {avg !== null && (
                      <>
                        <span>•</span>
                        <span className="text-[#8B5CF6]">avg score: {avg}%</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/upload"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Re-clip</span>
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteProject}
                  className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
                  title="Delete project"
                  aria-label={`Delete project ${project.video_name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clips Grid */}
            {project.clips.length === 0 ? (
              <div className="text-sm text-zinc-400">No clips were saved for this project.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.clips.map((c, i) => {
                  const title = (c.title as string) || `Clip ${i + 1}`;
                  const videoSrc = resolveClipUrl((c.video_url || c.url || c.preview_url) as string | undefined);
                  const downloadHref = toDownloadUrl((c.download_url || c.url || c.video_url) as string | undefined, title);
                  const score = typeof c.score === "number" ? Math.round(c.score) : undefined;
                  const key = `${project.id}-${i}`;
                  return (
                    <div
                      key={i}
                      className="group relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex flex-col justify-between hover:border-[#8B5CF6]/50 transition-all duration-300 hover:shadow-neon-violet"
                    >
                      <div className="relative aspect-[9/14] w-full bg-zinc-950 overflow-hidden flex items-center justify-center">
                        {videoSrc && !failed[key] ? (
                          <video
                            src={videoSrc}
                            preload="metadata"
                            playsInline
                            onError={() => setFailed((f) => ({ ...f, [key]: true }))}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center px-4 text-center text-xs text-zinc-500">
                            {videoSrc
                              ? "This clip file is no longer available on the server."
                              : "No preview"}
                          </div>
                        )}

                        {/* Top badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          {score !== undefined && (
                            <span className="px-2.5 py-1 rounded-full bg-[#10B981] text-black text-[10px] font-bold font-mono tracking-wider flex items-center gap-1 shadow-md">
                              <TrendingUp className="w-3 h-3" /> {score}% VIRAL
                            </span>
                          )}
                        </div>

                        {/* Hover Play Overlay */}
                        {videoSrc && !failed[key] && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                            <button
                              type="button"
                              onClick={() => setActiveClip({ clip: c, index: i })}
                              aria-label={`Preview clip: ${title}`}
                              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                            >
                              <Play className="w-5 h-5 fill-black ml-0.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Metadata & Tools */}
                      <div className="p-4 space-y-3 bg-[#0c0e18]">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-white text-xs line-clamp-2 leading-snug">
                              {title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(title, "Title copied!")}
                              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/5 flex-shrink-0"
                              title="Copy Title"
                              aria-label={`Copy title: ${title}`}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {typeof c.reason === "string" && c.reason && (
                            <div className="text-[10px] text-[#06B6D4] font-mono mt-1 line-clamp-1">
                              {c.reason}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => setActiveClip({ clip: c, index: i })}
                            aria-label={`Preview clip: ${title}`}
                            className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-zinc-300 border border-white/10 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3 h-3 text-[#06B6D4]" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(`${title} #shorts #viral #clipra`, "Hashtags copied!")
                            }
                            className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-zinc-300 transition-colors flex items-center justify-center gap-1 border border-white/5"
                            title="Copy Tags"
                            aria-label={`Copy hashtags for ${title}`}
                          >
                            <Hash className="w-3 h-3 text-zinc-400" />
                          </button>
                          {downloadHref ? (
                            <a
                              href={downloadHref}
                              download
                              rel="noreferrer"
                              className="py-1.5 px-3 rounded-lg bg-white text-black hover:bg-zinc-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
                              title="Download MP4"
                              aria-label={`Download MP4 ${title}`}
                            >
                              <Download className="w-3 h-3" />
                            </a>
                          ) : (
                            <span
                              className="py-1.5 px-3 rounded-lg bg-white/20 text-zinc-500 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
                              title="Download unavailable"
                            >
                              <Download className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 grid place-items-center mb-4">
            <Video className="w-6 h-6 text-zinc-400" />
          </div>
          <h3 className="font-semibold text-white tracking-tight">No projects yet</h3>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-sm mx-auto">
            Upload your first video to start building your library of viral shorts.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-sm font-semibold hover:opacity-90 transition-opacity mt-5"
          >
            <UploadIcon className="w-4 h-4" /> Upload a video
          </Link>
        </div>
      )}

      {/* CREATOR TIPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-white/[0.07] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-1">Speaker Auto-Centering</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Clipra's neural facial tracking keeps the active voice front and center, even during dynamic multi-person podcasts.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/[0.07] flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4] flex-shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white text-sm mb-1">Multi-Language Captions</h4>
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              {["EN", "ES", "FR", "DE", "HI", "+25"].map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/[0.07]">
          <div>
            <h4 className="font-semibold text-white text-sm mb-1">Algorithmic Hook Scoring</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Moments over 90% score feature conversational peaks, dramatic pauses, or high emotional resonance.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: CLIP PREVIEW */}
      {activeClip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-preview-title"
          onClick={() => setActiveClip(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-sm rounded-3xl p-5 border border-white/20 shadow-2xl relative max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setActiveClip(null)}
              aria-label="Close preview modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 z-10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-[9/15] w-full rounded-2xl overflow-hidden bg-zinc-950 mb-4">
              {resolveClipUrl((activeClip.clip.video_url || activeClip.clip.url || activeClip.clip.preview_url) as string | undefined) ? (
                <video
                  src={resolveClipUrl((activeClip.clip.video_url || activeClip.clip.url || activeClip.clip.preview_url) as string | undefined)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-xs text-zinc-500">
                  No preview available
                </div>
              )}
              {typeof activeClip.clip.score === "number" && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#10B981] text-black text-[10px] font-bold font-mono">
                    {Math.round(activeClip.clip.score)}% VIRAL
                  </span>
                </div>
              )}
            </div>
            <h3 id="dashboard-preview-title" className="font-semibold text-white text-sm mb-3">
              {(activeClip.clip.title as string) || `Clip ${activeClip.index + 1}`}
            </h3>
            <div className="flex gap-2">
              {toDownloadUrl(
                (activeClip.clip.download_url || activeClip.clip.url || activeClip.clip.video_url) as string | undefined,
                (activeClip.clip.title as string) || `clip-${activeClip.index + 1}`,
              ) ? (
                <a
                  href={toDownloadUrl(
                    (activeClip.clip.download_url || activeClip.clip.url || activeClip.clip.video_url) as string | undefined,
                    (activeClip.clip.title as string) || `clip-${activeClip.index + 1}`,
                  )}
                  download
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-white text-black text-xs font-semibold text-center hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download MP4
                </a>
              ) : (
                <span className="flex-1 py-2 rounded-xl bg-white/20 text-zinc-500 text-xs font-semibold text-center flex items-center justify-center gap-1.5 cursor-not-allowed">
                  <Download className="w-3.5 h-3.5" /> Unavailable
                </span>
              )}
              <button
                type="button"
                onClick={() => setActiveClip(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 border border-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
