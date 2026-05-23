import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Package, 
  Layers, 
  FileText, 
  Settings, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  FolderOpen
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import ImageUpload from "../components/ImageUpload";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { flexibleDb } from "../lib/flexibleDatabase";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrorHandler";

type Tab = "overview" | "products" | "categories" | "collections" | "journal" | "orders" | "home";

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Close sidebar by default on mobile, open on desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-studio-bg">
      <Loader2 className="animate-spin text-studio-accent" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F0F0] flex relative overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-studio-black text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-20"}
        flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          {(isSidebarOpen || window.innerWidth < 1024) ? (
            <span className="font-serif text-2xl tracking-tighter uppercase font-bold text-studio-accent">Vrr Admin</span>
          ) : (
            <span className="font-serif text-xl font-bold">V</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="hover:text-studio-accent transition-colors lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarLink icon={<TrendingUp size={20}/>} label="Overview" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          <SidebarLink icon={<Package size={20}/>} label="Products" active={activeTab === "products"} onClick={() => { setActiveTab("products"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          <SidebarLink icon={<Layers size={20}/>} label="Categories" active={activeTab === "categories"} onClick={() => { setActiveTab("categories"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          <SidebarLink icon={<FileText size={20}/>} label="Journal" active={activeTab === "journal"} onClick={() => { setActiveTab("journal"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          <SidebarLink icon={<ShoppingBag size={20}/>} label="Orders" active={activeTab === "orders"} onClick={() => { setActiveTab("orders"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          <SidebarLink icon={<FolderOpen size={20}/>} label="Collections" active={activeTab === "collections"} onClick={() => { setActiveTab("collections"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          <div className="pt-8 mb-2">
            <SidebarLink icon={<Settings size={20}/>} label="Home Page" active={activeTab === "home"} onClick={() => { setActiveTab("home"); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} collapsed={!isSidebarOpen && window.innerWidth >= 1024} />
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full p-3 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <LogOut size={20} />
            {(isSidebarOpen || window.innerWidth < 1024) && <span className="text-xs uppercase tracking-widest font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {user?.uid === "vrr_admin_id" && (
          <div className="bg-studio-accent text-white px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-black bg-white text-studio-accent px-1.5 py-0.5 rounded">Flexible Mode</span>
              <p className="text-[10px] uppercase tracking-[0.1em] font-medium">Resilient sync mode is active. You have full admin rights: add, edit, or upload items freely across all pages.</p>
            </div>
          </div>
        )}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5 p-4 lg:p-8 flex justify-between items-center transition-all">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl lg:text-3xl font-serif tracking-tight capitalize truncate max-w-[150px] sm:max-w-none">{activeTab}</h1>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.open('/', '_blank')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 border border-black/10 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-black/5 transition-all text-black/60"
                >
                    Visit Site
                </button>
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] uppercase tracking-widest font-bold">{user?.displayName}</p>
                    <p className="text-[9px] text-black/40">Studio Admin</p>
                </div>
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="admin" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-black/10" referrerPolicy="no-referrer" />
                ) : (
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-black/10 bg-studio-black flex items-center justify-center text-white text-[10px] uppercase font-bold">
                        {user?.displayName?.charAt(0) || "A"}
                    </div>
                )}
            </div>
        </header>

        <div className="p-4 lg:p-12">
          <div className="bg-white rounded-xl shadow-sm border border-black/5 min-h-[600px] overflow-hidden">
            {activeTab === "overview" && <DashboardOverview onTabChange={setActiveTab} />}
            {activeTab === "products" && <DashboardProducts />}
            {activeTab === "categories" && <DashboardCategories />}
            {activeTab === "collections" && <DashboardCollections />}
            {activeTab === "home" && <DashboardHome />}
            {activeTab === "orders" && <DashboardOrders />}
            {activeTab === "journal" && <DashboardJournal />}
          </div>
        </div>
      </main>
    </div>

  );
}

