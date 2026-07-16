import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { flexibleDb } from "../lib/flexibleDatabase";
import { useLanguage } from "../context/LanguageContext";

export default function ShopTheLook() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<any>({
    lookbookMainImage: "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576",
    lookbookTitle: "Every Look Tells a Story",
    lookbookSubtitle: "Inside the Studio",
    lookbookDescription: 'We believe in pieces that live beyond the trends. Our "Shop the Look" curators bring together textures and tones that harmonize effortlessly.',
    lookbookProd1Name: "Linen Trench Coat",
    lookbookProd1Price: "$340",
    lookbookProd1Image: "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574",
    lookbookProd1Top: "30%",
    lookbookProd1Left: "45%",
    lookbookProd2Name: "Silk Slip Dress",
    lookbookProd2Price: "$210",
    lookbookProd2Image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574",
    lookbookProd2Top: "60%",
    lookbookProd2Left: "55%"
  });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
    return unsub;
  }, []);

  const looks = [
    {
      id: 1,
      name: settings.lookbookProd1Name || "Linen Trench Coat",
      price: settings.lookbookProd1Price || "$340",
      image: settings.lookbookProd1Image || "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574",
      pos: { 
        top: settings.lookbookProd1Top || "30%", 
        left: settings.lookbookProd1Left || "45%" 
      },
    },
    {
      id: 2,
      name: settings.lookbookProd2Name || "Silk Slip Dress",
      price: settings.lookbookProd2Price || "$210",
      image: settings.lookbookProd2Image || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574",
      pos: { 
        top: settings.lookbookProd2Top || "60%", 
        left: settings.lookbookProd2Left || "55%" 
      },
    },
  ];

  return (
    <section id="shop" className="bg-[#EEECEA] py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Image Side with clickable dots */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-sm overflow-hidden">
               <img
                src={settings.lookbookMainImage || "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576"}
                alt="Main Look"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576";
                }}
              />
            </div>
          </motion.div>

          {/* Text Side */}
          <div className="space-y-12">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="uppercase tracking-[0.25em] text-[10px] mb-6 text-studio-accent font-medium">
                {settings.lookbookSubtitle || "Inside the Studio"}
              </p>
              <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-[0.95] mb-8 whitespace-pre-line">
                {settings.lookbookTitle || "Every Look Tells a Story"}
              </h2>
              <p className="text-sm md:text-base text-studio-black/70 leading-relaxed max-w-md">
                {settings.lookbookDescription}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-8"
            >
              {[1, 2].map((i) => (
                <div key={i} className="space-y-4 cursor-pointer group">
                  <div className="aspect-[4/5] overflow-hidden bg-white/50 p-2">
                    <img 
                      src={i === 1 ? looks[0].image : looks[1].image} 
                      alt="Product" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = i === 1 
                          ? "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574" 
                          : "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574";
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-serif text-sm">{i === 1 ? looks[0].name : looks[1].name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-studio-accent mt-1">{t("home.shop_look", "Shop Now")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
