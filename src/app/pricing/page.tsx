"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (planId: string, planName: string) => {
    setLoadingPlan(planName);
    try {
      // 1. Create a subscription on the backend
      const res = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      
      if (!data.subscriptionId) {
        alert(data.detail || "Failed to create subscription");
        setLoadingPlan(null);
        return;
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        subscription_id: data.subscriptionId,
        name: "Certi-Generator",
        description: `${planName} Plan Subscription`,
        handler: async function (response: any) {
          try {
            // 3. Verify the session and activate the plan
            const verifyRes = await fetch("/api/razorpay/verify-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                planId: planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              // Redirect to dashboard on success
              router.push("/dashboard");
              router.refresh();
            } else {
              alert(verifyData.detail || "Payment verification failed");
            }
          } catch (err) {
            alert("Error verifying payment");
          }
        },
        theme: {
          color: "#FFD60A", // Match our brand color (yellow-400)
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      rzp1.open();

    } catch (err) {
      alert("Error starting checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] p-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-5xl mx-auto py-12">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 text-center">Upgrade Your Plan</h1>
        <p className="text-center font-bold text-xl mb-12">More certificates. More power.</p>

        <div className="grid md:grid-cols-2 gap-8 items-end justify-center max-w-4xl mx-auto">
          {/* Pro */}
          <div className="brut-card bg-yellow-400 p-8 border-4 shadow-[12px_12px_0_#000] h-full flex flex-col">
            <div className="brut-label bg-black text-yellow-400 self-start mb-4">MOST POPULAR</div>
            <h3 className="text-3xl font-black uppercase mb-2">Pro</h3>
            <p className="text-5xl font-black mb-6">99₹<span className="text-lg">/mo</span></p>
            <ul className="space-y-4 mb-8 flex-grow font-bold">
              <li className="flex items-center gap-2"><Check className="text-black" /> Max 10,000 certificates/mo</li>
              <li className="flex items-center gap-2"><Check className="text-black" /> Custom Templates</li>
              <li className="flex items-center gap-2"><Check className="text-black" /> Email Support</li>
            </ul>
            <button
              onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PRO!, "PRO")}
              disabled={loadingPlan === "PRO"}
              className="brut-btn brut-btn-black w-full py-4 text-lg border-2 disabled:opacity-50"
            >
              {loadingPlan === "PRO" ? "Processing..." : "Subscribe to Pro"}
            </button>
          </div>
          
          {/* Expert */}
          <div className="brut-card bg-[#00E5FF] p-8 border-4 shadow-[8px_8px_0_#000] h-full flex flex-col">
            <div className="brut-label bg-black text-cyan-400 self-start mb-4">ENTERPRISE</div>
            <h3 className="text-3xl font-black uppercase mb-2">Expert</h3>
            <p className="text-5xl font-black mb-6">999₹<span className="text-lg">/mo</span></p>
            <ul className="space-y-4 mb-8 flex-grow font-bold">
              <li className="flex items-center gap-2"><Check className="text-black" /> Unlimited certificates</li>
              <li className="flex items-center gap-2"><Check className="text-black" /> API Access</li>
              <li className="flex items-center gap-2"><Check className="text-black" /> 24/7 Priority Support</li>
            </ul>
            <button
              onClick={() => handleSubscribe(process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_EXPERT!, "EXPERT")}
              disabled={loadingPlan === "EXPERT"}
              className="brut-btn brut-btn-black w-full py-4 text-lg border-2 disabled:opacity-50"
            >
              {loadingPlan === "EXPERT" ? "Processing..." : "Subscribe to Expert"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
