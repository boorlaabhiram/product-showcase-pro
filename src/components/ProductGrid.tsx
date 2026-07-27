import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX, RotateCcw } from 'lucide-react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  wishlistIds: string[];
  compareIds: string[];
  onToggleWishlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  layoutMode: 'grid-4' | 'grid-3' | 'list';
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishlistIds,
  compareIds,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  onAddToCart,
  layoutMode,
  onResetFilters,
}) => {
  const getGridClasses = () => {
    if (layoutMode === 'list') return 'flex flex-col gap-4';
    if (layoutMode === 'grid-3') return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
    return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
  };

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4 rounded-3xl bg-white/[0.02] border border-white/10 max-w-xl mx-auto my-12 backdrop-blur-xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Matching Hardware Found</h3>
        <p className="text-xs text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed">
          We couldn't find any products matching your selected search query or active filter criteria.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Search & Filters</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className={getGridClasses()}>
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)}
            isCompared={compareIds.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
            onToggleCompare={onToggleCompare}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            layoutMode={layoutMode}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