function SidebarLink({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-3 rounded-lg transition-all ${active ? "bg-studio-accent text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
    >
      {icon}
      {!collapsed && <span className="text-xs uppercase tracking-[0.2em] font-semibold">{label}</span>}
    </button>
  );
}

// --- Subcomponent Views ---

function DashboardOverview({ onTabChange }: { onTabChange: (tab: Tab) => void }) {
    const { isAdmin, user } = useAuth();
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, journal: 0, revenue: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            if (!isAdmin) return;

            try {
                const [products, categories, orders, journalPosts] = await Promise.all([
                    flexibleDb.getDocs("products"),
                    flexibleDb.getDocs("categories"),
                    flexibleDb.getDocs("orders"),
                    flexibleDb.getDocs("journalPosts")
                ]);
                
                const revenue = orders.reduce((acc, doc) => {
                    const totalVal = parseFloat(String(doc.total).replace(/[^0-9.]/g, '')) || 0;
                    return acc + totalVal;
                }, 0);
                
                setStats({
                    products: products.length,
                    categories: categories.length,
                    orders: orders.length,
                    journal: journalPosts.length,
                    revenue
                });
            } catch (err) {
                console.error("Dashboard stats fetch failed:", err);
            }
        };
        fetchStats();
    }, [isAdmin, user?.uid]);

    const chartData = [
      { name: 'Mon', value: 4000 },
      { name: 'Tue', value: 3000 },
      { name: 'Wed', value: 5000 },
      { name: 'Thu', value: 2780 },
      { name: 'Fri', value: 1890 },
      { name: 'Sat', value: 2390 },
      { name: 'Sun', value: 3490 },
    ];

    return (
        <div className="p-4 lg:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                <StatCard label="Live Inventory" value={stats.products} icon={<Package />} onClick={() => onTabChange("products")} />
                <StatCard label="Total Categories" value={stats.categories} icon={<Layers />} onClick={() => onTabChange("categories")} />
                <StatCard label="Total Orders" value={stats.orders} icon={<ShoppingBag />} onClick={() => onTabChange("orders")} />
                <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<TrendingUp />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-black/5 h-[400px]">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-xl">Sales Performance</h3>
                      <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Past 7 Days</p>
                   </div>
                   <ResponsiveContainer width="100%" height="90%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#000" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="bg-studio-black text-white p-8 rounded-xl flex flex-col justify-between">
                   <div>
                      <h3 className="font-serif text-2xl mb-2">Studio Status</h3>
                      <p className="text-white/40 text-xs tracking-wider uppercase">Connected to Global Node</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                         <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">Server Latency</p>
                         <p className="font-mono text-lg text-studio-accent">24ms</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                         <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">System Health</p>
                         <p className="font-mono text-lg text-green-400">Optimal</p>
                      </div>
                   </div>

                   <button 
                     onClick={() => onTabChange("home")}
                     className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold rounded-lg hover:bg-studio-accent hover:text-white transition-all"
                   >
                     Update Storefront
                   </button>
                </div>
            </div>
            
            <div className="p-6 lg:p-10 bg-[#F9F8F6] rounded-xl border border-black/5">
                <h3 className="font-serif text-xl lg:text-2xl mb-6">Management shortcuts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                    <ActionButton label="Add Product" onClick={() => onTabChange("products")} />
                    <ActionButton label="Create Post" onClick={() => onTabChange("journal")} />
                    <ActionButton label="View Orders" onClick={() => onTabChange("orders")} />
                    <ActionButton label="Edit Site" onClick={() => onTabChange("home")} />
                </div>
            </div>
        </div>
    );
}

