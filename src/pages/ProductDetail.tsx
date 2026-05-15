import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RefreshCw, Image as ImageIcon } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-studio-bg">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-studio-black/10 border-t-studio-black rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">Loading Piece</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-studio-bg px-6">
        <h1 className="font-serif text-4xl mb-8">Piece not found.</h1>
        <Link to="/shop" className="border-b border-studio-black pb-1 text-xs uppercase tracking-widest font-medium">
          Return to Shop
        </Link>
      </div>
    );
  }

  const gallery = [product.image, ...(product.gallery || [])];
  const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];

  const handleAddToBag = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart({
      ...product,
      selectedSize,
      quantity
    });
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Link to="/shop" className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-black/40 hover:text-studio-black mb-12 transition-colors">
        <ArrowLeft size={14} />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Visuals */}
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-studio-black/5 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {gallery[activeImage] ? (
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  src={gallery[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                   <ImageIcon size={48} className="text-black/5" />
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-[3/4] bg-studio-black/5 overflow-hidden transition-all border-2 ${activeImage === idx ? 'border-studio-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  {img ? (
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                      <ImageIcon size={16} className="text-black/10" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-studio-accent font-bold mb-4">{product.category}</p>
            <h1 className="font-serif text-5xl md:text-6xl tracking-tighter leading-none mb-6">{product.name}</h1>
            <p className="font-mono text-xl">{product.price}</p>
          </div>

          <div className="space-y-12 flex-1">
            {/* Description */}
            <div className="space-y-4">
              <p className="text-sm text-studio-black/70 leading-relaxed max-w-md uppercase tracking-wider font-light">
                {product.description || "A masterfully crafted piece designed for the modern wardrobe. Effortless essentialism in every stitch."}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest font-bold">Select Size</span>
                <button className="text-[9px] uppercase tracking-widest text-studio-black/40 border-b border-transparent hover:border-studio-black/40 transition-all">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-12 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold transition-all border ${selectedSize === size ? 'bg-studio-black text-white border-studio-black' : 'bg-transparent text-studio-black/40 border-black/10 hover:border-studio-black'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center border border-black/10 h-14">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-black/5 transition-all"><Minus size={14} /></button>
                  <span className="w-12 text-center text-xs font-mono">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-black/5 transition-all"><Plus size={14} /></button>
                </div>
                <button 
                  onClick={handleAddToBag}
                  className="flex-1 h-14 bg-studio-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-4 group"
                >
                  <ShoppingBag size={18} />
                  Add to Bag
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="pt-12 border-t border-black/5 grid grid-cols-2 gap-8">
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-studio-accent" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-1">Shipping</p>
                  <p className="text-[9px] text-studio-black/40 uppercase tracking-widest leading-relaxed">Complimentary global delivery on orders above $500.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw size={18} className="text-studio-accent" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold mb-1">Returns</p>
                  <p className="text-[9px] text-studio-black/40 uppercase tracking-widest leading-relaxed">14-day effortless returns policy.</p>
                </div>
              </div>
            </div>

            {/* Details Accordion */}
            <div className="pt-8 space-y-4">
              <details className="group border-t border-black/5 pt-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Materials & Origin</span>
                  <Plus size={14} className="group-open:rotate-45 transition-transform" />
                </summary>
                <div className="pt-4 text-[10px] uppercase tracking-widest text-studio-black/50 leading-relaxed">
                  {product.details || "100% fine cotton. Consciously woven in our Italian atelier. Each piece is finished by hand to ensure longevity and unparalleled quality."}
                </div>
              </details>
              <details className="group border-t border-black/5 pt-4">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Care Instruction</span>
                  <Plus size={14} className="group-open:rotate-45 transition-transform" />
                </summary>
                <div className="pt-4 text-[10px] uppercase tracking-widest text-studio-black/50 leading-relaxed">
                  Hand wash cold. Dry flat. Iron low heat. Handle with the same care we used in its creation.
                </div>
              </details>
              <div className="pt-8 flex items-center justify-center gap-4 grayscale opacity-20">
                 <ShieldCheck size={16} />
                 <span className="text-[8px] uppercase tracking-[0.5em]">Authentic Vrr Studio Piece</span>
                 <ShieldCheck size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
