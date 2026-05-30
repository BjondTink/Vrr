import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Privacy() {
  const [pageData, setPageData] = useState<any>(null);
  
  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const match = items.find((p) => p.id === "privacy");
      if (match) {
        setPageData(match);
      }
    });
    return unsub;
  }, []);

  const points = [
    {
      title: "1. Information We Secure",
      desc: "We collect personal identifiers such as your name, billing credentials, shipping address, collection histories, and device telemetry. This collection occurs exclusively when you submit inquiry files, perform transaction checkouts, or subscribe to our design processes."
    },
    {
      title: "2. Algorithmic Processing & Usage",
      desc: "Your data acts solely as the mechanical backbone of outstanding studio logistics. We utilize this information to execute transactions safely, coordinate premium express courier dispatching, personalize seasonal newsletters, and preserve account settings."
    },
    {
      title: "3. Cryptographic Storage & Safety",
      desc: "All personal identifiers and billing credentials undergo rigorous cryptographic encryption (using secure SSL protocols and certified PCI-compliant servers). We maintain a absolute zero-external-sharing commitment; we never sell, share, or lease transactional details."
    },
    {
      title: "4. Your Absolute Rights",
      desc: "Under standard EU general data protection regulations (GDPR), you possess absolute ownership over your files. You may prompt our studio database at any moment to completely erase your historical transactions, digital coordinates, or profile profiles."
    }
  ];

  return (
    <div className="pt-40 pb-24 bg-studio-bg min-h-screen text-studio-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-24">
          <div className={pageData?.pageImage ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl"}>
            <p className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-accent font-semibold text-left">
              {pageData?.pageSubtitle || "Legal Protections"}
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-left mb-12 whitespace-pre-line">
              {pageData?.pageTitle || "Privacy & \n Data Sovereignty."}
            </h1>
            <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light text-left whitespace-pre-line">
              {pageData?.pageBody || "We value your digital footprint with the exact same commitment and respect we hold for our organic fibers. Read about how we secure, process, and respect your private data."}
            </p>
          </div>
          {pageData?.pageImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 aspect-[4/3] rounded overflow-hidden shadow-sm border border-black/5"
            >
              <img 
                src={pageData.pageImage} 
                alt="Privacy Banner" 
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start border-t border-studio-black/5 pt-20">
          
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-studio-black/40 block">Last Updated</span>
            <p className="text-xs font-mono font-bold leading-none">May 25, 2026</p>
            <div className="h-[1px] bg-studio-black/5 my-6" />
            <h3 className="font-serif text-lg tracking-tight">Our Philosophy</h3>
            <p className="text-xs text-studio-black/60 leading-relaxed uppercase tracking-wider">
              An elegant experience demands absolute trust. We process only minimal data necessary to fulfill custom shipping logs, maintaining total confidentiality relative to third party registries.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {points.map((pt) => (
              <div key={pt.title} className="space-y-4">
                <h2 className="font-serif text-2xl tracking-tight text-studio-black">{pt.title}</h2>
                <p className="text-sm text-studio-black/70 leading-relaxed font-sans">{pt.desc}</p>
                <div className="h-[1px] bg-studio-black/5 pt-4" />
              </div>
            ))}
            
            <div className="pt-8">
              <h3 className="font-serif text-lg mb-2">Concierge Inquiries</h3>
              <p className="text-xs text-studio-black/60 leading-relaxed uppercase tracking-wider">
                If you seek full disclosure of files held within our local databases, please send a secured digital inquiry to:
              </p>
              <a href="mailto:privacy@vrr.com" className="font-mono text-sm underline underline-offset-4 font-bold text-studio-accent mt-4 inline-block">
                privacy@vrr.com
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
