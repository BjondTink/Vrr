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

export default function DashboardSiteInfo() {
  const [serverSettings, setServerSettings] = useState<any>(null);
  const [localSettings, setLocalSettings] = useState<any>({
    siteName: "Vrr",
    siteTitle: "My Google AI Studio App",
    siteFavicon: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=64&auto=format&fit=crop",
    siteMetaDescription: "Discover high-end seasonal collection pieces. Timeless silhouettes met with modern craftsmanship."
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
      alert("Site Info settings updated successfully");
    } catch (err: any) {
      console.error("Save failed:", err);
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
            {isDirty ? "Changes Unsaved" : "Live Info Synced"}
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
        {/* Core Site Information */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">1</span>
            Core Identity
          </h3>
          <p className="text-xs text-black/40 leading-relaxed">
            Customize the fundamental naming attributes of your website. These override the hardcoded layouts across navigation, browser tabs, and headers.
          </p>
          <div className="space-y-4 font-sans pt-2">
            <SettingInput 
              label="Website Brand Name (e.g. Vrr)" 
              value={localSettings.siteName} 
              onChange={(v) => updateSetting("siteName", v)} 
            />
            <SettingInput 
              label="Browser Tab Title (e.g. Vrr Studio | Fine Collection Pieces)" 
              value={localSettings.siteTitle} 
              onChange={(v) => updateSetting("siteTitle", v)} 
            />
          </div>
        </div>

        {/* Branding & Assets */}
        <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">2</span>
            Favicon & Metadata
          </h3>
          <p className="text-xs text-black/40 leading-relaxed">
            Configure the icon shown in the browser address bar and input custom metadata describing your platform.
          </p>
          <div className="space-y-4 font-sans pt-2">
            <SettingInput 
              label="Website Favicon URL" 
              value={localSettings.siteFavicon} 
              onChange={(v) => updateSetting("siteFavicon", v)} 
            />
            {localSettings.siteFavicon && (
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-black/5">
                <img 
                  src={localSettings.siteFavicon} 
                  alt="Favicon Preview" 
                  className="w-10 h-10 object-contain rounded border border-black/10 shadow-sm"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=64&auto=format&fit=crop";
                  }}
                />
                <div>
                  <div className="text-[10px] uppercase font-bold text-black/40">Favicon Preview</div>
                  <div className="text-xs text-black/60 truncate max-w-[200px] font-mono">{localSettings.siteFavicon}</div>
                </div>
              </div>
            )}
            <SettingInput 
              label="Meta / Search Description" 
              textarea 
              value={localSettings.siteMetaDescription} 
              onChange={(v) => updateSetting("siteMetaDescription", v)} 
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white p-6 border-t border-black/5 flex justify-end z-10 shadow-2xl">
        <button 
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 px-8 py-3 bg-studio-black text-white rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-studio-accent transition-all disabled:bg-black/10 disabled:text-black/40 cursor-pointer"
        >
          {saving ? "Saving Changes..." : "Publish Site Info"}
        </button>
      </div>
    </div>
  );
}
