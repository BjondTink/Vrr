import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Truck,
  MapPin
} from "lucide-react";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Success() {
  const { t } = useLanguage();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backgroundEmailStatus, setBackgroundEmailStatus] = useState<"idle" | "sent" | "skipped" | "failed">("idle");

  useEffect(() => {
    if (orderId) {
      flexibleDb.getDoc("orders", orderId)
        .then((data) => {
          if (data) {
            setOrder(data);
            sendEmailJSBackground(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading order:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const sendEmailJSBackground = async (orderData: any) => {
    const serviceId = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID;
    const templateId = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setBackgroundEmailStatus("skipped");
      return;
    }

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: orderData.customerEmail,
            to_name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
            order_id: orderData.id.slice(-6).toUpperCase(),
            total_amount: `${orderData.total.toLocaleString("en-US")} Lek`,
            courier_name: orderData.shippingAddress.courier,
            shipping_fee: orderData.shippingAddress.shippingFee,
            items_list: orderData.items.map((i: any) => `${i.name} (x${i.quantity})`).join(", "),
            delivery_address: `${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.country}`
          }
        })
      });

      if (response.ok) {
        setBackgroundEmailStatus("sent");
        console.log("Automated receipt email sent successfully via EmailJS!");
      } else {
        setBackgroundEmailStatus("failed");
        const errorText = await response.text();
        console.warn("EmailJS sending failed:", errorText);
      }
    } catch (e) {
      setBackgroundEmailStatus("failed");
      console.warn("Failed to trigger background EmailJS:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-studio-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-neutral pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={48} strokeWidth={1} className="text-studio-accent" />
        </div>
        
        <p className="uppercase tracking-[0.4em] text-[10px] mb-4 text-studio-black/40 font-medium">{t("success.order_confirmed", "Order Confirmed")}</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tighter leading-none mb-4">
          {t("success.title", "Thank you for joining our world.")}
        </h1>
        <p className="text-[10px] text-studio-black/50 leading-relaxed uppercase tracking-[0.2em] mb-12 max-w-lg mx-auto">
          {t("success.order_prepared", "Your custom order is being meticulously prepared in our Tirana atelier.")}
        </p>

        {order ? (
          <div className="max-w-xl mx-auto text-left mb-12 bg-white p-6 md:p-8 rounded-sm shadow-sm border border-studio-black/5">
            <div className="flex justify-between items-center border-b border-studio-black/5 pb-4 mb-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold">{t("success.receipt_summary", "Receipt Summary")}</h3>
                <p className="text-[9px] uppercase tracking-widest text-studio-black/40 mt-1">Ref: #{order.id.slice(-6).toUpperCase()}</p>
              </div>
              <span className="text-[9px] bg-studio-accent/10 text-studio-accent font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                {order.status}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-6">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-sm" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-serif text-xs font-semibold">{item.name}</h4>
                      <p className="text-[9px] uppercase tracking-widest text-studio-black/40">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium">{item.price}</span>
                </div>
              ))}
            </div>

            {/* Order Metadata */}
            <div className="border-t border-studio-black/5 pt-4 space-y-3">
              <div className="flex gap-2 text-[10px] uppercase tracking-widest text-studio-black/60">
                <MapPin size={12} className="shrink-0 mt-0.5 text-studio-accent" />
                <div>
                  <span className="font-bold text-studio-black block">{t("success.delivery_proportions", "Delivery Proportions:")}</span>
                  <span className="text-[9px] text-studio-black/40 block mt-0.5">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName} <br />
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country} <br />
                    Phone: {order.shippingAddress.phone}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 text-[10px] uppercase tracking-widest text-studio-black/60 pt-2 border-t border-studio-black/5">
                <Truck size={12} className="shrink-0 mt-0.5 text-studio-accent" />
                <div>
                  <span className="font-bold text-studio-black block">{t("success.courier", "Logistical Courier:")}</span>
                  <span className="text-[9px] text-studio-black/40 block mt-0.5">
                    {order.shippingAddress.courier} ({order.shippingAddress.shippingFee})
                  </span>
                </div>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-studio-black/5 pt-4 mt-6 flex justify-between items-end">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-studio-black/40 block">{t("success.payment_mode", "Payment Mode: Cash on Delivery")}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold block mt-1">{t("success.total_payable", "Total Payable")}</span>
              </div>
              <span className="font-serif text-2xl font-semibold text-studio-accent">
                {order.total.toLocaleString("en-US")} Lek
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-sm border border-studio-black/5 mb-12">
            <p className="text-xs uppercase tracking-widest text-studio-black/50">Receipt Details are not active. Continue browsing our catalog below.</p>
          </div>
        )}
        {/* Actions Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/shop" 
            className="bg-studio-black text-white w-full sm:w-auto px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-medium hover:opacity-90 transition-all flex items-center justify-center gap-4 group"
          >
            {t("success.continue_browsing", "Continue Browsing")}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/" 
            className="text-[10px] uppercase tracking-[0.2em] text-studio-black/40 hover:text-studio-black transition-colors py-2"
          >
            {t("success.return_home", "Return to Homepage")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
