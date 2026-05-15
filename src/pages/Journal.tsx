import { motion } from "motion/react";

const posts = [
  {
    date: "Mars 2026",
    title: "Light & shadow in the Parisian studio",
    category: "Notes",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2669",
  },
  {
    date: "Feb 2026",
    title: "The tactile nature of raw linen",
    category: "Material",
    image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670",
  },
  {
    date: "Jan 2026",
    title: "Defining the primavera palette",
    category: "Process",
    image: "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576",
  }
];

export default function Journal() {
  return (
    <div className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-24 text-center max-w-2xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-[10px] mb-6 text-studio-accent font-medium">Inside Vrr</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none mb-8 italic">Studio Journal</h1>
        <p className="text-sm md:text-base text-studio-black/60 leading-relaxed uppercase tracking-widest">
          A collection of thoughts, inspirations, and the processes behind our collections.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {posts.map((post, i) => (
          <motion.article 
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/5] overflow-hidden mb-8">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
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

      <div className="mt-40 border-t border-studio-black/5 pt-24 text-center">
        <p className="font-serif text-2xl italic text-studio-black/40 mb-8 max-w-lg mx-auto">
          "The journal is where the invisible becomes tangible. It is the bridge between inspiration and form."
        </p>
        <span className="text-[10px] uppercase tracking-widest text-studio-accent font-bold">— Studio Note No. 12</span>
      </div>
    </div>
  );
}
