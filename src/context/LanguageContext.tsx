import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "sq";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const dictionary: Record<Language, Record<string, string>> = {
  en: {
    // Nav & General UI
    "nav.shop": "Shop",
    "nav.collections": "Collections",
    "nav.about": "About",
    "nav.admin": "Admin",
    "nav.search": "Search",
    "nav.cart": "Cart",
    "nav.checkout": "Checkout",
    "nav.total": "Total",
    "nav.subtotal": "Subtotal",
    
    // Homepage
    "home.philosophy_quote": "Art is the soul of our studio, fashion is the language we use to speak to the world.",
    "home.philosophy_tag": "Our Philosophy",
    "home.marquee": "Vrr — Collection No.04 — Dropping Soon",
    "home.hero_sub": "Sustainable luxury tailored meticulously in our Tirana atelier.",
    "home.hero_cta": "Explore Collection",
    "home.scroll": "Scroll",
    "home.explore_primavera": "Explore Primavera",
    "home.shop_look": "Shop the Look",

    // Footer & Newsletter
    "newsletter.title": "Join the Club",
    "newsletter.desc": "Subscribe to receive updates, access to exclusive deals, and more.",
    "newsletter.placeholder": "Enter your email",
    "newsletter.button": "Subscribe",
    "newsletter.success": "Thank you for subscribing!",
    "footer.desc": "A creative space dedicated to the intersection of art, fashion, and human connection. Designed in Paris, inspired by the world.",
    "footer.col_title": "Collection",
    "footer.all_products": "Shop All",
    "footer.contact": "Contact Us",
    "footer.sustainability": "Sustainability",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.rights": "All rights reserved.",
    "newsletter.join_world": "Join our world",
    "newsletter.stay_close": "Stay close to \n the studio",
    "newsletter.stay_close_desc": "Follow our design process, studio updates and exclusive drops on Instagram.",

    // Cart Drawer
    "cart.title": "Shopping Bag",
    "cart.empty": "Your cart is empty",
    "cart.start_shopping": "Start Shopping",
    "cart.remove": "Remove",
    "cart.checkout": "Proceed to Checkout",
    "cart.free_shipping_notice": "Free shipping in Balkans & Albania on all orders",

    // Checkout
    "checkout.title": "Secure Checkout",
    "checkout.billing_details": "Shipping Details",
    "checkout.email": "Email Address",
    "checkout.first_name": "First Name",
    "checkout.last_name": "Last Name",
    "checkout.address": "Street Address",
    "checkout.city": "City / Town",
    "checkout.postal_code": "Postal Code",
    "checkout.phone": "Phone Number",
    "checkout.country": "Country",
    "checkout.shipping_method": "Shipping Method",
    "checkout.order_summary": "Order Summary",
    "checkout.place_order": "Place Order (Cash on Delivery)",
    "checkout.processing": "Processing Order...",
    "checkout.shipping_info": "Standard secure courier delivery expected in business days.",

    // Success Page
    "success.title": "Thank you for joining our world.",
    "success.order_confirmed": "Order Confirmed",
    "success.order_prepared": "Your custom order is being meticulously prepared in our Tirana atelier.",
    "success.receipt_summary": "Receipt Summary",
    "success.delivery_proportions": "Delivery Proportions:",
    "success.courier": "Logistical Courier:",
    "success.payment_mode": "Payment Mode: Cash on Delivery",
    "success.total_payable": "Total Payable",
    "success.continue_browsing": "Continue Browsing",
    "success.return_home": "Return to Homepage",

    // Collection Grid
    "collection.show_collection": "Show Collection",
    "collection.view_all": "View All Collections",

    // Shop Page
    "shop.the_studio_store": "The Studio Store",
    "shop.shop_all_pieces": "Shop All Pieces",
    "shop.categories": "Categories",
    "shop.collections": "Collections",
    "shop.all_collections": "All Collections",
    "shop.detailed_view": "Detailed View",
    "shop.prev": "Prev",
    "shop.next": "Next",
    "shop.default_description": "A masterfully crafted piece designed for the modern wardrobe.",

    // Product Detail
    "product.loading": "Loading Piece",
    "product.not_found": "Piece not found.",
    "product.return_to_shop": "Return to Shop",
    "product.back_to_shop": "Back to Shop",
    "product.select_size": "Select Size",
    "product.size_guide": "Size Guide",
    "product.add_to_bag": "Add to Bag",
    "product.shipping": "Shipping",
    "product.shipping_desc": "Complimentary global delivery on orders above $500.",
    "product.returns": "Returns",
    "product.returns_desc": "14-day effortless returns policy.",
    "product.materials_origin": "Materials & Origin",
    "product.materials_desc": "100% fine cotton. Consciously woven in our Italian atelier. Each piece is finished by hand to ensure longevity and unparalleled quality.",
    "product.care_instruction": "Care Instruction",
    "product.care_desc": "Hand wash cold. Dry flat. Iron low heat. Handle with the same care we used in its creation.",
    "product.authentic": "Authentic Vrr Studio Piece",
    "product.select_size_alert": "Please select a size",

    // About Page
    "about.established": "Established 2024",
    "about.title": "Vrr \n Studio.",
    "about.body": "Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism. We craft garments that serve as a quiet backdrop to a life well-lived.",
    "about.origin_label": "Origin",
    "about.origin_title": "Born from a desire to return to the tactile and the meaningful in an increasingly digital world.",
    "about.origin_desc": "Founded by a collective of designers and artists, our studio in the 4th Arrondissement serves as both an atelier and a gallery. We don't just design clothing; we curate environments where creativity can breathe.",
    "about.ethos_label": "Ethos",
    "about.ethos_title": "Sustainability is not a feature; it is the fundamental architecture of our decisions.",
    "about.ethos_desc": "Every thread, button, and package is considered. We work exclusively with small-scale European mills that share our commitment to regenerative practices and fair labor.",

    // Contact Page
    "contact.subtitle": "Connect With the Studio",
    "contact.title": "Ask our \n concierge.",
    "contact.body": "We are always here to listen. Whether you require meticulous sizing consultations, customized fitting edits, or details on imminent seasonal drops, please drop us a message.",
    "contact.spaces_label": "Studio Spaces",
    "contact.hq_title": "Vrr Headquarters",
    "contact.hq_desc": "Located in the historic Le Marais, our flagship atelier houses our collection library and active design tables. We welcome guests by scheduled private appointment only.",
    "contact.flagship_label": "Flagship Location",
    "contact.digital_label": "Digital Inquiries",
    "contact.digital_desc": "Our team replies within 24 operational hours.",
    "contact.hours_label": "Concierge Hours",
    "contact.hours_desc": "Monday — Friday\n09:00 — 18:00 Central European Time",
    "contact.channels_label": "Dedicated Channels",
    "contact.send_message": "Send a Message",
    "contact.thank_you": "Thank You",
    "contact.thank_you_desc": "Your message reaches our creative room securely. We will consult our designers and return with an answer promptly.",
    "contact.send_another": "Send another message",
    "contact.your_name": "Your Name *",
    "contact.your_name_placeholder": "e.g. Valentina V.",
    "contact.your_email": "Your Email *",
    "contact.your_email_placeholder": "e.g. email@address.com",
    "contact.department_label": "Inquiry Department",
    "contact.dept_general": "General Concierge Studio",
    "contact.dept_sizing": "Sizing & Custom Fitting Consultation",
    "contact.dept_press": "Editorial Press & Custom Collaborations",
    "contact.dept_bespoke": "Bespoke Custom Orders",
    "contact.message_label": "Your Message *",
    "contact.message_placeholder": "Write your creative or sizing inquiries here...",
    "contact.submit_message": "Submit Message",

    // Search Overlay
    "search.title": "Search",
    "search.placeholder": "WHAT ARE YOU LOOKING FOR?",
    "search.quick_links": "Quick Links",
    "search.new_arrivals": "New Arrivals",
    "search.essentials": "Essentials",
    "search.archived_pieces": "Archived Pieces",
    "search.studio_journal": "Studio Journal",
    "search.trending": "Trending"
  },
  sq: {
    // Nav & General UI
    "nav.shop": "Dyqani",
    "nav.collections": "Koleksionet",
    "nav.about": "Rreth nesh",
    "nav.admin": "Admin",
    "nav.search": "Kërko",
    "nav.cart": "Shporta",
    "nav.checkout": "Arka",
    "nav.total": "Totali",
    "nav.subtotal": "Nëntotali",

    // Homepage
    "home.philosophy_quote": "Arti është shpirti i studios sonë, moda është gjuha që përdorim për t'i folur botës.",
    "home.philosophy_tag": "Filozofia Jonë",
    "home.marquee": "Vrr — Koleksioni Nr.04 — Së Shpejti",
    "home.hero_sub": "Luks i qëndrueshëm i qepur me përpikëri në atelierin tonë në Tiranë.",
    "home.hero_cta": "Eksploro Koleksionin",
    "home.scroll": "Rrotullo",
    "home.explore_primavera": "Eksploro Primavera",
    "home.shop_look": "Bli Look-un",

    // Footer & Newsletter
    "newsletter.title": "Bashkohu me ne",
    "newsletter.desc": "Regjistrohuni për të marrë përditësime, akses në oferta ekskluzive dhe më shumë.",
    "newsletter.placeholder": "Shkruani email-in tuaj",
    "newsletter.button": "Regjistrohu",
    "newsletter.success": "Faleminderit që u regjistruat!",
    "footer.desc": "Një hapësirë krijuese kushtuar ndërthurjes së artit, modës dhe lidhjes njerëzore. Projektuar në Paris, frymëzuar nga bota.",
    "footer.col_title": "Koleksioni",
    "footer.all_products": "Shiko të Gjitha",
    "footer.contact": "Na Kontaktoni",
    "footer.sustainability": "Qëndrueshmëria",
    "footer.privacy": "Politika e Privatësisë",
    "footer.terms": "Kushtet e Shërbimit",
    "footer.rights": "Të gjitha të drejtat e rezervuara.",
    "newsletter.join_world": "Bashkohu me botën tonë",
    "newsletter.stay_close": "Rri pranë \n studios sonë",
    "newsletter.stay_close_desc": "Ndiqni procesin tonë të dizajnit, përditësimet e studios dhe publikimet ekskluzive në Instagram.",

    // Cart Drawer
    "cart.title": "Çanta e Blerjeve",
    "cart.empty": "Shporta juaj është bosh",
    "cart.start_shopping": "Fillo Blerjet",
    "cart.remove": "Hiqe",
    "cart.checkout": "Vazhdo te Arka",
    "cart.free_shipping_notice": "Transport falas në Ballkan dhe Shqipëri për të gjitha porositë",

    // Checkout
    "checkout.title": "Pagesë e Sigurt",
    "checkout.billing_details": "Detajet e Transportit",
    "checkout.email": "Adresa Email",
    "checkout.first_name": "Emri",
    "checkout.last_name": "Mbiemri",
    "checkout.address": "Adresa e Rrugës",
    "checkout.city": "Qyteti",
    "checkout.postal_code": "Kodi Postar",
    "checkout.phone": "Numri i Telefonit",
    "checkout.country": "Shteti",
    "checkout.shipping_method": "Metoda e Transportit",
    "checkout.order_summary": "Përmbledhja e Porosisë",
    "checkout.place_order": "Dërgo Porosinë (Pagesë në Dorëzim)",
    "checkout.processing": "Duke përpunuar porosinë...",
    "checkout.shipping_info": "Dërgimi standard i sigurt me korrier pritet në ditë pune.",

    // Success Page
    "success.title": "Faleminderit që u bëtë pjesë e botës sonë.",
    "success.order_confirmed": "Porosia u Konfirmua",
    "success.order_prepared": "Porosia juaj e personalizuar po përgatitet me përpikëri në atelierin tonë në Tiranë.",
    "success.receipt_summary": "Përmbledhja e Faturës",
    "success.delivery_proportions": "Detajet e Dërgimit:",
    "success.courier": "Korrieri Logjistik:",
    "success.payment_mode": "Mënyra e Pagesës: Pagesë në Dorëzim (Cash)",
    "success.total_payable": "Totali për t'u Paguar",
    "success.continue_browsing": "Vazhdo Shfletimin",
    "success.return_home": "Kthehu në Faqen Kryesore",

    // Collection Grid
    "collection.show_collection": "Shiko Koleksionin",
    "collection.view_all": "Shiko të Gjitha Koleksionet",

    // Shop Page
    "shop.the_studio_store": "Dyqani i Studios",
    "shop.shop_all_pieces": "Shiko të Gjitha Krijimet",
    "shop.categories": "Kategoritë",
    "shop.collections": "Koleksionet",
    "shop.all_collections": "Të gjitha Koleksionet",
    "shop.detailed_view": "Shiko Detajet",
    "shop.prev": "Para",
    "shop.next": "Tjetra",
    "shop.default_description": "Një krijim i realizuar me mjeshtëri, i dizajnuar për gardërobën moderne.",

    // Product Detail
    "product.loading": "Duke Ngarkuar Krijimin",
    "product.not_found": "Krijimi nuk u gjet.",
    "product.return_to_shop": "Kthehu te Dyqani",
    "product.back_to_shop": "Kthehu te Dyqani",
    "product.select_size": "Zgjidhni Madhësinë",
    "product.size_guide": "Udhëzuesi i Madhësive",
    "product.add_to_bag": "Shto në Shportë",
    "product.shipping": "Dërgimi",
    "product.shipping_desc": "Dërgesë ndërkombëtare falas për porositë mbi $500.",
    "product.returns": "Kthimet",
    "product.returns_desc": "Politikë kthimi pa mundim brenda 14 ditëve.",
    "product.materials_origin": "Materialet dhe Origjina",
    "product.materials_desc": "100% pambuk i hënshëm. Thasur me vetëdije në atelierin tonë italian. Çdo pjesë përfundohet me dorë për të siguruar jetëgjatësi dhe cilësi të pakrahasueshme.",
    "product.care_instruction": "Udhëzimet e Kujdesit",
    "product.care_desc": "Lajeni me dorë me ujë të ftohtë. Thajeni shtrirë. Hekuroseni në temperaturë të ulët. Trajtojeni me të njëjtin kujdes që kemi përdorur ne gjatë krijimit të tij.",
    "product.authentic": "Krijim Origjinal i Vrr Studio",
    "product.select_size_alert": "Ju lutem zgjidhni një madhësi",

    // About Page
    "about.established": "Themeluar në vitin 2024",
    "about.title": "Vrr \n Studio.",
    "about.body": "Vrr është një shtëpi krijuese pariziane e rrënjosur në filozofinë e esencializmit të thjeshtë. Ne krijojmë veshje që shërbejnë si një sfond i qetë për një jetë të jetuar mirë.",
    "about.origin_label": "Origjina",
    "about.origin_title": "Lindur nga dëshira për t'u rikthyer te e prekshmja dhe e rëndësishmja në një bota gjithnjë e më digjitale.",
    "about.origin_desc": "Themeluar nga një kolektiv dizajnerësh dhe artistësh, studioja jonë në rrethin e 4-të (4th Arrondissement) shërben si një atelier dhe një galeri. Ne nuk dizajnojmë thjesht rroba; ne kurojmë mjedise ku kreativiteti mund të marrë frymë.",
    "about.ethos_label": "Etoja",
    "about.ethos_title": "Qëndrueshmëria nuk është thjesht një tipar; ajo është arkitektura themelore e vendimeve tona.",
    "about.ethos_desc": "Çdo fije, kopsë dhe paketim merret parasysh. Ne punojmë ekskluzivisht me fabrika të vogla evropiane që ndajnë përkushtimin tonë ndaj praktikave rigjeneruese dhe punës së ndershme.",

    // Contact Page
    "contact.subtitle": "Lidhu me Studion",
    "contact.title": "Pyetni \n shërbimin tonë.",
    "contact.body": "Ne jemi gjithmonë këtu për t'ju dëgjuar. Nëse keni nevojë për konsulta të hollësishme mbi madhësitë, rregullime të personalizuara të përshtatjes, ose detaje mbi koleksionet e ardhshme sezonale, ju lutemi na dërgoni një mesazh.",
    "contact.spaces_label": "Hapësirat e Studios",
    "contact.hq_title": "Selia e Vrr",
    "contact.hq_desc": "I vendosur në Le Marais historik, atelier ynë kryesor strehon bibliotekën tonë të koleksionit dhe tavolinat aktive të dizajnit. Ne mirëpresim mysafirët vetëm me takim privat të planifikuar paraprakisht.",
    "contact.flagship_label": "Atelieri Kryesor",
    "contact.digital_label": "Kërkesat Digjitale",
    "contact.digital_desc": "Ekipi ynë përgjigjet brenda 24 orëve të punës.",
    "contact.hours_label": "Orari i Shërbimit",
    "contact.hours_desc": "E Hënë — E Premte\n09:00 — 18:00 Koha e Evropës Qendrore",
    "contact.channels_label": "Kanale të Dedikuara",
    "contact.send_message": "Dërgo një Mesazh",
    "contact.thank_you": "Faleminderit",
    "contact.thank_you_desc": "Mesazhi juaj ka mbërritur i sigurt në dhomën tonë krijuese. Ne do të konsultohemi me dizajnerët tanë dhe do t'ju kthejmë një përgjigje së shpejti.",
    "contact.send_another": "Dërgo një mesazh tjetër",
    "contact.your_name": "Emri Juaj *",
    "contact.your_name_placeholder": "p.sh. Valentina V.",
    "contact.your_email": "Email-i Juaj *",
    "contact.your_email_placeholder": "p.sh. email@adresa.com",
    "contact.department_label": "Departamenti i Kërkesave",
    "contact.dept_general": "Studio e Shërbimit të Përgjithshëm",
    "contact.dept_sizing": "Konsultim për Madhësitë & Përshtatjen",
    "contact.dept_press": "Shtypi Editorial & Bashkëpunime",
    "contact.dept_bespoke": "Porosi të Personalizuara Bespoke",
    "contact.message_label": "Mesazhi Juaj *",
    "contact.message_placeholder": "Shkruani pyetjet tuaja krijuese ose të madhësive këtu...",
    "contact.submit_message": "Dërgo Mesazhin",

    // Search Overlay
    "search.title": "Kërko",
    "search.placeholder": "ÇFARË PO KËRKONI?",
    "search.quick_links": "Lidhje të Shpejta",
    "search.new_arrivals": "Prurjet e Reja",
    "search.essentials": "Thelbësoret",
    "search.archived_pieces": "Krijimet e Arkivuara",
    "search.studio_journal": "Ditari i Studios",
    "search.trending": "Në Trend"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("vrr_language");
    return (saved === "sq" || saved === "en") ? saved : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("vrr_language", lang);
  };

  const t = (key: string, fallback?: string): string => {
    const translation = dictionary[language]?.[key];
    if (translation) return translation;
    
    // Fallback logic
    if (fallback) return fallback;
    
    // If not found, return the last part of key or key itself
    return dictionary["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
