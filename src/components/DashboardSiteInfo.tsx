import React, { useState, useEffect } from "react";
import { flexibleDb } from "../lib/flexibleDatabase";
import ImageUpload from "./ImageUpload";

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
    siteMetaDescription: "Discover high-end seasonal collection pieces. Timeless silhouettes met with modern craftsmanship.",
    newsletterInstagram: "https://www.instagram.com/v_dessign/",
    lookbookMainImage: "https://images.unsplash.com/photo-1509631179647-017733150396?auto=format&fit=crop&q=80&w=2576",
    lookbookTitle: "Every Look Tells a Story",
    lookbookSubtitle: "Inside the Studio",
    lookbookDescription: 'We believe in pieces that live beyond the trends. Our "Shop the Look" curators bring together textures and tones that harmonize effortlessly.',
    lookbookProd1Name: "Linen Trench Coat",
    lookbookProd1Price: "$340",
    lookbookProd1Image: "https://images.unsplash.com/photo-1544022613-e87ca7fdad78?auto=format&fit=crop&q=80&w=2574",
    lookbookProd1Top: "30%",
    lookbookProd1Left: "45%",
    lookbookProd2Name: "Silk Slip Dress",
    lookbookProd2Price: "$210",
    lookbookProd2Image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=2574",
    lookbookProd2Top: "60%",
    lookbookProd2Left: "55%",
    cloudinaryCloudName: "",
    cloudinaryUploadPreset: ""
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
            <SettingInput 
              label="Newsletter Banner Instagram Link" 
              value={localSettings.newsletterInstagram} 
              onChange={(v) => updateSetting("newsletterInstagram", v)} 
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
            <ImageUpload 
              label="Website Favicon" 
              currentImage={localSettings.siteFavicon} 
              onUpload={(v) => updateSetting("siteFavicon", v)} 
            />
            <SettingInput 
              label="Meta / Search Description" 
              textarea 
              value={localSettings.siteMetaDescription} 
              onChange={(v) => updateSetting("siteMetaDescription", v)} 
            />
          </div>
        </div>
      </div>

      {/* Lookbook Builder Section */}
      <div className="bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5 space-y-8 font-sans">
        <div>
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">3</span>
            Shop The Look ("Lookbook") Builder
          </h3>
          <p className="text-xs text-black/40 leading-relaxed mt-2">
            Configure the prominent split Lookbook section with a central featured image, custom coordinates for hotspot tooltips, and corresponding product names.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
          
          {/* Main Look & Copy */}
          <div className="space-y-4 bg-white p-5 rounded-xl border border-black/5">
            <h4 className="font-serif text-md font-semibold text-studio-black border-b border-black/5 pb-2">1. Layout & Cover</h4>
            <ImageUpload 
              label="Lookbook Cover Image" 
              currentImage={localSettings.lookbookMainImage} 
              onUpload={(v) => updateSetting("lookbookMainImage", v)} 
            />
            <SettingInput 
              label="Inside Studio Subtitle (e.g. Inside the Studio)" 
              value={localSettings.lookbookSubtitle} 
              onChange={(v) => updateSetting("lookbookSubtitle", v)} 
            />
            <SettingInput 
              label="Lookbook Title (e.g. Every Look Tells a Story)" 
              value={localSettings.lookbookTitle} 
              onChange={(v) => updateSetting("lookbookTitle", v)} 
            />
            <SettingInput 
              label="Lookbook Story Description text" 
              textarea
              value={localSettings.lookbookDescription} 
              onChange={(v) => updateSetting("lookbookDescription", v)} 
            />
          </div>

          {/* Product Hotspot 1 */}
          <div className="space-y-4 bg-white p-5 rounded-xl border border-black/5">
            <h4 className="font-serif text-md font-semibold text-studio-black border-b border-black/5 pb-2">2. Product 1 Details</h4>
            <SettingInput 
              label="Product 1 Name" 
              value={localSettings.lookbookProd1Name} 
              onChange={(v) => updateSetting("lookbookProd1Name", v)} 
            />
            <SettingInput 
              label="Product 1 Price Tag" 
              value={localSettings.lookbookProd1Price} 
              onChange={(v) => updateSetting("lookbookProd1Price", v)} 
            />
            <ImageUpload 
              label="Product 1 Image" 
              currentImage={localSettings.lookbookProd1Image} 
              onUpload={(v) => updateSetting("lookbookProd1Image", v)} 
            />
          </div>

          {/* Product Hotspot 2 */}
          <div className="space-y-4 bg-white p-5 rounded-xl border border-black/5">
            <h4 className="font-serif text-md font-semibold text-studio-black border-b border-black/5 pb-2">3. Product 2 Details</h4>
            <SettingInput 
              label="Product 2 Name" 
              value={localSettings.lookbookProd2Name} 
              onChange={(v) => updateSetting("lookbookProd2Name", v)} 
            />
            <SettingInput 
              label="Product 2 Price Tag" 
              value={localSettings.lookbookProd2Price} 
              onChange={(v) => updateSetting("lookbookProd2Price", v)} 
            />
            <ImageUpload 
              label="Product 2 Image" 
              currentImage={localSettings.lookbookProd2Image} 
              onUpload={(v) => updateSetting("lookbookProd2Image", v)} 
            />
          </div>

        </div>
      </div>

      {/* Cloudinary Integration Section */}
      <div className="bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5 space-y-6 font-sans mt-8">
        <div>
          <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3 text-studio-black">
            <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">4</span>
            Cloudinary CDN Media Integration
          </h3>
          <p className="text-xs text-black/40 leading-relaxed mt-2">
            Use Cloudinary.com as your primary media server for direct, fast image uploads instead of default local / Firestore storage. You can create a free account at Cloudinary and copy your credentials below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-black/5">
          <SettingInput 
            label="Cloudinary Cloud Name" 
            value={localSettings.cloudinaryCloudName} 
            onChange={(v) => updateSetting("cloudinaryCloudName", v)} 
          />
          <SettingInput 
            label="Cloudinary Unsigned Upload Preset" 
            value={localSettings.cloudinaryUploadPreset} 
            onChange={(v) => updateSetting("cloudinaryUploadPreset", v)} 
          />
        </div>
        <div className="p-4 bg-[#B39B84]/10 rounded-xl space-y-2">
          <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#B39B84]">How to configure Unsigned Uploads in Cloudinary:</h4>
          <ol className="list-decimal list-inside text-xs text-black/60 space-y-1.5 leading-relaxed">
            <li>Log into your <strong>Cloudinary Dashboard</strong> and copy your <strong>Cloud Name</strong>.</li>
            <li>Navigate to <strong>Settings (Gear Icon) &gt; Console &gt; Upload</strong>.</li>
            <li>Scroll down to <strong>Upload presets</strong> and click <strong>Add upload preset</strong>.</li>
            <li>Set the <strong>Signing Mode</strong> to <span className="font-bold border px-1 bg-white rounded">Unsigned</span> (very important!).</li>
            <li>Keep folder location as is, name the preset (or copy the generated random name), click <strong>Save</strong>, and paste the preset name above.</li>
          </ol>
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
