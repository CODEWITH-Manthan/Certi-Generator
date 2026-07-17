import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 401 });
    }

    let customerId = user.razorpayCustomerId;

    if (!customerId) {
      const customer = await razorpay.customers.create({
        email: user.email,
        name: user.name || undefined,
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { razorpayCustomerId: customerId },
      });
    }

    // Create a subscription in Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customerId,
      total_count: 120, // Keep recurring for a long time
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (err: any) {
    console.error("Razorpay Checkout Error:", err);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
