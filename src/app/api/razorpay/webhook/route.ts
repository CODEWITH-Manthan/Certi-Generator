import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature") as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ detail: "Missing signature or secret" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ detail: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);
    const eventName = event.event;
    
    // Razorpay wraps the entity inside payload.{entity_type}.entity
    if (eventName === "subscription.charged") {
      const subscription = event.payload.subscription.entity;
      const { id: subscriptionId, plan_id, current_end } = subscription;

      let newPlan = "FREE";
      if (plan_id === process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PRO) {
        newPlan = "PRO";
      } else if (plan_id === process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_EXPERT) {
        newPlan = "EXPERT";
      }

      await prisma.user.updateMany({
        where: { razorpaySubscriptionId: subscriptionId },
        data: {
          plan: newPlan,
          razorpayPlanId: plan_id,
          razorpayCurrentPeriodEnd: current_end ? new Date(current_end * 1000) : null,
          certificatesGenerated: 0, // Reset usage for the new billing cycle
        },
      });
      console.log(`[Razorpay Webhook] Subscription charged/renewed: ${subscriptionId}`);

    } else if (eventName === "subscription.cancelled" || eventName === "subscription.halted") {
      const subscription = event.payload.subscription.entity;
      
      await prisma.user.updateMany({
        where: { razorpaySubscriptionId: subscription.id },
        data: {
          plan: "FREE",
          razorpaySubscriptionId: null,
          razorpayPlanId: null,
          razorpayCurrentPeriodEnd: null,
        },
      });
      console.log(`[Razorpay Webhook] Subscription cancelled/halted: ${subscription.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Razorpay Webhook Error:", err);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
