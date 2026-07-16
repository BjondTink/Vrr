import { motion } from "motion/react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import SearchOverlay from "./SearchOverlay";
import { Link } from "react-router-dom";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState<any>({ siteName: "Vrr" });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.shop", "Shop"), href: "/shop" },
    { name: t("nav.collections", "Collections"), href: "/collections" },
    { name: t("nav.about", "About"), href: "/about" },
    ...(isAdmin ? [{ name: t("nav.admin", "Admin"), href: "/admin" }] : []),
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-studio-bg py-4 border-b border-studio-black/5" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-studio-black"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Desktop Links - Left */}
          <div className="hidden md:flex space-x-8">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs uppercase tracking-widest hover:opacity-50 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="font-serif text-2xl md:text-3xl tracking-tighter uppercase font-medium">
              {settings.siteName || "Vrr"}
            </span>
          </Link>

          {/* Desktop Links - Right */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs uppercase tracking-widest hover:opacity-50 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:opacity-50 transition-opacity"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:opacity-50 transition-opacity relative"
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 text-[8px] bg-studio-black text-white w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Icons - Mobile Only */}
          <div className="flex md:hidden items-center space-x-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:opacity-50 transition-opacity relative"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 text-[8px] bg-studio-black text-white w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-studio-bg z-[60] flex flex-col items-center justify-center space-y-8"
          >
            <button 
              className="absolute top-8 right-8"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center space-y-6">
              {navLinks.map((link) => (
                <Link
                   key={link.href}
                  to={link.href}
                  className="font-serif text-3xl uppercase tracking-tighter hover:italic transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Language Toggle in Mobile Menu */}
            <div className="mt-8 pt-8 border-t border-studio-black/10 flex flex-col items-center gap-3 w-40">
              <span className="text-[9px] uppercase tracking-[0.2em] text-studio-black/40">Gjuha / Language</span>
              <div className="relative w-full h-8 bg-studio-black/5 rounded-full p-0.5 flex items-center cursor-pointer select-none">
                <motion.div 
                  className="absolute top-0.5 bottom-0.5 bg-white rounded-full shadow-sm"
                  initial={false}
                  animate={{
                    left: language === "en" ? "2px" : "80px",
                    right: language === "en" ? "80px" : "2px"
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
                <button 
                  onClick={() => setLanguage("en")}
                  className={`z-10 w-1/2 text-center text-[9px] uppercase tracking-widest font-bold transition-colors ${
                    language === "en" ? "text-studio-black" : "text-studio-black/40"
                  }`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage("sq")}
                  className={`z-10 w-1/2 text-center text-[9px] uppercase tracking-widest font-bold transition-colors ${
                    language === "sq" ? "text-studio-black" : "text-studio-black/40"
                  }`}
                >
                  ALB
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
