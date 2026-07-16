import React, { useState, useEffect } from "react";
import { Instagram, Lock, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const { user, logout } = useAuth();
  const [footerPages, setFooterPages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    footerLogo: "Vrr",
    footerDescription: "A creative space dedicated to the intersection of art, fashion, and human connection. Designed in Paris, inspired by the world.",
    footerInstagram: "https://www.instagram.com/v_dessign/",
    footerTiktok: "https://tiktok.com",
    footerWhatsapp: "https://wa.me/355688859965",
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
              {settings.footerDescription === "A creative space dedicated to the intersection of art, fashion, and human connection. Designed in Paris, inspired by the world." ? t("footer.desc") : settings.footerDescription}
            </p>
            <div className="flex space-x-6 text-studio-black/40 items-center">
              {settings.footerInstagram && (
                <a href={settings.footerInstagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-studio-black transition-colors cursor-pointer flex items-center">
                  <Instagram size={18} />
                </a>
              )}
              {settings.footerTiktok && (
                <a href={settings.footerTiktok} target="_blank" rel="noopener noreferrer" title="TikTok" className="hover:text-studio-black transition-colors cursor-pointer flex items-center">
                  <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.77-.56-1.39-1.32-1.84-2.18v8.66c0 1.61-.31 3.26-1.12 4.63-1.01 1.79-2.88 3.14-4.96 3.37-2.28.25-4.75-.41-6.38-2.09C2.45 19.34 1.5 16.7 1.83 14.2c.31-2.27 1.85-4.37 4.02-5.13 1.42-.51 3-.52 4.46-.14v4.03c-1.16-.36-2.48-.19-3.48.53-.94.69-1.4 1.9-1.28 3.07.12 1.18.9 2.27 1.97 2.75.98.44 2.14.36 3.03-.21.72-.47 1.14-1.25 1.15-2.09l.01-17.13z"/>
                  </svg>
                </a>
              )}
              {settings.footerWhatsapp && (
                <a href={settings.footerWhatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="hover:text-studio-black transition-colors cursor-pointer flex items-center">
                  <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.63-1.023-5.102-2.884-6.964-1.859-1.859-4.329-2.883-6.961-2.883-5.438 0-9.863 4.42-9.866 9.864-.001 2.028.52 4.021 1.512 5.763l-.991 3.616 3.702-.971zm10.108-6.932c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.669.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.568-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-studio-accent">
              {settings.footerColTitle === "Collection" ? t("footer.col_title") : settings.footerColTitle}
            </h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-studio-black/70">
              {renderLink(settings.footerColLink1Text === "Shop All" ? t("footer.all_products") : settings.footerColLink1Text, settings.footerColLink1Url)}
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
                title={t("nav.logout", "Logout")}
              >
                <LogOut size={12} />
                <span>{t("nav.logout", "Sign Out")}</span>
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 hover:text-studio-black transition-colors"
                title={t("nav.login", "Studio Login")}
              >
                <Lock size={12} />
                <span>{t("nav.login", "Studio Login")}</span>
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
