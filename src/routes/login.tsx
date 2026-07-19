import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Sparkles, Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function navigateToRedirect(nav: ReturnType<typeof useNavigate>, target: string) {
  // Same-origin relative path only. Use full-page nav when it carries a query
  // string (e.g. the OAuth consent URL /.lovable/oauth/consent?authorization_id=…);
  // TanStack navigate({ to }) doesn't parse embedded query params.
  if (!target.startsWith("/")) {
    window.location.href = "/";
    return;
  }
  if (target.includes("?") || target.startsWith("/.lovable")) {
    window.location.href = target;
    return;
  }
  nav({ to: target });
}

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") ? s.redirect : "/dashboard",
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ href: search.redirect });
  },
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign In — Clipra" },
      { name: "description", content: "Sign in to Clipra to turn your long videos into viral short clips with AI." },
      { property: "og:title", content: "Sign In — Clipra" },
      { property: "og:description", content: "Access your Clipra account and keep clipping viral shorts from your long videos." },
      { property: "og:url", content: "https://clipra.bond/login" },
    ],
    links: [{ rel: "canonical", href: "https://clipra.bond/login" }],
  }),
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigateToRedirect(navigate, search.redirect);
  };

  const handleGoogle = async () => {
    // Google lands on /dashboard, then the app can complete any pending consent
    // from there (users doing MCP consent will typically already be signed in).
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
  };

  return (
    <AuthShell>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-muted-foreground mt-1.5">Sign in to your Clipra account.</p>

      <Button type="button" variant="ghost" onClick={handleGoogle} className="w-full mt-6 h-11 glass hover:bg-white/10 rounded-xl border border-white/10">
        <GoogleIcon /> Continue with Google
      </Button>

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field id="email" label="Email" icon={<Mail className="size-4" />}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@studio.io" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
        </Field>
        <Field id="password" label="Password" icon={<Lock className="size-4" />}>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={128} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
        </Field>
        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={loading} className="btn-premium w-full rounded-xl h-11">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-foreground hover:text-accent transition-colors font-medium">Create one</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center px-4 py-12 bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-mesh animate-aurora opacity-60" />
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-semibold mb-8">
          <span className="grid place-items-center size-9 rounded-xl bg-gradient-vivid glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </span>
          <span className="text-lg">Clipra</span>
        </Link>
        <div className="glass-strong rounded-3xl p-7 sm:p-8 border-gradient">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ id, label, icon, children }: { id: string; label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="relative mt-1.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex-1 h-px bg-white/10" />
      or continue with email
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12s4.1 10 9.2 10c5.3 0 8.8-3.7 8.8-8.9 0-.6-.07-1.1-.16-1.5H12z"/>
    </svg>
  );
}
