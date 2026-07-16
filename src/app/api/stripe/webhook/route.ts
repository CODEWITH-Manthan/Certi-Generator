import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("[Stripe Webhook] Signature verification failed:", error.message);
    return NextResponse.json({ detail: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;

      if (!subscriptionId) {
        console.warn("[Stripe Webhook] checkout.session.completed has no subscription ID");
        return NextResponse.json({ received: true });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const userId = session.metadata?.userId;

      if (!userId) {
        console.warn("[Stripe Webhook] No userId in session metadata");
        return NextResponse.json({ received: true });
      }

      const priceId = subscription.items.data[0].price.id;
      let plan = "PRO";
      if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_EXPERT) {
        plan = "EXPERT";
      }

      const periodEnd = (subscription as any).current_period_end;

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: priceId,
          stripeCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
          plan,
        },
      });

      console.log(`[Stripe Webhook] Plan updated to ${plan} for user ${userId}`);
    }

    if (event.type === "invoice.payment_succeeded") {
      // The object here is an Invoice, NOT a Checkout.Session
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as any).subscription as string | undefined;

      if (!subscriptionId) {
        return NextResponse.json({ received: true });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = (subscription as any).current_period_end;

      await prisma.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
          certificatesGenerated: 0,
        },
      });

      console.log(`[Stripe Webhook] Usage reset for subscription ${subscription.id}`);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          plan: "FREE",
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });

      console.log(`[Stripe Webhook] Subscription cancelled, plan reset to FREE`);
    }
  } catch (err: any) {
    console.error("[Stripe Webhook] Handler error:", err.message);
    return NextResponse.json({ detail: "Internal handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
