import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/**
 * POST /api/stripe/verify-session
 *
 * Called from the dashboard after a Stripe checkout redirect.
 * Looks up the checkout session directly and updates the user plan.
 * This is the fallback so the plan updates even if the webhook is delayed/misconfigured.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    // Make sure this session belongs to the current user
    const userFromDb = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!userFromDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      checkoutSession.metadata?.userId &&
      checkoutSession.metadata.userId !== userFromDb.id
    ) {
      return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
    }

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const subscription = checkoutSession.subscription as any;
    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 });
    }

    const priceId = subscription.items?.data?.[0]?.price?.id;
    let plan = "PRO";
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_EXPERT) {
      plan = "EXPERT";
    }

    const periodEnd = subscription.current_period_end;

    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        plan,
      },
      select: { plan: true },
    });

    console.log(`[verify-session] Plan updated to ${updated.plan} for ${session.user.email}`);
    return NextResponse.json({ plan: updated.plan });
  } catch (err: any) {
    console.error("[verify-session] Error:", err.message);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
