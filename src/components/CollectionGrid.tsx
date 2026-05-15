import { motion } from "motion/react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function CollectionGrid() {
  const [settings, setSettings] = useState({
    collectionTitle: "The Seasonal Edit",
    collectionSubtitle: "Curated Pieces",
    collectionDescription: "Our latest pieces are designed for the transitional moments between seasons. Timeless silhouettes meet modern craftsmanship."
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "global"), (snap) => {
      if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() as any }));
    });
    return unsub;
  }, []);

  const dynamicCollections = [
    {
      title: "Le Matin",
      category: "Essentials",
      image: (settings as any).collection1Image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2670",
      size: "large",
    },
    {
      title: "L'Heure Bleue",
      category: "Evening Wear",
      image: (settings as any).collection2Image || "https://images.unsplash.com/photo-1539008835270-3dc9d3160914?auto=format&fit=crop&q=80&w=2574",
      size: "small",
    },
    {
      title: "Jardin de Mars",
      category: "Accessories",
      image: (settings as any).collection3Image || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670",
      size: "small",
    },
    {
      title: "Primavera",
      category: "New Arrival",
      image: (settings as any).collection4Image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2520",
      size: "medium",
    },
  ];

  return (
    <section id="collections" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="uppercase tracking-[0.2em] text-[10px] mb-4 text-studio-accent font-medium">{settings.collectionSubtitle}</p>
          <h2 className="font-serif text-4xl md:text-6xl tracking-tight leading-none">{settings.collectionTitle}</h2>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-studio-black/60 uppercase tracking-wide">
          {settings.collectionDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {dynamicCollections.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`group cursor-pointer ${
              item.size === "large" ? "md:col-span-12 lg:col-span-8" : 
              item.size === "medium" ? "md:col-span-12 lg:col-span-4" : 
              "md:col-span-6 lg:col-span-4"
            }`}
          >
            <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto md:h-[600px]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[10px] uppercase tracking-widest border-b border-white pb-1">Show Collection</span>
                <span className="font-serif text-2xl italic">{index + 1}</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="font-serif text-xl mb-1">{item.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-studio-accent">{item.category}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <Link 
          to="/shop"
          className="inline-block border-b border-studio-black pb-2 text-xs uppercase tracking-[0.2em] font-medium hover:text-studio-accent hover:border-studio-accent transition-all"
        >
          View All Collections
        </Link>
      </div>
    </section>
  );
}
