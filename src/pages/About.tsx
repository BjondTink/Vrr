import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function About() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const match = items.find((p) => p.id === "story");
      if (match) {
        setPageData(match);
      }
    });
    return unsub;
  }, []);

  return (
    <div className="pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="uppercase tracking-[0.4em] text-[10px] mb-8 text-studio-accent font-medium">{pageData?.pageSubtitle || "Established 2024"}</p>
            <h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-[0.85] mb-12 whitespace-pre-line">
              {pageData?.pageTitle || "Vrr \n Studio."}
            </h1>
            <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light whitespace-pre-line">
              {pageData?.pageBody || "Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism. We craft garments that serve as a quiet backdrop to a life well-lived."}
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] overflow-hidden rounded-sm"
          >
            <img 
              src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670" 
              alt="Studio Atmosphere" 
              className="w-full h-full object-cover grayscale-[0.3]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Narrative Section */}
        <div className="max-w-4xl mx-auto mb-40 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-studio-black/5 pt-12">
             <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-accent">Origin</h3>
             <div className="md:col-span-2 space-y-8">
               <p className="font-serif text-3xl leading-snug">
                 Born from a desire to return to the tactile and the meaningful in an increasingly digital world.
               </p>
               <p className="text-studio-black/60 leading-relaxed uppercase tracking-widest text-xs">
                 Founded by a collective of designers and artists, our studio in the 4th Arrondissement serves as both an atelier and a gallery. We don't just design clothing; we curate environments where creativity can breathe.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-studio-black/5 pt-12">
             <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-studio-accent">Ethos</h3>
             <div className="md:col-span-2 space-y-8">
               <p className="font-serif text-3xl leading-snug">
                 Sustainability is not a feature; it is the fundamental architecture of our decisions.
               </p>
               <p className="text-studio-black/60 leading-relaxed uppercase tracking-widest text-xs">
                 Every thread, button, and package is considered. We work exclusively with small-scale European mills that share our commitment to regenerative practices and fair labor.
               </p>
             </div>
          </div>
        </div>




      </div>
    </div>
  );
}
