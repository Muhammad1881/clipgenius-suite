import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Set New Password — Clipra" },
      { name: "description", content: "Set a new password for your Clipra account." },
    ],
    links: [{ rel: "canonical", href: "https://clipra.bond/reset-password" }],
  }),
});

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery session in URL hash; client picks it up automatically.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    const parsed = schema.safeParse({ password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated! Please sign in.");
    await supabase.auth.signOut();
    navigate({ to: "/login", search: { redirect: "/dashboard" } });
  };

  return (
    <AuthShell>
      <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
      <p className="text-sm text-muted-foreground mt-1.5">
        Choose a strong password you haven't used before.
      </p>

      {!ready ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-muted-foreground">
          This link is invalid or has expired. Request a new one from{" "}
          <Link to="/forgot-password" className="text-foreground hover:text-accent font-medium">
            forgot password
          </Link>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Field id="password" label="New password" icon={<Lock className="size-4" />}>
            <Input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={128} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
          </Field>
          <Field id="confirm" label="Confirm password" icon={<Lock className="size-4" />}>
            <Input id="confirm" type="password" autoComplete="new-password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} maxLength={128} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
          </Field>
          <Button type="submit" disabled={loading} className="btn-premium w-full rounded-xl h-11">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
