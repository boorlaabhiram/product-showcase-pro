import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, Layers, ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react';
import { Product } from '../types/product';
import { formatINR } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isCompared: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  layoutMode?: 'grid-4' | 'grid-3' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  isCompared,
  onToggleWishlist,
  onToggleCompare,
  onQuickView,
  onAddToCart,
  layoutMode = 'grid-4',
}) => {
  const isListMode = layoutMode === 'list';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden hover:bg-white/[0.06] hover:border-blue-500/40 transition-all ${
        isListMode ? 'flex flex-col sm:flex-row gap-6 p-5 items-center' : 'p-5 flex flex-col justify-between'
      }`}
    >
      {/* Product Image & Badges Container */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 ${
          isListMode ? 'w-full sm:w-56 aspect-square' : 'w-full aspect-square mb-4'
        }`}
      >
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 items-start">
          {product.badgeText && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 backdrop-blur-md border border-emerald-500/20 text-[10px] font-mono font-bold tracking-wider uppercase">
              {product.badgeText}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono font-extrabold text-[10px] shadow-lg">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Action Overlay Floating Pills */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Wishlist Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
              isWishlisted
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg'
                : 'bg-black/50 hover:bg-black/80 text-zinc-300 border-white/10'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Compare Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
              isCompared
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'bg-black/50 hover:bg-black/80 text-zinc-300 border-white/10'
            }`}
            title={isCompared ? 'In Compare List' : 'Add to Compare'}
          >
            <Layers className={`w-4 h-4 ${isCompared ? 'text-sky-400' : ''}`} />
          </button>
        </div>

        {/* Quick Spec Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2.5 px-3 rounded-full bg-white text-black font-extrabold text-xs shadow-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>360° View & Specs</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className={`flex-1 flex flex-col justify-between ${isListMode ? 'w-full' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
            <span>{product.brand} • {product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
              <span className="text-zinc-500">({product.reviewCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-base font-bold text-white hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer tracking-tight"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Highlights Badges */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.highlights.slice(0, 2).map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-mono text-white">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through font-mono">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-mono block mt-0.5 font-bold">
              {product.stockStatus === 'in-stock'
                ? `In Stock (${product.stockCount} left in IN)`
                : 'Pre-Order Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                title="Add to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onQuickView(product)}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all active:scale-95 border border-white/10"
              title="Inspect Product Specs"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
