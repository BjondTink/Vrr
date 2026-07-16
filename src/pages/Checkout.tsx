import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Albania"
  });

  const getShippingDetails = (country: string) => {
    const norm = country.toLowerCase().trim();
    if (norm === "albania") {
      return {
        courier: "Intex Courier",
        feeLek: 300,
        feeStr: "300 Lek",
        isAlbania: true,
        isBalkan: false,
        transitDays: "1-2"
      };
    } else if (norm === "kosovo" || norm === "montenegro") {
      return {
        courier: "Intex Courier",
        feeLek: 500,
        feeStr: "500 Lek",
        isAlbania: false,
        isBalkan: true,
        transitDays: "2-3"
      };
    } else {
      return {
        courier: "Posta Shqiptare Courier",
        feeLek: 3000,
        feeStr: "30$ (~3,000 Lek)",
        isAlbania: false,
        isBalkan: false,
        transitDays: "5-10"
      };
    }
  };

  const shippingDetails = getShippingDetails(shippingInfo.country);
  const { courier, feeLek, feeStr, isAlbania, isBalkan, transitDays } = shippingDetails;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setIsProcessing(true);
    
    // Albanian Phone Number Validation
    if (isAlbania) {
      const cleanPhone = shippingInfo.phone.replace(/[\s\-()]/g, "");
      const localPermissive = /^06\d{7}$/; 
      const internationalRegex = /^\+3556\d{8}$/;
      const internationalNoPlusRegex = /^3556\d{8}$/;
      
      if (!(localPermissive.test(cleanPhone) || internationalRegex.test(cleanPhone) || internationalNoPlusRegex.test(cleanPhone))) {
        setPhoneError("Please enter a valid Albanian phone number (e.g., 067XXXXXXX or +3556XXXXXXXX)");
        setIsProcessing(false);
        return;
      }
    }

    try {
      const orderId = await flexibleDb.createDoc("orders", {
        userId: "guest", 
        customerEmail: shippingInfo.email,
        items: cart,
        total: totalPrice + feeLek,
        status: "pending",
        paymentMethod: "Cash on Delivery",
        shippingAddress: {
          ...shippingInfo,
          courier,
          shippingFee: feeStr
        },
        createdAt: new Date().toISOString()
      });
      
      clearCart();
      navigate("/success", { state: { orderId } });
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
        <h2 className="font-serif text-4xl mb-8">{t("cart.empty", "Your bag is empty")}</h2>
        <Link to="/shop" className="border-b border-studio-black pb-1 text-xs uppercase tracking-widest font-medium">
          {t("cart.start_shopping", "Return to Shop")}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <Link to="/shop" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-studio-black/40 hover:text-studio-black mb-12 transition-colors">
        <ArrowLeft size={14} />
        {t("cart.start_shopping", "Back to Shopping")}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Form Container */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCompleteOrder} className="space-y-12">
            <section>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 border-b border-studio-black/5 pb-4">{t("checkout.billing_details", "Shipping Details")}</h2>
              <div className="grid grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder={t("checkout.first_name", "FIRST NAME")} 
                  required 
                  value={shippingInfo.firstName}
                  onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                  className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="text" 
                  placeholder={t("checkout.last_name", "LAST NAME")} 
                  required 
                  value={shippingInfo.lastName}
                  onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                  className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-studio-black/40">{t("checkout.country", "Country")}</label>
                  <select 
                    value={shippingInfo.country}
                    onChange={e => setShippingInfo({...shippingInfo, country: e.target.value})}
                    className="w-full bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none text-studio-black"
                  >
                    <option value="Albania">Albania</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Italy">Italy</option>
                    <option value="Germany">Germany</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Other">Other Country</option>
                  </select>
                </div>
                <input 
                  type="email" 
                  placeholder={t("checkout.email", "EMAIL ADDRESS")} 
                  required 
                  value={shippingInfo.email}
                  onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                  className="col-span-2 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <div className="col-span-2">
                  <input 
                    type="tel" 
                    placeholder={t("checkout.phone", "PHONE NUMBER")} 
                    required 
                    value={shippingInfo.phone}
                    onChange={e => {
                      setPhoneError("");
                      setShippingInfo({...shippingInfo, phone: e.target.value});
                    }}
                    className="w-full bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                  />
                  {phoneError ? (
                    <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold mt-2">{phoneError}</p>
                  ) : (
                    <p className="text-studio-black/30 text-[9px] uppercase tracking-widest mt-1">
                      {isAlbania ? "Albanian number required (e.g. 06XXXXXXXX or +3556XXXXXXXX)" : "Enter contact phone number"}
                    </p>
                  )}
                </div>
                <input 
                  type="text" 
                  placeholder={t("checkout.address", "STREET ADDRESS")} 
                  required 
                  value={shippingInfo.address}
                  onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                  className="col-span-2 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                />
                <input 
                  type="text" 
                  placeholder={t("checkout.city", "CITY")} 
                  required 
                  value={shippingInfo.city}
                  onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                  className={`${isAlbania ? "col-span-2" : "col-span-1"} bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none`} 
                />
                {!isAlbania && (
                  <input 
                    type="text" 
                    placeholder={t("checkout.postal_code", "POSTAL CODE")} 
                    required={!isAlbania} 
                    value={shippingInfo.postalCode}
                    onChange={e => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                    className="col-span-1 bg-transparent border-b border-studio-black/10 py-3 text-xs uppercase tracking-widest focus:border-studio-black outline-none" 
                  />
                )}
              </div>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 border-b border-studio-black/5 pb-4">{t("checkout.shipping_method", "Shipping Courier")}</h2>
              <div className="p-6 bg-[#B39B84]/5 rounded-sm flex items-center justify-between border border-[#B39B84]/20">
                <div className="flex items-center gap-4">
                  <Truck size={20} className="text-studio-black" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-studio-black block">
                      {courier} {isAlbania ? "(Albania)" : isBalkan ? "(Balkans)" : "(International)"}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-studio-black/40 mt-1 block">
                      Delivery in {transitDays} business days via {courier}.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#B39B84] uppercase tracking-widest">
                  {feeStr}
                </span>
              </div>
            </section>

            <section>
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold mb-8 border-b border-studio-black/5 pb-4">Payment Method</h2>
              <div className="p-6 bg-[#B39B84]/5 rounded-sm flex items-center justify-between border border-[#B39B84]/20">
                <div className="flex items-center gap-4">
                  <Truck size={20} className="text-studio-black" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-studio-black block">Pay on Delivery (Cash on Delivery)</span>
                    <span className="text-[9px] uppercase tracking-widest text-studio-black/40 mt-1 block">Pay in cash to the courier upon delivery</span>
                  </div>
                </div>
                <ShieldCheck size={20} className="text-studio-black/60" />
              </div>
              <p className="mt-4 text-[9px] text-studio-black/40 uppercase tracking-widest">Note: No credit card or online payment details are required now. You will pay the courier when your package is delivered.</p>
            </section>

            <button 
              disabled={isProcessing}
              type="submit"
              className="w-full bg-studio-black text-white py-6 text-xs uppercase tracking-[0.4em] font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {isProcessing ? t("checkout.processing", "Processing...") : t("checkout.place_order", "Complete Purchase")}
            </button>
          </form>
        </div>

        {/* Summary Side */}
        <div className="lg:col-span-5 bg-white/40 p-8 md:p-12 self-start sticky top-32">
          <h2 className="font-serif text-2xl mb-8">{t("checkout.order_summary", "Order Summary")}</h2>
          <div className="space-y-6 mb-12">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" referrerPolicy="no-referrer" />
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
              <span>{t("nav.subtotal", "Subtotal")}</span>
              <span>{totalPrice.toLocaleString("en-US")} Lek</span>
            </div>
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-studio-black/40">
              <span>{t("checkout.shipping_method", "Shipping")} ({shippingInfo.country})</span>
              <span>{feeStr}</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="text-sm uppercase tracking-[0.2em] font-bold">{t("nav.total", "Total")}</span>
              <span className="font-serif text-3xl">
                {isAlbania || isBalkan 
                  ? `${(totalPrice + feeLek).toLocaleString("en-US")} Lek` 
                  : `${(totalPrice + feeLek).toLocaleString("en-US")} Lek (International Shipping included)`}
              </span>
            </div>
          </div>

          <div className="mt-12 flex items-start gap-4 p-4 border border-studio-black/5 rounded-sm">
            <Truck size={18} className="text-studio-accent shrink-0" />
            <p className="text-[9px] uppercase tracking-widest leading-relaxed text-studio-black/60">
              {courier} delivery to {shippingInfo.country} ({feeStr}) expected in {transitDays} business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
