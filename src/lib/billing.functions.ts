import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const PLAN_PRICE_IDS = {
  starter: "price_1TeKv8C0HMtKhtCJdXcKuwTu",
  creator: "price_1TeKvqC0HMtKhtCJq3pAhBlG",
} as const;

export const PLAN_MINUTES = {
  starter: 300,
  creator: 500,
} as const;

export type PlanKey = keyof typeof PLAN_PRICE_IDS;

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      plan: z.enum(["starter", "creator"]),
      origin: z.string().url(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const Stripe = (await import("stripe")).default;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    const stripe = new Stripe(key);

    const email = context.claims?.email as string | undefined;
    const existing = email
      ? await stripe.customers.list({ email, limit: 1 })
      : { data: [] as Array<{ id: string }> };
    const customerId = existing.data[0]?.id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: PLAN_PRICE_IDS[data.plan], quantity: 1 }],
      success_url: `${data.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}&plan=${data.plan}`,
      cancel_url: `${data.origin}/billing/cancel`,
      metadata: { user_id: context.userId, plan: data.plan },
    });

    return { url: session.url };
  });

export const confirmCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      session_id: z.string().min(1),
      plan: z.enum(["starter", "creator"]),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const Stripe = (await import("stripe")).default;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    const stripe = new Stripe(key);

    const session = await stripe.checkout.sessions.retrieve(data.session_id);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      throw new Error("Payment not completed");
    }
    if (session.metadata?.user_id && session.metadata.user_id !== context.userId) {
      throw new Error("Session does not belong to the current user");
    }

    const { supabase } = context;
    const monthly_minutes = PLAN_MINUTES[data.plan];
    const { error } = await supabase
      .from("profiles")
      .update({ plan: data.plan, monthly_minutes, minutes_used: 0 })
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);

    return { ok: true, plan: data.plan, monthly_minutes };
  });