function DashboardProducts() {
    const { isAdmin, user } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    useEffect(() => {
        if (!isAdmin) return;

        const unsub = flexibleDb.subscribeToCollection("products", (items) => {
            setProducts(items);
        });
        return unsub;
    }, [isAdmin]);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this product?")) {
            await flexibleDb.deleteDoc("products", id);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="font-serif text-xl lg:text-2xl">Studio Inventory</h2>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-studio-black text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg hover:opacity-90 transition-all"
                >
                    <Plus size={16} /> Add New Piece
                </button>
            </div>

            <div className="overflow-x-auto -mx-4 lg:mx-0 px-4 lg:px-0">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b border-black/5">
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Product</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Category</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Price</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                                <td className="py-4 flex items-center gap-4">
                                    {p.image ? (
                                        <img src={p.image} className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-md" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black/5 rounded-md flex items-center justify-center">
                                            <ImageIcon size={16} className="text-black/20" />
                                        </div>
                                    )}
                                    <span className="text-[10px] lg:text-xs font-semibold uppercase">{p.name}</span>
                                </td>
                                <td className="py-4 text-[10px] lg:text-xs uppercase tracking-widest text-black/60">{p.category}</td>
                                <td className="py-4 text-[10px] lg:text-xs font-mono">{p.price}</td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-1 lg:gap-2">
                                        <button onClick={() => setEditingProduct(p)} className="p-2 hover:bg-studio-accent hover:text-white rounded-md transition-all"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500 hover:text-white rounded-md transition-all text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(isAdding || editingProduct) && (
              <ProductModal 
                product={editingProduct} 
                onClose={() => { setIsAdding(false); setEditingProduct(null); }} 
              />
            )}
        </div>
    );
}

