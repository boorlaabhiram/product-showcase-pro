import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Trash2, Star, ShoppingBag, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types/product';
import { formatINR } from '../lib/utils';

interface CompareModalProps {
  isOpen: boolean;
  compareIds: string[];
  allProducts: Product[];
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onQuickView: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  compareIds,
  allProducts,
  onClose,
  onRemoveFromCompare,
  onClearCompare,
  onQuickView,
}) => {
  if (!isOpen) return null;

  const compareProducts = allProducts.filter((p) => compareIds.includes(p.id));

  // Find product with highest rating or specs score for AI Winner recommendation badge
  const bestProduct = compareProducts.length > 0
    ? [...compareProducts].sort((a, b) => b.rating - a.rating || a.price - b.price)[0]
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-[#09090b]/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <Layers className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Hardware Specification Matrix</h3>
                <p className="text-[11px] text-zinc-400">Compare up to 4 products side-by-side</p>
              </div>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold border border-sky-500/30">
                {compareProducts.length} / 4 Selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              {compareProducts.length > 0 && (
                <button
                  onClick={onClearCompare}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20"
                >
                  Clear Matrix
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Empty State when no items are selected */}
          {compareProducts.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center my-auto">
              <div className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Your Comparison Matrix is Empty</h4>
              <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
                Add products to your matrix by clicking the <span className="text-sky-400 font-mono font-bold">Compare icon (<Layers className="w-3 h-3 inline" />)</span> on any product card across the catalog.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-500/20 transition-all"
              >
                Browse Hardware Catalog
              </button>
            </div>
          ) : (
            /* Comparison Table */
            <div className="p-6 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 font-mono text-zinc-400 uppercase tracking-wider w-1/5">Feature / Spec</th>
                    {compareProducts.map((product) => {
                      const isWinner = bestProduct?.id === product.id && compareProducts.length > 1;
                      return (
                        <th key={product.id} className="p-3 text-center align-top relative">
                          <button
                            onClick={() => onRemoveFromCompare(product.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-zinc-400 hover:text-rose-400 transition-colors border border-white/10"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {isWinner && (
                            <div className="mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>AI Top Value Pick</span>
                            </div>
                          )}

                          <img
                            src={product.primaryImage}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-xl border border-white/10 mx-auto mb-2 bg-zinc-900 shadow-md"
                          />
                          <h4 className="font-bold text-white text-xs line-clamp-2 h-8 leading-tight">{product.name}</h4>
                          <div className="text-emerald-400 font-mono font-bold text-sm mt-1">
                            {formatINR(product.price)}
                          </div>

                          <button
                            onClick={() => {
                              onQuickView(product);
                              onClose();
                            }}
                            className="mt-3 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-all shadow-lg shadow-blue-500/20"
                          >
                            Inspect Specs
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Brand & Category</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-200">
                        {p.brand} ({p.category})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">User Rating</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-amber-400 font-bold">
                        ★ {p.rating} ({p.reviewCount} reviews)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Stock & Availability</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-emerald-400 font-bold uppercase text-[10px]">
                        {p.stockStatus}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Processor / Build</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-300">
                        {p.processor || 'High Speed Chipset'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">RAM / Memory</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-300">
                        {p.ram || 'Standard Tech RAM'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Storage / Capacity</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-300">
                        {p.storage || 'High Speed NVMe'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Warranty</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-300 text-[11px]">
                        {p.warranty}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Delivery Estimate</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-sky-300 text-[11px]">
                        {p.deliveryEstimate}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-semibold">Top Highlight</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3 text-center text-zinc-300 text-[11px]">
                        {p.highlights?.[0] || 'Official India Unit'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
