import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Sustainability() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const match = items.find((p) => p.id === "sustainability");
      if (match) {
        setPageData(match);
      }
    });
    return unsub;
  }, []);

  const pillars = [
    {
      title: "Regenerative Fibers",
      tag: "01 / Materials",
      description: "We work exclusively with certified organic, biodynamically grown fibers and premium deadstock. 100% of our linen is European Flax® certified, and our wool is sourced from small-scale generational farms in the UK supporting holistic land management.",
      details: [
        "No toxic pesticides or herbicides",
        "European Flax® certified linen",
        "Sustainably-sourced, mulesing-free organic wool",
        "PFC-free water-resistant coatings"
      ]
    },
    {
      title: "Slow-Batch Production",
      tag: "02 / Lifecycle",
      description: "Our collections are released in highly limited quantities to eliminate excess supply. Rather than responding to the hyper-accelerated fashion cycle, we design with permanence in mind. Each piece is crafted by skilled artisans who are paid fair living wages under ethical working conditions.",
      details: [
        "Crafted in hand-numbered batches",
        "All local artisans working under fair EU standards",
        "Zero-waste patterns that optimize yield",
        "A commitment to high-density French seams for lifetime durability"
      ]
    },
    {
      title: "Circular Design Blueprint",
      tag: "03 / The Future",
      description: "We construct our clothing to go back to the Earth. Our buttons are harvested from sustainable Corozo nuts or natural mother-of-pearl, and we use entirely organic cotton sewing threads so each garment remains fully biodegradable at the end of its life.",
      details: [
        "Natural corozo nut buttons instead of plastic",
        "100% biodegradable fiber design for natural colors",
        "Fiber recycling partnership option for customers",
        "Zero chemical finishes that compromise soil health"
      ]
    }
  ];

  return (
    <div className="pt-40 pb-24 bg-studio-bg min-h-screen text-studio-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-32">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-accent font-semibold"
          >
            {pageData?.pageSubtitle || "Studio Philosophy & Responsibility"}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-12 whitespace-pre-line"
          >
            {pageData?.pageTitle || "Pledging to \n the Earth."}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light whitespace-pre-line"
          >
            {pageData?.pageBody || "We don’t believe in seasons or disposable trends. For Vrr, sustainability is not a marketing strategy or a separate capsule—it is the baseline architecture of every garment we draft, sew, and package."}
          </motion.p>
        </div>

        {/* Feature Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40 border-t border-studio-black/5 pt-20">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="text-[10px] uppercase font-mono tracking-widest text-studio-black/40">Our Standard</span>
            <h2 className="font-serif text-4xl tracking-tighter leading-tight">
              A commitment to transparency, quality, and small-batch responsibility.
            </h2>
            <p className="text-xs uppercase tracking-widest text-studio-black/60 leading-relaxed">
              We vet every supplier from fiber to loom. We believe clothing is an investment, meant to be worn for decades, repaired over time, and eventually returned to nature.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="aspect-[4/5] rounded bg-white/50 p-3 shadow-sm border border-black/5"
          >
            <img 
              src={pageData?.pageImage || "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=1200"} 
              alt="Raw studio materials" 
              className="w-full h-full object-cover rounded-sm grayscale-[0.2]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Pillars / Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-36 border-t border-studio-black/5 pt-24">
          {pillars.map((pillar, i) => (
            <motion.div 
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-studio-black/5 pb-4">
                <span className="font-mono text-xs text-studio-accent font-semibold">{pillar.tag}</span>
                <span className="text-[9px] uppercase tracking-widest text-studio-black/30 font-medium">Sustainable Dev</span>
              </div>
              <h3 className="font-serif text-2xl tracking-tight text-studio-black">{pillar.title}</h3>
              <p className="text-sm text-studio-black/70 leading-relaxed">{pillar.description}</p>
              
              <ul className="space-y-3 pt-4 border-t border-studio-black/5">
                {pillar.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-studio-accent rounded-full mt-1.5 shrink-0" />
                    <span className="text-xs uppercase tracking-wider text-studio-black/60 font-medium">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Action Accordion / Closing Callout */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-studio-black text-white p-12 md:p-20 text-center rounded-sm"
        >
          <span className="uppercase tracking-[0.4em] text-[10px] text-white/40 font-medium block mb-6">Repair & Care Initiative</span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tighter mb-8 leading-tight max-w-2xl mx-auto">
            Our responsibility does not end at checkout.
          </h2>
          <p className="text-xs md:text-sm text-white/70 max-w-lg mx-auto leading-relaxed mb-8 uppercase tracking-widest">
            We offer complimentary repair consulting and free natural button packs for any Vrr garment. Reach out to our studio concierge to maintain your wardrobe's lifespan.
          </p>
          <div className="text-xs uppercase tracking-widest underline underline-offset-8 text-white/50 hover:text-white transition-colors cursor-pointer inline-block">
            Learn about our repair process
          </div>
        </motion.div>

      </div>
    </div>
  );
}
