import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, FolderOpen, Loader2, Upload as UploadIcon, Trash2, Copy, Check, Sparkles, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateSocialMeta, type SocialMeta } from "@/lib/social-meta.functions";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_app/results")({ component: Results });

const BACKEND_BASE = "https://api.clipra.bond";

function resolveClipUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${BACKEND_BASE}${url}`;
  return url;
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

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onCopy}
      className="h-7 px-2 glass hover:bg-white/10 rounded-md text-[11px] gap-1.5"
    >
      {copied ? <Check className="size-3 text-accent" /> : <Copy className="size-3" />}
      {label}
    </Button>
  );
}

function UpgradeOverlay() {
  return (
    <div className="mt-3 relative rounded-xl overflow-hidden border border-primary/20">
      {/* Blurred preview */}
      <div className="space-y-2.5 p-3 blur-[3px] select-none pointer-events-none opacity-60">
        <div className="glass rounded-lg p-2.5 border border-white/5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1">
            <Sparkles className="size-2.5 text-accent" /> Caption
          </div>
          <p className="text-xs leading-relaxed">This clip is about to blow up — here's why creators can't stop watching it.</p>
        </div>
        <div className="glass rounded-lg p-2.5 border border-white/5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Hashtags</div>
          <div className="flex flex-wrap gap-1">
            {["#shorts", "#viral", "#fyp", "#reels", "#tiktok"].map((h) => (
              <span key={h} className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{h}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background/90 grid place-items-center p-4">
        <div className="text-center max-w-[220px]">
          <div className="mx-auto size-9 rounded-xl bg-gradient-vivid grid place-items-center mb-2 shadow-card">
            <Lock className="size-4 text-primary-foreground" />
          </div>
          <div className="text-xs font-semibold tracking-tight">AI captions & hashtags</div>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
            Unlock viral-ready captions and smart hashtags on any paid plan.
          </p>
          <Button asChild size="sm" className="btn-premium rounded-lg h-7 px-3 mt-2.5 text-[11px]">
            <Link to="/pricing"><Sparkles className="size-3 mr-1" /> Upgrade</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SocialMetaBlock({ clip, isPaid }: { clip: Clip; isPaid: boolean }) {
  const generate = useServerFn(generateSocialMeta);
  const [meta, setMeta] = useState<SocialMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = (clip.title as string) || "Clip";

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generate({
        data: {
          title,
          reason: (clip.reason as string) ?? null,
          transcript: (clip.transcript as string) ?? null,
        },
      });
      setMeta(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPaid) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid]);

  if (!isPaid) return <UpgradeOverlay />;

  return (
    <div className="mt-3 space-y-2.5">
      {/* Caption */}
      <div className="glass rounded-lg p-2.5 border border-white/5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-2.5 text-accent" /> Caption
          </span>
          {meta && <CopyButton value={meta.caption} label="Copy" />}
        </div>
        {loading && !meta ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" /> Generating…
          </div>
        ) : meta ? (
          <p className="text-xs leading-relaxed text-foreground/90">{meta.caption}</p>
        ) : (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>

      {/* Hashtags */}
      <div className="glass rounded-lg p-2.5 border border-white/5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Hashtags</span>
          {meta && <CopyButton value={meta.hashtags.join(" ")} label="Copy" />}
        </div>
        {loading && !meta ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" /> Generating…
          </div>
        ) : meta ? (
          <div className="flex flex-wrap gap-1">
            {meta.hashtags.map((h) => (
              <span
                key={h}
                className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {error && !loading && (
        <Button
          size="sm"
          variant="ghost"
          onClick={run}
          className="w-full h-7 glass hover:bg-white/10 rounded-md text-[11px] gap-1.5"
        >
          <RefreshCw className="size-3" /> Retry
        </Button>
      )}
    </div>
  );
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
                      const downloadHref = resolveClipUrl((c.download_url || c.url || c.video_url) as string | undefined);
                      const title = (c.title as string) || `Clip ${i + 1}`;
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

                            <SocialMetaBlock clip={c} isPaid={isPaid} />

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
            );
          })}
        </div>
      )}
    </div>
  );
}
