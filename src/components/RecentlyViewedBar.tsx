import React from 'react';
import { History, Eye } from 'lucide-react';
import { Product } from '../types/product';
import { formatINR } from '../lib/utils';

interface RecentlyViewedBarProps {
  recentlyViewedIds: string[];
  allProducts: Product[];
  onQuickView: (product: Product) => void;
}

export const RecentlyViewedBar: React.FC<RecentlyViewedBarProps> = ({
  recentlyViewedIds,
  allProducts,
  onQuickView,
}) => {
  if (!recentlyViewedIds || recentlyViewedIds.length === 0) return null;

  const products = allProducts.filter((p) => recentlyViewedIds.includes(p.id));
  if (products.length === 0) return null;

  return (
    <div className="w-full py-8 border-t border-white/10 bg-[#09090b]/80 backdrop-blur-2xl relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <History className="w-4 h-4 text-blue-400" />
          <span>Recently Inspected Hardware</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pb-2">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onQuickView(product)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] cursor-pointer shrink-0 w-64 transition-all hover:-translate-y-0.5 group backdrop-blur-md shadow-lg"
            >
              <img
                src={product.primaryImage}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-xl bg-zinc-900 border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                  {product.name}
                </h5>
                <span className="text-xs font-mono text-emerald-400 font-extrabold block mt-0.5">
                  {formatINR(product.price)}
                </span>
              </div>
              <Eye className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
