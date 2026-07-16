import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">Privacy Policy</h1>
        <div className="space-y-6 text-sm">
          <p><strong>Last Updated:</strong> July 2026</p>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request customer support, or otherwise communicate with us.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">2. How We Use Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, as well as to process transactions and send related information.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase mb-2">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
