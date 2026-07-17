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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.razorpaySubscriptionId) {
      return NextResponse.json({ detail: "No active Razorpay subscription found" }, { status: 400 });
    }

    const subscription = await razorpay.subscriptions.fetch(user.razorpaySubscriptionId);

    if (subscription && subscription.short_url) {
      return NextResponse.json({ url: subscription.short_url });
    } else {
      return NextResponse.json({ detail: "Could not retrieve subscription URL" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Razorpay Portal Error:", err);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