function ProductModal({ product, onClose }: { product?: any, onClose: () => void }) {
    const [allCollections, setAllCollections] = useState<any[]>([]);
    const [formData, setFormData] = useState(product || { 
      name: "", 
      price: "", 
      discountPrice: "",
      category: "", 
      collection: "",
      image: "", 
      gallery: [], 
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: [],
      stock: 10,
      description: "",
      details: "",
      modelInfo: "",
      slug: "",
      isFeatured: false,
      isNewArrival: true,
      seoTitle: "",
      seoDescription: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsub = flexibleDb.subscribeToCollection("collections", (items) => {
            setAllCollections(items);
        });
        return unsub;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = product?.id || Date.now().toString();
            // Auto-generate slug if empty
            const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            
            await flexibleDb.saveDoc("products", id, {
                ...formData,
                slug,
                updatedAt: new Date().toISOString()
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 lg:p-8 border-b border-black/5 flex justify-between items-center bg-studio-bg flex-shrink-0">
                    <h3 className="font-serif text-2xl">{product ? "Edit Collection Piece" : "New Piece"}</h3>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-12 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Column: Media & Visuals */}
                        <div className="lg:col-span-5 space-y-8">
                            <ImageUpload 
                              label="Thumbnail (Primary)" 
                              currentImage={formData.image} 
                              onUpload={(url) => setFormData({...formData, image: url})} 
                            />
                            
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Gallery Images</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {formData.gallery?.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square bg-black/5 rounded-lg overflow-hidden">
                                            <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            <button 
                                              type="button" 
                                              onClick={() => {
                                                const newGallery = [...formData.gallery];
                                                newGallery.splice(idx, 1);
                                                setFormData({...formData, gallery: newGallery});
                                              }}
                                              className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    ))}
                                    <div className="aspect-square">
                                       <ImageUpload onUpload={(url) => setFormData({...formData, gallery: [...(formData.gallery || []), url]})} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-studio-black text-white rounded-xl space-y-4">
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Storefront Visibility</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-widest">Featured Item</span>
                                    <input 
                                      type="checkbox" 
                                      checked={formData.isFeatured} 
                                      onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                                      className="accent-studio-accent w-4 h-4"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-widest">New Arrival</span>
                                    <input 
                                      type="checkbox" 
                                      checked={formData.isNewArrival} 
                                      onChange={e => setFormData({...formData, isNewArrival: e.target.checked})}
                                      className="accent-studio-accent w-4 h-4"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Data & Specs */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Piece Name</label>
                                    <input required value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs font-bold uppercase tracking-widest rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Category</label>
                                    <input 
                                        required 
                                        value={formData.category || ""} 
                                        onChange={e => setFormData({...formData, category: e.target.value})} 
                                        className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs uppercase tracking-widest rounded-lg font-bold" 
                                        placeholder="Type or click suggestions below..."
                                    />
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {["Outerwear", "Dresses", "Bottoms", "Knitwear", "Accessories"].map(cat => (
                                            <button 
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({...formData, category: cat})}
                                                className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md border font-bold transition-all ${formData.category === cat ? 'bg-studio-accent text-white border-studio-accent' : 'bg-black/5 text-black/60 border-transparent hover:bg-black/10'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Collection (Optional)</label>
                                <select 
                                    value={formData.collection || ""} 
                                    onChange={e => setFormData({...formData, collection: e.target.value})} 
                                    className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs uppercase tracking-widest rounded-lg font-bold"
                                >
                                    <option value="">None (Standalone Piece)</option>
                                    {allCollections.map((col: any) => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Price</label>
                                    <input required value={formData.price || ""} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="$" className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs font-mono rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Discount Price</label>
                                    <input value={formData.discountPrice || ""} onChange={e => setFormData({...formData, discountPrice: e.target.value})} placeholder="$" className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs font-mono rounded-lg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold">Stock</label>
                                    <input type="number" required value={formData.stock ?? 0} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs rounded-lg" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Product Summary</label>
                                <textarea rows={2} value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs tracking-widest rounded-lg leading-relaxed" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold">Technical Details (Materials/Care)</label>
                                <textarea rows={3} value={formData.details || ""} onChange={e => setFormData({...formData, details: e.target.value})} className="w-full bg-[#f9f9f9] border border-black/5 p-4 text-xs tracking-widest rounded-lg" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-studio-accent font-black">Search Optimization (SEO)</label>
                                <div className="p-6 bg-studio-bg rounded-xl border border-black/5 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">SEO Title</label>
                                        <input value={formData.seoTitle || ""} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full bg-white border border-black/5 p-3 text-[10px] rounded-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">SEO Description</label>
                                        <textarea value={formData.seoDescription || ""} onChange={e => setFormData({...formData, seoDescription: e.target.value})} className="w-full bg-white border border-black/5 p-3 text-[10px] rounded-lg" rows={2} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                      disabled={loading}
                      className="w-full bg-studio-black text-white py-6 text-[10px] uppercase tracking-[0.6em] font-bold rounded-xl flex items-center justify-center gap-4 hover:bg-studio-accent transition-all sticky bottom-0 z-10 shadow-2xl"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin"/> : <><Save size={18}/> Push to Database</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function DashboardCategories() {
    const { isAdmin, user } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState({ name: "", slug: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;

        const unsub = flexibleDb.subscribeToCollection("categories", (items) => {
            setCategories(items);
        });
        return unsub;
    }, [isAdmin]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = newCategory.slug || Date.now().toString();
            await flexibleDb.saveDoc("categories", id, newCategory);
            setNewCategory({ name: "", slug: "" });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this category?")) {
            await flexibleDb.deleteDoc("categories", id);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <h2 className="font-serif text-xl lg:text-2xl mb-8">Categories</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleAdd} className="bg-[#f9f9f9] p-6 rounded-xl border border-black/5 space-y-4">
                        <h3 className="font-serif text-lg mb-4">Add New Category</h3>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold">Category Name</label>
                            <input 
                              required 
                              value={newCategory.name} 
                              onChange={e => setNewCategory({...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                              className="w-full p-3 bg-white border border-black/5 rounded-lg text-xs" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold">Slug</label>
                            <input 
                              required 
                              value={newCategory.slug} 
                              onChange={e => setNewCategory({...newCategory, slug: e.target.value})} 
                              className="w-full p-3 bg-white border border-black/5 rounded-lg text-xs" 
                            />
                        </div>
                        <button 
                           disabled={loading}
                           className="w-full bg-studio-black text-white py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin"/> : <><Plus size={14}/> Add Category</>}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="space-y-3">
                        {categories.map(c => (
                            <div key={c.id} className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-xl hover:bg-black/5 transition-colors">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold">{c.name}</p>
                                    <p className="text-[10px] text-black/40 font-mono">/{c.slug}</p>
                                </div>
                                <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardCollections() {
    const { isAdmin } = useAuth();
    const [collections, setCollections] = useState<any[]>([]);
    const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", category: "", slug: "", image: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;

        const unsub = flexibleDb.subscribeToCollection("collections", (items) => {
            setCollections(items);
        });
        return unsub;
    }, [isAdmin]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = editingCollectionId || formData.slug || Date.now().toString();
            const image = formData.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2670";
            
            await flexibleDb.saveDoc("collections", id, {
                ...formData,
                image,
                id
            });
            setFormData({ name: "", category: "", slug: "", image: "" });
            setEditingCollectionId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (col: any) => {
        setEditingCollectionId(col.id);
        setFormData({
            name: col.name || "",
            category: col.category || "",
            slug: col.id || "",
            image: col.image || ""
        });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this collection?")) {
            await flexibleDb.deleteDoc("collections", id);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <h2 className="font-serif text-xl lg:text-2xl mb-8">Collections</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <form onSubmit={handleSave} className="bg-[#f9f9f9] p-6 rounded-xl border border-black/5 space-y-4">
                        <h3 className="font-serif text-lg mb-4">{editingCollectionId ? "Edit Collection" : "Add New Collection"}</h3>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold">Collection Name</label>
                            <input 
                              required 
                              value={formData.name} 
                              onChange={e => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                              className="w-full p-3 bg-white border border-black/5 rounded-lg text-xs font-bold" 
                              placeholder="e.g. Le Matin"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold">Category Badge / Tag</label>
                            <input 
                              required 
                              value={formData.category} 
                              onChange={e => setFormData({...formData, category: e.target.value})} 
                              className="w-full p-3 bg-white border border-black/5 rounded-lg text-xs" 
                              placeholder="e.g. Essentials, Summer Edit"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold">Slug / Unique ID</label>
                            <input 
                              required 
                              disabled={!!editingCollectionId}
                              value={formData.slug} 
                              onChange={e => setFormData({...formData, slug: e.target.value})} 
                              className="w-full p-3 bg-white border border-black/5 rounded-lg text-xs font-mono disabled:opacity-50" 
                              placeholder="e.g. le-matin"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-bold">Cover Image</label>
                            <ImageUpload 
                              currentImage={formData.image} 
                              onUpload={(url) => setFormData({...formData, image: url})} 
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button 
                               disabled={loading}
                               className="flex-1 bg-studio-black text-white py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-studio-accent transition-colors"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin"/> : editingCollectionId ? "Save Changes" : <><Plus size={14}/> Add Collection</>}
                            </button>
                            {editingCollectionId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCollectionId(null);
                                        setFormData({ name: "", category: "", slug: "", image: "" });
                                    }}
                                    className="px-4 border border-black/10 rounded-lg text-[10px] uppercase tracking-widest hover:bg-black/5 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {collections.map(c => (
                            <div key={c.id} className="group relative bg-white border border-black/5 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                                <div className="aspect-[16/10] w-full bg-black/5 relative overflow-hidden">
                                    <img src={c.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2670"} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                                    <div className="absolute top-3 left-3 bg-studio-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[8px] uppercase tracking-widest text-white font-extrabold shadow-sm">
                                        {c.category}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-serif text-lg leading-tight mb-1">{c.name}</h4>
                                        <p className="text-[9px] text-black/40 font-mono tracking-wider">ID / Slug: {c.id}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 border-t border-black/5 pt-3">
                                        <button 
                                            type="button"
                                            onClick={() => handleEdit(c)} 
                                            className="flex-1 py-1 px-2 border border-black/10 rounded text-[9px] uppercase tracking-widest font-bold hover:bg-black/5 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <Edit size={12} /> Edit
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleDelete(c.id)} 
                                            className="p-1 px-2 border border-red-200 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
function DashboardOrders() {
    const { isAdmin, user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        if (!isAdmin) return;

        const unsub = flexibleDb.subscribeToCollection("orders", (items) => {
            setOrders(items);
        });
        return unsub;
    }, [isAdmin]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await flexibleDb.updateDoc("orders", id, { status: newStatus });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <h2 className="font-serif text-xl lg:text-2xl mb-8">Order Tracking</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="border-b border-black/5">
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Order ID</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Customer</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Total</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40">Status</th>
                            <th className="py-4 text-[10px] uppercase tracking-widest text-black/40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                                <td className="py-4 text-[10px] lg:text-xs font-mono font-bold tracking-widest">{o.id}</td>
                                <td className="py-4">
                                    <p className="text-[10px] lg:text-xs font-semibold">{o.customerEmail}</p>
                                    <p className="text-[8px] lg:text-[10px] text-black/40 uppercase tracking-widest">{new Date(o.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="py-4 text-[10px] lg:text-xs font-mono">${o.total}</td>
                                <td className="py-4">
                                    <span className={`px-3 py-1 rounded-full text-[8px] lg:text-[9px] uppercase tracking-widest font-bold ${
                                        o.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        o.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <select 
                                      value={o.status} 
                                      onChange={(e) => updateStatus(o.id, e.target.value)}
                                      className="bg-black/5 border border-black/5 p-2 text-[8px] lg:text-[10px] uppercase tracking-widest font-bold rounded-md outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
function DashboardJournal() {
    const { isAdmin, user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);

    useEffect(() => {
        if (!isAdmin) return;

        const unsub = flexibleDb.subscribeToCollection("journalPosts", (items) => {
            setPosts(items);
        });
        return unsub;
    }, [isAdmin]);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this post?")) {
            await flexibleDb.deleteDoc("journalPosts", id);
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="font-serif text-xl lg:text-2xl">Journal Editor</h2>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-2 bg-studio-black text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold rounded-lg"
                >
                    <Plus size={16} /> New Entry
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(p => (
                    <div key={p.id} className="bg-white border border-black/5 rounded-xl overflow-hidden group">
                        {p.image && <img src={p.image} className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />}
                        <div className="p-6">
                            <p className="text-[10px] uppercase tracking-widest text-studio-accent font-bold mb-2">{p.category}</p>
                            <h3 className="font-serif text-lg mb-4">{p.title}</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-black/40 font-mono italic">{p.date}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingPost(p)} className="p-2 hover:bg-studio-accent hover:text-white rounded-lg transition-all">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(isAdding || editingPost) && (
                <JournalModal 
                    post={editingPost}
                    onClose={() => { setIsAdding(false); setEditingPost(null); }} 
                />
            )}
        </div>
    );
}

function JournalModal({ post, onClose }: { post?: any, onClose: () => void }) {
    const [formData, setFormData] = useState(post || { 
        title: "", 
        category: "", 
        image: "", 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), 
        content: "",
        seoTitle: "",
        seoDescription: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = post?.id || Date.now().toString();
            await flexibleDb.saveDoc("journalPosts", id, {
                ...formData,
                updatedAt: new Date().toISOString()
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert("Save failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-black/5 flex justify-between items-center bg-studio-bg flex-shrink-0">
                    <h3 className="font-serif text-2xl">{post ? "Edit Journal Entry" : "New Journal Entry"}</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Title</label>
                                <input required value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#f9f9f9] p-4 text-xs font-serif text-lg tracking-tight rounded-lg border border-black/5" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Category</label>
                                    <input required value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#f9f9f9] p-4 text-[10px] uppercase tracking-widest font-black rounded-lg border border-black/5" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Publish Date</label>
                                    <input value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#f9f9f9] p-4 text-[10px] font-mono rounded-lg border border-black/5" />
                                </div>
                            </div>
                            
                            <ImageUpload 
                              label="Cover Image" 
                              currentImage={formData.image} 
                              onUpload={(url) => setFormData({...formData, image: url})} 
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">Post Content (Rich Text)</label>
                                <textarea rows={10} value={formData.content || ""} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-[#f9f9f9] p-4 text-xs leading-relaxed rounded-lg border border-black/5" />
                            </div>
                            
                            <div className="p-6 bg-studio-bg rounded-xl border border-black/5 space-y-4">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-studio-accent">Analytics & SEO</p>
                                <div className="space-y-2">
                                    <label className="text-[8px] uppercase tracking-widest font-bold opacity-40">SEO Meta Description</label>
                                    <textarea value={formData.seoDescription || ""} onChange={e => setFormData({...formData, seoDescription: e.target.value})} className="w-full bg-white border border-black/5 p-3 text-[10px] rounded-lg" rows={2} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-studio-black text-white py-6 text-[10px] uppercase tracking-[0.4em] font-bold rounded-xl flex items-center justify-center gap-4 hover:bg-studio-accent transition-all shadow-xl"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin"/> : <><Save size={18}/> {post ? "Update Entry" : "Publish Entry"}</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function DashboardHome() {
    const { isAdmin, user } = useAuth();
    const [serverSettings, setServerSettings] = useState<any>(null);
    const [localSettings, setLocalSettings] = useState<any>({
        heroTitle: "First Signs of Spring",
        heroSubtitle: "Discover the Collection",
        heroImage: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2670&auto=format&fit=crop",
        philosophyTag: "Our Philosophy",
        philosophyQuote: "Art is the soul of our studio, fashion is the language we use to speak to the world.",
        marqueeText: "Vrr — Collection No.04 — Dropping Soon",
        collectionTitle: "The Seasonal Edit",
        collectionSubtitle: "Curated Pieces",
        collectionDescription: "Our latest pieces are designed for the transitional moments between seasons. Timeless silhouettes meet modern craftsmanship.",
        collection1Image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
        collection2Image: "",
        collection3Image: "https://images.unsplash.com/photo-1618333230677-6c30ce0f6244?q=80&w=2670&auto=format&fit=crop",
        collection4Image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2670&auto=format&fit=crop"
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
            alert("Home Page updated successfully");
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
                    <span className="text-[10px] uppercase tracking-widest font-bold">
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
                {/* Hero Section */}
                <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
                    <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3">
                        <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">1</span>
                        Hero Section
                    </h3>
                    <div className="space-y-4">
                        <SettingInput label="Hero Title" value={localSettings.heroTitle} onChange={(v) => updateSetting("heroTitle", v)} />
                        <SettingInput label="Hero Subtitle" value={localSettings.heroSubtitle} onChange={(v) => updateSetting("heroSubtitle", v)} />
                        <ImageUpload label="Hero Main Visual" currentImage={localSettings.heroImage} onUpload={(url) => updateSetting("heroImage", url)} />
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
                    <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3">
                        <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">2</span>
                        Brand Philosophy
                    </h3>
                    <div className="space-y-4">
                        <SettingInput label="Philosophy Tag" value={localSettings.philosophyTag} onChange={(v) => updateSetting("philosophyTag", v)} />
                        <SettingInput label="Philosophy Quote" textarea value={localSettings.philosophyQuote} onChange={(v) => updateSetting("philosophyQuote", v)} />
                    </div>
                </div>

                {/* Marquee Section */}
                <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
                    <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3">
                        <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">3</span>
                        Marquee Text
                    </h3>
                    <div className="space-y-4">
                        <SettingInput label="Marquee Message" value={localSettings.marqueeText} onChange={(v) => updateSetting("marqueeText", v)} />
                    </div>
                </div>

                {/* Collection Section */}
                <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
                    <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3">
                        <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">4</span>
                        Collections Header
                    </h3>
                    <div className="space-y-4">
                        <SettingInput label="Section Title" value={localSettings.collectionTitle} onChange={(v) => updateSetting("collectionTitle", v)} />
                        <SettingInput label="Section Subtitle" value={localSettings.collectionSubtitle} onChange={(v) => updateSetting("collectionSubtitle", v)} />
                        <SettingInput label="Section Description" textarea value={localSettings.collectionDescription} onChange={(v) => updateSetting("collectionDescription", v)} />
                    </div>
                </div>

                {/* Collection Images */}
                <div className="space-y-6 bg-[#f9f9f9] p-6 lg:p-10 rounded-2xl border border-black/5">
                    <h3 className="font-serif text-xl lg:text-2xl flex items-center gap-3">
                        <span className="w-8 h-8 bg-studio-black text-white rounded-full flex items-center justify-center text-xs">5</span>
                        Collection Grid Images
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ImageUpload label="Image 1 (Le Matin)" currentImage={localSettings.collection1Image} onUpload={(url) => updateSetting("collection1Image", url)} />
                        <ImageUpload label="Image 2 (L'Heure Bleue)" currentImage={localSettings.collection2Image} onUpload={(url) => updateSetting("collection2Image", url)} />
                        <ImageUpload label="Image 3 (La Rue)" currentImage={localSettings.collection3Image} onUpload={(url) => updateSetting("collection3Image", url)} />
                        <ImageUpload label="Image 4 (Objets d'Art)" currentImage={localSettings.collection4Image} onUpload={(url) => updateSetting("collection4Image", url)} />
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 bg-white p-6 border-t border-black/5 flex justify-end z-10 shadow-2xl">
                <button 
                  disabled={saving || !isDirty}
                  onClick={handleSave}
                  className={`w-full sm:w-auto px-12 py-5 text-[10px] uppercase tracking-[0.4em] font-bold rounded-lg flex items-center justify-center gap-4 transition-all shadow-xl ${
                    isDirty 
                    ? "bg-studio-black text-white hover:opacity-90" 
                    : "bg-black/5 text-black/40 cursor-not-allowed"
                  }`}
                >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin"/>
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Publish Live View</span>
                      </>
                    )}
                </button>
            </div>
        </div>
    );
}

// --- Tiny UI Bits ---

function StatCard({ label, value, icon, onClick }: { label: string, value: number | string, icon: React.ReactNode, onClick?: () => void }) {
    return (
        <div 
          onClick={onClick}
          className={`p-6 lg:p-8 bg-white border border-black/5 rounded-xl shadow-sm hover:shadow-md transition-all group ${onClick ? "cursor-pointer" : ""}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 lg:p-3 bg-studio-black/5 rounded-lg group-hover:bg-studio-accent group-hover:text-white transition-colors">
                    {icon}
                </div>
                <span className="text-[8px] lg:text-[10px] uppercase tracking-widest text-black/30 font-bold">Vrr Studio</span>
            </div>
            <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">{label}</p>
            <p className="text-2xl lg:text-3xl font-serif">{value}</p>
        </div>
    );
}

function ActionButton({ label, onClick }: { label: string, onClick?: () => void }) {
    return (
        <button 
          onClick={onClick}
          className="p-4 bg-white border border-black/5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-studio-black hover:text-white transition-all text-center"
        >
            {label}
        </button>
    );
}

function SettingInput({ label, value, onChange, textarea }: { label: string, value: string, onChange: (v: string) => void, textarea?: boolean }) {
    const safeValue = value || "";
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40">{label}</label>
            {textarea ? (
                <textarea 
                  value={safeValue} 
                  onChange={e => onChange(e.target.value)} 
                  className="w-full bg-black/5 p-4 text-sm rounded-lg focus:outline-studio-accent"
                  rows={3}
                />
            ) : (
                <input 
                  type="text" 
                  value={safeValue} 
                  onChange={e => onChange(e.target.value)} 
                  className="w-full bg-black/5 p-4 text-sm rounded-lg focus:outline-studio-accent"
                />
            )}
        </div>
    );
}
