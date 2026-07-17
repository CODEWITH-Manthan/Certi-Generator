import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      planId
    } = await req.json();

    const text = razorpay_payment_id + "|" + razorpay_subscription_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ detail: "Invalid Signature" }, { status: 400 });
    }

    // Determine the plan based on the planId
    let newPlan = "FREE";
    if (planId === process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PRO) {
      newPlan = "PRO";
    } else if (planId === process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_EXPERT) {
      newPlan = "EXPERT";
    }

    // Initial period end. Webhooks will update this to exact dates.
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        plan: newPlan,
        razorpaySubscriptionId: razorpay_subscription_id,
        razorpayPlanId: planId,
        razorpayCurrentPeriodEnd: periodEnd,
      },
    });

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (err: any) {
    console.error("Razorpay Verify Error:", err);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
