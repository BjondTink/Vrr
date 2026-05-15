import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-studio-bg z-[110] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex items-center justify-between border-b border-studio-black/5">
              <h2 className="font-serif text-2xl uppercase tracking-tighter">Your Bag</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="hover:opacity-50 transition-opacity"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-sm uppercase tracking-widest text-studio-black/40">Your bag is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="border-b border-studio-black pb-1 text-xs uppercase tracking-widest"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 aspect-[3/4] bg-white rounded-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-black/10 text-[8px] uppercase tracking-widest text-center px-2">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-studio-black/30 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-studio-accent mt-1">
                          {item.category}
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-studio-black/10 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-black/5 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-black/5 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-medium">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-studio-black/5 bg-white/50 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-widest text-studio-black/40 font-medium">Subtotal</span>
                  <span className="font-serif text-2xl">${totalPrice.toFixed(2)}</span>
                </div>
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-studio-black text-white py-4 text-xs uppercase tracking-[0.3em] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-4 group"
                >
                  Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-[9px] text-center text-studio-black/40 uppercase tracking-widest">
                  Shipping and taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
