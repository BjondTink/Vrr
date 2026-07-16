import React, { useState, useEffect } from "react";
import { Save, RefreshCw, BookOpen, Loader2 } from "lucide-react";
import { flexibleDb } from "../lib/flexibleDatabase";
import ImageUpload from "./ImageUpload";

interface SettingInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}

function SettingInput({ label, value, onChange, textarea, rows = 3 }: SettingInputProps) {
  const safeValue = value || "";
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">{label}</label>
      {textarea ? (
        <textarea 
          value={safeValue} 
          onChange={e => onChange(e.target.value)} 
          className="w-full bg-black/5 p-4 text-sm rounded-lg focus:outline-studio-accent font-sans leading-relaxed"
          rows={rows}
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

export default function DashboardAbout() {
  const [aboutPage, setAboutPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Form Fields
  const [pageTitle, setPageTitle] = useState("Vrr \n Studio.");
  const [pageSubtitle, setPageSubtitle] = useState("Established 2024");
  const [pageBody, setPageBody] = useState("Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism. We craft garments that serve as a quiet backdrop to a life well-lived.");
  const [pageImage, setPageImage] = useState("https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670");

  useEffect(() => {
    setLoading(true);
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const match = items.find((p) => p.id === "story");
      if (match) {
        setAboutPage(match);
        if (!isDirty) {
          setPageTitle(match.pageTitle !== undefined ? match.pageTitle : "Vrr \n Studio.");
          setPageSubtitle(match.pageSubtitle !== undefined ? match.pageSubtitle : "Established 2024");
          setPageBody(match.pageBody !== undefined ? match.pageBody : "Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism. We craft garments that serve as a quiet backdrop to a life well-lived.");
          setPageImage(match.pageImage !== undefined ? match.pageImage : "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670");
        }
      } else {
        setAboutPage(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [isDirty]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const currentPayload = aboutPage || {
        id: "story",
        label: "Our Story",
        url: "/story",
        column: "studio",
        order: 1
      };

      const updatedPayload = {
        ...currentPayload,
        pageTitle: pageTitle.trim(),
        pageSubtitle: pageSubtitle.trim(),
        pageBody: pageBody.trim(),
        pageImage: pageImage.trim(),
        updatedAt: new Date().toISOString()
      };

      await flexibleDb.saveDoc("footerPages", "story", updatedPayload);
      setIsDirty(false);
      alert("About Page updated successfully!");
    } catch (err: any) {
      console.error("Save About Page Err:", err);
      alert("Failed to save About Page: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setIsDirty(true);
  };

  const discardChanges = () => {
    const baseTitle = aboutPage?.pageTitle !== undefined ? aboutPage.pageTitle : "Vrr \n Studio.";
    const baseSubtitle = aboutPage?.pageSubtitle !== undefined ? aboutPage.pageSubtitle : "Established 2024";
    const baseBody = aboutPage?.pageBody !== undefined ? aboutPage.pageBody : "Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism. We craft garments that serve as a quiet backdrop to a life well-lived.";
    const baseImage = aboutPage?.pageImage !== undefined ? aboutPage.pageImage : "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2670";
    
    setPageTitle(baseTitle);
    setPageSubtitle(baseSubtitle);
    setPageBody(baseBody);
    setPageImage(baseImage);
    setIsDirty(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3 min-h-[400px]">
        <RefreshCw className="animate-spin text-studio-accent" size={24} />
        <p className="font-mono text-xs text-black/40 uppercase tracking-widest">Loading Page Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-12 space-y-8 lg:space-y-12 h-screen overflow-y-auto pb-40">
      
      {/* Header section with status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white pb-6 border-b border-black/5 -mx-4 lg:-mx-12 lg:px-12 sticky top-0 z-20 p-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#B39B84] font-bold">Storefront Pages</p>
          <h2 className="font-serif text-2xl tracking-tighter text-studio-black mt-1">Edit About Page ("Our Story")</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isDirty ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
            <span className="text-[10px] uppercase tracking-widest font-bold text-black/50">
              {isDirty ? "Changes Unsaved" : "Synced"}
            </span>
          </div>
          {isDirty && (
            <button 
              onClick={discardChanges}
              className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
            >
              Discard
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
        {/* Form fields */}
        <form onSubmit={handleSave} className="xl:col-span-7 space-y-8 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5 font-sans">
          <div className="border-b border-black/5 pb-4">
            <h3 className="font-serif text-lg text-studio-black flex items-center gap-2">
              <BookOpen size={18} className="text-studio-accent" />
              Page Content Fields
            </h3>
            <p className="text-[10px] text-black/40 uppercase tracking-widest mt-1">Configure narrative and brand atmosphere copy</p>
          </div>

          <div className="space-y-6">
            <SettingInput 
              label="Page Hero Subtitle / Date (e.g. Established 2024)" 
              value={pageSubtitle} 
              onChange={(v) => updateField(setPageSubtitle, v)} 
            />

            <SettingInput 
              label="Page Large Title (Supports new lines for formatting)" 
              textarea
              rows={2}
              value={pageTitle} 
              onChange={(v) => updateField(setPageTitle, v)} 
            />

            <SettingInput 
              label="Narrative body story (Supports multiple lines)" 
              textarea 
              rows={8}
              value={pageBody} 
              onChange={(v) => updateField(setPageBody, v)} 
            />

            <div className="pt-2">
              <ImageUpload 
                label="Atelier Atmosphere / Story Image" 
                currentImage={pageImage} 
                onUpload={(url) => updateField(setPageImage, url)} 
              />
            </div>
          </div>
        </form>

        {/* Live miniature visual preview */}
        <div className="xl:col-span-5 space-y-4">
          <div className="border border-black/5 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 pb-3 mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-black/40">Visual Live Preview</span>
              <span className="text-[9px] font-mono text-studio-accent font-bold px-2 py-0.5 bg-studio-accent/5 rounded-full">Interactive</span>
            </div>

            {/* Immersive Preview card replicating About.tsx look */}
            <div className="border border-black/5 rounded-xl overflow-hidden bg-white p-6 max-h-[550px] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div>
                  <p className="uppercase tracking-[0.4em] text-[8px] text-studio-accent font-semibold mb-2">
                    {pageSubtitle || "Established 2024"}
                  </p>
                  <h1 className="font-serif text-3xl tracking-tighter leading-none mb-4 whitespace-pre-line text-studio-black">
                    {pageTitle || "Vrr \n Studio."}
                  </h1>
                  <p className="text-xs text-studio-black/70 leading-relaxed font-light whitespace-pre-line">
                    {pageBody || "Vrr is a Parisian creative house rooted in the philosophy of effortless essentialism."}
                  </p>
                </div>
                
                <div className="aspect-[4/5] w-full overflow-hidden rounded-md bg-black/5">
                  {pageImage ? (
                    <img 
                      src={pageImage} 
                      alt="Story atmosphere" 
                      className="w-full h-full object-cover grayscale-[0.2] transition-all"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-black/20 text-[10px] uppercase tracking-widest">
                      No Image Set
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#B39B84]/10 rounded-xl space-y-1.5 border border-[#B39B84]/10">
            <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#B39B84]">Design Best Practice:</h4>
            <p className="text-[10px] text-black/60 leading-relaxed">
              Use standard line-breaks in the Title (e.g. using a line return) to structure how the display typography breaks on desktop screens.
            </p>
          </div>
        </div>
      </div>

      {/* Persistent save footer bar */}
      <div className="sticky bottom-0 bg-white p-6 border-t border-black/5 flex justify-end z-20 shadow-2xl -mx-4 lg:-mx-12">
        <button 
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="flex items-center gap-2 px-8 py-3 bg-studio-black text-white rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-studio-accent transition-all disabled:bg-black/10 disabled:text-black/40 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>Publish About Page</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
