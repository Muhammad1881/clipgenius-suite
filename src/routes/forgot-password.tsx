import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset Password — Clipra" },
      { name: "description", content: "Reset your Clipra account password." },
    ],
    links: [{ rel: "canonical", href: "https://clipra.bond/forgot-password" }],
  }),
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Check your email for the reset link.");
  };

  return (
    <AuthShell>
      <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
      <p className="text-sm text-muted-foreground mt-1.5">
        Enter your email and we'll send you a link to reset it.
      </p>

      {sent ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm">
          <p className="font-medium text-foreground">Email sent ✉️</p>
          <p className="text-muted-foreground mt-1">
            We sent a reset link to <span className="text-foreground">{email}</span>. Check your inbox (and spam folder).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Field id="email" label="Email" icon={<Mail className="size-4" />}>
            <Input id="email" type="email" autoComplete="email" placeholder="you@studio.io" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="pl-9 h-11 bg-white/[0.03] border-white/10" />
          </Field>
          <Button type="submit" disabled={loading} className="btn-premium w-full rounded-xl h-11">
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Remembered it?{" "}
        <Link to="/login" className="text-foreground hover:text-accent transition-colors font-medium">Sign in</Link>
      </p>
    </AuthShell>
  );
}
