import { motion } from "motion/react";
import { Plus } from "lucide-react";

const looks = [
  {
    id: 1,
    name: "Linen Trench Coat",
    price: "$340",
    image: "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574",
    pos: { top: "30%", left: "45%" },
  },
  {
    id: 2,
    name: "Silk Slip Dress",
    price: "$210",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574",
    pos: { top: "60%", left: "55%" },
  },
];

export default function ShopTheLook() {
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
                src="https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576"
                alt="Main Look"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Hotspots */}
            {looks.map((look) => (
              <motion.div
                key={look.id}
                className="absolute"
                style={{ top: look.pos.top, left: look.pos.left }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="group relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-xl border border-black/5">
                    <Plus size={16} className="text-studio-black" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-white p-4 shadow-2xl rounded-sm w-48 border border-black/5">
                      <img src={look.image} alt={look.name} className="w-full aspect-square object-cover mb-3" />
                      <p className="font-serif text-sm">{look.name}</p>
                      <p className="text-[10px] text-studio-accent uppercase tracking-widest mt-1">{look.price}</p>
                    </div>
                    <div className="w-3 h-3 bg-white rotate-45 mx-auto -mt-1.5 border-r border-b border-black/5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Text Side */}
          <div className="space-y-12">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="uppercase tracking-[0.25em] text-[10px] mb-6 text-studio-accent font-medium">Inside the Studio</p>
              <h2 className="font-serif text-5xl md:text-7xl tracking-tighter leading-[0.95] mb-8">
                Every <br /> Look <br /> Tells a Story
              </h2>
              <p className="text-sm md:text-base text-studio-black/70 leading-relaxed max-w-md">
                We believe in pieces that live beyond the trends. Our "Shop the Look" curators bring together textures and tones that harmonize effortlessly.
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
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-serif text-sm">{i === 1 ? looks[0].name : looks[1].name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-studio-accent mt-1">Shop Now</p>
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
