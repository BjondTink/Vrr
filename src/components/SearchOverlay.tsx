import { motion, AnimatePresence } from "motion/react";
import { X, Search as SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-studio-bg z-[200] overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
            <div className="flex justify-between items-center mb-24">
              <span className="font-serif text-2xl uppercase tracking-tighter">Search</span>
              <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
                <X size={32} />
              </button>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  className="w-full bg-transparent border-b border-studio-black pb-8 text-4xl md:text-6xl font-serif tracking-tight focus:outline-none placeholder:text-studio-black/10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <SearchIcon size={32} className="absolute right-0 top-4 text-studio-black/20" />
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-studio-accent">Quick Links</h4>
                  <ul className="space-y-4 text-xl md:text-2xl font-serif">
                    <li className="hover:italic cursor-pointer transition-all">New Arrivals</li>
                    <li className="hover:italic cursor-pointer transition-all">Essentials</li>
                    <li className="hover:italic cursor-pointer transition-all">Archived Pieces</li>
                    <li className="hover:italic cursor-pointer transition-all">Studio Journal</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-studio-accent">Trending</h4>
                  <div className="flex flex-wrap gap-3">
                    {["Linen", "Spring", "Trench", "Silk", "Minimal", "Paris"].map((tag) => (
                      <span key={tag} className="px-4 py-2 bg-studio-black/5 rounded-full text-[10px] uppercase tracking-widest hover:bg-studio-black hover:text-white transition-colors cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
