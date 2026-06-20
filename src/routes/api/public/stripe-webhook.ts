import { createFileRoute } from "@tanstack/react-router";

const PLAN_BY_PRICE_ID: Record<string, { plan: "starter" | "creator"; minutes: number }> = {
  price_1TeKv8C0HMtKhtCJdXcKuwTu: { plan: "starter", minutes: 300 },
  price_1TeKvqC0HMtKhtCJq3pAhBlG: { plan: "creator", minutes: 500 },
};

function logStep(step: string, details?: unknown) {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
}

async function getAdminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function getUserIdForCustomer(customerId: string, email: string | null | undefined) {
  const admin = await getAdminClient();
  // Try by stored stripe_customer_id first
  const { data: byCustomer } = await admin
    .from("profiles")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  if (byCustomer?.user_id) return byCustomer.user_id;

  // Fall back to email via Auth Admin API
  if (!email) return null;
  const { data: list } = await admin.auth.admin.listUsers();
  const user = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  // Backfill the customer id for future events
  await admin
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("user_id", user.id);
  return user.id;
}

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret || !webhookSecret) {
          console.error("[STRIPE-WEBHOOK] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
          return new Response("Server not configured", { status: 500 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const rawBody = await request.text();

        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(secret);

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Invalid signature";
          console.error("[STRIPE-WEBHOOK] Verification failed:", msg);
          return new Response(`Webhook Error: ${msg}`, { status: 400 });
        }

        logStep("Event received", { type: event.type, id: event.id });

        try {
          const admin = await getAdminClient();

          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object as import("stripe").Stripe.Checkout.Session;
              const userId = session.metadata?.user_id;
              const planFromMeta = session.metadata?.plan as "starter" | "creator" | undefined;
              const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
              if (!userId || !planFromMeta || !customerId) {
                logStep("Missing metadata, skipping", { userId, planFromMeta, customerId });
                break;
              }
              const minutes = planFromMeta === "creator" ? 500 : 300;
              await admin
                .from("profiles")
                .update({
                  plan: planFromMeta,
                  monthly_minutes: minutes,
                  minutes_used: 0,
                  stripe_customer_id: customerId,
                  cycle_start: new Date().toISOString(),
                })
                .eq("user_id", userId);
              logStep("Upgrade applied", { userId, plan: planFromMeta });
              break;
            }

            case "invoice.payment_succeeded":
            case "invoice.paid": {
              const invoice = event.data.object as import("stripe").Stripe.Invoice;
              const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
              if (!customerId) break;
              // Skip the very first invoice (checkout.session.completed already handled it)
              if (invoice.billing_reason === "subscription_create") {
                logStep("Skipping first invoice", { invoiceId: invoice.id });
                break;
              }
              const email = invoice.customer_email ?? null;
              const userId = await getUserIdForCustomer(customerId, email);
              if (!userId) {
                logStep("No user found for customer", { customerId });
                break;
              }
              // Determine plan from the line item price id (cast — Stripe type shape varies by API version)
              const line = invoice.lines?.data?.[0] as unknown as { price?: { id?: string } } | undefined;
              const priceId = line?.price?.id;
              const planInfo = priceId ? PLAN_BY_PRICE_ID[priceId] : undefined;
              const update: {
                minutes_used: number;
                cycle_start: string;
                plan?: string;
                monthly_minutes?: number;
              } = {
                minutes_used: 0,
                cycle_start: new Date().toISOString(),
              };
              if (planInfo) {
                update.plan = planInfo.plan;
                update.monthly_minutes = planInfo.minutes;
              }
              await admin.from("profiles").update(update).eq("user_id", userId);
              logStep("Renewal reset applied", { userId });
              break;
            }

            case "customer.subscription.deleted": {
              const sub = event.data.object as import("stripe").Stripe.Subscription;
              const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
              if (!customerId) break;
              const userId = await getUserIdForCustomer(customerId, null);
              if (!userId) break;
              await admin
                .from("profiles")
                .update({
                  plan: "free",
                  monthly_minutes: 30,
                  minutes_used: 0,
                  cycle_start: new Date().toISOString(),
                })
                .eq("user_id", userId);
              logStep("Downgraded to free", { userId });
              break;
            }

            default:
              logStep("Ignored event type", { type: event.type });
          }
        } catch (err) {
          console.error("[STRIPE-WEBHOOK] Handler error:", err);
          return new Response("Handler error", { status: 500 });
        }

        return Response.json({ received: true });
      },
    },
  },
});
