import React, { useState, useEffect } from "react";
import { flexibleDb } from "../lib/flexibleDatabase";

interface SettingInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}

function SettingInput({ label, value, onChange, textarea }: SettingInputProps) {
  const safeValue = value || "";
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">{label}</label>
      {textarea ? (
        <textarea 
          value={safeValue} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-black/5 p-4 text-sm rounded-lg focus:outline-studio-accent font-sans"
          rows={3}
        />
      ) : (
        <input 
          type="text" 
          value={safeValue} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-black/5 p-4 text-sm rounded-lg focus:outline-studio-accent font-sans"
        />
      )}
    </div>
  );
}

export default function DashboardFooter() {
  const [serverSettings, setServerSettings] = useState<any>(null);
  const [localSettings, setLocalSettings] = useState<any>({
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
    footerStudioLink1Text: "Our Story",
    footerStudioLink1Url: "/story",
    footerStudioLink2Text: "Sustainability",
    footerStudioLink2Url: "/sustainability",
    footerStudioLink3Text: "Journal",
    footerStudioLink3Url: "/journal",
    footerStudioLink4Text: "Contact",
    footerStudioLink4Url: "/contact",
    footerAssistTitle: "Assist",
    footerAssistLink1Text: "Shipping & Returns",
    footerAssistLink1Url: "/shipping",
    footerAssistLink2Text: "Size Guide",
    footerAssistLink2Url: "/size-guide",
    footerAssistLink3Text: "Privacy Policy",
    footerAssistLink3Url: "/privacy",
    footerAssistLink4Text: "Terms of Service",
    footerAssistLink4Url: "/terms",
    footerCopyright: "Vrr. All Rights Reserved.",
    footerLocation: "Paris / London / NYC"
  });
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = flexibleDb.subscribeToDoc("settings", "global", (data) => {
      if (data) {
        setServerSettings(data);
        if (!isDirty) {
          setLocalSettings((prev: any) => ({ ...prev, ...data }));
        }
      }
    });
    return unsub;
  }, [isDirty]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await flexibleDb.saveDoc("settings", "global", {
        ...localSettings,
        updatedAt: new Date().toISOString()
      });
      setIsDirty(false);
      alert("Footer settings updated successfully");
    } catch (err: any) {
      console.error("Save failed Error:", err);
      alert("Save failed: " + (err.message || "Failure to update database. Verify your account has Admin permissions."));
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setLocalSettings((prev: any) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const discardChanges = () => {
    if (serverSettings) {
      setLocalSettings(serverSettings);
      setIsDirty(false);
    }
  };

  return (
    <div className="p-4 lg:p-12 space-y-8 lg:space-y-12 h-screen overflow-y-auto pb-40">
      <div className="flex justify-between items-center bg-white p-4 sticky top-0 z-20 border-b border-black/5 -mx-4 lg:-mx-12 lg:px-12">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isDirty ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
          <span className="text-[10px] uppercase tracking-widest font-bold text-black/60">
            {isDirty ? "Changes Unsaved" : "Live Content Synced"}
          </span>
        </div>
        {isDirty && (
          <button 
            onClick={discardChanges}
            className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
          >
            Discard Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        {/* Brand Details Block */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">1</span>
            Brand Information
          </h3>
          <div className="space-y-4 font-sans">
            <SettingInput label="Brand / Logo Name" value={localSettings.footerLogo} onChange={(v) => updateSetting("footerLogo", v)} />
            <SettingInput label="Footer Pitch / Description" textarea value={localSettings.footerDescription} onChange={(v) => updateSetting("footerDescription", v)} />
          </div>
        </div>

        {/* Social Media Block */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">2</span>
            Social Profiles Links
          </h3>
          <div className="space-y-4 font-sans">
            <SettingInput label="Instagram Profile Link" value={localSettings.footerInstagram} onChange={(v) => updateSetting("footerInstagram", v)} />
            <SettingInput label="Facebook Page Link" value={localSettings.footerFacebook} onChange={(v) => updateSetting("footerFacebook", v)} />
            <SettingInput label="Twitter / X Link" value={localSettings.footerTwitter} onChange={(v) => updateSetting("footerTwitter", v)} />
          </div>
        </div>

        {/* Links Column 1 Block */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">3</span>
            Navigation Column 1
          </h3>
          <div className="space-y-4 font-sans">
            <SettingInput label="Section Title" value={localSettings.footerColTitle} onChange={(v) => updateSetting("footerColTitle", v)} />
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
              <SettingInput label="Link 1 Label" value={localSettings.footerColLink1Text} onChange={(v) => updateSetting("footerColLink1Text", v)} />
              <SettingInput label="Link 1 Destination" value={localSettings.footerColLink1Url} onChange={(v) => updateSetting("footerColLink1Url", v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 2 Label" value={localSettings.footerColLink2Text} onChange={(v) => updateSetting("footerColLink2Text", v)} />
              <SettingInput label="Link 2 Destination" value={localSettings.footerColLink2Url} onChange={(v) => updateSetting("footerColLink2Url", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 3 Label" value={localSettings.footerColLink3Text} onChange={(v) => updateSetting("footerColLink3Text", v)} />
              <SettingInput label="Link 3 Destination" value={localSettings.footerColLink3Url} onChange={(v) => updateSetting("footerColLink3Url", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 4 Label" value={localSettings.footerColLink4Text} onChange={(v) => updateSetting("footerColLink4Text", v)} />
              <SettingInput label="Link 4 Destination" value={localSettings.footerColLink4Url} onChange={(v) => updateSetting("footerColLink4Url", v)} />
            </div>
          </div>
        </div>

        {/* Links Column 2 Block */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">4</span>
            Navigation Column 2
          </h3>
          <div className="space-y-4 font-sans">
            <SettingInput label="Section Title" value={localSettings.footerStudioTitle} onChange={(v) => updateSetting("footerStudioTitle", v)} />
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
              <SettingInput label="Link 1 Label" value={localSettings.footerStudioLink1Text} onChange={(v) => updateSetting("footerStudioLink1Text", v)} />
              <SettingInput label="Link 1 Destination" value={localSettings.footerStudioLink1Url} onChange={(v) => updateSetting("footerStudioLink1Url", v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 2 Label" value={localSettings.footerStudioLink2Text} onChange={(v) => updateSetting("footerStudioLink2Text", v)} />
              <SettingInput label="Link 2 Destination" value={localSettings.footerStudioLink2Url} onChange={(v) => updateSetting("footerStudioLink2Url", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 3 Label" value={localSettings.footerStudioLink3Text} onChange={(v) => updateSetting("footerStudioLink3Text", v)} />
              <SettingInput label="Link 3 Destination" value={localSettings.footerStudioLink3Url} onChange={(v) => updateSetting("footerStudioLink3Url", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 4 Label" value={localSettings.footerStudioLink4Text} onChange={(v) => updateSetting("footerStudioLink4Text", v)} />
              <SettingInput label="Link 4 Destination" value={localSettings.footerStudioLink4Url} onChange={(v) => updateSetting("footerStudioLink4Url", v)} />
            </div>
          </div>
        </div>

        {/* Links Column 3 Block */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">5</span>
            Navigation Column 3
          </h3>
          <div className="space-y-4 font-sans">
            <SettingInput label="Section Title" value={localSettings.footerAssistTitle} onChange={(v) => updateSetting("footerAssistTitle", v)} />
            
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-black/5">
              <SettingInput label="Link 1 Label" value={localSettings.footerAssistLink1Text} onChange={(v) => updateSetting("footerAssistLink1Text", v)} />
              <SettingInput label="Link 1 Destination" value={localSettings.footerAssistLink1Url} onChange={(v) => updateSetting("footerAssistLink1Url", v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 2 Label" value={localSettings.footerAssistLink2Text} onChange={(v) => updateSetting("footerAssistLink2Text", v)} />
              <SettingInput label="Link 2 Destination" value={localSettings.footerAssistLink2Url} onChange={(v) => updateSetting("footerAssistLink2Url", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 3 Label" value={localSettings.footerAssistLink3Text} onChange={(v) => updateSetting("footerAssistLink3Text", v)} />
              <SettingInput label="Link 3 Destination" value={localSettings.footerAssistLink3Url} onChange={(v) => updateSetting("footerAssistLink3Url", v)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="Link 4 Label" value={localSettings.footerAssistLink4Text} onChange={(v) => updateSetting("footerAssistLink4Text", v)} />
              <SettingInput label="Link 4 Destination" value={localSettings.footerAssistLink4Url} onChange={(v) => updateSetting("footerAssistLink4Url", v)} />
            </div>
          </div>
        </div>

        {/* Footer Base Block */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">6</span>
            Rights & Location
          </h3>
          <div className="space-y-4 font-sans">
            <SettingInput label="Copyright text (e.g., Vrr. All Rights Reserved.)" value={localSettings.footerCopyright} onChange={(v) => updateSetting("footerCopyright", v)} />
            <SettingInput label="Location labels (e.g., Paris / London / NYC)" value={localSettings.footerLocation} onChange={(v) => updateSetting("footerLocation", v)} />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white p-6 border-t border-black/5 flex justify-end z-10 shadow-2xl">
        <button 
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 px-8 py-3 bg-studio-black text-white rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-studio-accent transition-all disabled:bg-black/10 disabled:text-black/40 cursor-pointer"
        >
          {saving ? "Saving Changes..." : "Publish Footer content"}
        </button>
      </div>
    </div>
  );
}
