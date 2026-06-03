import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmCheckoutSession } from "@/lib/billing.functions";
import { z } from "zod";

const searchSchema = z.object({
  session_id: z.string().optional(),
  plan: z.enum(["starter", "creator"]).optional(),
});

export const Route = createFileRoute("/billing/success")({
  validateSearch: searchSchema,
  component: SuccessPage,
  head: () => ({ meta: [{ title: "Payment successful — Clipra" }] }),
});

function SuccessPage() {
  const { session_id, plan } = Route.useSearch();
  const confirm = useServerFn(confirmCheckoutSession);
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!session_id || !plan) {
      setStatus("error");
      setMessage("Missing checkout session details.");
      return;
    }
    confirm({ data: { session_id, plan } })
      .then(() => {
        setStatus("ok");
        window.dispatchEvent(new Event("profile:refresh"));
      })
      .catch((e) => {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Could not confirm payment");
      });
  }, [session_id, plan, confirm]);

  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="glass rounded-3xl p-10 max-w-md w-full text-center border-gradient">
        {status === "loading" && (
          <>
            <Loader2 className="size-10 mx-auto animate-spin text-accent" />
            <h1 className="text-2xl font-display mt-4">Confirming your payment…</h1>
          </>
        )}
        {status === "ok" && (
          <>
            <CheckCircle2 className="size-12 mx-auto text-accent" />
            <h1 className="text-2xl font-display mt-4">You're on the {plan} plan 🎉</h1>
            <p className="text-muted-foreground mt-2">Your minutes have been updated.</p>
            <Button className="btn-premium mt-6 rounded-xl h-11 w-full" onClick={() => navigate({ to: "/dashboard" })}>
              Go to dashboard
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-display">Something went wrong</h1>
            <p className="text-muted-foreground mt-2">{message}</p>
            <Button asChild className="mt-6 rounded-xl h-11 w-full">
              <Link to="/pricing">Back to pricing</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
