import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Instagram, ArrowUpRight } from "lucide-react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Newsletter() {
  const [settings, setSettings] = useState<any>({
    newsletterInstagram: "https://www.instagram.com/v_dessign/"
  });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
    return unsub;
  }, []);

  const instagramUrl = settings.newsletterInstagram || "https://www.instagram.com/v_dessign/";
  
  // Cleanly extract instagram handle from URL for presentation
  let handle = "v_dessign";
  try {
    const cleanUrl = instagramUrl.replace(/\/$/, "");
    const parts = cleanUrl.split("/");
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      if (last && !last.includes("instagram.com")) {
        handle = last;
      }
    }
  } catch (e) {
    // Keep fallback handle
  }

  return (
    <section className="py-32 bg-studio-black text-white overflow-hidden relative border-t border-white/5">
      {/* Decorative ambient gradient pattern overlay */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse duration-[8000ms]" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="space-y-10"
        >
          <p className="uppercase tracking-[0.4em] text-[10px] text-white/50 font-medium">Join our world</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9]">
            Stay close to <br /> the studio
          </h2>
          
          <p className="text-sm md:text-base text-white/60 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
            Follow our design process, studio updates and exclusive drops on Instagram.
          </p>

          <div className="max-w-md mx-auto pt-4">
            <a 
              href={instagramUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-white text-black hover:bg-transparent hover:text-white hover:border-white border-2 border-white px-8 md:px-12 py-5 rounded-full text-xs md:text-sm font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-xl group"
            >
              <Instagram size={18} className="group-hover:rotate-6 transition-transform" />
              <span>@{handle}</span>
              <ArrowUpRight size={18} className="translate-y-[1.5px]" />
            </a>
          </div>

          <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
             {["Vogue", "Bazaar", "Elle", "Wallpaper"].map((press) => (
                <span key={press} className="font-serif italic text-xl md:text-2xl tracking-tight">{press}</span>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
