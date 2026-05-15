import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Success() {
  return (
    <div className="h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-md text-center"
      >
        <div className="flex justify-center mb-8">
          <CheckCircle2 size={64} strokeWidth={1} className="text-studio-accent" />
        </div>
        <p className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-black/40 font-medium">Order Confirmed</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tighter leading-none mb-8">
          Thank you for <br /> joining our world.
        </h1>
        <p className="text-sm text-studio-black/60 leading-relaxed uppercase tracking-[0.15em] mb-12">
          Your order No. 8921 is being prepared in our Paris studio. You will receive a notification once it is on its way.
        </p>

        <div className="flex flex-col gap-4">
          <Link 
            to="/shop" 
            className="bg-studio-black text-white py-4 text-xs uppercase tracking-[0.3em] font-medium hover:opacity-90 transition-all flex items-center justify-center gap-4 group"
          >
            Continue Browsing
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/" 
            className="text-xs uppercase tracking-widest text-studio-black/40 hover:text-studio-black transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
