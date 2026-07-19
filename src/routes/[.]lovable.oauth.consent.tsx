import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type SupabaseOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{
    data: {
      client?: { name?: string; client_id?: string; redirect_uri?: string; logo_uri?: string };
      scope?: string;
      redirect_url?: string;
      redirect_to?: string;
    } | null;
    error: { message: string } | null;
  }>;
  approveAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  denyAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
};

function oauth(): SupabaseOAuth {
  // Typed wrapper around the beta supabase.auth.oauth namespace.
  return (supabase.auth as unknown as { oauth: SupabaseOAuth }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: the Supabase client reads its session from localStorage,
  // which is absent during SSR. Without this, signed-in users get bounced to /login.
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) {
      throw new Error("Missing authorization_id");
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/login", search: { redirect: next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      throw redirect({ href: immediate });
    }
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <ConsentShell>
      <h1 className="text-xl font-semibold">Could not load this authorization request</h1>
      <p className="mt-2 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </ConsentShell>
  ),
});

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "an application";
  const scopes = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  async function decide(approve: boolean) {
    setError(null);
    setBusy(approve ? "approve" : "deny");
    const api = oauth();
    const { data, error } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <ConsentShell>
      <div className="flex items-center gap-3">
        <span className="grid place-items-center size-10 rounded-xl bg-gradient-vivid glow shrink-0">
          <Sparkles className="size-5 text-primary-foreground" />
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">
            Connect {clientName} to Clipra
          </h1>
          <p className="text-xs text-muted-foreground">
            This lets {clientName} use Clipra as you.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
        <div className="flex items-start gap-3 text-sm">
          <ShieldCheck className="size-4 mt-0.5 text-accent shrink-0" />
          <div>
            <p className="font-medium">{clientName} will be able to call Clipra's tools while you are signed in.</p>
            <p className="text-xs text-muted-foreground mt-1">
              It can list your projects, read transcripts and generated clip metadata, and check your plan usage. This does not bypass Clipra's permissions or backend policies.
            </p>
          </div>
        </div>
        {scopes.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="uppercase tracking-widest text-[10px] mb-1">Requested access</div>
            <div className="flex flex-wrap gap-1.5">
              {scopes.map((s: string) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-foreground/80">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {details?.client?.redirect_uri && (
          <p className="text-[11px] text-muted-foreground break-all">
            Will redirect to: {details.client.redirect_uri}
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
        <Button
          type="button"
          variant="ghost"
          disabled={busy !== null}
          onClick={() => decide(false)}
          className="w-full h-11 glass hover:bg-white/10 rounded-xl border border-white/10"
        >
          {busy === "deny" ? <Loader2 className="size-4 animate-spin" /> : "Cancel connection"}
        </Button>
        <Button
          type="button"
          disabled={busy !== null}
          onClick={() => decide(true)}
          className="btn-premium w-full h-11 rounded-xl"
        >
          {busy === "approve" ? <Loader2 className="size-4 animate-spin" /> : `Approve ${clientName}`}
        </Button>
      </div>
    </ConsentShell>
  );
}

function ConsentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-mesh animate-aurora opacity-60" />
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="w-full max-w-md">
        <div className="glass-strong rounded-3xl p-7 sm:p-8 border-gradient">
          {children}
        </div>
      </div>
    </div>
  );
}
