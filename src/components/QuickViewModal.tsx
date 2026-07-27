import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Heart,
  Layers,
  CheckCircle,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  PackageCheck,
  ShoppingBag,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types/product';
import { formatINR } from '../lib/utils';
import { Product360Viewer } from './Product360Viewer';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  isCompared: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, storage?: string, ram?: string) => void;
  onShowToast: (title: string, description?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  isWishlisted,
  isCompared,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onShowToast,
}) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState<'360' | 'gallery' | 'overview' | 'specs' | 'stores'>('360');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions ? product.storageOptions[0] : ''
  );
  const [selectedRam, setSelectedRam] = useState(
    product.ramOptions ? product.ramOptions[0] : ''
  );
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [reviewsList, setReviewsList] = useState(product.reviews || []);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const reviewObj = {
      id: `rev-${Date.now()}`,
      userName: newReview.name,
      rating: Number(newReview.rating),
      date: 'Just now',
      title: 'Verified Buyer Feedback',
      comment: newReview.comment,
      verified: true,
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setNewReview({ name: '', rating: 5, comment: '' });
    onShowToast('Review Submitted', 'Thank you for sharing your experience!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Link Copied!', 'Product page link copied to clipboard.');
  };

  const images =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [product.primaryImage];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-[#09090b]/95 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-xs font-mono border border-white/10">
                SKU: {product.sku}
              </span>
              <span className="text-xs text-zinc-400">/ {product.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
                title="Share Product"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="p-6 overflow-y-auto space-y-8">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 360 Viewer & Image Gallery */}
              <div className="lg:col-span-6 space-y-4">
                {/* View Mode Tabs */}
                <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('360')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === '360'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>360° Studio View</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      activeTab === 'gallery'
                        ? 'bg-white/15 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    High-Res Gallery
                  </button>
                </div>

                {activeTab === '360' ? (
                  <Product360Viewer
                    images={product.galleryImages}
                    productName={product.name}
                    fallbackImage={product.primaryImage}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shadow-xl">
                      <img
                        src={images[activeImageIndex] || product.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.discountPercentage > 0 && (
                        <span className="absolute top-4 left-4 bg-blue-600 text-white font-mono font-bold text-xs px-3 py-1 rounded-full shadow-lg">
                          Save {product.discountPercentage}%
                        </span>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                              activeImageIndex === idx
                                ? 'border-blue-500 scale-105 shadow-md'
                                : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Product Specs & Purchase Options */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-mono font-bold mb-1">
                    <span>{product.brand}</span>
                    <span>•</span>
                    <span>Official India Warranty</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-xs text-emerald-400 font-mono mt-1">{product.tagline}</p>
                </div>

                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400 text-sm font-bold gap-1 font-mono">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">
                      ({reviewsList.length} verified reviews)
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {product.stockStatus === 'in-stock'
                      ? 'In Stock & Ready for Express Dispatch'
                      : `Low Stock (${product.stockCount} remaining)`}
                  </span>
                </div>

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white font-mono">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-zinc-500 line-through font-mono">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    Inclusive of 18% GST
                  </span>
                </div>

                {/* Storage Options */}
                {product.storageOptions && product.storageOptions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                      Storage Variant: <strong className="text-white">{selectedStorage}</strong>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.storageOptions.map((stg) => (
                        <button
                          key={stg}
                          onClick={() => setSelectedStorage(stg)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                            selectedStorage === stg
                              ? 'border-blue-500 bg-blue-600/20 text-white font-bold'
                              : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {stg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* RAM Options */}
                {product.ramOptions && product.ramOptions.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                      RAM Variant: <strong className="text-white">{selectedRam}</strong>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.ramOptions.map((ram) => (
                        <button
                          key={ram}
                          onClick={() => setSelectedRam(ram)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                            selectedRam === ram
                              ? 'border-indigo-500 bg-indigo-600/20 text-white font-bold'
                              : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {ram}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                      Color Finish: <strong className="text-white">{selectedColor}</strong>
                    </label>
                    <div className="flex items-center gap-3">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                            selectedColor === c.name
                              ? 'border-white bg-white/15 text-white font-bold'
                              : 'border-white/10 bg-white/5 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-xs text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add To Cart Button */}
                    <button
                      onClick={() => {
                        onAddToCart(product, quantity, selectedStorage, selectedRam);
                        onShowToast('Added to Cart', `Added ${quantity}x ${product.name} to your cart.`);
                      }}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-blue-500/25 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart ({formatINR(product.price * quantity)})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                        isWishlisted
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                    </button>

                    <button
                      onClick={() => onToggleCompare(product.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                        isCompared
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                          : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-sky-400" />
                      <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
                    </button>
                  </div>
                </div>

                {/* Indian Retail Buying Options */}
                {product.buyingOptions && product.buyingOptions.length > 0 && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block tracking-wider">
                      Verified Buying Options across Indian Retailers:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {product.buyingOptions.map((opt, i) => (
                        <a
                          key={i}
                          href={opt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.07] transition-all text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{opt.storeName}</span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {formatINR(opt.price)}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specification Tables */}
            <div className="pt-6 border-t border-white/10">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
                Full Technical Specifications
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {product.specs.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <span className="text-zinc-400 font-mono">{s.name}</span>
                    <span className="font-semibold text-white font-mono">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
