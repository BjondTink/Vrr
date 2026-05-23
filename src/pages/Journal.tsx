import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import SEO from "../components/SEO";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Journal() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection(
      "journalPosts",
      (items) => {
        setPosts(items);
        setLoading(false);
      },
      (err) => {
        console.error("Journal fetch error:", err);
        setLoading(false);
      },
      "updatedAt",
      "desc"
    );
    return unsub;
  }, []);

  return (
    <div className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <SEO title="Studio Journal" description="Insights, notes, and material studies from the Vrr Studio." />
      
      <header className="mb-24 text-center max-w-2xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[10px] mb-6 text-studio-accent font-medium">Inside Vrr</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none mb-8 italic">Studio Journal</h1>
        <p className="text-sm md:text-base text-studio-black/60 leading-relaxed uppercase tracking-widest">
          A collection of thoughts, inspirations, and the processes behind our collections.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-studio-black/10 border-t-studio-black rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 opacity-20 uppercase tracking-widest text-[10px] font-bold">
          No entries found in archive.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {posts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden mb-8 bg-black/5">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-black/10">No Image</div>
                )}
              </div>
              <div className="flex justify-between items-center mb-4 text-[10px] uppercase tracking-[0.2em] text-studio-accent font-bold">
                <span>{post.category}</span>
                <span className="opacity-40">{post.date}</span>
              </div>
              <h2 className="font-serif text-2xl group-hover:italic transition-all leading-tight">{post.title}</h2>
              <div className="mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-[10px] uppercase tracking-widest border-b border-studio-black/20 pb-1">Read Entry</span>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <div className="mt-40 border-t border-studio-black/5 pt-24 text-center">
        <p className="font-serif text-2xl italic text-studio-black/40 mb-8 max-w-lg mx-auto">
          "The journal is where the invisible becomes tangible. It is the bridge between inspiration and form."
        </p>
        <span className="text-[10px] uppercase tracking-widest text-studio-accent font-bold">— Studio Note No. 12</span>
      </div>
    </div>
  );
}
