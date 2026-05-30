import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Truck, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Shipping() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const match = items.find((p) => p.id === "shipping");
      if (match) {
        setPageData(match);
      }
    });
    return unsub;
  }, []);

  const sections = [
    {
      title: "Corporate Logistical Tiers",
      icon: <Truck className="text-studio-accent" size={24} />,
      items: [
        { name: "Union Express Delivery", price: "Free on all worldwide orders", time: "2 to 4 business days" },
        { name: "Priority Studio Courier", price: "$35", time: "Next business day delivery" },
        { name: "Bespoke Personal Delivery", price: "Contact concierge", time: "Hand-delivered within European zones" }
      ]
    },
    {
      title: "Effortless Return Framework",
      icon: <RotateCcw className="text-studio-accent" size={24} />,
      text: "We invite you to try garments in the comfort of your sanctuary. If any piece does not harmonize with your collection, we accept returns within 14 days of delivery. Returns must remain unworn, unaltered, and with all protective cotton tags fully attached.",
      steps: [
        "Reach our concierge department via email at returns@vrr.com to secure your label.",
        "Pack the garment inside its original reusable bio-degradable carton box.",
        "Affix the prepaid DHL Express label and schedule your custom courier collection time.",
        "Allow 5–7 banking days for your original account credentials to be securely reimbursed."
      ]
    }
  ];

  return (
    <div className="pt-40 pb-24 bg-studio-bg min-h-screen text-studio-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-24">
          <div className={pageData?.pageImage ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl"}>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-accent font-semibold text-left"
            >
              {pageData?.pageSubtitle || "Studio Logistical Framework"}
            </motion.p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-left mb-12 whitespace-pre-line">
              {pageData?.pageTitle || "Shipping & \n Transit."}
            </h1>
            <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light text-left whitespace-pre-line">
              {pageData?.pageBody || "Every Vrr piece is hand-wrapped in tissue paper, loaded in custom organic cotton garment bags, and dispatched inside FSC-certified biodegradable containers directly from our atelier to minimize trace emissions."}
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
                alt="Transit / Shipping" 
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32 border-t border-studio-black/5 pt-20">
          
          {/* Tiers Left Col */}
          <div className="space-y-12">
            <div className="flex gap-4 items-center">
              {sections[0].icon}
              <h2 className="font-serif text-3xl tracking-tighter leading-tight font-medium">
                {sections[0].title}
              </h2>
            </div>
            
            <div className="space-y-6">
              {sections[0].items?.map((item) => (
                <div key={item.name} className="bg-white p-6 border border-black/5 rounded group hover:border-studio-accent transition-colors">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-sans text-sm font-semibold tracking-wide uppercase">{item.name}</h3>
                    <span className="text-xs font-mono font-bold text-studio-accent">{item.price}</span>
                  </div>
                  <div className="flex justify-between text-xs text-studio-black/60 font-mono">
                    <span>Delivered via DHL / FedEx Premium</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/40 p-6 border border-black/5 rounded flex items-start gap-4">
              <ShieldCheck className="text-studio-accent shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-[10px] uppercase font-mono tracking-widest text-studio-black/40 mb-1">Transit Insurance</h4>
                <p className="text-xs text-studio-black/70 leading-relaxed">
                  All Vrr shipments are fully insured from our atelier doors to your shipping destination. We guarantee transit security on high-value bespoke drops.
                </p>
              </div>
            </div>
          </div>

          {/* Returns Right Col */}
          <div className="space-y-12 bg-white p-8 md:p-12 border border-black/5 rounded">
            <div className="flex gap-4 items-center">
              {sections[1].icon}
              <h2 className="font-serif text-3xl tracking-tighter leading-tight font-medium">
                {sections[1].title}
              </h2>
            </div>

            <p className="text-sm text-studio-black/70 leading-relaxed uppercase tracking-wider">
              {sections[1].text}
            </p>

            <div className="space-y-6 pt-6 border-t border-studio-black/5">
              <h4 className="text-[10px] uppercase font-mono tracking-widest text-studio-black/40">Step-By-Step Return Workflow</h4>
              <ul className="space-y-6">
                {sections[1].steps?.map((step, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-xs text-studio-accent bg-[#F3F1EF] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-xs text-studio-black/70 leading-relaxed font-sans">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Closing support card */}
        <div className="border border-black/5 p-8 text-center rounded-sm max-w-2xl mx-auto flex flex-col items-center">
          <HelpCircle className="text-studio-accent mb-4" size={24} />
          <h4 className="font-serif text-xl tracking-tight mb-2">Require Customized Courier Schedules?</h4>
          <p className="text-xs text-studio-black/50 leading-relaxed max-w-md uppercase tracking-widest mb-6">
            If you need customized delivery dates or alternative localized address validations, please reach our digital concierge team.
          </p>
          <a href="mailto:studio@vrr.com" className="text-xs uppercase tracking-widest text-studio-black hover:text-studio-accent underline underline-offset-4">
            studio@vrr.com
          </a>
        </div>

      </div>
    </div>
  );
}
