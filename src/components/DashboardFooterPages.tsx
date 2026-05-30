import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Save, X, RefreshCw, Layers } from "lucide-react";
import { flexibleDb } from "../lib/flexibleDatabase";
import ImageUpload from "./ImageUpload";

export default function DashboardFooterPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [id, setId] = useState("");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [column, setColumn] = useState<"studio" | "assist">("studio");
  const [order, setOrder] = useState(1);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [pageBody, setPageBody] = useState("");
  const [pageImage, setPageImage] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsub = flexibleDb.subscribeToCollection("footerPages", (items) => {
      const sorted = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
      setPages(sorted);
      setLoading(false);
    });
    return unsub;
  }, []);

  const resetForm = () => {
    setId("");
    setLabel("");
    setUrl("");
    setColumn("studio");
    setOrder(1);
    setPageTitle("");
    setPageSubtitle("");
    setPageBody("");
    setPageImage("");
    setSelectedPage(null);
    setIsAdding(false);
  };

  const startEdit = (page: any) => {
    setSelectedPage(page);
    setIsAdding(false);
    setId(page.id || "");
    setLabel(page.label || "");
    setUrl(page.url || "");
    setColumn(page.column || "studio");
    setOrder(page.order || 1);
    setPageTitle(page.pageTitle || "");
    setPageSubtitle(page.pageSubtitle || "");
    setPageBody(page.pageBody || "");
    setPageImage(page.pageImage || "");
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
    // Auto calculate next order
    const nextOrder = pages.length > 0 ? Math.max(...pages.map(p => p.order || 0)) + 1 : 1;
    setOrder(nextOrder);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return alert("Label is required");
    if (!url.trim()) return alert("Destination URL is required");

    setSaving(true);
    try {
      const targetId = isAdding ? (id.trim() || label.toLowerCase().replace(/[^a-z0-9]/g, "-")) : id;
      
      const payload = {
        label: label.trim(),
        url: url.trim(),
        column,
        order: Number(order) || 1,
        pageTitle: pageTitle.trim(),
        pageSubtitle: pageSubtitle.trim(),
        pageBody: pageBody.trim(),
        pageImage: pageImage.trim()
      };

      await flexibleDb.saveDoc("footerPages", targetId, payload);
      alert(isAdding ? "Page created successfully!" : "Page updated successfully!");
      resetForm();
    } catch (err: any) {
      console.error("Save Page Err:", err);
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (pageId: string) => {
    if (!confirm("Are you sure you want to delete this footer page/link? This will remove it from the footer instantly.")) return;
    try {
      await flexibleDb.deleteDoc("footerPages", pageId);
      alert("Page removed successfully!");
      if (selectedPage?.id === pageId) resetForm();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  // Reorder links inside their columns
  const moveItem = async (page: any, direction: "up" | "down") => {
    const colItems = pages.filter(p => p.column === page.column).sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = colItems.findIndex(p => p.id === page.id);
    if (currentIndex === -1) return;

    if (direction === "up" && currentIndex > 0) {
      const prevItem = colItems[currentIndex - 1];
      const tempOrder = page.order;
      
      // swap orders
      await flexibleDb.saveDoc("footerPages", page.id, { ...page, order: prevItem.order || 1 });
      await flexibleDb.saveDoc("footerPages", prevItem.id, { ...prevItem, order: tempOrder || 1 });
    } else if (direction === "down" && currentIndex < colItems.length - 1) {
      const nextItem = colItems[currentIndex + 1];
      const tempOrder = page.order;

      // swap orders
      await flexibleDb.saveDoc("footerPages", page.id, { ...page, order: nextItem.order || 1 });
      await flexibleDb.saveDoc("footerPages", nextItem.id, { ...nextItem, order: tempOrder || 1 });
    }
  };

  const studioPages = pages.filter(p => p.column === "studio");
  const assistPages = pages.filter(p => p.column === "assist");

  return (
    <div className="p-4 lg:p-12 space-y-8 h-screen overflow-y-auto pb-40">
      
      {/* Dynamic Header actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white pb-6 border-b border-black/5 -mx-4 lg:-mx-12 lg:px-12 sticky top-0 z-10 p-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#B39B84] font-bold">Dynamic Pages Configurations</p>
          <h2 className="font-serif text-2xl tracking-tighter text-studio-black mt-1">Manage Footer Columns & Page Contents</h2>
        </div>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 bg-studio-black hover:bg-studio-accent text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
        >
          <Plus size={14} />
          Add Page / Link
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* List of current pages */}
        <div className="xl:col-span-2 space-y-8">
          
          {loading ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-black/5 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="animate-spin text-studio-accent" size={24} />
              <p className="font-mono text-xs text-black/40 uppercase tracking-widest">Loading active collection...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Studio Column */}
              <div className="bg-[#f9f9f9] p-6 lg:p-8 rounded-2xl border border-black/5 space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                  <h3 className="font-serif text-lg text-studio-black flex items-center gap-2">
                    <Layers size={16} className="text-studio-accent" />
                    Studio Column
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-white border px-2 py-1 rounded text-black/50">
                    {studioPages.length} item(s)
                  </span>
                </div>
                
                {studioPages.length === 0 ? (
                  <p className="font-mono text-[10px] text-black/30 uppercase text-center py-8">No links in Studio column</p>
                ) : (
                  <div className="space-y-3">
                    {studioPages.map((page, idx) => (
                      <div 
                        key={page.id} 
                        className={`p-4 bg-white rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          selectedPage?.id === page.id ? "border-studio-accent shadow-sm ring-1 ring-studio-accent/20" : "border-black/5 hover:border-black/10"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-studio-black truncate">{page.label}</p>
                          <p className="font-mono text-[9px] text-black/40 truncate mt-0.5">{page.url}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Order Up */}
                          <button
                            onClick={() => moveItem(page, "up")}
                            disabled={idx === 0}
                            className="p-1 px-1.5 bg-black/5 hover:bg-black/10 rounded text-black/60 hover:text-black transition-colors disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          
                          {/* Order Down */}
                          <button
                            onClick={() => moveItem(page, "down")}
                            disabled={idx === studioPages.length - 1}
                            className="p-1 px-1.5 bg-black/5 hover:bg-black/10 rounded text-black/60 hover:text-black transition-colors disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={11} />
                          </button>

                          <span className="text-[9px] font-mono text-black/30 px-1">#{page.order}</span>

                          {/* Edit Item */}
                          <button
                            onClick={() => startEdit(page)}
                            className="p-1.5 bg-studio-black/5 hover:bg-studio-black hover:text-white rounded text-studio-black transition-all cursor-pointer"
                            title="Edit content"
                          >
                            <Edit size={12} />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => handleRemove(page.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-550 hover:bg-red-500 hover:text-white rounded text-red-500 transition-all cursor-pointer"
                            title="Remove completely"
                          >
                            <Trash2 size={12} />
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Assist Column */}
              <div className="bg-[#f9f9f9] p-6 lg:p-8 rounded-2xl border border-black/5 space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-4">
                  <h3 className="font-serif text-lg text-studio-black flex items-center gap-2">
                    <Layers size={16} className="text-studio-accent" />
                    Assist Column
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-white border px-2 py-1 rounded text-black/50">
                    {assistPages.length} item(s)
                  </span>
                </div>
                
                {assistPages.length === 0 ? (
                  <p className="font-mono text-[10px] text-black/30 uppercase text-center py-8">No links in Assist column</p>
                ) : (
                  <div className="space-y-3">
                    {assistPages.map((page, idx) => (
                      <div 
                        key={page.id} 
                        className={`p-4 bg-white rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          selectedPage?.id === page.id ? "border-studio-accent shadow-sm ring-1 ring-studio-accent/20" : "border-black/5 hover:border-black/10"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-studio-black truncate">{page.label}</p>
                          <p className="font-mono text-[9px] text-black/40 truncate mt-0.5">{page.url}</p>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Order Up */}
                          <button
                            onClick={() => moveItem(page, "up")}
                            disabled={idx === 0}
                            className="p-1 px-1.5 bg-black/5 hover:bg-black/10 rounded text-black/60 hover:text-black transition-colors disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          
                          {/* Order Down */}
                          <button
                            onClick={() => moveItem(page, "down")}
                            disabled={idx === assistPages.length - 1}
                            className="p-1 px-1.5 bg-black/5 hover:bg-black/10 rounded text-black/60 hover:text-black transition-colors disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={11} />
                          </button>

                          <span className="text-[9px] font-mono text-black/30 px-1">#{page.order}</span>

                          {/* Edit Item */}
                          <button
                            onClick={() => startEdit(page)}
                            className="p-1.5 bg-studio-black/5 hover:bg-studio-black hover:text-white rounded text-studio-black transition-all cursor-pointer"
                            title="Edit content"
                          >
                            <Edit size={12} />
                          </button>

                          {/* Delete Item */}
                          <button
                            onClick={() => handleRemove(page.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-500 hover:text-white rounded text-red-500 transition-all cursor-pointer"
                            title="Remove completely"
                          >
                            <Trash2 size={12} />
                          </button>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Edit or Add Area */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 lg:p-8 space-y-6">
          {!selectedPage && !isAdding ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-black/40 space-y-4">
              <Layers size={36} className="text-black/10" />
              <div>
                <p className="font-serif text-sm font-medium text-studio-black">Atelier Page Drafting</p>
                <p className="text-[10px] uppercase font-mono tracking-widest mt-1">Select a page on the left to modify, or create a new one to begin editing.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/5 pb-4">
                <h3 className="font-serif text-lg text-studio-black">
                  {isAdding ? "Draft New Page Link" : `Edit: ${label}`}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-1 hover:bg-black/5 rounded text-black/55 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* ID field only editable during custom creation */}
                {isAdding && (
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-1">Unique Slot ID</label>
                    <input 
                      type="text"
                      value={id}
                      onChange={e => setId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"))}
                      placeholder="e.g., custom-ethics (leave blank to auto-slugify)"
                      className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-mono"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-1">Link Label / Text</label>
                    <input 
                      type="text"
                      required
                      value={label}
                      onChange={e => setLabel(e.target.value)}
                      placeholder="e.g., Transparency Reports"
                      className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-sans font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-1">Sort Priority Order</label>
                    <input 
                      type="number"
                      required
                      value={order}
                      onChange={e => setOrder(Number(e.target.value))}
                      className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-1">Destination Relative Route / Url</label>
                  <input 
                    type="text"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="e.g., /transparency or https://..."
                    className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-1">Footer Section Category</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setColumn("studio")}
                      className={`py-2 px-4 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${
                        column === "studio" ? "bg-studio-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
                      }`}
                    >
                      Studio Column
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setColumn("assist")}
                      className={`py-2 px-4 rounded text-[10px] uppercase tracking-widest font-bold transition-all ${
                        column === "assist" ? "bg-studio-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
                      }`}
                    >
                      Assist Column
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#B39B84] mb-3">Custom Page Content Override</h4>
                  <p className="text-[9px] uppercase tracking-widest leading-relaxed text-black/35 mb-4">
                    Modify the live page sections! These override static content when customers open this footer page.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-0.5">Custom Page Title</label>
                      <input 
                        type="text"
                        value={pageTitle}
                        onChange={e => setPageTitle(e.target.value)}
                        placeholder="e.g., Transparency Blueprint."
                        className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-0.5">Custom Subtitle Tagline</label>
                      <input 
                        type="text"
                        value={pageSubtitle}
                        onChange={e => setPageSubtitle(e.target.value)}
                        placeholder="e.g., Studio Audits & Local Standards"
                        className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 block mb-0.5">Body Narrative Paragraph</label>
                      <textarea
                        value={pageBody}
                        onChange={e => setPageBody(e.target.value)}
                        placeholder="Type standard copy or rich paragraph text here. Supports layout spacing and live updates..."
                        rows={6}
                        className="w-full bg-black/5 p-3 text-xs rounded-lg focus:outline-studio-accent font-sans leading-relaxed"
                      />
                    </div>

                    <div>
                      <ImageUpload 
                        label="Page Image (e.g. Hero, Atmosphere, or Feature Image)" 
                        currentImage={pageImage} 
                        onUpload={(url) => setPageImage(url)} 
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-studio-accent hover:bg-studio-black text-white py-3.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all disabled:bg-black/10 disabled:text-black/40 cursor-pointer"
                >
                  <Save size={14} />
                  {saving ? "Saving Draft..." : isAdding ? "Publish New Page" : "Save and Update Page"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
