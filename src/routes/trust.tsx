import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Database, Mail, FileText, Server } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/trust")({
  component: TrustPage,
  head: () => ({
    meta: [
      { title: "Trust & Security — Clipra" },
      {
        name: "description",
        content:
          "How Clipra handles your videos and personal data: authentication, storage, subprocessors, retention, and how to contact us about security or privacy.",
      },
      { property: "og:title", content: "Trust & Security — Clipra" },
      {
        property: "og:description",
        content:
          "Clipra's approach to security, privacy, and data handling — written and maintained by the Clipra team.",
      },
    ],
  }),
});

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/50 p-6 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function TrustPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-32 md:pt-40">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Trust & Security
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            This page is maintained by the Clipra team to answer common security and privacy
            questions about Clipra. It describes our current practices — it is not an independent
            audit or certification.
          </p>
        </header>

        <div className="space-y-6">
          <Section icon={Shield} title="Authentication & access">
            <p>
              Clipra accounts are protected by email and password sign-in and Google sign-in.
              Sessions use short-lived access tokens that are refreshed automatically.
            </p>
            <p>
              Every request that reads or writes your data is authenticated on our server before it
              reaches the database. Row-level rules in the database ensure one user cannot read or
              modify another user's data.
            </p>
          </Section>

          <Section icon={Lock} title="Data in transit and at rest">
            <p>
              All traffic to Clipra is served over HTTPS/TLS. Account data and project metadata are
              stored in our managed Postgres database; uploaded videos and generated clips are
              stored with our hosting and processing providers listed below.
            </p>
          </Section>

          <Section icon={Database} title="What we collect">
            <p>
              <strong className="text-foreground">Account data:</strong> email address, display
              name, and authentication identifiers.
            </p>
            <p>
              <strong className="text-foreground">Usage data:</strong> minutes processed, plan, and
              project history needed to operate the product.
            </p>
            <p>
              <strong className="text-foreground">Content:</strong> the videos you upload or link to
              and the clips Clipra generates from them.
            </p>
          </Section>

          <Section icon={Server} title="Subprocessors">
            <p>We rely on the following providers to run Clipra:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Lovable Cloud (hosting, database, authentication, storage)</li>
              <li>Stripe (billing and subscription management)</li>
              <li>Our video processing backend at api.clipra.bond (clip generation)</li>
            </ul>
            <p>
              These providers process data only to deliver the service. We do not sell your data.
            </p>
          </Section>

          <Section icon={FileText} title="Retention and deletion">
            <p>
              Account and usage records are retained while your account is active. Uploaded videos
              and generated clips are retained so you can access them from your dashboard; you can
              delete your account at any time by contacting us, and we will remove your account
              data and stored clips within a reasonable period thereafter, except where we are
              required to retain limited records (for example, billing history).
            </p>
          </Section>

          <Section icon={Mail} title="Reporting a security issue">
            <p>
              If you believe you've found a vulnerability or have a privacy concern, please reach
              out and we'll respond as quickly as we can. Please do not publicly disclose the issue
              before we've had a chance to investigate.
            </p>
            <p>
              Contact:{" "}
              <a
                href="mailto:security@clipra.bond"
                className="text-primary underline-offset-4 hover:underline"
              >
                security@clipra.bond
              </a>
            </p>
          </Section>
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Have a question this page doesn't answer?{" "}
          <Link to="/" className="text-primary underline-offset-4 hover:underline">
            Get in touch
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
