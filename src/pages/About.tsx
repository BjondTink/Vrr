import { motion } from "motion/react";

export default function About() {
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
            <p className="uppercase tracking-[0.4em] text-[10px] mb-8 text-studio-accent font-medium">Established 2024</p>
            <h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-[0.85] mb-12">
              Vrr <br /> Studio.
            </h1>
            <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light">
              Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism. We craft garments that serve as a quiet backdrop to a life well-lived.
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

        {/* Studio Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-40">
           {[
             "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2669",
             "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=2670",
             "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2520",
             "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576"
           ].map((img, i) => (
             <motion.div 
               key={img}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="aspect-square overflow-hidden"
             >
               <img src={img} alt="Studio" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
             </motion.div>
           ))}
        </div>

        {/* Visit Section */}
        <div className="bg-studio-black text-white p-12 md:p-24 text-center rounded-sm">
          <p className="uppercase tracking-[0.5em] text-[10px] mb-8 text-white/50 font-medium">Join us</p>
          <h2 className="font-serif text-5xl md:text-7xl tracking-tighter mb-12">Visit the Studio</h2>
          <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-24 text-xs uppercase tracking-widest">
            <div>
              <p className="text-white/40 mb-4">Location</p>
              <p>42 Rue des Francs-Bourgeois <br /> 75004 Paris, France</p>
            </div>
            <div>
              <p className="text-white/40 mb-4">Inquiries</p>
              <p>studio@vrr.com <br /> +33 1 23 45 67 89</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
