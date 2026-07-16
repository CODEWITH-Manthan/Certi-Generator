import Link from "next/link";
import { Check, Star, Zap, Shield, FileBadge, ArrowRight, Upload } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] text-black overflow-hidden font-sans">
      {/* HERO SECTION */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400 border-4 border-black rotate-12 -z-10 shadow-[8px_8px_0_#000]" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400 border-4 border-black -rotate-6 rounded-full -z-10 shadow-[8px_8px_0_#000]" />
        
        <div className="brut-label brut-label-yellow mb-6 text-sm py-2 px-4 shadow-[4px_4px_0_#000]">
          v2.0 is live! ⚡️
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none" style={{ textShadow: "4px 4px 0 #FFD60A" }}>
          Generate Certificates <br /> Like a Machine.
        </h1>
        
        <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 text-gray-800 border-l-4 border-black pl-4 text-left">
          Stop manually creating certificates. Upload a spreadsheet, pick a template, and generate thousands of certificates in seconds. Designed for speed, built for scale.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/login" className="brut-btn brut-btn-yellow text-lg py-4 px-8 border-4">
            Get Started For Free <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link href="#pricing" className="brut-btn brut-btn-white text-lg py-4 px-8 border-4">
            View Pricing
          </Link>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="w-full bg-black text-yellow-400 py-3 border-y-4 border-black overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee font-black uppercase text-xl tracking-widest">
          FAST. SECURE. BRUTAL. GENERATE 10,000 CERTS IN SECONDS. ZERO CONFIG. FAST. SECURE. BRUTAL. GENERATE 10,000 CERTS IN SECONDS. ZERO CONFIG.
        </div>
      </div>

      {/* FEATURES */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-12 border-b-8 border-black inline-block pb-2">
          Brutal Features
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="brut-card bg-cyan-400 p-8 border-4 shadow-[8px_8px_0_#000]">
            <Zap className="w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold uppercase mb-4">Blazing Fast</h3>
            <p className="font-medium text-black">Generate thousands of certificates locally or on our blazing fast cloud infrastructure. No waiting.</p>
          </div>
          
          <div className="brut-card bg-yellow-400 p-8 border-4 shadow-[8px_8px_0_#000]">
            <Upload className="w-12 h-12 mb-6" />
            <h3 className="text-2xl font-bold uppercase mb-4">Bulk Uploads</h3>
            <p className="font-medium text-black">Just drop a CSV or Excel file and map the columns. We handle the rest. Simple and straightforward.</p>
          </div>
          

        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-24 bg-white border-y-8 border-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 text-center">
            Pricing that makes sense
          </h2>
          <p className="text-center font-bold text-xl mb-12">No hidden fees. Upgrade when you need to.</p>
          
          <div className="grid md:grid-cols-3 gap-8 items-end">
            {/* Free */}
            <div className="brut-card bg-[#f5f5f0] p-8 border-4 shadow-[8px_8px_0_#000] h-full flex flex-col">
              <div className="brut-label bg-black text-white self-start mb-4">HOBBY</div>
              <h3 className="text-3xl font-black uppercase mb-2">Free</h3>
              <p className="text-5xl font-black mb-6">$0<span className="text-lg">/mo</span></p>
              <ul className="space-y-4 mb-8 flex-grow font-bold">
                <li className="flex items-center gap-2"><Check className="text-black" /> Max 100 certificates/mo</li>
                <li className="flex items-center gap-2"><Check className="text-black" /> Standard Templates</li>
                <li className="flex items-center gap-2"><Check className="text-black" /> Community Support</li>
              </ul>
              <Link href="/login" className="brut-btn brut-btn-black w-full py-4 text-lg border-2">Start Free</Link>
            </div>
            
            {/* Pro */}
            <div className="brut-card bg-yellow-400 p-8 border-4 shadow-[12px_12px_0_#000] transform md:-translate-y-4 h-full flex flex-col">
              <div className="brut-label bg-black text-yellow-400 self-start mb-4">MOST POPULAR</div>
              <h3 className="text-3xl font-black uppercase mb-2">Pro</h3>
              <p className="text-5xl font-black mb-6">99₹<span className="text-lg">/mo</span></p>
              <ul className="space-y-4 mb-8 flex-grow font-bold">
                <li className="flex items-center gap-2"><Check className="text-black" /> Max 10,000 certificates/mo</li>
                <li className="flex items-center gap-2"><Check className="text-black" /> Custom Templates</li>
                <li className="flex items-center gap-2"><Check className="text-black" /> Email Support</li>
              </ul>
              <Link href="/login" className="brut-btn brut-btn-black w-full py-4 text-lg border-2">Get Pro</Link>
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
              <Link href="/login" className="brut-btn brut-btn-black w-full py-4 text-lg border-2">Get Expert</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 bg-[#FF4D6D] border-b-8 border-black text-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 text-white" style={{ textShadow: "4px 4px 0 #000" }}>
          Ready to generate?
        </h2>
        <Link href="/login" className="brut-btn bg-yellow-400 text-black border-4 shadow-[8px_8px_0_#000] text-2xl py-6 px-12 hover:-translate-y-2 hover:shadow-[12px_12px_0_#000] transition-all">
          Start building now
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-4">
              <FileBadge className="w-8 h-8 text-yellow-400" />
              <span className="font-black text-2xl tracking-tighter">CERTIGEN</span>
            </div>
            <p className="font-bold text-gray-400">© 2026 CertiGen. Brutally effective.</p>
          </div>
          <div className="flex gap-6 font-bold text-sm text-gray-400 uppercase">
            <Link href="/terms" className="hover:text-yellow-400 hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:text-yellow-400 hover:underline">Privacy</Link>
            <Link href="/refund" className="hover:text-yellow-400 hover:underline">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
