/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CollectionGrid from "./components/CollectionGrid";
import ShopTheLook from "./components/ShopTheLook";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import Shop from "./pages/Shop";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import CartDrawer from "./components/CartDrawer";
import AdminDashboard from "./pages/AdminDashboard";
import Sustainability from "./pages/Sustainability";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import SizeGuide from "./pages/SizeGuide";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import { useState } from "react";
import { flexibleDb } from "./lib/flexibleDatabase";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  const [settings, setSettings] = useState({
    philosophyQuote: "Art is the soul of our studio, fashion is the language we use to speak to the world.",
    philosophyTag: "Our Philosophy",
    marqueeText: "Vrr — Collection No.04 — Dropping Soon",
    collection1Image: "",
    collection2Image: "",
    collection3Image: "",
    collection4Image: ""
  });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });
    return unsub;
  }, []);

  return (
    <>
      <Hero />
      <div className="relative z-10 bg-studio-bg">
        <CollectionGrid />
        <section className="py-40 px-6 text-center max-w-4xl mx-auto">
          <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-studio-black/80 leading-tight">
            "{settings.philosophyQuote}"
          </h2>
          <p className="mt-12 uppercase tracking-[0.4em] text-[10px] text-studio-accent font-semibold">{settings.philosophyTag}</p>
        </section>
        <ShopTheLook />
        <div className="py-12 border-y border-studio-black/5 overflow-hidden bg-white">
          <div className="whitespace-nowrap flex animate-marquee">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="font-serif text-2xl uppercase tracking-tighter mx-12 text-studio-black/20">
                {settings.marqueeText}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/admin") || pathname === "/login";

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        if (data.siteTitle) {
          document.title = data.siteTitle;
        }
        if (data.siteFavicon) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.siteFavicon;
        }
      }
    });
    return unsub;
  }, []);

  return (
    <main className="min-h-screen selection:bg-studio-accent selection:text-white relative">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] contrast-150 mix-blend-multiply">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {!isDashboard && <Navbar />}
      {!isDashboard && <CartDrawer />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<div className="pt-32"><CollectionGrid /></div>} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/about" element={<About />} />
        <Route path="/story" element={<About />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {!isDashboard && <Newsletter />}
      {!isDashboard && <Footer />}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
      `}} />
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

