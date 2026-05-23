import { motion } from "motion/react";
import { PRODUCTS } from "../constants";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { LayoutGrid, List, Image as ImageIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import { flexibleDb } from "../lib/flexibleDatabase";

export default function Shop() {
  const { addToCart } = useCart();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("All");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCollections, setDbCollections] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const itemsPerPage = 9;

  const collectionParam = searchParams.get("collection") || "";

  useEffect(() => {
    const unsubProducts = flexibleDb.subscribeToCollection("products", (items) => {
      setDbProducts(items);
    });
    
    const unsubCollections = flexibleDb.subscribeToCollection("collections", (items) => {
      setDbCollections(items);
    });

    return () => {
      unsubProducts();
      unsubCollections();
    };
  }, []);

  // Reset page when category or collection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, collectionParam]);

  const categories = ["All", ...new Set(dbProducts.map((p) => p.category))];

  // 1. Filter by category
  let filteredProducts = filter === "All" ? dbProducts : dbProducts.filter(p => p.category === filter);

  // 2. Filter by collection (optional)
  if (collectionParam) {
    if (collectionParam === "all_collections") {
      filteredProducts = filteredProducts.filter(p => p.collection && p.collection !== "");
    } else {
      filteredProducts = filteredProducts.filter(p => p.collection === collectionParam);
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="pt-32 pb-36 px-6 md:px-12 max-w-7xl mx-auto">
      <SEO title="Shop Collections" description="Explore the full collection of Vrr Studio pieces." />
      <header className="mb-16">
        <p className="uppercase tracking-[0.3em] text-[10px] mb-4 text-studio-accent font-medium text-center md:text-left">The Studio Store</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none text-center md:text-left">Shop All Pieces</h1>
           <div className="flex items-center justify-center md:justify-end pb-2 border-b border-studio-black/5">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setView("grid")}
                  className={`transition-opacity ${view === "grid" ? "opacity-100" : "opacity-30"}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button 
                  onClick={() => setView("list")}
                  className={`transition-opacity ${view === "list" ? "opacity-100" : "opacity-30"}`}
                >
                  <List size={20} />
                </button>
              </div>
           </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-48 flex-shrink-0">
          <div className="sticky top-32 space-y-12">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-studio-accent">Categories</h3>
              <ul className="space-y-4">
                {categories.map((cat) => (
                  <li 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`text-xs uppercase tracking-widest cursor-pointer transition-all hover:translate-x-1 ${filter === cat ? "font-bold text-studio-black" : "text-studio-black/40"}`}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {dbCollections.length > 0 && (
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-studio-accent">Collections</h3>
                <ul className="space-y-4">
                  <li 
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete("collection");
                      setSearchParams(params);
                    }}
                    className={`text-xs uppercase tracking-widest cursor-pointer transition-all hover:translate-x-1 ${!collectionParam ? "font-bold text-studio-black" : "text-studio-black/40"}`}
                  >
                    All Collections
                  </li>
                  {dbCollections.map((col) => (
                    <li 
                      key={col.id}
                      onClick={() => setSearchParams({ collection: col.id })}
                      className={`text-xs uppercase tracking-widest cursor-pointer transition-all hover:translate-x-1 ${collectionParam === col.id ? "font-bold text-studio-black" : "text-studio-black/40"}`}
                    >
                      {col.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className={view === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" 
            : "flex flex-col space-y-12"
          }>
            {currentProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group ${view === "list" ? "flex gap-12 items-center" : ""}`}
              >
                <Link to={`/product/${product.id}`} className={`relative overflow-hidden bg-white aspect-[3/4] ${view === "list" ? "w-64 flex-shrink-0" : "w-full"}`}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/5 flex items-center justify-center">
                      <ImageIcon size={32} className="text-black/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute bottom-6 left-6 right-6 py-3 bg-studio-bg text-studio-black text-[10px] uppercase tracking-[0.2em] font-medium translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl text-center">
                    Detailed View
                  </div>
                </Link>

                <div className={view === "list" ? "flex-1" : "mt-6"}>
                  <p className="text-[10px] uppercase tracking-widest text-studio-accent mb-2">{product.category}</p>
                  <h3 className="font-serif text-xl md:text-2xl mb-2 items-start">
                    <Link to={`/product/${product.id}`} className="hover:text-studio-accent transition-colors">{product.name}</Link>
                  </h3>
                  <p className="font-medium text-studio-black/60">{product.price}</p>
                  {view === "list" && (
                    <p className="mt-4 text-xs uppercase tracking-widest text-studio-black/40 leading-relaxed max-w-md">
                      {product.description || "A masterfully crafted piece designed for the modern wardrobe."}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Aesthetic Studio-styled Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-20 border-t border-studio-black/5 pt-12">
              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${currentPage === 1 ? "opacity-20 cursor-not-allowed" : "hover:text-studio-accent"}`}
              >
                Prev
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-full text-[10px] font-extrabold tracking-widest transition-all ${
                        currentPage === pageNum 
                          ? "bg-studio-black text-white" 
                          : "text-studio-black/40 hover:bg-black/5 hover:text-studio-black"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${currentPage === totalPages ? "opacity-20 cursor-not-allowed" : "hover:text-studio-accent"}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
