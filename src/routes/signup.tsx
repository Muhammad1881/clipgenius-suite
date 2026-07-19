import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthShell, Field, Divider, GoogleIcon } from "./login";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") ? s.redirect : "/dashboard",
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ href: search.redirect });
  },
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create Your Account — Clipra" },
      { name: "description", content: "Create your free Clipra account and start turning long videos into viral short clips today." },
      { property: "og:title", content: "Create Your Account — Clipra" },
      { property: "og:description", content: "Sign up free for Clipra and ship viral-ready shorts from your long videos in minutes." },
      { property: "og:url", content: "https://clipra.bond/signup" },
    ],
    links: [{ rel: "canonical", href: "https://clipra.bond/signup" }],
  }),
});

const schema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(32).regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ and - only"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

function SignupPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const goToRedirect = () => {
    const target = search.redirect;
    if (target.includes("?") || target.startsWith("/.lovable")) {
      window.location.href = target;
    } else {
      navigate({ to: target });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ username, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}${search.redirect}`,
        data: { username: parsed.data.username, display_name: parsed.data.username },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Account created!");
      goToRedirect();
    } else {
      toast.success("Check your email to confirm your account.");
      navigate({ to: "/login", search: { redirect: search.redirect } });
    }
  };

  const handleGoogle = async () => {
    await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
  };

  return (
    <AuthShell>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1.5">Start turning long videos into viral shorts.</p>

      <Button type="button" variant="ghost" onClick={handleGoogle} className="w-full mt-6 h-11 glass hover:bg-white/10 rounded-xl border border-white/10">
        <GoogleIcon /> Continue with Google
      </Button>

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field id="username" label="Username" icon={<User className="size-4" />}>
          <Input id="username" autoComplete="username" placeholder="alexcreates" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} maxLength={32} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
        </Field>
        <Field id="email" label="Email" icon={<Mail className="size-4" />}>
          <Input id="email" type="email" autoComplete="email" placeholder="you@studio.io" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
        </Field>
        <Field id="password" label="Password" icon={<Lock className="size-4" />}>
          <Input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={128} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
        </Field>
        <Button type="submit" disabled={loading} className="btn-premium w-full rounded-xl h-11">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-5 text-center leading-relaxed">
        By creating an account you agree to our Terms and Privacy Policy.
      </p>
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" search={{ redirect: search.redirect }} className="text-foreground hover:text-accent transition-colors font-medium">Sign in</Link>
      </p>
    </AuthShell>
  );
}
