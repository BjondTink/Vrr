import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Ruler, HelpCircle } from "lucide-react";

export default function SizeGuide() {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [selectedCategory, setSelectedCategory] = useState<"tops" | "bottoms">("tops");

  const topsSizes = [
    { size: "XS", eu: "34", chest: { cm: "80 - 84", in: "31.5 - 33" }, waist: { cm: "62 - 66", in: "24.5 - 26" }, sleeve: { cm: "59", in: "23.2" } },
    { size: "S", eu: "36", chest: { cm: "84 - 88", in: "33 - 34.6" }, waist: { cm: "66 - 70", in: "26 - 27.5" }, sleeve: { cm: "60", in: "23.6" } },
    { size: "M", eu: "38", chest: { cm: "88 - 92", in: "34.6 - 36.2" }, waist: { cm: "70 - 74", in: "27.5 - 29.1" }, sleeve: { cm: "61", in: "24" } },
    { size: "L", eu: "40", chest: { cm: "92 - 96", in: "36.2 - 37.8" }, waist: { cm: "74 - 78", in: "29.1 - 30.7" }, sleeve: { cm: "62", in: "24.4" } },
    { size: "XL", eu: "42", chest: { cm: "96 - 100", in: "37.8 - 39.4" }, waist: { cm: "78 - 82", in: "30.7 - 32.3" }, sleeve: { cm: "63", in: "24.8" } }
  ];

  const bottomsSizes = [
    { size: "XS", eu: "34", waist: { cm: "62 - 66", in: "24.5 - 26" }, hip: { cm: "86 - 90", in: "33.8 - 35.4" }, inseam: { cm: "76", in: "30" } },
    { size: "S", eu: "36", waist: { cm: "66 - 70", in: "26 - 27.5" }, hip: { cm: "90 - 94", in: "35.4 - 37" }, inseam: { cm: "77", in: "30.3" } },
    { size: "M", eu: "38", waist: { cm: "70 - 74", in: "27.5 - 29.1" }, hip: { cm: "94 - 98", in: "37 - 38.6" }, inseam: { cm: "78", in: "30.7" } },
    { size: "L", eu: "40", waist: { cm: "74 - 78", in: "29.1 - 30.7" }, hip: { cm: "98 - 102", in: "38.6 - 40.2" }, inseam: { cm: "79", in: "31.1" } },
    { size: "XL", eu: "42", waist: { cm: "78 - 82", in: "30.7 - 32.3" }, hip: { cm: "102 - 106", in: "40.2 - 41.7" }, inseam: { cm: "80", in: "31.5" } }
  ];

  const details = [
    { title: "The Oversized Blazer", desc: "Crafted with dynamic dropped shoulders and padded structure. We recommend selecting your standard size for an intentional editorial block, or sizing down if you prefer a slim body mapping." },
    { title: "The Silk Slip Dress", desc: "Cut on a bias to cascade effortlessly over contours. We recommend selecting your precise scale as raw natural silk has marginal yield." },
    { title: "The Generous Sweatpants", desc: "Features a relaxed waistband and high-rise drape details. If you seek standard utility length, size down; otherwise select your conventional size." }
  ];

  return (
    <div className="pt-40 pb-24 bg-studio-bg min-h-screen text-studio-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <p className="uppercase tracking-[0.4em] text-[10px] mb-6 text-studio-accent font-semibold">Fitting Room Architecture</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-12">
            Perfecting the <br /> Silhouette.
          </h1>
          <p className="text-lg md:text-xl text-studio-black/70 leading-relaxed font-light">
            Each Vrr item is meticulously patterned to honor movement, drape, and physical ease. Follow our custom size guide model to secure your exact proportions.
          </p>
        </div>

        {/* Content Tabs & Unit Toggles */}
        <div className="flex flex-col lg:flex-row gap-16 items-start mb-36 border-t border-studio-black/5 pt-20">
          
          {/* Main Size Table Wrapper */}
          <div className="lg:col-span-8 w-full space-y-8 bg-white p-6 md:p-10 border border-black/5 rounded">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 pb-6 border-b border-studio-black/5">
              
              {/* Category Switches */}
              <div className="flex gap-4 border border-black/5 bg-[#F6F5F3] p-1.5 rounded-full">
                <button
                  onClick={() => setSelectedCategory("tops")}
                  className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                    selectedCategory === "tops" ? "bg-studio-black text-white" : "text-black/50 hover:text-black"
                  }`}
                >
                  Tops & Blazers
                </button>
                <button
                  onClick={() => setSelectedCategory("bottoms")}
                  className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300 ${
                    selectedCategory === "bottoms" ? "bg-studio-black text-white" : "text-black/50 hover:text-black"
                  }`}
                >
                  Bottoms & Trousers
                </button>
              </div>

              {/* Metric/Imperial Switches */}
              <div className="flex gap-2">
                <button
                  onClick={() => setUnit("cm")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs border ${
                    unit === "cm" ? "bg-studio-black text-white border-studio-black" : "border-black/10 hover:border-black/40"
                  }`}
                >
                  CM
                </button>
                <button
                  onClick={() => setUnit("in")}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs border ${
                    unit === "in" ? "bg-studio-black text-white border-studio-black" : "border-black/10 hover:border-black/40"
                  }`}
                >
                  IN
                </button>
              </div>
            </div>

            {/* Sizes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-studio-black/5">
                    <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Standard Size</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">EU Size Reference</th>
                    {selectedCategory === "tops" ? (
                      <>
                        <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Chest Circumference</th>
                        <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Natural Waist</th>
                        <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Sleeve Length</th>
                      </>
                    ) : (
                      <>
                        <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Natural Waist</th>
                        <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Max Hip Circumference</th>
                        <th className="py-4 text-[10px] uppercase tracking-widest text-[#8A8987] font-semibold">Inseam Target</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-studio-black/5 text-xs uppercase tracking-wider">
                  {selectedCategory === "tops"
                    ? topsSizes.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FCFBF9] transition-colors">
                          <td className="py-5 font-semibold text-studio-black">{row.size}</td>
                          <td className="py-5 text-studio-black/60 font-mono">{row.eu}</td>
                          <td className="py-5 text-studio-black/70 font-mono">{row.chest[unit]} {unit}</td>
                          <td className="py-5 text-studio-black/70 font-mono">{row.waist[unit]} {unit}</td>
                          <td className="py-5 text-studio-black/70 font-mono">{row.sleeve[unit]} {unit}</td>
                        </tr>
                      ))
                    : bottomsSizes.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FCFBF9] transition-colors">
                          <td className="py-5 font-semibold text-studio-black">{row.size}</td>
                          <td className="py-5 text-studio-black/60 font-mono">{row.eu}</td>
                          <td className="py-5 text-studio-black/70 font-mono">{row.waist[unit]} {unit}</td>
                          <td className="py-5 text-studio-black/70 font-mono">{row.hip[unit]} {unit}</td>
                          <td className="py-5 text-studio-black/70 font-mono">{row.inseam[unit]} {unit}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-studio-black/5 flex items-start gap-4">
              <span className="w-1.5 h-1.5 bg-studio-accent rounded-full mt-1.5 shrink-0" />
              <p className="text-[10px] uppercase tracking-wider text-studio-black/40 leading-relaxed font-semibold">
                Tips: Use natural measuring tape. Hold the tape firmly (not tightly) around the apex of your chest (for tops) or widest contour of your low seat (for trousers).
              </p>
            </div>
          </div>

          {/* Guidelines Sidebar Col */}
          <div className="w-full lg:max-w-sm space-y-10">
            <h3 className="font-serif text-3xl tracking-tighter leading-none">Design & Fits</h3>
            <div className="space-y-6">
              {details.map((item) => (
                <div key={item.title} className="space-y-2 border-b border-studio-black/5 pb-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#3a3937]">{item.title}</h4>
                  <p className="text-xs text-studio-black/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#EEECEA] p-6 rounded text-studio-black">
              <h4 className="font-serif text-lg tracking-tight mb-3">Custom Fitting Needs?</h4>
              <p className="text-[10px] leading-relaxed uppercase tracking-widest text-studio-black/60 mb-6">
                Our workshop concierge provides customized measurement drafts. Specify your sleeve or cuff margins, and we will formulate bespoke modifications.
              </p>
              <a href="/contact" className="inline-flex items-center gap-3 bg-studio-black text-white hover:bg-studio-accent px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors shadow">
                Inquire With Atelier
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
