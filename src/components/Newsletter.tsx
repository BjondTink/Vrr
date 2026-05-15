import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="py-32 bg-studio-black text-white overflow-hidden relative">
      {/* Decorative grain/noise pattern overlay if I could, but let's stick to clean */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
        >
          <p className="uppercase tracking-[0.4em] text-[10px] mb-8 text-white/50 font-medium">Join our world</p>
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-12">
            Stay close to <br /> the studio
          </h2>
          
          <p className="text-sm md:text-base text-white/60 mb-16 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
            Early access to new drops, studio journals, and exclusive events.
          </p>

          <form className="max-w-md mx-auto relative group">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="w-full bg-transparent border-b border-white/30 pb-6 text-sm uppercase tracking-widest focus:outline-none focus:border-white transition-colors text-center"
              required
            />
            <button 
              type="submit"
              className="absolute right-0 bottom-6 group-hover:translate-x-2 transition-transform duration-300"
            >
              <ArrowRight size={24} className="text-white" />
            </button>
          </form>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
             {["Vogue", "Bazaar", "Elle", "Wallpaper"].map((press) => (
               <span key={press} className="font-serif italic text-xl md:text-2xl tracking-tight">{press}</span>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
