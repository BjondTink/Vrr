import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: ""
  });

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      await addDoc(collection(db, "orders"), {
        userId: "guest", // Could be auth.currentUser.uid if logged in
        customerEmail: shippingInfo.email,
        items: cart,
        total: totalPrice,
        status: "pending",
        shippingAddress: shippingInfo,
        createdAt: serverTimestamp()
      });
      
      clearCart();
      navigate("/success");
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 text-center">
        <h2 className="font-serif text-4xl mb-8">Your bag is empty</h2>
        <Link to="/shop" className="border-b border-studio-black pb-1 text-xs uppercase tracking-widest font-medium">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Link to="/shop" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-black/40 hover:text-studio-black mb-12 transition-colors">
        <ArrowLeft size={14} />
        Back to Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCompleteOrder} className="space-y-12">
            <section>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 border-b border-studio-black/5 pb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="FIRST NAME" 
                  required 
                  value={shippingInfo.firstName}
                  onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                  className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="LAST NAME" 
                  required 
                  value={shippingInfo.lastName}
                  onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                  className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  required 
                  value={shippingInfo.email}
                  onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                  className="col-span-2 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="STREET ADDRESS" 
                  required 
                  value={shippingInfo.address}
                  onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                  className="col-span-2 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="CITY" 
                  required 
                  value={shippingInfo.city}
                  onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                  className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="POSTAL CODE" 
                  required 
                  value={shippingInfo.postalCode}
                  onChange={e => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                  className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
              </div>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 border-b border-studio-black/5 pb-4">Payment Method</h2>
              <div className="p-6 bg-studio-black/5 rounded-sm flex items-center justify-between opacity-50 border border-dashed border-studio-black/20">
                <div className="flex items-center gap-4">
                  <CreditCard size={20} />
                  <span className="text-[10px] uppercase tracking-widest">Secure Credit Card via Stripe</span>
                </div>
                <ShieldCheck size={20} />
              </div>
              <p className="mt-4 text-[9px] text-studio-black/40 uppercase tracking-widest">Note: This is a design demo. Your payment details are protected.</p>
            </section>

            <button 
              disabled={isProcessing}
              type="submit"
              className="w-full bg-studio-black text-white py-6 text-xs uppercase tracking-[0.4em] font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </button>
          </form>
        </div>

        {/* Summary Side */}
        <div className="lg:col-span-5 bg-white/40 p-8 md:p-12 self-start sticky top-32">
          <h2 className="font-serif text-2xl mb-8">Order Summary</h2>
          <div className="space-y-6 mb-12">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                <div className="flex-1">
                  <h3 className="font-serif text-sm">{item.name}</h3>
                  <p className="text-[9px] uppercase tracking-widest text-studio-black/40 mt-1">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-medium">{item.price}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-8 border-t border-studio-black/5">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-studio-black/40">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-studio-black/40">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="text-sm uppercase tracking-[0.2em] font-bold">Total</span>
              <span className="font-serif text-3xl">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-12 flex items-start gap-4 p-4 border border-studio-black/5 rounded-sm">
            <Truck size={18} className="text-studio-accent shrink-0" />
            <p className="text-[9px] uppercase tracking-widest leading-relaxed text-studio-black/60">
              Complimentary carbon-neutral shipping on all studio orders. Delivery expected in 2-4 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
