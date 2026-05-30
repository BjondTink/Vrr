import React, { useState, useEffect } from "react";
import { Instagram, Facebook, Twitter, Lock, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, logout } = useAuth();
  const [footerPages, setFooterPages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    footerLogo: "Vrr",
    footerDescription: "A creative space dedicated to the intersection of art, fashion, and human connection. Designed in Paris, inspired by the world.",
    footerInstagram: "https://instagram.com",
    footerFacebook: "https://facebook.com",
    footerTwitter: "https://twitter.com",
    footerColTitle: "Collection",
    footerColLink1Text: "Shop All",
    footerColLink1Url: "/shop",
    footerColLink2Text: "New Arrivals",
    footerColLink2Url: "/shop?filter=new",
    footerColLink3Text: "Best Sellers",
    footerColLink3Url: "/shop?filter=best",
    footerColLink4Text: "Archive",
    footerColLink4Url: "/shop?filter=archive",
    footerStudioTitle: "Studio",
    footerAssistTitle: "Assist",
    footerCopyright: "Vrr. All Rights Reserved.",
    footerLocation: "Paris / London / NYC"
  });

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        setSettings((prev: any) => ({ ...prev, ...data }));
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const sorted = [...items].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setFooterPages(sorted);
    });
    return unsub;
  }, []);

  const renderLink = (text: string, path: string) => {
    if (!text) return null;
    const isExternal = path.startsWith("http://") || path.startsWith("https://") || path.startsWith("mailto:") || path.startsWith("tel:");
    if (isExternal) {
      return (
        <li>
          <a 
            href={path} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-studio-black transition-colors block cursor-pointer"
          >
            {text}
          </a>
        </li>
      );
    }
    return (
      <li>
        <Link 
          to={path} 
          className="hover:text-studio-black transition-colors block cursor-pointer"
        >
          {text}
        </Link>
      </li>
    );
  };

  return (
    <footer className="bg-studio-bg py-24 px-6 md:px-12 border-t border-studio-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          <div className="space-y-8">
            <Link to="/" className="font-serif text-2xl uppercase tracking-tighter inline-block">
              {settings.footerLogo || "Vrr"}
            </Link>
            <p className="text-xs leading-relaxed text-studio-black/60 max-w-xs">
              {settings.footerDescription}
            </p>
            <div className="flex space-x-6 text-studio-black/40">
              {settings.footerInstagram && (
                <a href={settings.footerInstagram} target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} className="hover:text-studio-black transition-colors cursor-pointer" />
                </a>
              )}
              {settings.footerFacebook && (
                <a href={settings.footerFacebook} target="_blank" rel="noopener noreferrer">
                  <Facebook size={18} className="hover:text-studio-black transition-colors cursor-pointer" />
                </a>
              )}
              {settings.footerTwitter && (
                <a href={settings.footerTwitter} target="_blank" rel="noopener noreferrer">
                  <Twitter size={18} className="hover:text-studio-black transition-colors cursor-pointer" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">
              {settings.footerColTitle || "Collection"}
            </h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              {renderLink(settings.footerColLink1Text, settings.footerColLink1Url)}
              {renderLink(settings.footerColLink2Text, settings.footerColLink2Url)}
              {renderLink(settings.footerColLink3Text, settings.footerColLink3Url)}
              {renderLink(settings.footerColLink4Text, settings.footerColLink4Url)}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">
              {settings.footerStudioTitle || "Studio"}
            </h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              {footerPages
                .filter((p) => p.column === "studio")
                .map((p) => (
                  <React.Fragment key={p.id || p.label}>
                    {renderLink(p.label, p.url)}
                  </React.Fragment>
                ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">
              {settings.footerAssistTitle || "Assist"}
            </h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              {footerPages
                .filter((p) => p.column === "assist")
                .map((p) => (
                  <React.Fragment key={p.id || p.label}>
                    {renderLink(p.label, p.url)}
                  </React.Fragment>
                ))}
            </ul>
          </div>

        </div>

        <div className="pt-12 border-t border-studio-black/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-studio-black/40">
          <p>© {currentYear} {settings.footerCopyright}</p>
          <div className="flex space-x-8">
            <span>{settings.footerLocation || "Paris / London / NYC"}</span>
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
