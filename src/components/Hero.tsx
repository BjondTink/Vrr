import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Hero() {
  const [settings, setSettings] = useState({
    heroTitle: "First Signs of Spring",
    heroSubtitle: "Discover the Collection",
    heroImage: "",
    collection1Image: "",
    collection2Image: "",
    collection3Image: "",
    collection4Image: ""
  });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });
    return unsub;
  }, []);

  const bgImage = settings.heroImage || "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2670&auto=format&fit=crop";

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Spring Collection"
          className="w-full h-full object-cover grayscale-[0.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 font-medium"
        >
          {settings.heroSubtitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif text-5xl md:text-8xl lg:text-9xl mb-8 leading-[0.9] tracking-tighter text-balance max-w-4xl mx-auto"
        >
          {settings.heroTitle}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/shop"
            className="px-8 py-3 bg-white text-studio-black text-[10px] uppercase tracking-widest hover:bg-studio-black hover:text-white transition-all w-full md:w-auto text-center"
          >
            Shop the Look
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase tracking-widest hover:bg-white hover:text-studio-black transition-all w-full md:w-auto text-center"
          >
            Explore Primavera
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] uppercase tracking-widest text-white/60">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 relative">
          <motion.div
            animate={{
              y: [0, 48, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-full h-4 bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
