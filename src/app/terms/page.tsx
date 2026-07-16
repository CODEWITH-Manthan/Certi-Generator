import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-sans">
      <header className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black sticky top-0 z-40">
        <Link href="/" className="font-bold text-yellow-400 uppercase tracking-widest text-xl">
          CertiGen
        </Link>
        <Link href="/" className="brut-btn bg-white text-black text-xs py-2 px-4 shadow-[2px_2px_0_#FFD60A]">
          <ArrowLeft className="w-4 h-4 inline-block mr-2" />
          Back to Home
        </Link>
      </header>
      <main className="max-w-3xl mx-auto p-8 my-8 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
        <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Terms of Service</h1>
        <div className="space-y-6 text-sm">
          <p><strong>Last Updated:</strong> July 2026</p>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using CertiGen, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">2. Description of Service</h2>
            <p>CertiGen provides an automated certificate generation service. We reserve the right to modify or discontinue the service at any time.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">4. Payment and Subscriptions</h2>
            <p>Subscription fees are billed in advance on a recurring basis. You may cancel your subscription at any time through the billing portal.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
