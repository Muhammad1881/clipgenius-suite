import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, FolderOpen, Loader2, Upload as UploadIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { CopyButton, SocialMetaBlock } from "@/components/ClipSocialMeta";

export const Route = createFileRoute("/_app/results")({ component: Results });

const BACKEND_BASE = "https://api.clipra.bond";

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

function avgScore(clips: Clip[]): number | null {
  const scores = clips.map((c) => (typeof c.score === "number" ? c.score : null)).filter((n): n is number => n !== null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function Results() {
  const { profile } = useProfile();
  const isPaid = (profile?.plan ?? "free") !== "free";
  const [projects, setProjects] = useState<Project[] | null>(null);


  const load = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, video_name, clips, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      setProjects([]);
      return;
    }
    setProjects(
      (data ?? []).map((p) => ({
        id: p.id,
        video_name: p.video_name,
        created_at: p.created_at,
        clips: Array.isArray(p.clips) ? (p.clips as unknown as Clip[]) : [],
      })),
    );
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Project deleted");
    setProjects((prev) => (prev ?? []).filter((p) => p.id !== id));
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto relative">
      <div className="absolute inset-x-0 top-0 h-80 bg-mesh opacity-40 -z-10 pointer-events-none" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent">Library</div>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-1 tracking-tight">Your projects</h1>
          <p className="text-muted-foreground mt-1">Every upload and its generated clips, saved automatically.</p>
        </div>
        <Button asChild className="btn-premium rounded-xl h-11 px-5">
          <Link to="/upload"><UploadIcon className="size-4 mr-2" /> New upload</Link>
        </Button>
      </div>

      {projects === null ? (
        <div className="mt-16 grid place-items-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-10 glass rounded-2xl p-12 text-center border-gradient">
          <div className="mx-auto size-14 rounded-2xl glass grid place-items-center mb-4">
            <FolderOpen className="size-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold tracking-tight">No projects yet</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
            Upload your first video to start building your library of viral shorts.
          </p>
          <Button asChild className="btn-premium rounded-xl h-10 px-5 mt-5">
            <Link to="/upload"><UploadIcon className="size-4 mr-2" /> Upload a video</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {projects.map((p) => {
            const avg = avgScore(p.clips);
            return (
              <div key={p.id} className="glass rounded-2xl p-5 sm:p-6 border-gradient">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight truncate">{p.video_name}</h2>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                      <span>{new Date(p.created_at).toLocaleString()}</span>
                      <span>·</span>
                      <span>{p.clips.length} clip{p.clips.length === 1 ? "" : "s"}</span>
                      {avg !== null && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-accent">
                            <TrendingUp className="size-3" /> avg {avg}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(p.id)}
                    className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>

                {p.clips.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No clips were saved for this project.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {p.clips.map((c, i) => {
                      const videoSrc = resolveClipUrl((c.video_url || c.url || c.preview_url) as string | undefined);
                      const title = (c.title as string) || `Clip ${i + 1}`;
                      const downloadHref = toDownloadUrl((c.download_url || c.url || c.video_url) as string | undefined, title);
                      const score = typeof c.score === "number" ? Math.round(c.score) : undefined;
                      return (
                        <div key={i} className="glass rounded-2xl overflow-hidden hover-lift border-gradient flex flex-col">
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

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {["✨ AI Auto Reframed", "🎯 Smart Tracking", "📝 AI Subtitles"].map((b) => (
                                <span
                                  key={b}
                                  className="text-[10px] px-2 py-0.5 rounded-full glass border border-white/10 text-muted-foreground"
                                >
                                  {b}
                                </span>
                              ))}
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
                                  <a href={downloadHref} download={`${title.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60) || "clip"}.mp4`} rel="noreferrer">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
