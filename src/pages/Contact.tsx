import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, MapPin, Phone, Mail, Clock } from "lucide-react";
import { flexibleDb } from "../lib/flexibleDatabase";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [pageData, setPageData] = useState<any>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "Inquiry",
    message: ""
  });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const match = items.find((p) => p.id === "contact");
      if (match) {
        setPageData(match);
      }
    });
    return unsub;
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setLoading(true);
    
    // Simulate real server delivery nicely
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormState({ name: "", email: "", subject: "Inquiry", message: "" });
    }, 1200);
  };

  const departments = [
    { name: t("contact.dept_general", "General Inquiries"), email: "studio@vrr.com" },
    { name: t("contact.dept_press", "Press & Collaborations"), email: "press@vrr.com" },
    { name: t("contact.dept_bespoke", "Private Concierge Services"), email: "concierge@vrr.com" }
  ];

  return (
    <div className="pt-40 pb-24 bg-studio-bg min-h-screen text-studio-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-24">
          <div className={pageData?.pageImage ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl"}>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-accent font-semibold text-left"
            >
              {pageData?.pageSubtitle || t("contact.subtitle", "Connect With the Studio")}
            </motion.p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] text-left mb-12 whitespace-pre-line">
              {pageData?.pageTitle || t("contact.title", "Ask our \n concierge.")}
            </h1>
            <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light text-left whitespace-pre-line">
              {pageData?.pageBody || t("contact.body", "We are always here to listen. Whether you require meticulous sizing consultations, customized fitting edits, or details on imminent seasonal drops, please drop us a message.")}
            </p>
          </div>
          {pageData?.pageImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 aspect-[4/3] rounded overflow-hidden shadow-sm border border-black/5"
            >
              <img 
                src={pageData.pageImage} 
                alt="Concierge Department" 
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start mb-36 border-t border-studio-black/5 pt-20">
          
          {/* Quick Details & Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-studio-black/40">{t("contact.spaces_label", "Studio Spaces")}</span>
              <h2 className="font-serif text-3xl tracking-tighter leading-tight">
                {t("contact.hq_title", "Vrr Headquarters")}
              </h2>
              <p className="text-sm text-studio-black/70 leading-relaxed uppercase tracking-wider">
                {t("contact.hq_desc", "Located in the historic Le Marais, our flagship atelier houses our collection library and active design tables. We welcome guests by scheduled private appointment only.")}
              </p>
            </div>

            <div className="space-y-8 pt-8 border-t border-studio-black/5">
              <div className="flex items-start gap-4">
                <MapPin size={18} className="text-studio-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-mono text-studio-black/40 mb-2">{t("contact.flagship_label", "Flagship Location")}</h4>
                  <p className="text-sm tracking-wide font-medium">42 Rue des Francs-Bourgeois</p>
                  <p className="text-xs text-studio-black/60 mt-1">75004 Paris, France</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail size={18} className="text-studio-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-mono text-studio-black/40 mb-2">{t("contact.digital_label", "Digital Inquiries")}</h4>
                  <p className="text-sm tracking-wide font-medium">studio@vrr.com</p>
                  <p className="text-xs text-studio-black/60 mt-1">{t("contact.digital_desc", "Our team replies within 24 operational hours.")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock size={18} className="text-studio-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-mono text-studio-black/40 mb-2">{t("contact.hours_label", "Concierge Hours")}</h4>
                  <p className="text-sm tracking-wide font-medium">{t("contact.hours_desc", "Monday — Friday\n09:00 — 18:00 Central European Time").split('\n')[0]}</p>
                  <p className="text-xs text-studio-black/60 mt-1">{t("contact.hours_desc", "Monday — Friday\n09:00 — 18:00 Central European Time").split('\n')[1]}</p>
                </div>
              </div>
            </div>

            {/* Department Emails */}
            <div className="space-y-4 pt-8 border-t border-studio-black/5">
              <h4 className="text-[10px] uppercase tracking-widest font-mono text-studio-black/40 mb-4">{t("contact.channels_label", "Dedicated Channels")}</h4>
              {departments.map((dept) => (
                <div key={dept.name} className="flex justify-between items-center text-xs pb-2 border-b border-studio-black/5">
                  <span className="text-studio-black/60">{dept.name}</span>
                  <a href={`mailto:${dept.email}`} className="font-mono hover:text-studio-accent transition-colors underline underline-offset-4">{dept.email}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-black/5 rounded shadow-sm">
            <h3 className="font-serif text-2xl tracking-tight mb-8">{t("contact.send_message", "Send a Message")}</h3>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-center py-12"
                >
                  <div className="w-16 h-16 bg-[#F3F1EF] rounded-full flex items-center justify-center mx-auto text-studio-accent">
                    <Check size={28} />
                  </div>
                  <h4 className="font-serif text-2xl tracking-tight">{t("contact.thank_you", "Thank You")}</h4>
                  <p className="text-sm text-studio-black/60 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
                    {t("contact.thank_you_desc", "Your message reaches our creative room securely. We will consult our designers and return with an answer promptly.")}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-xs uppercase tracking-widest text-studio-accent hover:underline underline-offset-4 pt-4"
                  >
                    {t("contact.send_another", "Send another message")}
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-mono text-studio-black/50">{t("contact.your_name", "Your Name *")}</label>
                      <input 
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        placeholder={t("contact.your_name_placeholder", "e.g. Valentina V.")}
                        className="w-full bg-[#fcfcfc] border border-black/10 px-5 py-4 text-xs tracking-wider rounded focus:outline-none focus:border-studio-accent transition-all uppercase placeholder:text-black/3.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-mono text-studio-black/50">{t("contact.your_email", "Your Email *")}</label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        placeholder={t("contact.your_email_placeholder", "e.g. email@address.com")}
                        className="w-full bg-[#fcfcfc] border border-black/10 px-5 py-4 text-xs tracking-wider rounded focus:outline-none focus:border-studio-accent transition-all placeholder:text-black/3.0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-mono text-studio-black/50">{t("contact.department_label", "Inquiry Department")}</label>
                    <select 
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      className="w-full bg-[#fcfcfc] border border-black/10 px-5 py-4 text-xs tracking-wider rounded focus:outline-none focus:border-studio-accent transition-all"
                    >
                      <option value="Inquiry">{t("contact.dept_general", "General Concierge Studio")}</option>
                      <option value="Sizing">{t("contact.dept_sizing", "Sizing & Custom Fitting Consultation")}</option>
                      <option value="Press">{t("contact.dept_press", "Editorial Press & Custom Collaborations")}</option>
                      <option value="Bespoke">{t("contact.dept_bespoke", "Bespoke Custom Orders")}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-mono text-studio-black/50">{t("contact.message_label", "Your Message *")}</label>
                    <textarea 
                      required
                      rows={6}
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      placeholder={t("contact.message_placeholder", "Write your creative or sizing inquiries here...")}
                      className="w-full bg-[#fcfcfc] border border-black/10 px-5 py-4 text-xs tracking-wider rounded focus:outline-none focus:border-studio-accent transition-all placeholder:text-black/3.0 resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-studio-black text-white hover:bg-studio-accent transition-colors py-5 text-xs font-bold uppercase tracking-[0.25em] rounded flex items-center justify-center gap-3 shadow"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t("contact.submit_message", "Submit Message")}</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
