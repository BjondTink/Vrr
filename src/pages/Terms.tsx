import React from "react";
import { motion } from "motion/react";

export default function Terms() {
  const compliancePoints = [
    {
      title: "1. Scope & Acceptance",
      desc: "By utilizing this platform, browsing our digital archives, or completing transactions, you accept these Terms of Service. This platform presents seasonal high-concept clothing collections subject to limited physical stocks."
    },
    {
      title: "2. Purchase & Inventory Locks",
      desc: "Since all items are produced in small restricted batches, placing an article in your cart does not reserve the inventory. An purchase is finalized only when checkout processing is fully authorized and you receive a confirmation invoice. We reserve the absolute right to limit item volumes to prevent commercial reselling."
    },
    {
      title: "3. Precision Pricing & Inaccuracies",
      desc: "We work diligently to ensure item specs, visual drapes, and pricing parameters remain immaculate. In the rare event of informational or typographical errors, we hold the right to cancel or void transactions to correct such system faults."
    },
    {
      title: "4. Intellectual & Visual Ownership",
      desc: "All code, text layout designs, product photography, trademarks, and typography curves displayed are the exclusive creative property of Vrr. Any unauthorized redistribution, replication, or commercial duplication is strictly forbidden."
    }
  ];

  return (
    <div className="pt-40 pb-24 bg-studio-bg min-h-screen text-studio-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <p className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-accent font-semibold text-left">Transactional Rules</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-left mb-12">
            Terms of <br /> Service.
          </h1>
          <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light text-left">
            Our legal conditions are established to ensure total security, inventory precision, and intellectual safety for everyone. Read about our billing policies and product limits.
          </p>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start border-t border-studio-black/5 pt-20">
          
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-studio-black/40 block">Operational Code</span>
            <p className="text-xs font-mono font-bold leading-none">VRR-TERMS-V4</p>
            <div className="h-[1px] bg-studio-black/5 my-6" />
            <h3 className="font-serif text-lg tracking-tight">Fair Play Standard</h3>
            <p className="text-xs text-studio-black/60 leading-relaxed uppercase tracking-wider">
              We operate on principles of patience and respect. By shopping at Vrr, you agree to respect our creators, logistics partners, and artisanal staff.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {compliancePoints.map((pt) => (
              <div key={pt.title} className="space-y-4">
                <h2 className="font-serif text-2xl tracking-tight text-studio-black">{pt.title}</h2>
                <p className="text-sm text-studio-black/70 leading-relaxed font-sans">{pt.desc}</p>
                <div className="h-[1px] bg-studio-black/5 pt-4" />
              </div>
            ))}

            <div className="pt-8">
              <h3 className="font-serif text-lg mb-2">Legal Questions</h3>
              <p className="text-xs text-studio-black/60 leading-relaxed uppercase tracking-wider">
                For complete copies of our legal terms, or physical registration credentials, please contact our legal counsel:
              </p>
              <a href="mailto:legal@vrr.com" className="font-mono text-sm underline underline-offset-4 font-bold text-studio-accent mt-4 inline-block">
                legal@vrr.com
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
