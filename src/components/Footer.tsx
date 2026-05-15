import { Instagram, Facebook, Twitter, Github, Lock, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, login, logout } = useAuth();

  return (
    <footer className="bg-studio-bg py-24 px-6 md:px-12 border-t border-studio-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          <div className="space-y-8">
            <a href="/" className="font-serif text-2xl uppercase tracking-tighter inline-block">
              Vrr
            </a>
            <p className="text-xs leading-relaxed text-studio-black/60 max-w-xs">
              A creative space dedicated to the intersection of art, fashion, and human connection. Designed in Paris, inspired by the world.
            </p>
            <div className="flex space-x-6 text-studio-black/40">
              <Instagram size={18} className="hover:text-studio-black transition-colors cursor-pointer" />
              <Facebook size={18} className="hover:text-studio-black transition-colors cursor-pointer" />
              <Twitter size={18} className="hover:text-studio-black transition-colors cursor-pointer" />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">Collection</h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              <li className="hover:text-studio-black transition-colors cursor-pointer">Shop All</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">New Arrivals</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Best Sellers</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Archive</li>
            </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">Studio</h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              <li className="hover:text-studio-black transition-colors cursor-pointer">Our Story</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Sustainability</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Journal</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Contact</li>
            </ul>
          </div>

          <div className="space-y-6">
             <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">Assist</h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              <li className="hover:text-studio-black transition-colors cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Size Guide</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-studio-black transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-studio-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-studio-black/40">
          <p>© {currentYear} Vrr. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <span>Paris / London / NYC</span>
            <span className="text-studio-black/20">|</span>
            {user ? (
              <button 
                onClick={() => logout()}
                className="flex items-center gap-2 hover:text-studio-black transition-colors"
                title="Logout"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 hover:text-studio-black transition-colors"
                title="Admin Login"
              >
                <Lock size={12} />
                <span>Studio Login</span>
              </Link>
            )}
            <span className="text-studio-black/20">|</span>
            <span className="hover:text-studio-black transition-colors cursor-pointer">Designed with Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
