import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Copy, Check, Sparkles, Loader2, RefreshCw, Lock } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { generateSocialMeta, type SocialMeta } from "@/lib/social-meta.functions";

export function CopyButton({ value, label }: { value: string; label: string }) {
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

export function SocialMetaBlock({
  title,
  reason,
  transcript,
  isPaid,
}: {
  title: string;
  reason?: string | null;
  transcript?: string | null;
  isPaid: boolean;
}) {
  const generate = useServerFn(generateSocialMeta);
  const [meta, setMeta] = useState<SocialMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generate({
        data: { title, reason: reason ?? null, transcript: transcript ?? null },
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
