import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Trash2, Eye } from 'lucide-react';
import { Product } from '../types/product';
import { formatINR } from '../lib/utils';

interface WishlistDrawerProps {
  isOpen: boolean;
  wishlistIds: string[];
  allProducts: Product[];
  onClose: () => void;
  onRemoveWishlist: (id: string) => void;
  onClearWishlist: () => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  wishlistIds,
  allProducts,
  onClose,
  onRemoveWishlist,
  onClearWishlist,
  onQuickView,
}) => {
  if (!isOpen) return null;

  const savedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Slide-over Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-[#09090b]/95 border-l border-white/10 h-full shadow-2xl flex flex-col z-10 backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-500" />
              <h3 className="font-bold text-base text-white">Saved Hardware</h3>
              <span className="text-xs font-mono text-zinc-400">({savedProducts.length})</span>
            </div>

            <div className="flex items-center gap-3">
              {savedProducts.length > 0 && (
                <button
                  onClick={onClearWishlist}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
                >
                  Clear All
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

          {/* List Content */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {savedProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Your Wishlist is Empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Click the heart icon on any hardware card to bookmark it for future review.
                </p>
              </div>
            ) : (
              savedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors group"
                >
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-zinc-900 border border-white/10 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-zinc-400 block">{product.brand}</span>
                    <h5 className="text-xs font-bold text-white line-clamp-1">{product.name}</h5>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {formatINR(product.price)}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      title="Inspect Product"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
