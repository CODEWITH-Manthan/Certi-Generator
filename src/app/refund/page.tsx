import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
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
        <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Refund Policy</h1>
        <div className="space-y-6 text-sm">
          <p><strong>Last Updated:</strong> July 2026</p>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">1. Refund Requests</h2>
            <p>If you are not satisfied with CertiGen, you may request a refund within 14 days of your initial purchase.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">2. Exceptions</h2>
            <p>Refunds will not be granted for accounts that have violated our Terms of Service or generated a significant volume of certificates.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">3. How to Request</h2>
            <p>Please contact our support team to initiate a refund request. Allow up to 5-10 business days for the refund to process to your original payment method.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
