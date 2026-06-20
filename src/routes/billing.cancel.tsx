import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/billing/cancel")({
  component: CancelPage,
  head: () => ({
    meta: [
      { title: "Payment canceled — Clipra" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function CancelPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
      <div className="glass rounded-3xl p-10 max-w-md w-full text-center border-gradient">
        <XCircle className="size-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-display mt-4">Checkout canceled</h1>
        <p className="text-muted-foreground mt-2">No charge was made. You can pick a plan whenever you're ready.</p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button asChild variant="outline" className="rounded-xl h-11">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild className="btn-premium rounded-xl h-11">
            <Link to="/pricing">View plans</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
