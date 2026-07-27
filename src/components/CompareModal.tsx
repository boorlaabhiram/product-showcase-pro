import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, Trash2, Check, Star, ArrowUpRight } from 'lucide-react';
import { Product } from '../types/product';
import { PRODUCTS } from '../data/products';
import { formatCurrency } from '../lib/utils';

interface CompareModalProps {
  compareIds: string[];
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onQuickView: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  compareIds,
  onClose,
  onRemoveFromCompare,
  onClearCompare,
  onQuickView,
}) => {
  if (compareIds.length === 0) return null;

  const compareProducts = PRODUCTS.filter((p) => compareIds.includes(p.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <h3 className="font-serif font-bold text-lg text-white">Hardware Spec Matrix</h3>
              <span className="text-xs font-mono text-zinc-400">({compareProducts.length} items)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClearCompare}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
              >
                Clear Matrix
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="p-6 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 font-mono text-zinc-500 uppercase tracking-wider w-1/4">Hardware</th>
                  {compareProducts.map((product) => (
                    <th key={product.id} className="p-3 text-center align-top relative">
                      <button
                        onClick={() => onRemoveFromCompare(product.id)}
                        className="absolute top-1 right-1 p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-zinc-800 mx-auto mb-2"
                      />
                      <h4 className="font-serif font-bold text-white text-xs line-clamp-1">{product.name}</h4>
                      <div className="text-emerald-400 font-mono font-bold mt-1">
                        {formatCurrency(product.price)}
                      </div>

                      <button
                        onClick={() => {
                          onQuickView(product);
                          onClose();
                        }}
                        className="mt-2 w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="p-3 font-mono text-zinc-400 font-semibold">Category</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-zinc-200">{p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-zinc-400 font-semibold">Rating</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-amber-400 font-bold">
                      ★ {p.rating} ({p.reviewCount})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-zinc-400 font-semibold">Stock Status</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-emerald-400 font-mono uppercase text-[10px]">
                      {p.stockStatus}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-zinc-400 font-semibold">Release Year</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-zinc-300 font-mono">{p.releaseYear}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-mono text-zinc-400 font-semibold">Primary Feature</td>
                  {compareProducts.map((p) => (
                    <td key={p.id} className="p-3 text-center text-zinc-300 text-[11px]">
                      {p.highlights[0] || 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
